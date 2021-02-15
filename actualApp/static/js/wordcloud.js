//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html


d3.json("/api/keywords", function(keywordData) {

    function drawWordCloud(selector) {
    
        var fill = d3.scale.category20();

        var svg = d3.select(selector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .style('width', '100%')
        // .style('height', 'auto')
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")

        // Draw the word cloud
        function drawCloud(words) {
            // Get the element
            var cloud = svg.selectAll("text")
                            .data(words)
            
            // Enter the words
            cloud.enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", function (d, i) {
                    return fill(i);
                })
                .attr("text-anchor", "middle")
                .style("fill-opacity", 1e-6)
                .attr("font-size", 1)
                .text(function (d) { return d.text; });

            // Making animation for words
            cloud.transition()
                .duration(1000)
                .style("font-size", function (d) { return d.size + "px"; })
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

            // Exiting words
            cloud.exit()
                .transition()
                .duration(500)
                .style("fill-opacity", 1e-6)
                .attr('font-size', 1)
                .remove();
                
        }

        return {
            update: function (words) {
                maxSize = d3.max(words, function (d) { return d.size; });
                minSize = d3.min(words, function (d) { return d.size; });
            
                var fontScale = d3.scale.linear().domain([minSize, maxSize]).range([10, 150]);

                d3.layout.cloud().size([width, height])
                .words(words)
                .padding(5)
                .font("Impact")
                .fontSize(function (d) { return fontScale(d.size) })
                .on("end", drawCloud)
                .start();
            }
        }

    }
    
    // Collect returned API result into a list
    var listWords = [
        keywordData["Data Analyst"],
        keywordData["Data Scientist"],
        keywordData["Data Engineer"],
        keywordData["Machine Learning"]
    ]

    filteredList = ["analyst", "data", "scientist"]

    var width = 800, height = 500;

    function getWords(i) {

        var words = Object.entries(listWords[i]).map(function ([key, value]) {
            if (value > 2) {
                // Check if the key matches the filter list
                if (filteredList.indexOf(key) >= 0) {
                    console.log(key, value);
                    return { text: key, size: value/2};
                } else {
                    return { text: key, size: value };
                }
            }
        }).filter(d => d);

        return words
    }
 
    function showNewWords(vis, i) {
        i = i || 0;
        console.log(i)
        vis.update(getWords(i ++ % listWords.length))
        setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
    }

    //Create a new instance of the word cloud visualisation.
    var myWordCloud = drawWordCloud(".wordcloud");
    
    showNewWords(myWordCloud);

})

