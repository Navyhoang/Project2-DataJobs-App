
var table = d3.select("tbody");

//Clear table before rendering 
table.html(" ");

d3.json("/api/jobs").then( function(response) {

    var jobPost = response["jobs"];
    //console.log(jobPost);

    var summary = {};
    
    //counting jobs by type of role (e.g. 1000 postings for job analyst roles)
    jobPost[0].forEach(function(post) {
        
        var row = table.append("tr");

        // Extracting data from each key value pair in the data dictionary
    
        Object.entries(report).forEach( function([key,value]) {
            // Adding column 
            var cell = row.append("th");
            // Adding Value
            cell.text(value);
        });
    });

});

