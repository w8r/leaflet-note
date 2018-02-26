(function (L$1) {
'use strict';

L$1 = 'default' in L$1 ? L$1['default'] : L$1;

// XXX: maybe just use L.MarkerDrag and fake stuff,
// but it's very dirty

var DRAGGABLE_CLASS = 'leaflet-marker-draggable';

var Drag = L$1.Handler.extend({

  initialize: function (overlay) {
    this._overlay = overlay;
  },

  addHooks: function () {
    var handle = this._overlay._container;

    if (!this._draggable) {
      this._draggable = new L$1.Draggable(handle, handle, true);
    }

    this._draggable.on({
      dragstart: this._onDragStart,
      predrag:   this._onPreDrag,
      drag:      this._onDrag,
      dragend:   this._onDragEnd
    }, this).enable();

    L$1.DomUtil.addClass(handle, DRAGGABLE_CLASS);
  },

  removeHooks: function () {
    this._draggable.off({
      dragstart: this._onDragStart,
      predrag:   this._onPreDrag,
      drag:      this._onDrag,
      dragend:   this._onDragEnd
    }, this).disable();

    if (this._overlay._container) {
      L$1.DomUtil.removeClass(this._overlay._container, DRAGGABLE_CLASS);
    }
  },

  moved: function () {
    return this._draggable && this._draggable._moved;
  },

  _adjustPan: function (e) {
    var overlay = this._overlay,
        map = overlay._map,
        speed = this._overlay.options.autoPanSpeed,
        padding = this._overlay.options.autoPanPadding,
        handlePos = L$1.DomUtil.getPosition(overlay._container).add(overlay._getAnchor()),
        bounds = map.getPixelBounds(),
        origin = map.getPixelOrigin();

    var panBounds = L$1.bounds(
      bounds.min._subtract(origin).add(padding),
      bounds.max._subtract(origin).subtract(padding)
    );

    if (!panBounds.contains(handlePos)) {
      // Compute incremental movement
      var movement = L$1.point(
        (Math.max(panBounds.max.x, handlePos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
        (Math.min(panBounds.min.x, handlePos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

        (Math.max(panBounds.max.y, handlePos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
        (Math.min(panBounds.min.y, handlePos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
      ).multiplyBy(speed);

      map.panBy(movement, {animate: false});

      this._draggable._newPos._add(movement);
      this._draggable._startPos._add(movement);

      L$1.DomUtil.setPosition(overlay._container, this._draggable._newPos);
      this._onDrag(e);

      this._panRequest = L$1.Util.requestAnimFrame(this._adjustPan.bind(this, e));
    }
  },

  _onDragStart: function () {
    // @section Dragging events
    // @event dragstart: Event
    // Fired when the user starts dragging the marker.

    // @event movestart: Event
    // Fired when the marker starts moving (because of dragging).

    this._oldLatLng = this._overlay.getLatLng();
    this._overlay
        .closePopup()
        .fire('movestart')
        .fire('dragstart');
  },

  _onPreDrag: function (e) {
    if (this._overlay.options.autoPan) {
      L$1.Util.cancelAnimFrame(this._panRequest);
      this._panRequest = L$1.Util.requestAnimFrame(this._adjustPan.bind(this, e));
    }
  },

  _onDrag: function (e) {
    var overlay = this._overlay,
    handlePos = L$1.DomUtil.getPosition(overlay._container).subtract(overlay._getAnchor()),
        latlng = overlay._map.layerPointToLatLng(handlePos);

    overlay._latlng = latlng;
    e.latlng = latlng;
    e.oldLatLng = this._oldLatLng;

    // @event drag: Event
    // Fired repeatedly while the user drags the marker.
    overlay
        .fire('move', e)
        .fire('drag', e);
  },

  _onDragEnd: function (e) {
    // @event dragend: DragEndEvent
    // Fired when the user stops dragging the marker.

     L$1.Util.cancelAnimFrame(this._panRequest);

    // @event moveend: Event
    // Fired when the marker stops moving (because of dragging).
    delete this._oldLatLng;
    this._overlay
        .fire('moveend')
        .fire('dragend', e);
  }
});

var Content = L$1.DivOverlay.extend({


  options: {
    containerClass: 'leaflet-note-container',
    contentClass:   'leaflet-note-content',
    pane:           'popupPane',

    offset:         [0, 0],
    maxWidth:       500,
    minWidth:       50,
    maxHeight:      null,
    draggable:      true
  },


  update: function update() {
    L$1.DivOverlay.prototype.update.call(this);
    this._updateDraggable();
  },


  getEvents: function getEvents() {
    return {};
  },


  _initLayout: function _initLayout() {
    var options = this.options;
    this._container   = L$1.DomUtil.create('div', options.containerClass);
    this._contentNode = L$1.DomUtil.create('div', options.contentClass);
    this._container.appendChild(this._contentNode);

    this.dragging = new Drag(this);
    this._updateDraggable();
  },


  _updateDraggable: function _updateDraggable() {
    if (this.dragging) {
      this.dragging[this.options.draggable ? 'enable' : 'disable']();
    }
  },


  _updateLayout: function _updateLayout() {
    var container = this._contentNode,
          style = container.style;

    style.width = '';
    style.whiteSpace = 'nowrap';

    var width = container.offsetWidth;
    width = Math.min(width, this.options.maxWidth);
    width = Math.max(width, this.options.minWidth);

    style.width = (width + 1) + 'px';
    style.whiteSpace = '';

    style.height = '';

    var height = container.offsetHeight,
          maxHeight = this.options.maxHeight,
          scrolledClass = 'leaflet-popup-scrolled';

    if (maxHeight && height > maxHeight) {
      style.height = maxHeight + 'px';
      L$1.DomUtil.addClass(container, scrolledClass);
    } else {
      L$1.DomUtil.removeClass(container, scrolledClass);
    }

    this._containerWidth = this._container.offsetWidth;
  },


  _getSize: function _getSize() {
    var content = this._contentNode;
    return this.options.size ?
      L$1.point(this.options.size) :
      L$1.point(content.offsetWidth, content.offsetHeight);
  },


  _getAnchor: function _getAnchor() {
    var size = this._getSize();
    return [-size.x / 2, -size.y / 2];
  },


  _adjustPan: function _adjustPan() {}
});

/**
 * Leaflet Note plugin
 *
 * @author Milevski Alexander <info@w8r.name>
 * @license MIT
 * @preserve
 */


var Note = L$1.Note = L$1.FeatureGroup.extend({

  options: {
    lineClass:      L$1.Polyline,
    markerClass:    L$1.CircleMarker,
    overlayClass:   Content,
    offset:         [20, 20],
    draggable:      true,
    overlayOptions: {},
    lineOptions:    {},
    anchorOptions:  {}
  },


  initialize: function initialize(latlng, options) {
    /**
     * @type {L.LatLng}
     */
    this._latlng = latlng;


    /**
     * @type {L.Overlay}
     */
    this._marker = null;


    /**
     * @type {L.CircleMarker}
     */
    this._anchor = null;


    /**
     * @type {L.Polyline}
     */
    this._line = null;


    /**
     * @type {L.Point}
     */
    this._initialDistance = null;

    L$1.Util.setOptions(this, options);
    this._createLayers();

    this._content
      .on('dragstart', this._onOverlayDragStart, this)
      .on('drag',      this._onOverlayDrag,      this)
      .on('dragend',   this._onOverlayDragStart, this)
      .on('move',      this._onOverlayMove,      this);
    L$1.LayerGroup.prototype.initialize.call(this,
      [this._anchor, this._line, this._content]);
  },


  setContent: function setContent(content) {
    this._content.setContent(content);
    this._updateLatLngs();
    return this;
  },


  setSize: function setSize(size) {
    if (size) {
      size = L$1.point(size);
      this._content.options.maxWidth = size.x;
      this._content.options.maxHeight = size.y;
      this._content.update();
    }
  },


  setDraggable: function setDraggable(on) {
    this.options.draggable                =
    this.options.overlayOptions.draggable =
    this._content.options.draggable       = !!on;
    this._content.update();
  },


  setOffset: function setOffset(offset) {
    this.options.offset = offset;
    return this.update();
  },


  update: function update() {
    this._content.setLatLng(this._getOverlayLatLng()).update();
    this._updateLatLngs();
    return this;
  },


  getEvents: function getEvents() {
    return {
      zoom: this.update,
      // zoomanim: this.update,
      viewreset: this.update,
      // previewreset: this.update
    };
  },


  getLatLng: function getLatLng() {
    return this._anchor.getLatLng();
  },


  _updateLatLngs: function _updateLatLngs() {
    this._line.setLatLngs([this._anchor.getLatLng(), this._content.getLatLng()]);
  },


  _onOverlayMove: function _onOverlayMove() {
    var newLatLng = this._content.getLatLng();
    if (this._map) {
      var anchorPos = this._map.latLngToContainerPoint(this._latlng);
      var newPos = this._map.latLngToContainerPoint(newLatLng);
      this.options.offset = newPos.subtract(anchorPos);
      this._line.setLatLngs([this._latlng, newLatLng]);
    }
  },


  _createLayers: function _createLayers() {
    var options      = this.options;
    var MarkerClass  = options.markerClass;
    var LineClass    = options.lineClass;
    var OverlayClass = options.overlayClass;

    this._anchor = new MarkerClass(this._latlng,
      L$1.Util.extend({}, L$1.Note.prototype.options.anchorOptions,
        options.anchorOptions));

    var latlng = this._getOverlayLatLng();
    this._line = new LineClass([this._latlng, latlng],
      L$1.Util.extend({}, L$1.Note.prototype.options.lineOptions,
        options.lineOptions));

    options.overlayOptions.draggable = options.draggable;
    this._content = new OverlayClass(options.overlayOptions, this)
      .setLatLng(latlng)
      .setContent(options.content);
    this.setSize(this.options.size);
  },


  _getOverlayLatLng: function _getOverlayLatLng() {
    if (this._map) {
      return this._map.containerPointToLatLng(
        this._map.latLngToContainerPoint(this._latlng).add(this.options.offset)
      );
    } else { return this._latlng; }
  },


  setLatLng: function setLatLng(latlng) {
    this._latlng = latlng;
    this._anchor.setLatLng(latlng);
    this._content.setLatLng(this._getOverlayLatLng());
  },

  onAdd: function onAdd(map) {
    L$1.FeatureGroup.prototype.onAdd.call(this, map);
    this._line.setLatLngs([this._latlng, this._getOverlayLatLng()]);
    this._content.setLatLng(this._getOverlayLatLng());
    return this;
  },


  /**
   * Store shift to be precise while dragging
   * @param  {Event} evt
   */
  _onOverlayDragStart: function(evt) {
    this.fire('label:' + evt.type, evt);
  },


  /**
   * Line dragging
   * @param  {DragEvent} evt
   */
  _onOverlayDrag: function(evt) {
    this.fire('label:' + evt.type, evt);
  },


  _onOverlayDragEnd: function(evt) {
    this.fire('label:' + evt.type, evt);
  }
});

Note.Content = Content;

function note$1(latlng, options) {
  return new L$1.Note(latlng, options);
}

L$1.note = note$1;

var map = L.map('map').setView([48.8535912,2.340996], 15);
var ACCESS_TOKEN = 'pk.eyJ1IjoidzhyIiwiYSI6IlF2Nlh6QVkifQ.D7BkmeoMI7GEkMDtg3durw';
var layer = L.tileLayer(
  ("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=" + ACCESS_TOKEN), {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(map);

//const url = 'https://media.giphy.com/media/lH0nrd3yKW1sA/giphy.gif';
var url = 'https://21786-presscdn-pagely.netdna-ssl.com/wp-content/uploads/2014/10/red-panda-445px.jpg';
var note = new Note([48.8535912,2.340996], {
  offset: [100, -100],
  content: ("<img src=\"" + url + "\" width=\"150\">")
}).addTo(map);

// detect/update tooltip when image is loaded
var img = new Image();
L.DomEvent.on(img, 'load', function () { return note.update(); });
img.src = url;

window.note = note;

}(L));
