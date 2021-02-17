/* Bar chart configuration */
function updateStackedbar(countrySelected) {
    // Remove the old stacked bar chart
    d3.select("#stackedbar").html("");

    // extract data from the jobs API
    d3.json("/api/jobs").then((data) => {
        var dataObject = data.jobs[0].map(d => {
            return {
                id: d[0],
                title: d[1],
                country: d[2],
                city: d[3],
                state: d[4],
                longitude: d[5],
                latitude: d[6]
            }
        });

        // Filter the data based on countries
        var selectedData = countrySelected.toLowerCase() == "all" ? 
            dataObject : dataObject.filter(d => d.country == countrySelected);
        
        // Construct dataset based on countries
        var allStates = [];
        var allTitles = [];
        selectedData.forEach(d => {
            if (d.state in states && !allStates.includes(states[d.state])){
                allStates.push(states[d.state]);
            }
            else if (!(d.state in states) && !allStates.includes(d.state)){
                allStates.push(d.state);
            }

            if (!allTitles.includes(d.title)){
                allTitles.push(d.title);
            }
        });

        //Obtain the transformed data
        var transformedData = allStates.map(d => {
            var dataObj = {state: d};
            allTitles.forEach(title => {
                if (!(title in dataObj)) {
                    dataObj[title] = 0;
                }
            })
            dataObj.total = 0;
            return dataObj;
        });

        selectedData.forEach(d => {
            transformedData.forEach(record => {
                if(record.state === d.state || record.state === states[d.state]){
                    record[d.title] += 1;
                    record.total += 1;
                }
            });
        });

        // Sort the data into descending order based on the total number of jobs
        transformedData.sort((a, b) => {b.total - a.total});

        // Define margins and dimensions of the svg
        var margin = {top: 20, right: 50, bottom: 30, left: 40};
        var width = 500 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;
        var svg = d3.select("#stackedbar").append("svg").attr("viewBox", [0, 0, 500, 300]);
        g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        // Define the scales for different axis
        var y = d3.scaleBand()
            .domain(allStates)
            .range([0, height])
            .paddingInner(0.05)
            .align(0.1);
        var x = d3.scaleLinear()
            .domain([0, d3.max(transformedData, (d) => d.total)])
            .range([0, width]);
        var z = d3.scaleOrdinal()
            .domain(allTitles)
            .range(["#f9d5e5", "#eeac99", "#e06377", "#c83349"]);

        // Added the stacked bar charts onto the svg
        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(allTitles)(transformedData))
            .enter().append("g")
                .attr("fill", d => z(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
                .attr("y", d => y(d.data.state))
                .attr("x", d => x(d[0]))
                .attr("width", d => x(d[1]) - x(d[0]))
                .attr("height", y.bandwidth());
        // Add x and y axis
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,0)")
            .style("font-size", allStates.length > 30 ? 4 : 7)
            .style("font-weight", "bold")
            .call(d3.axisLeft(y));
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,"+height+")")
            .style("font-size", 7)
            .style("font-weight", "bold")
                .call(d3.axisBottom(x).ticks(null, "s"));
        
        // Configure and add legend for the stacked bar chart
        var legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 5)
                .attr("text-anchor", "end")
            .selectAll("g")
            .data(allTitles.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(-50," + (180 + i * 12) + ")"; });
        
        legend.append("rect")
            .attr("x", width - 10)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", z);
        legend.append("text")
            .attr("x", width - 15)
            .attr("y", 3)
            .attr("dy", "0.32em")
            .style("font-weight", "bold")
            .text(d => d);
    });
}

updateStackedbar("all");