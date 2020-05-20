const url = "../../data/samples.json";

var dropDownMenu = d3.select("#selDataset");
var demographicInfo = d3.select("#sample-metadata");

function onload() {
  d3.json(url).then(function(data) {
    Object.values(data.names).forEach((val) =>{
      var dropDownMenu = d3.select("#selDataset");
      dropDownMenu.append('option').text(val);
    })
    populateDemographicInfo(data.names[0]);
    showHorizontalBarChart(data.names[0]);
    showBubbleChart(data.names[0]);
  });
}

/**
 * 
 * @param {*} val 
 */
function populateDemographicInfo(val){
  d3.json(url).then(function(data) {

    // Returns list of dictionaries
    var metaData = data.metadata;  
    var filteredData = metaData.filter(function(d){
      return d.id == val;
    })

    Object.entries(filteredData).forEach(([key, value]) => {
      demographicInfo.html("");
 
      var table = demographicInfo.append("table");
      appendRows("id",value.id,table);
      appendRows("ethnicity",value.ethnicity,table);
      appendRows("gender",value.gender,table);
      appendRows("age",value.age,table);
      appendRows("location",value.location,table);
      appendRows("bbtype",value.bbtype,table);
      appendRows("wfreq",value.wfreq,table);
    });
  });
}

/**
 * Appends rows for each key-value pair for demographic info
 * @param {*} key 
 * @param {*} val
 * @param {*} table 
 */
function appendRows(key, val, table){
  var row = table.append("tr");
  var cell = row.append("td");
  cell.text(`${key}: ${val}`);
}

function showHorizontalBarChart(val){
  d3.json(url).then(function(data){
    var samples = data.samples;
    var sample = samples.filter(sample => sample.id == val);

    Object.entries(sample).forEach(([key, value]) => {
      var otu_ids = value.otu_ids.slice(0, 10).reverse();
      var otu_labels =  value.otu_labels.slice(0, 10).reverse();
      var sample_values = value.sample_values.slice(0,10).reverse();

      var trace1 = {
        x: sample_values,
        y: otu_ids,
        type: "bar",
        orientation: 'h'
      };

      var data = [trace1];
    
      var layout = {
        title: "Top 10 OTU",
        xaxis: { title: "Sample Values" },
        yaxis: { type: "category" }
      };
    
      Plotly.newPlot("bar", data, layout);
    })
  })
}

function showBubbleChart(val){

  d3.json(url).then(function(data){
    var samples = data.samples;
    var sample = samples.filter(sample => sample.id == val);

    Object.entries(sample).forEach(([key, value]) => {
      var otu_ids = value.otu_ids;
      var otu_labels =  value.otu_labels;
      var sample_values = value.sample_values;

      var trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker_size : sample_values,
        marker: {
          color: otu_ids,
          size: sample_values,
          sizeref: 2
        },
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Bubble Chart',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);

    })
  })

  
}

/**
 * Updates demographic info on change of subject id
 * @param {*} val 
 */
function optionChanged(val){
  populateDemographicInfo(val);
  showHorizontalBarChart(val);
  showBubbleChart(val);
}

onload();
