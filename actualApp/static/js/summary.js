//reading all data on job postings
function updateSummary(countrySelected) {


    d3.json("/api/jobs").then( function(response) {

        var jobPost = response["jobs"];
        //console.log(jobPost);

        //if countryselected is "ALL", default is to show results for all countries
        if (countrySelected == "All") {
            //console.log("country selected ALL!!");
            var filteredList = jobPost[0]}
        else { //otherwise filter for selected country
            //console.log("country selected. filtering now!");
            var filteredList = jobPost[0].filter(d => d[2] == countrySelected)}

        var summary = {};
        
        //counting jobs by type of role (e.g. 1000 postings for job analyst roles)
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
        var cardBody = d3.select("#canvas");
        var legend = d3.select(".legend");
        //clear dashboard from preivous data
        card.html("");
        legend.html("");
        // cardBody.html("")
        cardBody.html("<canvas id='pie-sample'></canvas>")

        var pie = document.getElementById('pie-sample').getContext("2d");
        //updating data into dashboard

        //adding total job postings
        card.html(`<p> Total Job Postings: ${filteredList.length} <p>`)
        
        // A list for pie chart data
        pieData = []
        pieLabel = []
        pieColor = []
        Object.keys(summary).forEach(function(key) {
            if (key == "Data Analyst") {textStyle = "gray"; pieColor.push('#e3e3e3')}
            else if (key == "Data Scientist") {textStyle = "primary"; pieColor.push('#4acccd')}
            else if (key == "Machine Learning") {textStyle = "warning"; pieColor.push('#fcc468')}
            else {textStyle = "danger"; pieColor.push('#ef8157')}

            // card.append().html( 
            //     `<div id="sample-metadata" class="panel-body"> ${key} Roles: ${summary[key]}</div>`
            // );
            legend.append().html(
                `<i class="fa fa-circle text-${textStyle}"></i> ${key}: ${summary[key]}<br>`
            )
            pieLabel.push(key)
            pieData.push(summary[key])
        });
        

        // Create a bar chart for the job counts
        
        myChart = new Chart(pie, {
            type: 'pie',
            data: {
              labels: pieLabel,
              datasets: [{
                label: "Job Counts",
                pointRadius: 0,
                pointHoverRadius: 0,
                backgroundColor: pieColor,
                // [
                //   '#e3e3e3', //gray
                //   '#4acccd', //primary
                //   '#fcc468', //warning
                //   '#ef8157' //danger
                // ],
                borderWidth: 0,
                data: pieData
              }]
            },
      
            options: {
      
              legend: {
                display: false
              },
      
              pieceLabel: {
                render: 'percentage',
                fontColor: ['white'],
                precision: 2
              },
      
              tooltips: {
                enabled: true
              },
      
              scales: {
                yAxes: [{
      
                  ticks: {
                    display: false
                  },
                  gridLines: {
                    drawBorder: false,
                    zeroLineColor: "transparent",
                    color: 'rgba(255,255,255,0.05)'
                  }
      
                }],
      
                xAxes: [{
                  barPercentage: 1.6,
                  gridLines: {
                    drawBorder: false,
                    color: 'rgba(255,255,255,0.1)',
                    zeroLineColor: "transparent"
                  },
                  ticks: {
                    display: false,
                  }
                }]
              },
            }
          });
    });


}

// Default page for summary
updateSummary("All");