/**
 * Leaflet Note plugin
 *
 * @author Milevski Alexander <info@w8r.name>
 * @license MIT
 * @preserve
 */


import L from 'leaflet';


const Content = L.DivOverlay.extend({
  _initLayout() {
    this._container = L.DomUtil.create('div', this.options.contentClass);
  },
  _updateLayout() {
    console.log(arguments);
  },
  _adjustPan() {}
});

L.Note = L.FeatureGroup.extend({

  options: {
    lineClass:     L.Polyline,
    markerClass:   L.CircleMarker,
    overlayClass:  Content,
    offset:        [20,20],
    lineOptions:   {},
    anchorOptions: {}
  },


  initialize(latlng, options) {
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

    this._createLayers();
    L.LayerGroup.prototype.initialize.call(this,
      [this._anchor, this._line, this._overlay]);
  },


  _createLayers() {
    const options      = this.options;
    const MarkerClass  = options.markerClass;
    const LineClass    = options.lineClass;
    const OverlayClass = options.overlayClass;

    this._anchor = new MarkerClass(this._latlng,
      L.Util.extend({}, L.Note.prototype.options.anchorOptions,
        options.anchorOptions));

    this._line = new LineClass([this._latlng, this._getOverlayLatLng()],
      L.Util.extend({}, L.Note.prototype.options.lineOptions,
        options.lineOptions));

    this._overlay = new OverlayClass(options, this)
      .setLatLng(this._latlng)
      .setContent(options.content);
  },


  _getOverlayLatLng() {
    if (this._map) {
      return this._map.containerPointToLatLng(
        this._map.latLngToContainerPoint(this._latlng).add(this.options.offset)
      );
    } else return this._latlng;
  },


  setLatLng(latlng) {
    this._latlng = latlng;
    this._anchor.setLatLng(latlng);
    this._overlay.setLatLng(latlng);

  },

  onAdd(map) {
    L.FeatureGroup.prototype.onAdd.call(this, map);
    this._line.setLatLngs([this._latlng, this._getOverlayLatLng()]);
    return this;
  },


  /**
   * Store shift to be precise while dragging
   * @param  {Event} evt
   */
  _onOverlayDragStart: function(evt) {
    this._initialDistance = L.DomEvent.getMousePosition(evt)
      .subtract(this._map.latLngToContainerPoint(this._marker.getLatLng()));
    this.fire('label:' + evt.type, evt);
  },


  /**
   * Line dragging
   * @param  {DragEvent} evt
   */
  _onOverlayDrag: function(evt) {
    var latlng = this._map.containerPointToLatLng(
      L.DomEvent.getMousePosition(evt)._subtract(this._initialDistance));
    this._line.setLatLngs([latlng, this._latlng]);
    this.fire('label:' + evt.type, evt);
  },


  _onOverlayDragEnd: function(evt) {
    this.fire('label:' + evt.type, evt);
  }
});

export function note(latlng, options) {
  return new L.Note(latlng, options);
};

L.note = note;

export default L.Note;
