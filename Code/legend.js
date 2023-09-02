// Create the legend container
const legendContainer = document.getElementById('legend');

// Function to toggle the legend visibility
function toggleLegend() {
  legendContainer.classList.toggle('show');
}

// Define the legend items for trails, roads, and boundaries
const trailLegendItem = {
    name: 'Trails',
    color: '#A0766E', 
  };
  
  const roadLegendItem = {
    name: 'Roads',
    color: '#000000', 
  };
  
  const boundaryLegendItem = {
    name: 'Boundaries',
    color: '#000000', 
  };
  const FilteredLegendItem = {
      name: 'Filtered Trails',
      color: '#F7B32B', 
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
  legendContainer.appendChild(createLegendItem(trailLegendItem.name, trailLegendItem.color));
  legendContainer.appendChild(createLegendItem(roadLegendItem.name, roadLegendItem.color));
  legendContainer.appendChild(createLegendItem(boundaryLegendItem.name, boundaryLegendItem.color));
  legendContainer.appendChild(createLegendItem(FilteredLegendItem.name, FilteredLegendItem.color));

  const poiLegendItem = createPOILegendItem('Points of Interest', 'circle', '#000000');
  legendContainer.appendChild(poiLegendItem);

  Object.keys(iconMapping).forEach(poiType => {

    const legendItem = document.createElement('div');
  legendItem.className = 'legend-item';


  const icon = document.createElement('img');
  icon.src = iconMapping[poiType];
  icon.alt = poiType;
  legendItem.appendChild(icon);

  const label = document.createElement('span');
  label.textContent = poiType;
  legendItem.appendChild(label);

  legendContainer.appendChild(legendItem);
});

legendContainer.addEventListener('mousedown', (event) => {
  event.stopPropagation();
});

const legendButton = document.getElementById('legendButton');
legendButton.addEventListener('click', toggleLegend);

//This is the function that toggles the alerts on and off (Yellowstone)
function toggleBox(boxId) {
  var box = document.getElementById(boxId);
  var boxContent = box.querySelector('.box-content');

  // Make API request
  var xhr = new XMLHttpRequest();
  var url = "https://developer.nps.gov/api/v1/alerts?q=yell&api_key=RllXDxNdfPKkKBMSXt5K6lv0XtH9Ik3IdckjAnNt";
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var alerts = response.data;

      boxContent.innerHTML = '';

      for (var i = 0; i < alerts.length; i++) {
        var alert = alerts[i];
        var alertTitle = document.createElement('h3');
        alertTitle.textContent = alert.title;
        var alertDescription = document.createElement('p');
        alertDescription.textContent = alert.description;

        boxContent.appendChild(alertTitle);
        boxContent.appendChild(alertDescription);
      }

      box.classList.toggle('visible');
    }
  };
  xhr.send();
}

//This is the function that toggles the alerts on and off (Grand Canyon)
function toggleBoxCanyon(boxId) {
  var box = document.getElementById(boxId);
  var boxContent = box.querySelector('.box-content');
  var xhr = new XMLHttpRequest();
  var url = "https://developer.nps.gov/api/v1/alerts?q=grca&api_key=RllXDxNdfPKkKBMSXt5K6lv0XtH9Ik3IdckjAnNt";
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var alerts = response.data;

      boxContent.innerHTML = '';

      for (var i = 0; i < alerts.length; i++) {
        var alert = alerts[i];
        var alertTitle = document.createElement('h3');
        alertTitle.textContent = alert.title;
        var alertDescription = document.createElement('p');
        alertDescription.textContent = alert.description;

        boxContent.appendChild(alertTitle);
        boxContent.appendChild(alertDescription);
      }
      box.classList.toggle('visible');
    }
  };
  xhr.send();
}

//This code controls the visibility of the text box of the 'roundabout-button' is clicked
const roundaboutButton = document.getElementById('roundabout-button');
const textBoxContainer = document.getElementById('text-box-container');
let isTextBoxVisible = false; 

roundaboutButton.addEventListener('click', function() {
  console.log('Button clicked');
  console.log('Current visibility state:', isTextBoxVisible);

  if (isTextBoxVisible) {
    textBoxContainer.style.display = 'none';
  } else {
    textBoxContainer.style.display = 'block';
  }
  isTextBoxVisible = !isTextBoxVisible; 

  console.log('Updated visibility state:', isTextBoxVisible);
});
