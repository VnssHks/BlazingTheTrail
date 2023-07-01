// Create the legend container
const legendContainer = document.getElementById('legend');

// Function to toggle the legend visibility
function toggleLegend() {
  legendContainer.classList.toggle('show');
}

// Define the legend items for trails, roads, and boundaries
const trailLegendItem = {
    name: 'Trails',
    color: '#A0766E', // Specify the desired color for trails
  };
  
  const roadLegendItem = {
    name: 'Roads',
    color: '#000000', // Specify the desired color for roads
  };
  
  const boundaryLegendItem = {
    name: 'Boundaries',
    color: '#000000', // Specify the desired color for boundaries
  };
  const FilteredLegendItem = {
      name: 'Filtered Trails',
      color: '#F7B32B', // Specify the desired color for boundaries
    };
  
  
  // Function to create a legend item element
  function createLegendItem(name, color) {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
  
    const line = document.createElement('div');
    line.className = 'legend-line';
    line.style.backgroundColor = color;
  
    const label = document.createElement('span');
    label.textContent = name;
  
    legendItem.appendChild(line);
    legendItem.appendChild(label);
  
    return legendItem;
  }
  // Function to create a legend item element for POIs
  function createPOILegendItem(name, shape, color) {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
    
      const icon = document.createElement('div');
      icon.className = `legend-icon ${shape}`;
      icon.style.backgroundColor = color;
    
      const label = document.createElement('span');
      label.textContent = name;
    
      legendItem.appendChild(icon);
      legendItem.appendChild(label);
    
      return legendItem;
    }
  // Append the legend items to the legend container
  legendContainer.appendChild(createLegendItem(trailLegendItem.name, trailLegendItem.color));
  legendContainer.appendChild(createLegendItem(roadLegendItem.name, roadLegendItem.color));
  legendContainer.appendChild(createLegendItem(boundaryLegendItem.name, boundaryLegendItem.color));
  legendContainer.appendChild(createLegendItem(FilteredLegendItem.name, FilteredLegendItem.color));
  // Create a POI legend item with a circular shape
  const poiLegendItem = createPOILegendItem('Points of Interest', 'circle', '#000000');
  legendContainer.appendChild(poiLegendItem);
// Iterate over the keys of the iconMapping object
Object.keys(iconMapping).forEach(poiType => {
  // Create a legend item element
  const legendItem = document.createElement('div');
  legendItem.className = 'legend-item';

  // Create an image element for the icon
  const icon = document.createElement('img');
  icon.src = iconMapping[poiType];
  icon.alt = poiType;
  legendItem.appendChild(icon);

  // Create a label element for the POI type
  const label = document.createElement('span');
  label.textContent = poiType;
  legendItem.appendChild(label);

  // Append the legend item to the legend container
  legendContainer.appendChild(legendItem);
});

// Stop event propagation for mouse events on the legend container
legendContainer.addEventListener('mousedown', (event) => {
  event.stopPropagation();
});

// Add click event listener to the legend button
const legendButton = document.getElementById('legendButton');
legendButton.addEventListener('click', toggleLegend);



function toggleBox(boxId) {
    var box = document.getElementById(boxId);
    var boxContent = box.querySelector('.box-content');
    if (box.style.display === 'none') {
      box.style.display = 'block';
      boxContent.style.display = 'block';
    } else {
      box.style.display = 'none';
      boxContent.style.display = 'none';
    }
  }
  // Make API request
  var xhr = new XMLHttpRequest();
  var url = "https://developer.nps.gov/api/v1/alerts?q=yell&api_key=RllXDxNdfPKkKBMSXt5K6lv0XtH9Ik3IdckjAnNt";
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var alerts = response.data;

      var alertsContainer = document.getElementById('alerts');
      for (var i = 0; i < alerts.length; i++) {
        var alert = alerts[i];
        var alertTitle = document.createElement('h3');
        alertTitle.textContent = alert.title;
        var alertDescription = document.createElement('p');
        alertDescription.textContent = alert.description;
        alertsContainer.appendChild(alertTitle);
        alertsContainer.appendChild(alertDescription);
      }
    }
  };
  xhr.send();

  // Get the button and text box container elements
const roundaboutButton = document.getElementById('roundabout-button');
const textBoxContainer = document.getElementById('text-box-container');

// Add click event listener to the roundabout button
roundaboutButton.addEventListener('click', function() {
  // Toggle the visibility of the text box container
  textBoxContainer.style.display = textBoxContainer.style.display === 'none' ? 'block' : 'none';
});
