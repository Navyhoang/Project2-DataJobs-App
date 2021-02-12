//set layout for %all gauge views
var layout = { 
    // width: 300,
    // height: 300,
    margin: { t: 0, b: 0 },
    autosize: true,
    automargin: true
};

        
//reading survey data on who has benefits 
//responses include: "Yes", "No", "Don't Know"
d3.json("/api/benefits").then( function(response) {

    //console.log("Benefits information");
    //console.log(response);

    var actualResponse = response["Benefits"];

    //filtering out all yes responses
    var filteredList = actualResponse.filter(d => d[0] == "Yes");
    //rounding percentage to two decimals
    var count = Math.round(filteredList.length/actualResponse.length * 10)/10;

    //title for gauge chart - to include total responses
    var titleName = `(${actualResponse.length} surveys)`;

    //setting up data into the plotly gauge format
    var benefits_data = [
        {
            domain: { 
                x: [0, 1], 
                y: [0, 1] },
            value: count*100,
            title: { text: titleName, font: {size: 12}},
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

    var config = {responsive: true}


    //adding plot in tag in index.html 
    Plotly.newPlot('gauge-benefits', benefits_data, layout, config);


});


//reading survey data on who has a wellness program at work 
//Responses include: "Yes", "No", "Don't Know"
d3.json("/api/wellness_programs").then( function(response) {

    //console.log("Wellnes Program information");
    //console.log(response);
    
    //filtering out all yes responses
    var actualResponse = response["Wellness Program"];
    //filtering out all yes responses
    var filteredList = actualResponse.filter(d => d[0] == "Yes");
    //rounding percentage to two decimals
    var count = Math.round(filteredList.length/actualResponse.length * 10)/10;

    //title for gauge chart - to include total responses
    var titleName = `(${actualResponse.length} surveys)`;

    //setting up data into the plotly gauge format
    var wellness_data = [
        {
            domain: { 
                x: [0, 1], 
                y: [0, 1] },
            value: count*100,
            title: { text: titleName, font: {size: 12}},
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

    //adding plot in tag in index.html 
    Plotly.newPlot('gauge-wellness', wellness_data, layout);


});



function updateGauge(countrySelected) {

    //console.log(`updated Gauge is reading: ${countrySelected}`);

    d3.json("/api/benefits").then( function(response) {

        var actualResponse = response["Benefits"];

        //if countrySelected is "ALL", default of all countries will show
        if (countrySelected == "All") {
            //console.log("country selected ALL!!");
            var countryList = actualResponse}
        else {  //filter by countries
            //console.log("country selected. filtering now!");
            var countryList = actualResponse.filter(d => d[2] == countrySelected)}
        
        //filter by yes responses
        var filteredList = countryList.filter(d => d[0] == "Yes");
        var count = Math.round(filteredList.length/countryList.length * 10)/10;
    
        var newTitle = `(${countryList.length} surveys)`
        
        //update title and values
        Plotly.restyle("gauge-benefits", "value", [count*100]); 
        Plotly.restyle("gauge-benefits", "title", [{text: newTitle}]);  
   
    });

    d3.json("/api/wellness_programs").then( function(response) {

        var actualResponse = response["Wellness Program"];

        //if countrySelected is "ALL", default of all countries will show
        if (countrySelected == "All") {
            //console.log("country selected ALL!!");
            var countryList = actualResponse}
        else { //filter by countries
            //console.log("country selected. filtering now!");
            var countryList = actualResponse.filter(d => d[2] == countrySelected)}
        
        //filter by yes responses
        var filteredList = countryList.filter(d => d[0] == "Yes");
        var count = Math.round(filteredList.length/countryList.length * 10)/10;
    
        var newTitle = `(${countryList.length} surveys)`
        
        //update title and values
        Plotly.restyle("gauge-wellness", "value", [count*100]); 
        Plotly.restyle("gauge-wellness", "title", [{text: newTitle}]);  
   
    });

};

