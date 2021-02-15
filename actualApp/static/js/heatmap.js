//drop down menu 
function dropdownMenu() {

  //creating all options 
  var listNames = ["All", "Canada", "United States", "Australia", "Singapore"];
  
  //console.log(data);
  //console.log(listNames);

  //selecting drop down menu designation
  var dropdownMenu = d3.selectAll("#selDataset");
  
  //adding each option into drop down menu 
  for (i=0; i<listNames.length; i++) {
      dropdownMenu.append("option").text(listNames[i]);
  };

};

dropdownMenu();

//default map
var myMap = L.map("heatmap", {
  center: [0,0],
  zoom: 2
});

//adding tile layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

//reading JSON with data
d3.json("/api/jobs").then( function(response) {

  //data is within the "jobs" key
  var jobPost = response["jobs"];
  //console.log(jobPost);

  //empty array to hold all coordinates
  var myArray = []; 

  //going through each job post and extracting the laitude and longitude points
  jobPost[0].forEach(function(incident) {

    //console.log(incident[0]);
    var tempArray = []
    tempArray.push(incident[5])
    tempArray.push(incident[6])
    myArray.push(tempArray);
    //console.log(tempArray);

  });

  //console.log(myArray);
 
  //adding layers as heat layer onto map
  L.heatLayer(myArray, {
    radius: 35,
    blur: 20
  }).addTo(myMap);

});


//recenter map based on country selected
function updateHeatmap(countrySelected) {

  //setting heatmap zoom options 
  var centerPoint = [];

  if (countrySelected == "Canada") {centerPoint = [56.1304, -95.7129];}
  else if (countrySelected == "United States") {centerPoint = [37.0902, -95.7129];}
  else if (countrySelected == "Australia") {centerPoint = [-25.2744, 133.7751];}
  else if (countrySelected == "Singapore") {centerPoint = [1.3521, 103.8198];}
  else if (countrySelected == "All") {centerPoint = [0,0];}

  //myMap.panTo(new L.LatLng(centerPoint[0], centerPoint[1]));
  myMap.setView(centerPoint, 4);


};

