import L from 'leaflet';
import Drag from './drag';

const Tooltip = L.Tooltip.extend({
  options: {
    containerClass: 'leaflet-note-container',
    direction: 'center',
    permanent: true,
    draggable: true
  },

  _initLayout: function () {
    const prefix = this.options.containerClass;
    const className = prefix + ' ' + (this.options.className || '') +
      ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

    this._contentNode = this._container = L.DomUtil.create('div', className);

    this.dragging = new Drag(this);
    this._updateDraggable();
  },


  update() {
    L.Tooltip.prototype.update.call(this);
    this._updateDraggable();
  },


  _updateLayout() {
    L.Popup.prototype._updateLayout.call(this);
  },


  _updateDraggable() {
    if (this.dragging) {
      this.dragging[this.options.draggable ? 'enable' : 'disable']();
    }
  },


  _getSize() {
    const content = this._contentNode;
    return this.options.size ?
      L.point(this.options.size) :
      L.point(content.offsetWidth, content.offsetHeight);
  },


  _getAnchor(t) {
    return t ? this._getSize().multiplyBy(-0.5) : L.point([0, 0]);
  }

});

export default Tooltip;
