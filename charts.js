function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let profile = samples.filter( x => parseInt(x.id) == sample)[0];
    //  5. Create a variable that holds the first sample in the array.
    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = profile.otu_ids;
    let otu_labels = profile.otu_labels;
    let sample_values = profile.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    let mapped = sample_values.map( (v,i) => {
      return {i, value: v}
    })
    mapped.sort( (a,b) => b.value- a.value);
    let topTen = mapped.slice(0,10);
    let results = topTen.map(v => sample_values[v.i]).reverse();
    let yticks = topTen.map(v => 'OTU ' + otu_ids[v.i]).reverse();
    let hover = topTen.map(v => otu_labels[v.i]).reverse();
  
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: results,
      y: yticks,
      orientation : 'h',
      type: 'bar',
      text: hover
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout)
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures for Sample ID ' + sample,
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    metadata = data.metadata.filter(x => parseInt(x.id) == sample)[0];
    // Create a variable that holds the first sample in the array.

    // 2. Create a variable that holds the first sample in the metadata array.
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    wfreq = parseFloat(metadata.wfreq);
    
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: { 
        axis: { range:[null,10] },
        bar: {color:"darkblue"},
        steps: [
          { range: [0,2], color: "red"},
          { range: [2,4], color: "orangered"},
          { range: [4,6], color: "yellow"},
          { range: [6,8], color: "yellowgreen"},
          { range: [8,10], color: "chartreuse"},
        ] 
      },
    title : { text: "<b>Belly Button Washing Frequency</b><br>Cleanings per Week"}
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 400
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData);
  });
}
