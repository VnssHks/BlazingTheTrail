mapboxgl.accessToken = 'pk.eyJ1IjoidmFuZXNzYWhlbmtlcyIsImEiOiJjbDQyZnI1czQwNGJiM21tbG1xOGU1cHUyIn0.90NG-Bfg_Q_tsxUd_UZCfA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vanessahenkes/cl4ehgpd4000114o38wx98v6y',
  center: [-110.629578, 44.480121],
  zoom: 8,
});


var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
const scale = new mapboxgl.ScaleControl({maxWidth: 80, unit: 'imperial'});
map.addControl(scale, 'bottom-right');

let centerLatitude;
let centerLongitude;
let trails; // Variable to store the fetched trails GeoJSON data

fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/YS_Trails_Final.geojson')
  .then(response => response.json())
  .then(data => {
    trails = data; // Store the fetched trails data in the variable

    // Check if the 'trails' source already exists in the map
    if (map.getSource('trails')) {
      // If the source exists, remove it from the map
      map.removeSource('trails');
    }

    // Add the 'trails' source to the map
    map.addSource('trails', {
      type: 'geojson',
      data: trails // Use the fetched trails data
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

  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Yellowstone_POIs.geojson')
  .then(response => response.json())
  .then(data => {
    POIs = data; // Store the fetched trails data in the variable

    // Check if the 'trails' source already exists in the map
    if (map.getSource('POIs')) {
      // If the source exists, remove it from the map
      map.removeSource('POIs');
    }

    // Add the 'trails' source to the map
    map.addSource('POIs', {
      type: 'geojson',
      data: POIs // Use the fetched trails data
    });

    // Check if the 'trails' layer already exists in the map
    if (map.getLayer('POIs')) {
      // If the layer exists, remove it from the map
      map.removeLayer('POIs');
    }

    map.addLayer({
      id: 'POIs',
      type: 'circle', // Change the type to 'circle' for a point layer
      source: 'POIs',
      paint: {
        'circle-color': 'black', // Set the point color
        'circle-radius': 2, // Set the point radius
        'circle-stroke-width': 1, // Set the stroke width
        'circle-stroke-color': '#ffffff' // Set the stroke color
      }
    });
  })
  .catch(error => {
    console.error('Error fetching POIs data:', error);
  });

  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/yellowstone_roads.geojson')
  .then(response => response.json())
  .then(data => {
    Roads = data; // Store the fetched trails data in the variable

    // Check if the 'trails' source already exists in the map
    if (map.getSource('Roads')) {
      // If the source exists, remove it from the map
      map.removeSource('Roads');
    }

    // Add the 'trails' source to the map
    map.addSource('Roads', {
      type: 'geojson',
      data: Roads // Use the fetched trails data
    });

    // Check if the 'trails' layer already exists in the map
    if (map.getLayer('Roads')) {
      // If the layer exists, remove it from the map
      map.removeLayer('Roads');
    }

    map.addLayer({
      id: 'Roads',
      type: 'line', // Change the type to 'circle' for a point layer
      source: 'Roads',
      paint: {
        'line-color': 'black',
        'line-width': 1,
      }
    });
  })
  .catch(error => {
    console.error('Error fetching Roads data:', error);
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

// Layer source for highlighted features
const highlightedSource = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
};

// Layer for highlighted features
const highlightedLayer = {
  id: 'highlighted',
  source: 'highlightedSource',
  type: 'line',
  paint: {
    'line-color': 'red',
    'line-width': 3
  }
};

function toggleFilter() {
  var filter = document.getElementById('toggleFilter');
  if (filter.style.display === 'none') {
    filter.style.display = 'block';
  } else {
    filter.style.display = 'none';
  }
}

function updateCenterCoordinates(selectedOption) {
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
    // Update the map center with the new coordinates
    map.setCenter([centerLongitude, centerLatitude]);

}

// Add event listener to the apply filter button
document.getElementById("applyFilterButton").addEventListener("click", applyFilter);
document.getElementById("clearFilterButton").addEventListener("click", clearFilter);
const poiFilterButtons = document.querySelectorAll('.poi-filter-button');
poiFilterButtons.forEach((button) => {
  button.addEventListener('click', togglePOIFilter);
});
// Define and assign a value to the predefinedGeoJSON variable
const predefinedGeoJSON = {
  type: 'FeatureCollection',
  features: [] // Add your predefined POI features here
};
// Define and assign a value to the predefinedGeoJSON variable
const filteredPointGeoJSON = {
  type: 'FeatureCollection',
  features: [] // Add your predefined POI features here
};
// Variable to store the bounding box coordinates
let boundingBox = null;

function applyFilter() {
    // Get the value of the dropdown menu
    const dropdownValue = document.getElementById("dropdown").value;

    const sliderValue2 = parseInt(document.getElementById('slider2').value, 10);
    console.log('Slider value:', sliderValue2);

  
    // Call the updateCenterCoordinates function with the dropdown value
    updateCenterCoordinates(dropdownValue);
  
    const sliderValue = document.getElementById("slider").value;
    //Specify the desired bounding box dimensions in kilometers
    const bboxWidth = 0.00055; // Width in kilometers
    const bboxHeight = 0.00055; // Height in kilometers
    
    // Calculate the scaled width and height based on the slider value
    const scaledWidth = bboxWidth * sliderValue;
    const scaledHeight = bboxHeight * sliderValue;

    // Convert the scaled bounding box dimensions to the desired unit of measurement
    const bboxWidthMeters = turf.distance([centerLongitude, centerLatitude], [centerLongitude + (scaledWidth / 111.32), centerLatitude], { units: 'kilometers' }) * 1000;
    const bboxHeightMeters = turf.distance([centerLongitude, centerLatitude], [centerLongitude, centerLatitude + (scaledHeight / 111.32)], { units: 'kilometers' }) * 1000;
    
    const bboxSize = bboxWidthMeters * bboxHeightMeters; // Size in meters

    const bboxCoordinates = [
        centerLongitude - (bboxWidthMeters / 2),
        centerLatitude - (bboxHeightMeters / 2),
        centerLongitude + (bboxWidthMeters / 2),
        centerLatitude + (bboxHeightMeters / 2)
      ];

      // Create a new bounding box polygon
const bboxPolygon = turf.bboxPolygon(bboxCoordinates);

//Comment out UNDERNEATH TO get rid of BBOX DISPLAY
// Clear the 'filtered' layer if it exists
//if (map.getLayer('bbox')) {
   // map.removeLayer('bbox');
  //}
  //if (map.getSource('bbox')) {
  //  map.removeSource('bbox');
 // }
// Add the 'bbox' source to the map
//map.addSource('bbox', {
//  type: 'geojson',
//  data: bboxPolygon
//});

// Add the 'bbox' layer to the map
//map.addLayer({
 // id: 'bbox',
 // type: 'fill',
 // source: 'bbox',
 // paint: {
 //   'fill-color': 'rgba(0, 0, 255, 0.1)',
 //   'fill-outline-color': 'blue'
 // }
//});

  // Filter the trails by all the filtering functions
  filterTrailsByBoundingBox(bboxCoordinates);
  console.log('Filtered Features:', filteredFeatures); // Add this line
  desiredActivity(sliderValue2, filteredFeatures);
  const poiFilterButtons = document.querySelectorAll('.poi-filter-button.selected');

  // Create an array to store the selected POI types
  const selectedPOITypes = [];

  // Loop through the selected buttons and extract the POI types
  poiFilterButtons.forEach((button) => {
    const poiType = button.dataset.poiType;
    selectedPOITypes.push(poiType);
  });

  // Call the filterPOIs function with the selected POI types
  filterPOIs(selectedPOITypes);
// Call the filterPOIsByBoundingBox function to filter the layers by bbox
filterPOIsByBoundingBox(bboxCoordinates, predefinedGeoJSON, filteredPointGeoJSON);
 // leavearea(dropdownValue2);

 

}
  
  
//IT FUCKING WORKS - BBOX FILTERING
const turf = window.turf;
let filteredFeatures; 
function filterTrailsByBoundingBox(bbox) {
    // Convert the bounding box to a Polygon feature
    const bboxPolygon = turf.bboxPolygon(bbox);
  
    // Filter the trails based on the bounding box
    filteredFeatures = trails.features.flatMap(function (feature) { // Remove 'let' here
      // Check if the feature has a valid geometry
      if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
        console.log('Invalid feature:', feature);
        return []; // Skip features without valid geometry
      }
  
      // Convert MultiLineString to LineString if necessary
      if (feature.geometry.type === 'MultiLineString') {
        const lineStrings = feature.geometry.coordinates.flatMap(function (coordinates) {
          // Create new LineString feature with original properties
          const lineString = turf.lineString(coordinates, feature.properties);
  
          // Check if any point of the lineString intersects the bounding box polygon
          const intersects = lineString.geometry.coordinates.some(function (coordinate) {
            const point = turf.point(coordinate);
            return turf.booleanPointInPolygon(point, bboxPolygon);
          });
  
          // Return the LineString feature if it intersects the bounding box
          return intersects ? [lineString] : [];
        });
  
        // Return the new LineString features
        return lineStrings;
      }
  
      // Check if any point of the trail intersects the bounding box polygon
      const intersects = feature.geometry.coordinates.some(function (coordinate) {
        const point = turf.point(coordinate);
        return turf.booleanPointInPolygon(point, bboxPolygon);
      });
  
      // Return the original feature if it intersects the bounding box
      return intersects ? [feature] : [];
    });
  
    // Clear the 'filtered' layer if it exists
    if (map.getLayer('filtered-lines')){
      map.removeLayer('filtered-lines')
    }
    if (map.getSource('filtered-lines')) {
      map.removeSource('filtered-lines');
    }
    if (map.getLayer('filtered-labels')){
      map.removeLayer('filtered-labels')
    }
    if (map.getSource('filtered-labels')) {
      map.removeSource('filtered-labels');
    }
    if (map.getLayer('filtered')) {
      map.removeLayer('filtered');
    }
    if (map.getSource('filtered')) {
      map.removeSource('filtered');
    }
  
    // Add the filtered features as a new source and layer
    map.addSource('filtered', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: filteredFeatures
      }
    });
  
    map.addLayer({
      id: 'filtered-lines',
      type: 'line',
      source: 'filtered',
      paint: {
        'line-color': 'red',
        'line-width': 4
      }
    });
    
    // Add labels to the 'predefined-poi' layer with a halo effect
    map.addLayer({
      id: 'filtered-labels',
      type: 'symbol',
      source: 'filtered',
      layout: {
      'symbol-placement': 'line',
      'text-field': ['get', 'MAPLABEL'],
      'text-font': ['Open Sans Regular'],
      'text-size': 12,
      'text-offset': [0, 1], // Adjust the vertical offset as needed
      'text-anchor': 'center'
        },
      paint: {
        'text-color': 'black',
        'text-halo-color': 'white', // Set the halo color to white
        'text-halo-width': 2, // Adjust the halo width as desired
      },
    });
  }

 
  
  //Filter for Slider Nr. 2 - taking into account the amount of desired activity of the user
  function desiredActivity(sliderValue2, filteredFeatures) {
    let maxValue;
    let maxValueElev;
    let maxCategory;
    let maxEstimated;
  
    // Set the max value based on the slider value
    if (sliderValue2 === 1) {
      maxValue = 4;
      maxValueElev = 50;
      maxCategory = 1;
      maxEstimated = 2;
      console.log(maxValueElev);
      console.log(maxValue);
    } else if (sliderValue2 === 2) {
      maxValue = 8;
      maxValueElev = 75;
      maxCategory = 2;
      maxEstimated = 3;
    } else if (sliderValue2 === 3) {
      maxValue = 12;
      maxValueElev = 100;
      maxCategory = 3;
      maxEstimated = 4;
    } else if (sliderValue2 === 4) {
      maxValue = 16;
      maxValueElev = 150;
      maxCategory = 4;
      maxEstimated = 4.5;
    } else if (sliderValue2 === 5) {
      maxValue = 35;
      maxValueElev = 1000;
      maxCategory =  5;
      maxEstimated = 1000;
    } else {
      return; // Invalid slider value
    }

   // Filter trails by attribute values (Miles and Elev_gain)
const filteredFeaturesUpdated = filteredFeatures.filter(function (feature) {
    console.log('Feature', feature);
    // Check if the feature has the 'Miles' property
    if (
      feature.properties &&
      feature.properties.Miles !== null &&
      feature.properties.Miles !== undefined
    ) {
      const attributeMiles = parseFloat(feature.properties.Miles.replace(',', '.'));
      // Check if the feature has the 'Elev_gain' property
      if (
        feature.properties.Elev_Gain !== null &&
        feature.properties.Elev_Gain !== undefined
      ) {
        const attributeElevGain = parseFloat(feature.properties.Elev_Gain.replace(',', '.'));
        console.log('Attribute Elev_gain:', attributeElevGain);
        if (
            feature.properties.Category !== null &&
            feature.properties.Category !== undefined
        ) {
            const attributeCategory = parseFloat(feature.properties.Category.replace(',','.'));
            console.log("Attribute Category:", attributeCategory);
            if (
                feature.properties.Estimated !== null&&
                feature.properties.Estimated !== undefined
            ) {
                const attributeEstimated = parseFloat(feature.properties.Estimated);
                console.log("Attribute Estimated:", attributeEstimated);
                return attributeMiles < maxValue && attributeElevGain < maxValueElev && attributeCategory < maxCategory && attributeEstimated < maxEstimated;
            } else {
                console.log("Missing Estimated Value");
                return attributeMiles < maxValue && attributeElevGain < maxValueElev && attributeCategory < maxCategory;
            }
        } else {
            console.log("Missing Category Value");
            return attributeMiles < maxValue && attributeElevGain < maxValueElev;
        }
        
      } else {
        console.log('Missing Elev_gain value');
        return attributeMiles < maxValue;
      }
    } else {
      console.log('Missing Miles value');
      return true;
    }
  });
  
  // Create a GeoJSON object with the updated filtered features
  const filteredGeoJSON = turf.featureCollection(filteredFeaturesUpdated);
  
  // Clear the 'filtered' layer if it exists
  if (map.getLayer('filtered-lines')){
    map.removeLayer('filtered-lines')
  }
  if (map.getSource('filtered-lines')) {
    map.removeSource('filtered-lines');
  }
  if (map.getLayer('filtered-labels')){
    map.removeLayer('filtered-labels')
  }
  if (map.getSource('filtered-labels')) {
    map.removeSource('filtered-labels');
  }
  if (map.getLayer('filtered')) {
    map.removeLayer('filtered');
  }
  if (map.getSource('filtered')) {
    map.removeSource('filtered');
  }

  // Add the updated filtered features as a new source and layer
  map.addSource('filtered', {
    type: 'geojson',
    data: filteredGeoJSON
  });
  map.addLayer({
    id: 'filtered-lines',
    type: 'line',
    source: 'filtered',
    paint: {
      'line-color': 'red',
      'line-width': 4
    }
  });
  
  // Add labels to the 'predefined-poi' layer with a halo effect
  map.addLayer({
    id: 'filtered-labels',
    type: 'symbol',
    source: 'filtered',
    layout: {
    'symbol-placement': 'line',
    'text-field': ['get', 'MAPLABEL'],
    'text-font': ['Open Sans Regular'],
    'text-size': 12,
    'text-offset': [0, 1], // Adjust the vertical offset as needed
    'text-anchor': 'center'
      },
    paint: {
      'text-color': 'black',
      'text-halo-color': 'white', // Set the halo color to white
      'text-halo-width': 2, // Adjust the halo width as desired
    },
  });
 
}
let poiTypesArray = [];

function filterPOIs(selectedPOITypes) {
  if (map.getLayer('poi-features')) {
    map.removeLayer('poi-features');
  }
  if (map.getSource('poi-features')) {
    map.removeSource('poi-features');
  }
  if (map.getLayer('predefined-poi-features')) {
    map.removeLayer('predefined-poi-features');
  }
  if (map.getSource('predefined-poi-features')) {
    map.removeSource('predefined-poi-features');
  }
  // Define the specific POI types for the predefined POIs
  const predefinedPOITypes = ['Parking Lot', 'Entrance Station', 'Post Office', 'Ranger Station', 'Restroom', 'Trailhead'];

  map.setLayoutProperty('POIs', 'visibility', 'none');

  // Flatten the selected POI types array
  const selectedTypes = selectedPOITypes.flatMap((types) =>
    types.split(',').map((type) => type.trim())
  );

  // Filter the POIs based on selected POI types
  const filteredFeatures = POIs.features.filter((feature) => {
    const poiType = feature.properties.POITYPE;

    // Check if the POI type is in the selected types array
    return selectedTypes.includes(poiType);
  });
  filteredPointGeoJSON.features = filteredFeatures;

  // Create a GeoJSON object with the filtered features
  const filteredGeoJSON = {
    type: 'FeatureCollection',
    features: filteredFeatures,
  };

  // Add the filtered POIs as a new source and layer on the map
  map.addSource('poi-features', {
    type: 'geojson',
    data: filteredGeoJSON,
  });


  console.log('Number of Features Filtered (poi layer):', filteredFeatures.length);

  // Filter the predefined POI types from the entire dataset
  const predefinedFeatures = POIs.features.filter((feature) => {
    const poiType = feature.properties.POITYPE;

    // Check if the POI type is in the predefined types array
    return predefinedPOITypes.includes(poiType);
  });
  predefinedGeoJSON.features = predefinedFeatures;

  // Add the predefined POIs as a new source and layer on the map
  map.addSource('predefined-poi-features', {
    type: 'geojson',
    data: predefinedGeoJSON,
  });

  

  console.log('Number of Features Filtered (predefined-poi layer):', predefinedFeatures.length);
}






function filterPOIsByBoundingBox(bbox, predefinedGeoJSON, filteredPointGeoJSON) {
  if (map.getLayer('individual-markers')){
    map.removeLayer('individual-markers')
  }
  if (map.getSource('individual-markers')) {
    map.removeSource('individual-markers');
  }
  if (map.getLayer('cluster-marker')) {
    map.removeLayer('cluster-marker');
  }
  if (map.getSource('cluster-marker')) {
    map.removeSource('cluster-marker');
  }
  if (map.getLayer('predefined-poi-markers')){
    map.removeLayer('predefined-poi-markers')
  }
  if (map.getSource('predefined-poi-markers')) {
    map.removeSource('predefined-poi-markers');
  }
  if (map.getLayer('individual-markers-filtered')) {
    map.removeLayer('individual-markers-filtered');
  }
  if (map.getSource('individual-markers-filtered')) {
    map.removeSource('individual-markers-filtered');
  }
  // Clear the 'poi' layer if it exists
  if (map.getLayer('cluster-markers-filtered')) {
    map.removeLayer('cluster-markers-filtered');
  }
  if (map.getSource('cluster-markers-filtered')) {
    map.removeSource('cluster-markers-filtered');
  }
  if (map.getLayer('poi-markers')) {
    map.removeLayer('poi-markers');
  }
  if (map.getSource('poi-markers')) {
    map.removeSource('poi-markers');
  }
  console.log('Bounding Box:', bbox);

  // Convert the bounding box to a Polygon feature
  const bboxPolygon = turf.bboxPolygon(bbox);

  // Filter the point features based on the bounding box
  const filteredPointFeatures = filteredPointGeoJSON.features.filter(function (feature) {
    // Check if the feature has a valid geometry
    if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
      console.log('Invalid feature:', feature);
      return false; // Skip features without valid geometry
    }

    // Convert the point to a Turf.js point feature
    const point = turf.point(feature.geometry.coordinates, feature.properties);

    // Check if the point is within the bounding box polygon
    return turf.booleanPointInPolygon(point, bboxPolygon);
  });

  console.log('Filtered Point Features:', filteredPointFeatures);


  // Filter the predefined POI features based on the bounding box
  const filteredPredefinedFeatures = predefinedGeoJSON.features.filter(function (feature) {
    // Check if the feature has a valid geometry
    if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
      console.log('Invalid feature:', feature);
      return false; // Skip features without valid geometry
    }

    // Convert the point to a Turf.js point feature
    const point = turf.point(feature.geometry.coordinates, feature.properties);

    // Check if the point is within the bounding box polygon
    return turf.booleanPointInPolygon(point, bboxPolygon);
  });

  console.log('Filtered Predefined Features:', filteredPredefinedFeatures);

  // Create a GeoJSON object with the filtered point features
  const newFilteredPointGeoJSON = {
    type: 'FeatureCollection',
    features: filteredPointFeatures,
  };
// Update the filteredGeoJSON features with the appropriate icon image names
newFilteredPointGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
});
  // Add the filtered point features as a new source and layer
  map.addSource('poi-markers', {
    type: 'geojson',
    data: newFilteredPointGeoJSON,
    cluster: true, 
    clusterRadius: 20
  });

map.on('load', function() {
  // Create a layer for the cluster markers
  map.addLayer({
    id: 'cluster-markers-filtered',
    type: 'symbol',
    source: 'poi-markers',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count}',
      'text-font': ['Arial Unicode MS Bold'],
      'text-size': 12
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 1
    }
  });
});
// Create a layer for the individual markers
map.addLayer({
  id: 'individual-markers-filtered',
  type: 'symbol',
  source: 'poi-markers',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', // Use the icon mapping for the marker icons
    'icon-size': 1 // Adjust the icon size as desired
  },
  paint: {}
});
// Define an empty array to store the filtered markers
var markersFiltered = [];

// Iterate through each filtered point
newFilteredPointGeoJSON.features.forEach(function (point, index) {
  var poiType = point.properties.POITYPE;

  // Check if the poi type has a corresponding icon URL
  if (iconMapping.hasOwnProperty(poiType)) {
    // Remove the existing image if it exists
    if (map.hasImage('marker-filtered-' + index)) {
      map.removeImage('marker-filtered-' + index);
    }

    // Create a marker object
    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-filtered-' + index // Use the index as the icon name
      }
    };

    // Add the marker to the valid markers array
    markersFiltered.push(marker);

    // Add the image as an icon to the map
    map.loadImage(iconMapping[poiType], function (error, image) {
      if (error) {
        console.error('Failed to load image:', error);
        console.log('Failed image URL:', iconMapping[poiType]);

        return;
      }
      map.addImage('marker-filtered-' + index, image);
      console.log('Marker loaded successfully for POI type:', poiType);

    });
  }
});
// Update the data of the cluster source for the filtered points
map.getSource('poi-markers').setData({
  type: 'FeatureCollection',
  features: markersFiltered
});


  console.log('Adding source: poi');


  // Create a GeoJSON object with the filtered predefined features
  const newFilteredPredefinedGeoJSON = {
    type: 'FeatureCollection',
    features: filteredPredefinedFeatures,
  };

  // Update the filteredGeoJSON features with the appropriate icon image names
newFilteredPredefinedGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
});

  // Add the filtered predefined features as a new source and layer
  map.addSource('predefined-poi-markers', {
    type: 'geojson',
    data: newFilteredPredefinedGeoJSON,
    cluster: true,
    clusterRadius: 20
  });

  map.on('load', function() {
    // Create a layer for the cluster markers
    map.addLayer({
      id: 'cluster-markers',
      type: 'symbol',
      source: 'predefined-poi-markers',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count}',
        'text-font': ['Arial Unicode MS Bold'],
        'text-size': 12
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    })});

    // Create a layer for the individual markers
map.addLayer({
  id: 'individual-markers',
  type: 'symbol',
  source: 'predefined-poi-markers',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', // Use the icon mapping for the marker icons
    'icon-size': 1 // Adjust the icon size as desired
  },
  paint: {}
});
// Define an empty array to store the filtered markers
var markers = [];
// Iterate through each predefined point
newFilteredPredefinedGeoJSON.features.forEach(function (point, index) {
  var poiType = point.properties.POITYPE;

  // Check if the poi type has a corresponding icon URL
  if (iconMapping.hasOwnProperty(poiType)) {
    // Remove the existing image if it exists
    if (map.hasImage('marker-' + index)) {
      map.removeImage('marker-' + index);
    }

    // Create a marker object
    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-' + index // Use the index as the icon name
      }
    };

    // Add the marker to the valid markers array
    markers.push(marker);

    // Add the image as an icon to the map
    map.loadImage(iconMapping[poiType], function (error, image) {
      if (error) {
        console.error('Failed to load image:', error); 
        console.log('Icon URL:', iconMapping[poiType]);
        console.log('Marker index:', index);
        console.log('Marker properties:', feature.properties);

        return;
      }
      map.addImage('marker-' + index, image);
      console.log('Marker loaded successfully for POI type:', poiType);

    });
  }
});

// Update the data of the cluster source
map.getSource('predefined-poi-markers').setData({
  type: 'FeatureCollection',
  features: markers
});


  console.log('Adding source: predefined-poi-markers');

}






function togglePOIFilter() {
  //Toggle the 'selected' class of the clicked button
  this.classList.toggle('selected');
}

//function leavearea(selectedOption2){
 //   if (selectedOption2 === 'Yes') {
//
//    } else if (selectedOption2 === 'No') {
//}}

  
  

  
  //HIGHLIGHT INTERSECTING TRAILS
    // Calculate the trailGeometry based on the filtered features
   // const lineStrings = filteredFeatures.map(function (feature) {
     // return turf.lineString(feature.geometry.coordinates);
    //});
  
    //const mergedLineString = lineStrings.reduce(function (mergedCoordinates, lineString) {
      //return mergedCoordinates.concat(lineString.geometry.coordinates);
   // }, []);
  
    //const trailGeometry = turf.lineString(mergedLineString);
  
    // Update the 'highlighted' layer with the filtered features
    //highlightedSource.data.features = filteredFeatures;
    //if (map.getLayer('highlighted')) {
    //  map.getSource('highlightedSource').setData(highlightedSource.data);
    //} else {
      //map.addSource('highlightedSource', highlightedSource);
      //map.addLayer(highlightedLayer);
    //}


//Clears all active filters on the map and re-zooms to the center of the park
  function clearFilter() {
    var select = document.getElementById("dropdown");
    select.selectedIndex = 0;
    var filter = ["all"];
    map.setFilter("trails", filter);
    map.setLayoutProperty("trails", "visibility", "visible");
    map.setFilter("boundary", filter);
    map.setLayoutProperty("boundary", "visibility", "visible");
    map.setCenter([-110.629578, 44.480121]);
    map.setZoom(7); // Set the zoom level to 10
    // Clear the 'filtered' layer if it exists
    if (map.getLayer('filtered-lines')){
      map.removeLayer('filtered-lines')
    }
    if (map.getSource('filtered-lines')) {
      map.removeSource('filtered-lines');
    }
    if (map.getLayer('filtered-labels')){
      map.removeLayer('filtered-labels')
    }
    if (map.getSource('filtered-labels')) {
      map.removeSource('filtered-labels');
    }
    if (map.getLayer('filtered')) {
      map.removeLayer('filtered');
    }
    if (map.getSource('filtered')) {
      map.removeSource('filtered');
    }
  // Clear the 'poi' layer if it exists and toggle off the 'selected' class for the buttons
  if (map.getLayer('individual-markers')){
    map.removeLayer('individual-markers')
  }
  if (map.getSource('individual-markers')) {
    map.removeSource('individual-markers');
  }
  if (map.getLayer('cluster-marker')) {
    map.removeLayer('cluster-marker');
  }
  if (map.getSource('cluster-marker')) {
    map.removeSource('cluster-marker');
  }
  if (map.getLayer('predefined-poi-markers')){
    map.removeLayer('predefined-poi-markers')
  }
  if (map.getSource('predefined-poi-markers')) {
    map.removeSource('predefined-poi-markers');
  }
  if (map.getLayer('individual-markers-filtered')) {
    map.removeLayer('individual-markers-filtered');
  }
  if (map.getSource('individual-markers-filtered')) {
    map.removeSource('individual-markers-filtered');
  }
  // Clear the 'poi' layer if it exists
  if (map.getLayer('cluster-markers-filtered')) {
    map.removeLayer('cluster-markers-filtered');
  }
  if (map.getSource('cluster-markers-filtered')) {
    map.removeSource('cluster-markers-filtered');
  }
  if (map.getLayer('poi-markers')) {
    map.removeLayer('poi-markers');
  }
  if (map.getSource('poi-markers')) {
    map.removeSource('poi-markers');

  if (map.getLayer('predefined-poi-points')){
    map.removeLayer('predefined-poi-points')
  }
  if (map.getSource('predefined-poi-points')) {
    map.removeSource('predefined-poi-points');
  }
  if (map.getLayer('predefined-poi-labels')){
    map.removeLayer('predefined-poi-labels')
  }
  if (map.getSource('predefined-poi-labels')) {
    map.removeSource('predefined-poi-labels');
  }
  if (map.getLayer('poi-points')){
    map.removeLayer('poi-points')
  }
  if (map.getSource('poi-points')) {
    map.removeSource('poi-points');
  }
  if (map.getLayer('poi-labels')) {
    map.removeLayer('poi-labels');
  }
  if (map.getSource('poi-labels')) {
    map.removeSource('poi-labels');
  }
  if (map.getLayer('poi')) {
    map.removeLayer('poi');
    var poiButtons = document.getElementsByClassName('poi-filter-button');
    for (var i = 0; i < poiButtons.length; i++) {
      poiButtons[i].classList.remove('selected');
    }
  }
  if (map.getSource('poi')) {
    map.removeSource('poi');
  }//clear the 'filtered' layer if it exists
     if (map.getLayer('predefined-poi')) {
      map.removeLayer('predefined-poi');
    }
    if (map.getSource('predefined-poi')) {
      map.removeSource('predefined-poi');
    }
      // Clear the filteredPointFeatures array
  filteredPointFeatures = [];
  }

///START NEW JS FILE HERE
function toggleFilter2() {
  var filter = document.getElementById('toggleFilter2');
  if (filter.style.display === 'none') {
    filter.style.display = 'block';
  } else {
    filter.style.display = 'none';
  }
}

var dropdown5 = document.getElementById('dropdown5');

// Add event listener for the 'change' event
dropdown5.addEventListener('change', function() {
  // Get the selected value
  var dropdown51 = dropdown5.value;

  // Call your function with the selected value
  Predefined_Maps(dropdown51);
});}

