//Function to trigger all updates

function optionChanged(selectedCountry) {

    console.log(selectedCountry);

    updateGauge(selectedCountry);
    updateHeatmap(selectedCountry);
    //updateBubblechart(selectedCountry);
    //updateStackedbar(selectedCountry);
    updateSummary(selectedCountry);
};