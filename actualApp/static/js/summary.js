d3.json("/api/jobs").then( function(response) {

    var jobPost = response["jobs"];
    //console.log(jobPost);

    var summary = {};
    
    jobPost[0].forEach(function(post) {

        var roleType = post[1];

        if (roleType in summary) {
            summary[roleType] += 1;
        }
        else {
            summary[roleType] = 1;
        }

    });

    //console.log(summary);

    //Adding data into summary table
    var card = d3.select("#sample-metadata");

    //clear dashboard from preivous data
    card.html(" ");

    //updating data into dashboard

    //adding total job postings
    card.append().html(`<div id="sample-metadata" class="panel-body"> Total Job Postings: ${jobPost[0].length}</div>`)

    Object.keys(summary).forEach(function(key) {
        
        card.append().html( 
            `<div id="sample-metadata" class="panel-body"> ${key} Roles: ${summary[key]}</div>`
        );  
    });

});

function updateSummary(countrySelected) {


    d3.json("/api/jobs").then( function(response) {

        var jobPost = response["jobs"];
        //console.log(jobPost);
        
        if (countrySelected == "All") {
            //console.log("country selected ALL!!");
            var filteredList = jobPost[0]}
        else {
            //console.log("country selected. filtering now!");
            var filteredList = jobPost[0].filter(d => d[2] == countrySelected)}

        var summary = {};
        
        filteredList.forEach(function(post) {
    
            var roleType = post[1];
    
            if (roleType in summary) {
                summary[roleType] += 1;
            }
            else {
                summary[roleType] = 1;
            }
    
        });
    
        //console.log(summary);
    
        //Adding data into summary table
        var card = d3.select("#sample-metadata");
    
        //clear dashboard from preivous data
        card.html(" ");
    
        //updating data into dashboard
    
        //adding total job postings
        card.append().html(`<div id="sample-metadata" class="panel-body"> Total Job Postings: ${filteredList.length}</div>`)
    
        Object.keys(summary).forEach(function(key) {
            
            card.append().html( 
                `<div id="sample-metadata" class="panel-body"> ${key} Roles: ${summary[key]}</div>`
            );  
        });
    
    });


}