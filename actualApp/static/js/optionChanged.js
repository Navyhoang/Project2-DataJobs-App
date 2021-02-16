//Function to trigger all updates

function optionChanged(selectedCountry) {

    //console.log(selectedCountry);

    //initiating all other functions to update views 
    updateGauge(selectedCountry);
    updateHeatmap(selectedCountry);
    //updateBubblechart(selectedCountry);
    updateStackedbar(selectedCountry);
    updateSummary(selectedCountry);
};