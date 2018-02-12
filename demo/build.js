(function () {
'use strict';

var map = L.map('map').setView([48.8535912,2.340996], 15);
var ACCESS_TOKEN = 'pk.eyJ1IjoidzhyIiwiYSI6IlF2Nlh6QVkifQ.D7BkmeoMI7GEkMDtg3durw';
var layer = L.tileLayer(
  ("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=" + ACCESS_TOKEN), {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(map);

var note = L.note([48.8535912,2.340996], {
  size: [200, 100],
  offset: [100, 50],
  content: "<img src=\"https://media.giphy.com/media/lH0nrd3yKW1sA/giphy.gif\" />"
}).addTo(map);

}());
