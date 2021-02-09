/* Bubble chart creation */

// Obtain the leave data from the flask service
d3.json("/api/leave").then((data) => {

    // Obtained the current country that is deciphered
    // var countrySelected = d3.select("#selDataset").text();
    var countrySelected = "Canada";

    //Construct an array of record objects
    var leaveRecords = data.leave[0].map(item => {
        return {
           response: item[0],
           state: item[1],
           country: item[2] 
        };
    });

    //Filter the selected objects based on countries
    var selectedRecords = leaveRecords.filter(record => record.country == countrySelected);

    //Find the count of each different responses
    var responseCounts = {};
    selectedRecords.forEach(record => {
        if (record.response in responseCounts) {
            responseCounts[record.response] += 1;
        }
        else {
            responseCounts[record.response] = 0;
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


    var format = d3.format(",d");
    var color = d3.scaleOrdinal(allCounts.map(d => d.key), d3.schemeCategory20)
    var width = 450;
    var height = 450;
    var pack = (data) => d3.pack()
        .size([width - 2, height - 2])
        .padding(3)
        (d3.hierarchy({children: data})
            .sum(d => d.count));
    
    const root = pack(counterList);

    const svg = d3.select("#bubble").append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("font-size", 7)
        .attr("font-family", "Times New Roman")
        .attr("text-anchor", "middle");
    
    console.log(root.leaves());
    
    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
          .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
    
    leaf.append("circle")
        // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
        .attr("r", d => d.r)
        .attr("fill-opacity", 0.7)
        .attr("fill", "pink");
    
    leaf.append("clipPath")
        // .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
        .append("use");
        // .attr("xlink:href", d => d.leafUid.href);
    
    leaf.append("text")
        // .attr("clip-path", d => d.clipUid)
        .selectAll("tspan")
        .data(d => d.data.response)
        .enter().append("tspan")
        .attr("y", 0)
        .attr("x", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text(d => d);
    
    leaf.append("title")
        .text(d => d.data.response + " - " + countrySelected);

    // console.log(allCounts);

    // // set the dimension of the graph
    // var width = 500;
    // var height = 700;

    // var radius = d3.scaleSqrt()
    //     .domain(allCounts)
    //     .range(allCounts.map(count => (count * 150) / allCounts[allCounts.length - 1]));
    //     // .range(allCounts.map(count => {
    //     //     if (count > 100){
    //     //         return count ;
    //     //     }
    //     // }));
    
    // var color = d3.scaleLinear()
    //     .domain(allCounts)
    //     .range(allCounts.map(count => "#" + (count * 30000).toString(16)))

    // var svg = d3.select("#bubble")
    //     .append("svg")
    //         .attr("width", width)
    //         .attr("height", height);

    // var node = svg.append("g")
    //     .selectAll("circle")
    //     .data(counterList);
    //     // .enter();

    // node.enter().append("circle")
    //     .attr("r", (d) => radius(d.count))
    //     .attr("cx", width/2)
    //     .attr("cy", height/2)
    //     .style("fill", (d) => color(d.count))
    //     .style("fill-opacity", 0.5)
    //     .attr("stroke", "black")
    //     .style("stroke-width", 4)
    //     .call(d3.drag()
    //         .on("start", dragstarted)
    //         .on("drag", dragged)
    //         .on("end", dragended));

    // // node.append("text")
    // //     .text("asfdafa")
    // //     .attr("x", width/2)
    // //     .attr("y", height/2);
    
    // // Features of the forces applied to the nodes:
    // var simulation = d3.forceSimulation()
    //     .force("x", d3.forceX().strength(0.1).x( width/2 ))
    //     .force("y", d3.forceY().strength(0.1).y( height/2 ))
    //     .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    //     .force("charge", d3.forceManyBody().strength(0.1)) // Nodes are attracted one each other of value is > 0
    //     .force("collide", d3.forceCollide().strength(0.1).radius(35000 / allCounts[allCounts.length - 1] + 10).iterations(1)) // Force that avoids circle overlapping

    // // Apply these forces to the nodes and update their positions.
    // // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    // simulation
    //     .nodes(counterList)
    //     .on("tick", function(d){
    //         node
    //             .attr("cx", function(d){ return d.x; })
    //             .attr("cy", function(d){ return d.y; });
    //     });

    // // What happens when a circle is dragged?
    // function dragstarted(d) {
    //     if (!d3.event.active) simulation.alphaTarget(.03).restart();
    //     d.fx = d.x;
    //     d.fy = d.y;
    // }
    // function dragged(d) {
    //     d.fx = d3.event.x;
    //     d.fy = d3.event.y;
    // }
    // function dragended(d) {
    //     if (!d3.event.active) simulation.alphaTarget(.03);
    //     d.fx = null;
    //     d.fy = null;
    // }

});
