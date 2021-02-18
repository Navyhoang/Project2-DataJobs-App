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
  

var table = d3.select("tbody");

//Clear table before rendering 
table.html(" ");

d3.json("/api/jobs").then( function(response) {

    var jobPost = response["jobs"][0].slice(0,50);
    
    //counting jobs by type of role (e.g. 1000 postings for job analyst roles)
    jobPost.forEach(function(report) {
        
        var row = table.append("tr");

        // Extracting data from each key value pair in the data dictionary
    
        Object.entries(report).forEach( function([key,value]) {
            // Adding column 
            var cell = row.append("td");
            // Adding Value
            cell.text(value);
        });
    });

});

function updateRawdata(countrySelected) {

    //Clear table before rendering 
    table.html(" ");

    d3.json("/api/jobs").then( function(response) {

        var jobPost = response["jobs"];
        //console.log(jobPost);

        //if countryselected is "ALL", default is to show results for all countries
        if (countrySelected == "All") {
            var filteredList = jobPost[0]}
        else { //otherwise filter for selected country
            var filteredList = jobPost[0].filter(d => d[2] == countrySelected)}

        
        //counting jobs by type of role (e.g. 1000 postings for job analyst roles)
        filteredList.forEach(function(report) {
        
            var row = table.append("tr");
    
            // Extracting data from each key value pair in the data dictionary
        
            Object.entries(report).forEach( function([key,value]) {
                // Adding column 
                var cell = row.append("td");
                // Adding Value
                cell.text(value);
            });
        });
    
           
    });


};