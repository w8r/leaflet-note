import { note } from '../src/index';

describe('suite', () => {

  let map;

  beforeEach(() => {
    map = L.map('map').setView([51.505, -0.09], 13);
  });

  afterEach(() => map.remove());

  it('test', (done) => {
    setTimeout(done, 1500);
  });
});
