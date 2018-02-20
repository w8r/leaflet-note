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

const note = new Note([48.8535912,2.340996], {
  size: [200, 100],
  offset: [200, -200],
  content: `<img src="https://media.giphy.com/media/lH0nrd3yKW1sA/giphy.gif">`
}).addTo(map);

setTimeout(() => note.update(), 500);

window.note = note;

