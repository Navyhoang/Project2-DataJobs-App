/* Bar chart configuration */

// extract data from the jobs API
d3.json("/api/jobs").then((data) => {
    console.log(data);

    var countrySelected = "United States";
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

    var selectedData = dataObject.filter(d => d.country == countrySelected);
    console.log(selectedData);

    var allStates = [];
    var allTitles = [];
    selectedData.forEach(d => {
        if (!allStates.includes(d.state)){
            allStates.push(d.state);
        }
        if (!allTitles.includes(d.title)){
            allTitles.push(d.title);
        }
    });

    var transformedData = allStates.map(d => {
        var dataObj = {state: d};
        allTitles.forEach(title => {
            if (!(title in dataObj)) {
                dataObj[title] = 0;
            }
        })
        return dataObj;
    });

    selectedData.forEach(d => {
        transformedData.forEach(record => {
            if(record.state == d.state){
                record[d.title] += 1;
            }
        });
    });

    var series = d3.stack()
        .keys(allTitles)
        (data)
        .map(d => (d.forEach(v => v.key = d.key), d));
    console.log(series);
});