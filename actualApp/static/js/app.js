// //reading JSON file 

function optionList() {

    d3.json("../data/samples.json").then(data=> {
        var listNames = data.names;
        //console.log(data);
        //console.log(listNames);

        var dropdownMenu = d3.selectAll("#selDataset");
        
        for (i=0; i<listNames.length; i++) {
            dropdownMenu.append("option").text(listNames[i]);
        };
    });

    var card = d3.select("#sample-metadata");

    var metadata_labels = ["id", "ethnicity", "gender", "age", "location", "bbtype", "wfreq"];

    card.selectAll("#panel-body")
        .data(metadata_labels)
        .enter()
        .append("div")
        .classed("panel-body", true)
        .text( function(d) {
            return `${d} : `;
    });

};

optionList();

function optionChanged(subjectName){

   console.log(`Change triggered. Searching for ${subjectName} information`);


    //reading in JSON file 
    d3.json("../data/samples.json").then( function(data) {

        //Reading all sample data
        var database = data["samples"]; 
        var metadata = data["metadata"];

        //console.log(database);

        //Filtering out all other sample data except for the selected subject's information 
        var filteredList = database.filter(id => id["id"] == subjectName);
        var filteredmetadata = metadata.filter(id => id["id"] == subjectName);

        //console.log(filteredmetadata);
        //console.log(filteredList);

        //Sorting out list in descending order 
        var sortedList = filteredList.sort( function(first, second) {
            return second["sample_values"] - first["sample_values"]
        });

        //console.log(sortedList);
        
        //Data into list 
        var sampleValues = sortedList.map(data => data.sample_values);
        var OTUids = sortedList.map(data => data.otu_ids);
        var OTUlabels = sortedList.map(data => data.otu_labels);

        // console.log(sampleValues);
        // console.log(OTUids);
        // console.log(OTUlabels);


        //Taking only top 10 
        var top_sampleValues = sampleValues[0].slice(0,10);
        var top_OTUids = OTUids[0].slice(0,10);
        var top_OTUlabels = OTUlabels[0].slice(0,10);

        //Adding OTU prefix

        var OTUids_labels = top_OTUids.map( function(id) {
            return 'OTU ' + id;
        });

        // console.log( "Showing top 10 ....");
        // console.log(top_sampleValues);
        // console.log(top_OTUids);
        // console.log(top_OTUlabels);

        //Bar chart

        var trace = {
            type: 'bar',
            x: top_sampleValues,
            y: OTUids_labels,
            text: top_OTUlabels,
            orientation: 'h'
        };
        
        var data = [trace];
        
        var layout = {
            title: 'OTU chart'
        }; 

        Plotly.newPlot("bar", data, layout);

        //Bubble chart 
        console.log("Plotting bubble chart");

        //mapping out filtered data (to specific otu_id) into separate lists
        var sampleValues_unsorted = filteredList.map(data => data.sample_values);
        var OTUids_unsorted = filteredList.map(data => data.otu_ids);
        var OTUlabels_unsorted = filteredList.map(data => data.otu_labels);

        // Into list for plotting
        var sampleValues_list = sampleValues_unsorted[0];
        var OTUids_list = OTUids_unsorted[0];
        var OTUlabels_list = OTUlabels_unsorted[0];


        var trace2 = {
            x: OTUids_list,
            y: sampleValues_list,
            mode: 'markers',
            text: OTUlabels_list,
            marker: {
                color: OTUids_list,
                size: sampleValues_list
            }
        };
        
        var data = [trace2];
        
        var layout = {
            title: `Test Subject ${subjectName} OTU Chart`,
            xaxis: {title: "OTU ID"},
            showlegend: false
        };
        
        Plotly.newPlot('bubble', data, layout);



        //Demographic Card 
        var card = d3.select("#sample-metadata");

        //data to go into dashboard 
        var dashboard_data = filteredmetadata[0];

        //clear dashboard from preivous data
        card.html(" ");

        //updating data into dashboard
        var metadata_labels = ["id", "ethnicity", "gender", "age", "location", "bbtype", "wfreq"];

        for (i=0; i<metadata_labels.length;i++) {

            var property = metadata_labels[i];
            var value = dashboard_data[property];

            card.append().html( 
                `<div id="sample-metadata" class="panel-body"> ${property} : ${value}</div>`
            );   
        };

        //Gauge 

        var wfreq = dashboard_data["wfreq"];

        console.log(wfreq);

        var data2 = [
            {
                domain: { 
                    x: [0, 1], 
                    y: [0, 1] },
                value: wfreq,
                title: { text: "Belly Button Washing Frequency - Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 10] },
                    steps: [
                      { range: [0, 1], color: "white" },
                      { range: [1, 2], color: "AntiqueWhite" },
                      { range: [2, 3], color: "BlanchedAlmond" },
                      { range: [3, 4], color: "Khaki" },
                      { range: [4, 5], color: "DarkKhaki" },
                      { range: [5, 6], color: "DarkSeaGreen" },
                      { range: [6, 7], color: "MediumSeaGreen" },
                      { range: [7, 8], color: "OliveDrab" },
                      { range: [8, 9], color: "SeaGreen" },
                      { range: [9, 10], color: "YellowGreen" } 
                    ]
                }
            }
        ];
        
        var layout = { 
            width: 600, 
            height: 500, 
            margin: { t: 0, b: 0 } 
        };

        Plotly.newPlot('gauge', data2, layout);


    });

    

};


