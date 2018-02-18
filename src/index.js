/**
 * Leaflet Note plugin
 *
 * @author Milevski Alexander <info@w8r.name>
 * @license MIT
 * @preserve
 */


import L from 'leaflet';
import Content from './content';

const Note = L.Note = L.FeatureGroup.extend({

  options: {
    lineClass:      L.Polyline,
    markerClass:    L.CircleMarker,
    overlayClass:   Content,
    offset:         [20, 20],
    size:           [100, 100],
    overlayOptions: {},
    lineOptions:    {},
    anchorOptions:  {}
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

    L.Util.setOptions(this, options);
    this._createLayers();

    this._overlay
      .on('dragstart', this._onOverlayDragStart, this)
      .on('drag',      this._onOverlayDrag,      this)
      .on('dragend',   this._onOverlayDragStart, this)
      .on('move',      this._onOverlayMove,      this);
    L.LayerGroup.prototype.initialize.call(this,
      [this._anchor, this._line, this._overlay]);
  },


  setContent(content) {
    this._overlay.setContent(content);
    this._updateLatLngs();
    return this;
  },


  setOffset(offset) {
    this.options.offset = offset;
    return this.update();
  },


  update() {
    this._overlay.setLatLng(this._getOverlayLatLng()).update();
    this._updateLatLngs();
    return this;
  },


  _updateLatLngs() {
    this._line.setLatLngs([this._anchor.getLatLng(), this._overlay.getLatLng()]);
  },

  _onOverlayMove() {
    const newLatLng = this._overlay.getLatLng();
    if (this._map) {
      const anchorPos = this._map.latLngToContainerPoint(this._latlng);
      const newPos = this._map.latLngToContainerPoint(newLatLng);
      this.options.offset = newPos.subtract(anchorPos);
      this._line.setLatLngs([this._latlng, newLatLng]);
    }
  },


  _createLayers() {
    const options      = this.options;
    const MarkerClass  = options.markerClass;
    const LineClass    = options.lineClass;
    const OverlayClass = options.overlayClass;

    this._anchor = new MarkerClass(this._latlng,
      L.Util.extend({}, L.Note.prototype.options.anchorOptions,
        options.anchorOptions));

    const latlng = this._getOverlayLatLng();
    this._line = new LineClass([this._latlng, latlng],
      L.Util.extend({}, L.Note.prototype.options.lineOptions,
        options.lineOptions));

    this._overlay = new OverlayClass(this.options.overlayOptions, this)
      .setLatLng(latlng)
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
    this._overlay.setLatLng(this._getOverlayLatLng());
  },

  onAdd(map) {
    L.FeatureGroup.prototype.onAdd.call(this, map);
    this._line.setLatLngs([this._latlng, this._getOverlayLatLng()]);
    this._overlay.setLatLng(this._getOverlayLatLng());
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

export function note(latlng, options) {
  return new L.Note(latlng, options);
};

L.note = note;

export default Note;
