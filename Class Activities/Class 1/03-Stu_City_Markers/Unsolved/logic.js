// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
}).addTo(myMap);

// City markers

// Add code to create a marker for each city below and add it to the map

// newyork;
// var NYmarker = L.marker([40.7, -74.00]).addTo(myMap);
// NYmarker.bindPopup("<b>New York City</b><br>Population: 8.4 mil").openPopup();

// // chicago;
// var CHImarker = L.marker([41.8, -87.63]).addTo(myMap);
// CHImarker.bindPopup("<b>Chicago</b><br>Population: 2.71 mil").openPopup();

// // houston;
// var HOUmarker = L.marker([29.76, -95.37]).addTo(myMap);
// HOUmarker.bindPopup("<b>Houston</b><br>Population: 2.31 mil").openPopup();

// // la;
// var LAmarker = L.marker([34.05, -118.24]).addTo(myMap);
// LAmarker.bindPopup("<b>Los Angeles</b><br>Population: 2.97 mil").openPopup();

// // omaha;
// var OMAmarker = L.marker([41.26, -95.93]).addTo(myMap);
// OMAmarker.bindPopup("<b>Omaha</b><br>Population: 475,000").openPopup();

var cities = [{
  location: [40.7128, -74.0059],
  name: "New York",
  population: "8,550,405"
},
{
  location: [41.8781, -87.6298],
  name: "Chicago",
  population: "2,720,546"
},
{
  location: [29.7604, -95.3698],
  name: "Houston",
  population: "2,296,224"
},
{
  location: [34.0522, -118.2437],
  name: "Los Angeles",
  population: "3,971,883"
},
{
  location: [41.2524, -95.9980],
  name: "Omaha",
  population: "446,599"
}
];

cities.forEach(function(city) {
  var marker = L.marker(city.location).addTo(myMap);
  marker.bindPopup(`<b>Chicago</b><br>Population: ${city.population}`).openPopup();  
});

L.polygon([  [45.54, -122.68],
  [45.55, -122.68],
  [45.55, -122.66]], {
      color: "yellow", 
      fillColor: "yellow", 
      fillOpacity: 0.75
  }).addTo(myMap);

var line = [[45.54, -122.68],
  [45.55, -122.68],
  [45.55, -122.66], 
  [45.55, -122.70]]

L.polyline(line, {
  color: "blue"
}).addTo(myMap);

L.rectangle([[45.54, -122.68],
  [45.55, -122.66]],{
      color: "black", 
      weight: 3, 
      stroke: true
  }).addTo(myMap)