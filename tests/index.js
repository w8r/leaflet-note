import { note } from '../src/index';
import chai from 'chai';

const assert = chai.assert;

describe('L.Note', () => {

  let map;

  beforeEach(() => {
    map = L.map('map').setView([51.505, -0.09], 13);
  });

  afterEach(() => map.remove());


  it('API present', () => {
    assert.isFunction(L.note);
    assert.isFunction(L.Note);
  });


  it('adds a note', () => {
    const content = 'content';
    const note = new L.Note([51.505, -0.09], {
      content: `<h1>${content}</h1>`
    }).addTo(map);
    const container = document.querySelector('#map .leaflet-note-container');
    assert.isOk(container);
    assert.equal(container.tagName.toLowerCase(), 'div');

    const h1 = container.querySelector('h1');
    assert.isOk(h1);
    assert.equal(h1.innerHTML, content);
  });


  it('preserves distance', (done) => {
    const note = new L.Note([51.505, -0.09], {
      content: '<h1>content</h1>'
    }).addTo(map);
    const container = document.querySelector('#map .leaflet-note-container');
    const dist = L.point(note.options.offset).distanceTo(L.point([0,0]));
    const pos = map.latLngToContainerPoint(note.getLatLng());
    const center = L.DomUtil.getPosition(container).add(note._content._getSize().multiplyBy(0.5));

    assert.deepEqual(note._content._getSize(), L.point({ x: 88, y: 36 }));
    assert.deepEqual(L.DomUtil.getPosition(container), L.point({ x: 176, y: 202 }));

    assert.equal(dist, pos.distanceTo(center));

    done();
  });
});
