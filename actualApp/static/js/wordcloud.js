//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html


d3.json("/api/keywords", function(keywordData) {

    titleChoice = keywordData["Data Scientist"]
    scaled_list = ["analyst", "data", "scientist"]

    var width = 800, height = 500;
    var words = Object.entries(titleChoice).map(function ([key, value]) {
        if (value > 2) {
            // Check if the key matches the filter list
            if (scaled_list.indexOf(key) >= 0) {
                console.log(key, value);
                return { text: key, size: value/3};
            } else {
                return { text: key, size: value };
            }
        }
    }).filter(d => d);

    console.log(words)
    
    maxSize = d3.max(words, function (d) { return d.size; });
    minSize = d3.min(words, function (d) { return d.size; });

    var fontScale = d3.scale.linear().domain([minSize, maxSize]).range([10, 150]);

    var fill = d3.scale.category20();

    d3.layout.cloud().size([width, height])
        .words(words)
        .font("Impact")
        .fontSize(function (d) { return fontScale(d.size) })
        .on("end", drawCloud)
        .start();

    // Draw the word cloud
    function drawCloud(words) {
        // Get the element
        var cloud = d3.select(".wordcloud").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style('width', '100%')
            // .style('height', 'auto')
            .append("g")
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
            .selectAll("text")
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
            .duration(2000)
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
        
        return {
            refresh: function (words) {
                d3.layout.cloud().size([width, height])
                .words(words)
                .padding(50)
                .font("Impact")
                .fontSize(function (d) { return fontScale(d.size) })
                .on("end", drawCloud)
                .start();
            }
        }
            
    }
    


// ================================================================

    // Encapsulate the word cloud functionality
    function wordCloud(selector) {

        var fill = d3.scale.category20();

        //Construct the word cloud's SVG element
        var svg = d3.select(selector).append("svg")
            .attr("width", 800)
            .attr("height", 400)
            .append("g")
            .attr("transform", "translate(400,200)");


        //Draw the word cloud
        function draw(words) {
            var cloud = svg.selectAll("g text")
                            .data(words)

            //Entering words
            cloud.enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr('font-size', 1)
                .text(function(d) { return d.text; });

            //Entering and existing words
            cloud
                .transition()
                    .duration(600)
                    .style("font-size", function(d) { return d.size + "px"; })
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("fill-opacity", 1);

            //Exiting words
            cloud.exit()
                .transition()
                    .duration(200)
                    .style('fill-opacity', 1e-6)
                    .attr('font-size', 1)
                    .remove();
        }


        //Use the module pattern to encapsulate the visualisation code. We'll
        // expose only the parts that need to be public.
        return {

            //Recompute the word cloud for a new set of words. This method will
            // asycnhronously call draw when the layout has been computed.
            //The outside world will need to call this function, so make it part
            // of the wordCloud return value.
            update: function(words) {
                d3.layout.cloud().size([800, 400])
                    .words(words.map(function([key, value]) {
                        return {text: key, size: value/10};}))
                    .padding(5)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();
            }
        }

    }

    //Some sample data
    // var words = [
    //     "You don't know about me without you have read a book called The Adventures of Tom Sawyer but that ain't no matter.",
    //     "The boy with fair hair lowered himself down the last few feet of rock and began to pick his way toward the lagoon.",
    //     "When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",
    //     "It was inevitable: the scent of bitter almonds always reminded him of the fate of unrequited love."
    // ]

    //Prepare one of the sample sentences by removing punctuation,
    // creating an array of words and computing a random size attribute.
    // function getWords(i) {
    //     return words[i]
    //             .replace(/[!\.,:;\?]/g, '')
    //             .split(' ')
    //             .map(function(d) {
    //                 return {text: d, size: 10 + Math.random() * 30};
    //             })
    // }

    // var words = keywordData["Data Analyst"]
    // console.log(words)
    //This method tells the word cloud to redraw with a new set of words.
    //In reality the new words would probably come from a server request,
    // user input or some other source.
    function showNewWords(vis, i) {
        i = i || 0;

        vis.update(words)
        // setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
    }

    //Create a new instance of the word cloud visualisation.
    // var myWordCloud = wordCloud(".wordcloud");

    //Start cycling through the demo data
    // showNewWords(myWordCloud);

})

