## Leaflet Note plugin

[<img width="465" alt="screenshot 2018-02-26 22 08 34" src="https://user-images.githubusercontent.com/26884/36695570-fe5c16ca-1b41-11e8-88b2-258d3d61241b.png">](https://w8r.github.io/leaflet-note/)

### API

**Constructor**
```js
const note = L.note([lat, lng], {
  offset:  <L.Point|Array>, // offset between the center of tooltip and anchor
  [size]:  <L.Point|Array>, // content size (optional)
  [draggable]: true,        // enable/disable tooltip dragging
  content: <String>         // HTML content,
  overlayOptions: DivOverlayOptions,
  lineOptions:    PolyLineOptions,
  anchorOptions:  CircleMarkerOptions
});
```
For styling options of the parts of the note, see [DivOverlayOptions](https://leafletjs.com/reference-1.3.0.html#divoverlay), [PolylineOptions](https://leafletjs.com/reference-1.3.0.html#polyline-option), [CircleMarkerOptions](https://leafletjs.com/reference-1.3.0.html#circlemarker-option)

**`.update()`**

**`.setLatLng(<L.LatLng|Array<number>>)`**

**`.setDraggable(<boolean>)`**

**`.setSize(<L.Point|Array<number>>)`**

**`.setOffset(<L.Point|Array<number>>)`**

**`.setContent(<String>)`**


### Install

```
npm i -S leaflet-note
```

```js
import Note from 'leaflet-note';
// or
const Note = require('leaflet-note');
```

**CDN**
```html
<script src="https://unpkg.com/leaflet-note"></script>
```

### Develop

### License

Copyright 2018 Alexander Milevski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
