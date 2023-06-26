mapboxgl.accessToken = 'pk.eyJ1IjoidmFuZXNzYWhlbmtlcyIsImEiOiJjbDQyZnI1czQwNGJiM21tbG1xOGU1cHUyIn0.90NG-Bfg_Q_tsxUd_UZCfA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vanessahenkes/cl4ehgpd4000114o38wx98v6y',
  center: [-110.629578, 44.480121],
  zoom: 8,
});

var boundingBox = null;

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Yellowstone_Trails.geojson')
  .then(response => response.json())
  .then(data => {
    // Check if the 'trails' source already exists in the map
    if (map.getSource('trails')) {
      // If the source exists, remove it from the map
      map.removeSource('trails');
    }

    // Add the 'trails' source to the map
    map.addSource('trails', {
      type: 'geojson',
      data: data
    });

    // Check if the 'trails' layer already exists in the map
    if (map.getLayer('trails')) {
      // If the layer exists, remove it from the map
      map.removeLayer('trails');
    }

    // Add the 'trails' layer to the map
    map.addLayer({
      id: 'trails',
      type: 'line',
      source: 'trails',
      paint: {
        'line-color': 'black',
        'line-width': 1
      }
    });
  })
  .catch(error => {
    console.error('Error fetching trail data:', error);
  });

fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Yellowstone_Boundary.geojson')
  .then(response => response.json())
  .then(data => {
    // Check if the 'boundary' source already exists in the map
    if (map.getSource('boundary')) {
      // If the source exists, remove it from the map
      map.removeSource('boundary');
    }

    // Add the 'boundary' source to the map
    map.addSource('boundary', {
      type: 'geojson',
      data: data
    });

    // Check if the 'boundary' layer already exists in the map
    if (map.getLayer('boundary')) {
      // If the layer exists, remove it from the map
      map.removeLayer('boundary');
    }

    // Add the 'boundary' layer to the map
    map.addLayer({
      id: 'boundary',
      type: 'line',
      source: 'boundary',
      paint: {
        'line-color': 'dark blue',
        'line-width': 0.5
      }
    });
  })
  .catch(error => {
    console.error('Error fetching boundary data:', error);
  });

function updateCenterCoordinates() {
  var startingPointDropdown = document.getElementById('dropdown');
  var selectedOption = startingPointDropdown.value;

  // Declare center latitude and longitude variables
  var centerLatitude;
  var centerLongitude;

  // Update center latitude and longitude based on the selected option
  if (selectedOption === 'North Entrance') {
    centerLatitude = 45.026235;
    centerLongitude = -110.702286;
  } else if (selectedOption === 'West Entrance') {
    centerLatitude = 44.656857;
    centerLongitude = -111.089583;
  } else if (selectedOption === 'South Entrance') {
    centerLatitude = 44.135120;
    centerLongitude = -110.666514;
  } else if (selectedOption === 'East Entrance') {
    centerLatitude = 44.488458;
    centerLongitude = -110.004057;
  } else if (selectedOption === 'North East Entrance') {
    centerLatitude = 45.004461;
    centerLongitude = -110.010576;
  }
  console.log('Center Coordinates:', centerLatitude, centerLongitude);
}

function toggleFilter() {
  var filter = document.getElementById('toggleFilter');
  if (filter.style.display === 'none') {
    filter.style.display = 'block';
  } else {
    filter.style.display = 'none';
  }
}

function checkBoundingBox() {
  if (boundingBox && boundingBox.length >= 2) {
    // Remove the existing 'bounding-box' layer from the map
    if (map.getLayer('bounding-box')) {
      map.removeLayer('bounding-box');
    }

    // Remove the existing 'bounding-box' source from the map
    if (map.getSource('bounding-box')) {
      map.removeSource('bounding-box');
    }

    // Add the new 'bounding-box' layer to the map
    map.addLayer({
      id: 'bounding-box',
      type: 'fill',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [boundingBox[0][0], boundingBox[0][1]],
                [boundingBox[1][0], boundingBox[0][1]],
                [boundingBox[1][0], boundingBox[1][1]],
                [boundingBox[0][0], boundingBox[1][1]],
                [boundingBox[0][0], boundingBox[0][1]]
              ]
            ]
          }
        }
      },
      paint: {
        'fill-color': 'rgba(0, 0, 255, 0.2)',
        'fill-outline-color': 'blue'
      }
    });
  } else {
    // Remove the existing 'bounding-box' layer from the map
    if (map.getLayer('bounding-box')) {
      map.removeLayer('bounding-box');
    }

    // Remove the existing 'bounding-box' source from the map
    if (map.getSource('bounding-box')) {
      map.removeSource('bounding-box');
    }
  }
}

function applyFilter() {
  // Get the value of the slider
  var sliderValue = document.getElementById('slider').value;

// Convert the slider value to a scaling factor
var scalingFactor = 10 + (sliderValue * 2); // Assuming each slider step corresponds to 5 square miles and starting with a 10 square mile bounding box

// Calculate the half width and height of the bounding box
var halfWidth = scalingFactor / 30;
var halfHeight = scalingFactor / 30;

// Calculate the center latitude and longitude
var centerLatitude = 44.480121;
var centerLongitude = -110.629578;

// Calculate the bounding box coordinates
var minLongitude = centerLongitude - (halfWidth / Math.cos(centerLatitude * (Math.PI / 180)));
var minLatitude = centerLatitude - halfHeight;
var maxLongitude = centerLongitude + (halfWidth / Math.cos(centerLatitude * (Math.PI / 180)));
var maxLatitude = centerLatitude + halfHeight;

// Update the bounding box variable
boundingBox = [[minLongitude, minLatitude], [maxLongitude, maxLatitude]];

  // Filter trails within the bounding box
  filterTrailsInBoundingBox(boundingBox);
}

var slider = document.getElementById('slider');
var applyFilterButton = document.getElementById('applyFilterButton');
var dropdown = document.getElementById('dropdown');



slider.oninput = function () {
  // Update the slider value display
  var sliderValueDisplay = document.getElementById('slider');
  sliderValueDisplay.textContent = this.value;
};

applyFilterButton.onclick = function () {
  // Update the center coordinates based on the selected option
  updateCenterCoordinates();

  // Update the filter based on the slider value
  applyFilter();
};

dropdown.onchange = function () {
  // Update the center coordinates based on the selected option
  updateCenterCoordinates();

  // Update the filter based on the slider value
  applyFilter();
  displayBoundingBox();
  boundingBox = null;
    // Remove the existing bounding box layer from the map
    if (boundingBox) {
      map.removeLayer(boundingBox);
    }

};


function clearFilter() {
  var select = document.getElementById("dropdown");
  select.selectedIndex = 0;
  var filter = ["all"];
  map.setFilter("trails", filter);
  map.setLayoutProperty("trails", "visibility", "visible");
  map.setFilter("boundary", filter);
  map.setLayoutProperty("boundary", "visibility", "visible");
}

function filterTrailsInBoundingBox(boundingBox) {
  // Clear the current trails layer
  if (map.getLayer('bounding-box')) {
    map.removeLayer('bounding-box');
  }

  // Filter trails within the bounding box
  var filteredTrails = trailsData.features.filter(function (trail) {
    // Check if the trail is within the bounding box
    var trailCoordinates = trail.geometry.coordinates;
    var trailLongitude = trailCoordinates[0];
    var trailLatitude = trailCoordinates[1];
    var isWithinBoundingBox =
      trailLongitude >= boundingBox[0][0] &&
      trailLongitude <= boundingBox[1][0] &&
      trailLatitude >= boundingBox[0][1] &&
      trailLatitude <= boundingBox[1][1];

    // Check if the trail length is below 3 miles
    var trailLength = trail.properties.length;
    var isBelowThreeMiles = trailLength < 3;

    // Return true only if the trail is within the bounding box and below 3 miles
    return isWithinBoundingBox && isBelowThreeMiles;
  });

  // Add the filtered trails to the map
  L.geoJSON(filteredTrails, {
    style: {
      color: 'green',
      weight: 2,
      opacity: 0.6,
    },
  }).addTo(trailsLayer);
}
function displayBoundingBox() {
  if (boundingBox && boundingBox.length >= 2) {
    // Create a GeoJSON feature for the bounding box
    var boundingBoxFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [boundingBox[0][0], boundingBox[0][1]],
            [boundingBox[1][0], boundingBox[0][1]],
            [boundingBox[1][0], boundingBox[1][1]],
            [boundingBox[0][0], boundingBox[1][1]],
            [boundingBox[0][0], boundingBox[0][1]]
          ]
        ]
      }
    };

    // Check if the 'bounding-box' source already exists in the map
    if (map.getSource('bounding-box')) {
      // If the source exists, update its data
      map.getSource('bounding-box').setData(boundingBoxFeature);
    } else {
      // If the source doesn't exist, add it to the map
      map.addSource('bounding-box', {
        type: 'geojson',
        data: boundingBoxFeature
      });

      // Add the 'bounding-box' layer to the map
      map.addLayer({
        id: 'bounding-box',
        type: 'fill',
        source: 'bounding-box',
        paint: {
          'fill-color': '#00ff00',
          'fill-opacity': 0.3
        }
      });
    }
  }
}

function checkBoundingBox() {
  if (boundingBox && boundingBox.length >= 2) {
    // Remove the existing 'bounding-box' layer from the map
    if (map.getLayer('bounding-box')) {
      map.removeLayer('bounding-box');
    }

    // Remove the existing 'bounding-box' source from the map
    if (map.getSource('bounding-box')) {
      map.removeSource('bounding-box');
    }

    // Add the new 'bounding-box' layer to the map
    map.addLayer({
      id: 'bounding-box',
      type: 'fill',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [boundingBox[0][0], boundingBox[0][1]],
                [boundingBox[1][0], boundingBox[0][1]],
                [boundingBox[1][0], boundingBox[1][1]],
                [boundingBox[0][0], boundingBox[1][1]],
                [boundingBox[0][0], boundingBox[0][1]]
              ]
            ]
          }
        }
      },
      paint: {
        'fill-color': 'rgba(0, 0, 255, 0.2)',
        'fill-outline-color': 'blue'
      }
    });
  } else {
    // Remove the existing 'bounding-box' layer from the map
    if (map.getLayer('bounding-box')) {
      map.removeLayer('bounding-box');
    }

    // Remove the existing 'bounding-box' source from the map
    if (map.getSource('bounding-box')) {
      map.removeSource('bounding-box');
    }
  }
}

function updateMap(filteredTrails) {
  // Check if the 'filtered-trails' source already exists in the map
  if (map.getSource('filtered-trails')) {
    // If the source exists, remove it from the map
    map.removeSource('filtered-trails');
  }

  // Add the 'filtered-trails' source to the map
  map.addSource('filtered-trails', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: filteredTrails
    }
  });

  // Check if the 'filtered-trails' layer already exists in the map
  if (map.getLayer('filtered-trails')) {
    // If the layer exists, remove it from the map
    map.removeLayer('filtered-trails');
  }

  // Add the 'filtered-trails' layer to the map
  map.addLayer({
    id: 'filtered-trails',
    type: 'line',
    source: 'filtered-trails',
    paint: {
      'line-color': 'red',
      'line-width': 2
    }
  });

  // Hide the original 'trails' layer
  map.setLayoutProperty('trails', 'visibility', 'none');
}


var applyFilterButton = document.getElementById('applyFilterButton');
if (applyFilterButton) {
  applyFilterButton.addEventListener('click', applyFilter);
}
