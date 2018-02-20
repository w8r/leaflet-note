import L from 'leaflet';
import Drag from './drag';

export default L.DivOverlay.extend({


  options: {
    containerClass: 'leaflet-note-container',
    contentClass:   'leaflet-note-content',
    pane:           'popupPane',

    maxWidth:       500,
    minWidth:       50,
    maxHeight:      null,
    draggable:      true
  },


  update() {
    L.DivOverlay.prototype.update.call(this);
    this._updateDraggable();
  },


  _initLayout() {
    const options = this.options;
    this._container   = L.DomUtil.create('div', options.containerClass);
    this._contentNode = L.DomUtil.create('div', options.contentClass);
    this._container.appendChild(this._contentNode);

    this.dragging = new Drag(this);
    this._updateDraggable();
  },


  _updateDraggable() {
    if (this.dragging) {
      this.dragging[this.options.draggable ? 'enable' : 'disable']();
    }
  },


  _updateLayout() {
    const { x, y } = this._getSize();
    L.Popup.prototype._updateLayout.call(this);
  },


  _getSize() {
    const content = this._contentNode;
    return this.options.size ?
      L.point(this.options.size) :
      L.point(content.offsetWidth, content.offsetHeight);
  },


  _getAnchor() {
    const size = this._getSize();
    return [-size.x / 2, -size.y / 2];
  },

  _adjustPan() {}
});
