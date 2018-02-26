import L from 'leaflet';

// XXX: maybe just use L.MarkerDrag and fake stuff,
// but it's very dirty

const DRAGGABLE_CLASS = 'leaflet-marker-draggable';

export default L.Handler.extend({

  initialize: function (overlay) {
    this._overlay = overlay;
  },

  addHooks: function () {
    var handle = this._overlay._container;

    if (!this._draggable) {
      this._draggable = new L.Draggable(handle, handle, true);
    }

    this._draggable.on({
      dragstart: this._onDragStart,
      predrag:   this._onPreDrag,
      drag:      this._onDrag,
      dragend:   this._onDragEnd
    }, this).enable();

    L.DomUtil.addClass(handle, DRAGGABLE_CLASS);
  },

  removeHooks: function () {
    this._draggable.off({
      dragstart: this._onDragStart,
      predrag:   this._onPreDrag,
      drag:      this._onDrag,
      dragend:   this._onDragEnd
    }, this).disable();

    if (this._overlay._container) {
      L.DomUtil.removeClass(this._overlay._container, DRAGGABLE_CLASS);
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
        handlePos = L.DomUtil.getPosition(overlay._container).add(overlay._getAnchor()),
        bounds = map.getPixelBounds(),
        origin = map.getPixelOrigin();

    var panBounds = L.bounds(
      bounds.min._subtract(origin).add(padding),
      bounds.max._subtract(origin).subtract(padding)
    );

    if (!panBounds.contains(handlePos)) {
      // Compute incremental movement
      const movement = L.point(
        (Math.max(panBounds.max.x, handlePos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
        (Math.min(panBounds.min.x, handlePos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

        (Math.max(panBounds.max.y, handlePos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
        (Math.min(panBounds.min.y, handlePos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
      ).multiplyBy(speed);

      map.panBy(movement, {animate: false});

      this._draggable._newPos._add(movement);
      this._draggable._startPos._add(movement);

      L.DomUtil.setPosition(overlay._container, this._draggable._newPos);
      this._onDrag(e);

      this._panRequest = L.Util.requestAnimFrame(this._adjustPan.bind(this, e));
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
      L.Util.cancelAnimFrame(this._panRequest);
      this._panRequest = L.Util.requestAnimFrame(this._adjustPan.bind(this, e));
    }
  },

  _onDrag: function (e) {
    var overlay = this._overlay,
    handlePos = L.DomUtil.getPosition(overlay._container)
      .subtract(overlay._getAnchor(overlay.options.direction === 'center')),
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

     L.Util.cancelAnimFrame(this._panRequest);

    // @event moveend: Event
    // Fired when the marker stops moving (because of dragging).
    delete this._oldLatLng;
    this._overlay
        .fire('moveend')
        .fire('dragend', e);
  }
});
