var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;

// Create the createMap function
function createMap (bikeMarkers) {

  // Create a light layer for the map 
  var lightLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    id: "mapbox/light-v10",
    accessToken: API_KEY
  })

  //create overlay maps for bikestation layer
  var overlayMaps = {
    "Bike Station" : bikeMarkers
  };

  //base map to hold the light layer map 
  var baseMap = {
    "Light Map": lightLayer
  };

  //map object with all the layers
  var myMap = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [lightLayer, bikeMarkers]
  });


  // create layer control 
  L.control.layers(baseMap, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};

function createMarkers () {

  var url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json";

  d3.json(url, function (response) {
    //console.log(response);
  
    var stations = response.data.stations;
    //console.log(stations);

    //Array to hold all bike marker objects 
    var bikeMarkers = [];

    stations.forEach( function(d) {

      var lat = d.lat;
      var long = d.lon;
      //console.log(long);

      //creating bike markers from the json data 
      var bikeMarker = L.marker([lat, long])
        .bindPopup("<h3>" + d.name + "</h3><h3> Capacity:" + d.capacity + "</h3>")

      // pushing the created bike marker into the array for all bike markers
      bikeMarkers.push(bikeMarker);
    })
    
    // dont forget to layerGroup() the array with all the layers 
    createMap(L.layerGroup(bikeMarkers));
  
  });

  
};

createMarkers();
