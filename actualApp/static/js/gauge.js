
var layout = { 
    width: 400, 
    height: 400, 
    margin: { t: 0, b: 0 } 
};

        
//Benefits data 
//responses include: "Yes", "No", "Don't Know"
d3.json("/api/benefits").then( function(response) {

    //console.log("Benefits information");
    //console.log(response);

    var actualResponse = response["Benefits"];
    var filteredList = actualResponse.filter(d => d[0] == "Yes");
    var count = Math.round(filteredList.length/actualResponse.length * 10)/10;

    var titleName = `% with Benefits (${actualResponse.length} surveys)`;

    var benefits_data = [
        {
            domain: { 
                x: [0, 1], 
                y: [0, 1] },
            value: count*100,
            title: { text: titleName },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 100] },
                steps: [
                    { range: [0, 50], color: "white" },
                    { range: [50, 100], color: "AntiqueWhite" }
                ]
            }
        }
    ];

    Plotly.newPlot('gauge-benefits', benefits_data, layout);


});


//Wellness Program data
//Responses include: "Yes", "No", "Don't Know"
d3.json("/api/wellness_programs").then( function(response) {

    //console.log("Wellnes Program information");
    //console.log(response);

    var actualResponse = response["Wellness Program"];
    var filteredList = actualResponse.filter(d => d[0] == "Yes");
    var count = Math.round(filteredList.length/actualResponse.length * 10)/10;

    var titleName = `% with Wellness Programs (${actualResponse.length} surveys)`;

    var wellness_data = [
        {
            domain: { 
                x: [0, 1], 
                y: [0, 1] },
            value: count*100,
            title: { text: titleName},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 100] },
                steps: [
                    { range: [0, 50], color: "white" },
                    { range: [50, 100], color: "AntiqueWhite" }
                ]
            }
        }
    ];

    Plotly.newPlot('gauge-wellness', wellness_data, layout);
});



function updateGauge(selectedCountry) {

    console.log(`updated Gauge is reading: ${selectedCountry}`); 

    d3.json("/api/benefits").then( function(response) {

        var actualResponse = response["Benefits"];
        var countryList = actualResponse.filter(d => d[2] == selectedCountry)
        var filteredList = countryList.filter(d => d[0] == "Yes");
        var count = Math.round(filteredList.length/countryList.length * 10)/10;
    
        var newTitle = `% with Benefits (${countryList.length} surveys)`
        
        Plotly.restyle("gauge-benefits", "value", [count*100]); 
        Plotly.restyle("gauge-benefits", "title", [{text: newTitle}]);  
   
    });

    d3.json("/api/wellness_programs").then( function(response) {

        var actualResponse = response["Wellness Program"];
        var countryList = actualResponse.filter(d => d[2] == selectedCountry)
        var filteredList = countryList.filter(d => d[0] == "Yes");
        var count = Math.round(filteredList.length/countryList.length * 10)/10;
    
        var newTitle = `% with Wellness Programs (${countryList.length} surveys)`
        
        Plotly.restyle("gauge-wellness", "value", [count*100]); 
        Plotly.restyle("gauge-wellness", "title", [{text: newTitle}]);  
   
    });

};

