// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// TODO: 

// Store API query variables
var baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
// Add the dates in the ISO formats
var date = "$where=created_date between '2016-01-01T00:00:00' and '2017-01-01T00:00:00'";
// Add the complaint type
var complaint = "&complaint_type=Rodent";
// Add a limit
var limit = "&$limit=100";


// Assemble API query URL
var url = baseURL + date + complaint + limit;

// Grab the data with d3
d3.json(url, function(response) {

  console.log(response);
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Check for location property
  response.forEach( function(d) {

    var latitude = d.latitude;
    var longitude = d.longitude;

    //console.log(location.coordinates);
    if (latitude) {
      markers.addLayer(L.marker([latitude, longitude]))
    }

  });
   
myMap.addLayer(markers);


});


