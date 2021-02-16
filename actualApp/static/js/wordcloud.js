//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

function dropdownMenu() {

    //creating all options 
    var titleNames = ["Data Analyst", "Data Scientist", "Data Engineer", "Machine Learning"];

    //selecting drop down menu designation
    var dropdownMenu = d3.selectAll("#selTitle");
    
    //adding each option into drop down menu 
    titleNames.forEach(title => {
        dropdownMenu.append("option").attr("value", title).text(title);
    });

};

function dropdownFreq() {

    //creating all options 
    var listFreq = ["2", "5", "10", "30", "50", "100"];

    //selecting drop down menu designation
    var dropdownFreq = d3.selectAll("#selFreq");
    
    //adding each option into drop down menu 
    listFreq.forEach(freq => {
        dropdownFreq.append("option").attr("value", freq).text(freq);
    });

};

d3.json("/api/keywords", function(keywordData) {

    function drawWordCloud() {

        var fill = d3.scale.category20();     

        // Draw the word cloud
        function drawCloud(words) {
            // Get the element
            var svg = d3.select(".wordcloud").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style('width', '100%')
            // .style('height', 'auto')
            .append("g")
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")

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

            d3.layout.cloud().stop();
        }

        return {
            update: function (words) {
                maxSize = d3.max(words, function (d) { return d.size; });
                minSize = d3.min(words, function (d) { return d.size; });
                // Set the ranges for the scales (in sqrt)
                var fontScale = d3.scale.sqrt().domain([minSize, maxSize]).range([10, 70]);
                
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
    
    
    filteredList = ["analyst", "data", "scientist", "engineer"]

    var width = 1000, height = 500;

    function getWords(word, freqValue) {


        var words = Object.entries(word).map(function ([key, value]) {
            if (value > freqValue) {
                // Check if the key matches the filter list
                if (filteredList.indexOf(key) >= 0) {
                    console.log(key, value);
                    return { text: key, size: value/2};
                } else {
                    return { text: key, size: value };
                }
            }
        }).filter(d => d);
        console.log(words)
        return words
    }

    // Populate the dropdown menu
    dropdownMenu();
    dropdownFreq();
    // Get drop down menu value
    var selectedTitle = d3.select("#selTitle")
    var selectedFreq = d3.select("#selFreq")
    // Get the API result by parsing the title name
    var listWords = keywordData[selectedTitle.node().value];
    var defaultFreq = parseInt(selectedFreq.node().value)
    //Create a new instance of the word cloud visualisation.
    var myWordCloud = drawWordCloud();

    myWordCloud.update(getWords(listWords, defaultFreq))

    // Set a listener for the dropdown menu
    selectedTitle.on("change", optionChanged);
    selectedFreq.on("change", optionChanged);

    function optionChanged() {
        var currentTitle = selectedTitle.node().value
        var freqValue = selectedFreq.node().value
        // d3.select(".current-title").text(currentTitle)

        d3.select(".wordcloud").html("")
        listWords = keywordData[currentTitle];
        myWordCloud.update(getWords(listWords, freqValue))
    }
})

