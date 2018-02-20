import Note from '../src/index';

const map = L.map('map').setView([48.8535912,2.340996], 15);
const ACCESS_TOKEN = 'pk.eyJ1IjoidzhyIiwiYSI6IlF2Nlh6QVkifQ.D7BkmeoMI7GEkMDtg3durw';
const layer = L.tileLayer(
  `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${ACCESS_TOKEN}`, {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(map);

//const url = 'https://media.giphy.com/media/lH0nrd3yKW1sA/giphy.gif';
const url = 'https://21786-presscdn-pagely.netdna-ssl.com/wp-content/uploads/2014/10/red-panda-445px.jpg';
const note = new Note([48.8535912,2.340996], {
  offset: [100, -100],
  content: `<img src="${url}" width="150">`
}).addTo(map);

// detect/update tooltip when image is loaded
const img = new Image();
L.DomEvent.on(img, 'load', () => note.update());
img.src = url;

window.note = note;
