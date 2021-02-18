var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 13
  });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

var url = "https://data.sfgov.org/resource/cuks-n6tp.json"

d3.json(url, function(response) {
    //console.log(response);

    var myArray = []; 
    response.forEach(function(incident) {
        var tempArray = []
        tempArray.push(incident.location.coordinates[1])
        tempArray.push(incident.location.coordinates[0])
        myArray.push(tempArray);
    });

    //console.log(myArray);

    L.heatLayer(myArray, {
        radius: 20,
        blur: 35
    }).addTo(myMap);
})