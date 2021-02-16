/* Bubble chart creation */

function updateBubblechart(selectedCountry) {
    d3.select("#bubble").html("");

    // Obtain the leave data from the flask service
    d3.json("/api/leave").then((data) => {

        //Construct an array of record objects
        var leaveRecords = data.leave[0].map(item => {
            return {
            response: item[0],
            state: item[1],
            country: item[2] 
            };
        });

        //Filter the selected objects based on countries
        var selectedRecords = selectedCountry.toLowerCase() == "all" ?
            leaveRecords : leaveRecords.filter(record => record.country == selectedCountry);

        //Find the count of each different responses
        var responseCounts = {};
        selectedRecords.forEach(record => {
            if (record.response in responseCounts) {
                responseCounts[record.response] += 1;
            }
            else {
                responseCounts[record.response] = 1;
            }
        });

        //Compile the counts into a list of object
        var counterList = Object.keys(responseCounts).map(key => {
            return {
                response: key,
                count: responseCounts[key]
            }
        });

        //Obtain the all counts into the array
        var allCounts = Object.keys(responseCounts).map(key => responseCounts[key]);
        allCounts.sort((a, b) => {
            return a - b;
        });

        var width = 800;
        var height = 800;
        var pack = (data) => d3.pack()
            .size([width - 2, height - 2])
            .padding(3)
            (d3.hierarchy({children: data})
                .sum(d => d.count));
        
        const root = pack(counterList);

        const svg = d3.select("#bubble").append("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("text-anchor", "middle");
        
        console.log(root.leaves());
        
        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
        
        var circle = leaf.append("circle")
            .attr("r", d => d.r)
            .attr("fill-opacity", 0.7)
            .attr("fill", "pink");
        
    
        leaf.append("clipPath")
            .append("use");
        leaf.append("text")
            .selectAll("tspan")
            .data(d => {var temp = d.data.response.split(" ");
                        return `${temp[0]} ${temp[1]}` })
            .enter().append("tspan")
            .attr("y", 0)
            .attr("x", (d, i, nodes) => `${i/1.5 - nodes.length / 2 + 2}em`)
            .text(d => d);
        leaf.append("title")
            .text(d => d.data.response + " - " + selectedCountry);
    });
}

updateBubblechart("all");
