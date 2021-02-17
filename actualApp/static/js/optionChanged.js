// Function to trigger all updates

function optionChanged(selectedCountry) {

    // Catch errors
    try {updateGauge(selectedCountry);}
      catch(err) {};

    try {updateHeatmap(selectedCountry);}
      catch(err) {};
    
    try {updateBubblechart(selectedCountry);}
        catch(err) {};

    try {updateStackedbar(selectedCountry);}
        catch(err) {};

    try {updateSummary(selectedCountry);}
        catch(err) {};

    try {updateRawdata(selectedCountry);}
        catch(err) {};
   
};