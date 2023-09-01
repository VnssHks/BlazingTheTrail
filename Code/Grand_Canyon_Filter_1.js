function updateCenterCoordinatescanyon(selectedOption) {
    // Update center latitude and longitude based on the selected option
    if (selectedOption === 'North Rim Entrance') {
      centerLatitudeCanyon = 36.210327;
      centerLongitudeCanyon = -112.056510;
    } else if (selectedOption === 'South Entrance') {
      centerLatitudeCanyon = 36.000381;
      centerLongitudeCanyon = -112.121084;
    } else if (selectedOption === 'East Entrance') {
      centerLatitudeCanyon = 36.036114;
      centerLongitudeCanyon = -111.830217;
    }
    console.log('Center Coordinates Canyon:', centerLatitudeCanyon, centerLongitudeCanyon);
      // Update the map center with the new coordinates
      map.setCenter([centerLongitudeCanyon, centerLatitudeCanyon]);
  
  }
  let trailsGC; // Variable to store the fetched trails GeoJSON data
  let filteredFeaturesCanyon; 
// Define and assign a value to the predefinedGeoJSON variable
const filteredPointGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: [] // Add your predefined POI features here
  };

  // Define and assign a value to the predefinedGeoJSON variable
const predefinedGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: [] // Add your predefined POI features here
  };

  
document.getElementById("applyFilterButtonCanyon").addEventListener("click", applyFilterCanyon);
document.getElementById("clearFilterButtonCanyon").addEventListener("click", clearFilterCanyon);
// For the second group of buttons
const poiFilterButtonsCanyon = document.querySelectorAll('.poi-filter-button-canyon');
poiFilterButtonsCanyon.forEach((button) => {
  button.addEventListener('click', togglePOIFilterCanyon);
});
function togglePOIFilterCanyon() {
    //Toggle the 'selected' class of the clicked button
    this.classList.toggle('selected');
  }
function applyFilterCanyon() {
    // Get the value of the dropdown menu
    const dropdownValueCanyon = document.getElementById("dropdownpark2").value;

    const sliderValue2canyon = parseInt(document.getElementById('slider2canyon').value, 10);
    console.log('Slider value:', sliderValue2canyon);


  
    // Call the updateCenterCoordinates function with the dropdown value
    updateCenterCoordinatescanyon(dropdownValueCanyon);
    
  
    const sliderValuecanyon = document.getElementById("slidercanyon").value;
    //Specify the desired bounding box dimensions in kilometers
    const bboxWidth = 0.00025; // Width in kilometers
    const bboxHeight = 0.00025; // Height in kilometers
    
    // Calculate the scaled width and height based on the slider value
    const scaledWidth = bboxWidth * sliderValuecanyon;
    const scaledHeight = bboxHeight * sliderValuecanyon;

    // Convert the scaled bounding box dimensions to the desired unit of measurement
    const bboxWidthMeters = turf.distance([centerLongitudeCanyon, centerLatitudeCanyon], [centerLongitudeCanyon + (scaledWidth / 111.32), centerLatitudeCanyon], { units: 'kilometers' }) * 1000;
    const bboxHeightMeters = turf.distance([centerLongitudeCanyon, centerLatitudeCanyon], [centerLongitudeCanyon, centerLatitudeCanyon + (scaledHeight / 111.32)], { units: 'kilometers' }) * 1000;
    
    const bboxSize = bboxWidthMeters * bboxHeightMeters; // Size in meters

    const bboxCoordinatesCanyon = [
        centerLongitudeCanyon - (bboxWidthMeters / 2),
        centerLatitudeCanyon - (bboxHeightMeters / 2),
        centerLongitudeCanyon + (bboxWidthMeters / 2),
        centerLatitudeCanyon + (bboxHeightMeters / 2)
      ];

      // Create a new bounding box polygon
const bboxPolygon = turf.bboxPolygon(bboxCoordinatesCanyon);
map.setCenter([centerLongitudeCanyon, centerLatitudeCanyon]);

//Comment out UNDERNEATH TO get rid of BBOX DISPLAY
// Clear the 'filtered' layer if it exists
//if (map.getLayer('bbox')) {
  //  map.removeLayer('bbox');
  //}
  //if (map.getSource('bbox')) {
    //map.removeSource('bbox');
 // }
// Add the 'bbox' source to the map
//map.addSource('bbox', {
  //type: 'geojson',
 // data: bboxPolygon
//});

// Add the 'bbox' layer to the mapm
//map.addLayer({
 // id: 'bbox',
  //type: 'fill',
// source: 'bbox',
  //paint: {
    //'fill-color': 'rgba(0, 0, 255, 0.1)',
   // 'fill-outline-color': 'blue'
 // }
//});

  // Filter the trails by all the filtering functions
  filterTrailsByBoundingBoxCanyon(bboxCoordinatesCanyon);
  console.log('Filtered Features:', filteredFeaturesCanyon); // Add this line
  desiredActivityCanyon(sliderValue2canyon, filteredFeaturesCanyon);
  const poiFilterButtonsCanyon = document.querySelectorAll('.poi-filter-button-canyon.selected');

  // Create an array to store the selected POI types
  const selectedPOITypesCanyon = [];

  // Loop through the selected buttons and extract the POI types
  poiFilterButtonsCanyon.forEach((button) => {
    const poiTypeCanyon = button.dataset.poiType;
    selectedPOITypesCanyon.push(poiTypeCanyon);
  });

  // Call the filterPOIs function with the selected POI types
  filterPOIsCanyon(selectedPOITypesCanyon);
// Call the filterPOIsByBoundingBox function to filter the layers by bbox
filterPOIsByBoundingBoxCanyon(bboxCoordinatesCanyon, predefinedGeoJSONCanyon, filteredPointGeoJSONCanyon);
 // leavearea(dropdownValue2);
  // Re-add the 'entrance' source and layers
  if (!map.getSource('entranceGC')) {
    map.addSource('entranceGC', {
      type: 'geojson',
      data: entranceStationsGC // Use the fetched entrance station data
    });

    // Add the 'cluster-markers' layer for entrance stations
    map.addLayer({
      id: 'cluster-markers-canyon',
      type: 'symbol',
      source: 'clustered-entrance-canyon',
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

    // Add the 'individual-markers' layer for entrance stations
    map.addLayer({
      id: 'individual-markers-canyon',
      type: 'symbol',
      source: 'clustered-entrance-canyon',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{icon}', // Use the icon mapping for the marker icons
        'icon-size': 1 // Adjust the icon size as desired
      },
      paint: {}
    });
  }


}
  
//IT FUCKING WORKS - BBOX FILTERING
function filterTrailsByBoundingBoxCanyon(bbox) {
    // Convert the bounding box to a Polygon feature
    const bboxPolygon = turf.bboxPolygon(bbox);
  
    // Filter the trails based on the bounding box
    filteredFeaturesCanyon = trailsGC.features.flatMap(function (feature) { // Remove 'let' here
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
    if (map.getLayer('filtered-lines-canyon')){
      map.removeLayer('filtered-lines-canyon')
    }
    if (map.getSource('filtered-lines-canyon')) {
      map.removeSource('filtered-lines-canyon');
    }
    if (map.getLayer('filtered-labels-canyon')){
      map.removeLayer('filtered-labels-canyon')
    }
    if (map.getSource('filtered-labels-canyon')) {
      map.removeSource('filtered-labels-canyon');
    }
    if (map.getLayer('filtered-canyon')) {
      map.removeLayer('filtered-canyon');
    }
    if (map.getSource('filtered-canyon')) {
      map.removeSource('filtered-canyon');
    }
  
    // Add the filtered features as a new source and layer
    map.addSource('filtered-canyon', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: filteredFeaturesCanyon
      }
    });
  
    map.addLayer({
      id: 'filtered-lines-canyon',
      type: 'line',
      source: 'filtered',
      paint: {
        'line-color': '#F7B32B',
        'line-width': 4
      }
    });
    
    // Add labels to the 'predefined-poi' layer with a halo effect
    map.addLayer({
      id: 'filtered-labels-canyon',
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
   function desiredActivityCanyon(sliderValue2canyon, filteredFeaturesCanyon) {
    let maxValue;
    let maxValueElev;
    let maxCategory;
    let maxEstimated;
  
    // Set the max value based on the slider value
    if (sliderValue2canyon === 1) {
      maxValue = 4;
      maxValueElev = 50;
      maxCategory = 1;
      maxEstimated = 2;
      console.log(maxValueElev);
      console.log(maxValue);
    } else if (sliderValue2canyon === 2) {
      maxValue = 8;
      maxValueElev = 75;
      maxCategory = 2;
      maxEstimated = 3;
    } else if (sliderValue2canyon === 3) {
      maxValue = 12;
      maxValueElev = 100;
      maxCategory = 3;
      maxEstimated = 4;
    } else if (sliderValue2canyon === 4) {
      maxValue = 16;
      maxValueElev = 150;
      maxCategory = 4;
      maxEstimated = 4.5;
    } else if (sliderValue2canyon === 5) {
      maxValue = 1000;
      maxValueElev = 1000;
      maxCategory =  5;
      maxEstimated = 1000;
    } else {
      return; // Invalid slider value
    }

   // Filter trails by attribute values (Miles and Elev_gain)
const filteredFeaturesUpdatedCanyon = filteredFeaturesCanyon.filter(function (feature) {
    console.log('Feature', feature);
  if (
    feature.properties &&
    feature.properties.Miles !== null &&
    feature.properties.Miles !== undefined
  ) {
  const attributeMiles = parseFloat(feature.properties.Miles);
    console.log('Attribute Miles:', attributeMiles);

    // Check if the feature has the 'Elev_gain' property
    if (
      feature.properties.z_range !== null &&
      feature.properties.z_range !== undefined
    ) {
      const attributez_range = parseFloat(feature.properties.z_range);
      console.log('Attribute z-range:', attributez_range);

      if (
        feature.properties.Shendoah_Category !== null &&
        feature.properties.Shendoah_Category !== undefined
      ) {
        const attributeCategory = parseFloat(feature.properties.Shendoah_Category);
        console.log('Attribute Category:', attributeCategory);

        if (
          feature.properties.Naismith_Hours !== null &&
          feature.properties.Naismith_Hours !== undefined
        ) {
          const attributeEstimated = parseFloat(feature.properties.Naismith_Hours);
          console.log('Attribute Estimated:', attributeEstimated);

          return attributeMiles < maxValue && (attributez_range < maxValueElev || attributez_range === 0 || isNaN(attributez_range)) && attributeCategory < maxCategory && attributeEstimated < maxEstimated;
        } else {
          console.log('Missing Estimated Value');
          return attributeMiles < maxValue && (attributez_range < maxValueElev || attributez_range === 0 || isNaN(attributez_range)) && attributeCategory < maxCategory;
        }
      } else {
        console.log('Missing Category Value');
        return attributeMiles < maxValue && (attributez_range < maxValueElev || attributez_range === 0 || isNaN(attributez_range));
      }
    } else {
      console.log('Missing z-range value');
      return true; // Include trails with missing or null Elev_gain
    }
  } else {
    console.log('Missing Miles value');
    return true; // Include trails with missing or null Miles
  }
});
  // Create a GeoJSON object with the updated filtered features
  const filteredGeoJSONCanyon = turf.featureCollection(filteredFeaturesUpdatedCanyon);
  
  // Clear the 'filtered' layer if it exists
  if (map.getLayer('filtered-lines-canyon')){
    map.removeLayer('filtered-lines-canyon')
  }
  if (map.getSource('filtered-lines-canyon')) {
    map.removeSource('filtered-lines-canyon');
  }
  if (map.getLayer('filtered-labels-canyon')){
    map.removeLayer('filtered-labels-canyon')
  }
  if (map.getSource('filtered-labels-canyon')) {
    map.removeSource('filtered-labels-canyon');
  }
  if (map.getLayer('filtered-canyon')) {
    map.removeLayer('filtered-canyon');
  }
  if (map.getSource('filtered-canyon')) {
    map.removeSource('filtered-canyon');
  }

  // Add the updated filtered features as a new source and layer
  map.addSource('filtered-canyon', {
    type: 'geojson',
    data: filteredGeoJSONCanyon
  });
  map.addLayer({
    id: 'filtered-lines-canyon',
    type: 'line',
    source: 'filtered-canyon',
    paint: {
      'line-color': '#F7B32B',
      'line-width': 4
    }
  });
  
  // Add labels to the 'predefined-poi' layer with a halo effect
  map.addLayer({
    id: 'filtered-labels-canyon',
    type: 'symbol',
    source: 'filtered-canyon',
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

function filterPOIsCanyon(selectedPOITypesCanyon) {
  if (map.getLayer('poi-features-canyon')) {
    map.removeLayer('poi-features-canyon');
  }
  if (map.getSource('poi-features-canyon')) {
    map.removeSource('poi-features-canyon');
  }
  if (map.getLayer('predefined-poi-features-canyon')) {
    map.removeLayer('predefined-poi-features-canyon');
  }
  if (map.getSource('predefined-poi-features-canyon')) {
    map.removeSource('predefined-poi-features-canyon');
  }
  // Define the specific POI types for the predefined POIs
  const predefinedPOITypesCanyon = ['Parking Lot', 'Post Office', 'Ranger Station','Restroom', 'Trailhead', 'Entrance Station', 'Barn', 'Building', 'Cemetery', 'Chapel', 'Fire Station', 'First Aid Station', 'Gas Station', 'Headquarters', 'Lake', 'Potable Water', 'Shelter', 'Telephone', 'Tower'];

  map.setLayoutProperty('POIsGC', 'visibility', 'none');
  console.log('Selected POI Types:', selectedPOITypesCanyon);

  // Flatten the selected POI types array
  const selectedTypesCanyon = selectedPOITypesCanyon.flatMap((types) =>
    types.split(',').map((type) => type.trim())
  );
  console.log(selectedTypesCanyon); 

  // Filter the POIs based on selected POI types
  const filteredFeaturesCanyon = POIsGC.features.filter((feature) => {
    const poiTypeCanyon = feature.properties.POITYPE;

    // Check if the POI type is in the selected types array
    return selectedTypesCanyon.includes(poiTypeCanyon);
  });
  filteredPointGeoJSONCanyon.features = filteredFeaturesCanyon;

  // Create a GeoJSON object with the filtered features
  const filteredGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: filteredFeaturesCanyon,
  };

  // Add the filtered POIs as a new source and layer on the map
  map.addSource('poi-features-canyon', {
    type: 'geojson',
    data: filteredGeoJSONCanyon,
  });


  console.log('Number of Features Filtered (poi layer):', filteredFeaturesCanyon.length);

  // Filter the predefined POI types from the entire dataset
  const predefinedFeaturesCanyon = POIsGC.features.filter((feature) => {
    const poiTypeCanyon = feature.properties.POITYPE;

    // Check if the POI type is in the predefined types array
    return predefinedPOITypesCanyon.includes(poiTypeCanyon);
  });
  predefinedGeoJSONCanyon.features = predefinedFeaturesCanyon;

  // Add the predefined POIs as a new source and layer on the map
  map.addSource('predefined-poi-features-canyon', {
    type: 'geojson',
    data: predefinedGeoJSONCanyon,
  });

  

  console.log('Number of Features Filtered (predefined-poi layer):', predefinedFeaturesCanyon.length);
}






function filterPOIsByBoundingBoxCanyon(bbox, predefinedGeoJSONCanyon, filteredPointGeoJSONCanyon) {
  if (map.getLayer('individual-markers-canyon')){
    map.removeLayer('individual-markers-canyon')
  }
  if (map.getSource('individual-markers-canyon')) {
    map.removeSource('individual-markers-canyon');
  }
  if (map.getLayer('cluster-marker-canyon')) {
    map.removeLayer('cluster-marker-canyon');
  }
  if (map.getSource('cluster-marker-canyon')) {
    map.removeSource('cluster-marker-canyon');
  }
  if (map.getLayer('predefined-poi-markers-canyon')){
    map.removeLayer('predefined-poi-markers-canyon')
  }
  if (map.getSource('predefined-poi-markers-canyon')) {
    map.removeSource('predefined-poi-markers-canyon');
  }
  if (map.getLayer('individual-markers-filtered-canyon')) {
    map.removeLayer('individual-markers-filtered-canyon');
  }
  if (map.getSource('individual-markers-filtered-canyon')) {
    map.removeSource('individual-markers-filtered-canyon');
  }
  // Clear the 'poi' layer if it exists
  if (map.getLayer('cluster-markers-filtered-canyon')) {
    map.removeLayer('cluster-markers-filtered-canyon');
  }
  if (map.getSource('cluster-markers-filtered-canyon')) {
    map.removeSource('cluster-markers-filtered-canyon');
  }
  if (map.getLayer('poi-markers-canyon')) {
    map.removeLayer('poi-markers-canyon');
  }
  if (map.getSource('poi-markers-canyon')) {
    map.removeSource('poi-markers-canyon');
  }
  console.log('Bounding Box:', bbox);

  // Convert the bounding box to a Polygon feature
  const bboxPolygon = turf.bboxPolygon(bbox);

  // Filter the point features based on the bounding box
  const filteredPointFeaturesCanyon = filteredPointGeoJSONCanyon.features.filter(function (feature) {
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

  console.log('Filtered Point Features:', filteredPointFeaturesCanyon);


  // Filter the predefined POI features based on the bounding box
  const filteredPredefinedFeaturesCanyon = predefinedGeoJSONCanyon.features.filter(function (feature) {
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

  console.log('Filtered Predefined Features:', filteredPredefinedFeaturesCanyon);

  // Create a GeoJSON object with the filtered point features
  const newFilteredPointGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: filteredPointFeaturesCanyon,
  };
// Update the filteredGeoJSON features with the appropriate icon image names
newFilteredPointGeoJSONCanyon.features.forEach(function (feature) {
  const poiTypeCanyon = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiTypeCanyon];
});
  // Add the filtered point features as a new source and layer
  map.addSource('poi-markers-canyon', {
    type: 'geojson',
    data: newFilteredPointGeoJSONCanyon,
    cluster: true, 
    clusterRadius: 20
  });

map.on('load', function() {
  // Create a layer for the cluster markers
  map.addLayer({
    id: 'cluster-markers-filtered-canyon',
    type: 'symbol',
    source: 'poi-markers-canyon',
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
  id: 'individual-markers-filtered-canyon',
  type: 'symbol',
  source: 'poi-markers-canyon',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', // Use the icon mapping for the marker icons
    'icon-size': 1 // Adjust the icon size as desired
  },
  paint: {}
});
// Define an empty array to store the filtered markers
var markersFilteredCanyon = [];

// Iterate through each filtered point
newFilteredPointGeoJSONCanyon.features.forEach(function (point, index) {
  var poiTypeCanyon = point.properties.POITYPE;

  // Check if the poi type has a corresponding icon URL
  if (iconMapping.hasOwnProperty(poiTypeCanyon)) {
    // Remove the existing image if it exists
    if (map.hasImage('marker-filtered-canyon-' + index)) {
      map.removeImage('marker-filtered-canyon-' + index);
    }

    // Create a marker object
    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-filtered-canyon-' + index // Use the index as the icon name
      }
    };
    Object.assign(marker.properties, point.properties);

    // Add the marker to the valid markers array
    markersFilteredCanyon.push(marker);

    // Add the image as an icon to the map
    map.loadImage(iconMapping[poiTypeCanyon], function (error, image) {
      if (error) {
        console.error('Failed to load image:', error);
        console.log('Failed image URL:', iconMapping[poiTypeCanyon]);

        return;
      }
      map.addImage('marker-filtered-canyon-' + index, image);
      console.log('Marker loaded successfully for POI type:', poiTypeCanyon);

    });
  }
});
// Update the data of the cluster source for the filtered points
map.getSource('poi-markers-canyon').setData({
  type: 'FeatureCollection',
  features: markersFilteredCanyon
});


  console.log('Adding source: poi');


  // Create a GeoJSON object with the filtered predefined features
  const newFilteredPredefinedGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: filteredPredefinedFeaturesCanyon,
  };

  // Update the filteredGeoJSON features with the appropriate icon image names
newFilteredPredefinedGeoJSONCanyon.features.forEach(function (feature) {
  const poiTypeCanyon = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiTypeCanyon];
});

  // Add the filtered predefined features as a new source and layer
  map.addSource('predefined-poi-markers-canyon', {
    type: 'geojson',
    data: newFilteredPredefinedGeoJSONCanyon,
    cluster: true,
    clusterRadius: 20
  });

  map.on('load', function() {
    // Create a layer for the cluster markers
    map.addLayer({
      id: 'cluster-markers-canyon',
      type: 'symbol',
      source: 'predefined-poi-markers-canyon',
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
  id: 'individual-markers-canyon',
  type: 'symbol',
  source: 'predefined-poi-markers-canyon',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', // Use the icon mapping for the marker icons
    'icon-size': 1 // Adjust the icon size as desired
  },
  paint: {}
});
// Define an empty array to store the filtered markers
var markersCanyon = [];
// Iterate through each predefined point
newFilteredPredefinedGeoJSONCanyon.features.forEach(function (point, index) {
  var poiTypeCanyon = point.properties.POITYPE;

  // Check if the poi type has a corresponding icon URL
  if (iconMapping.hasOwnProperty(poiTypeCanyon)) {
    // Remove the existing image if it exists
    if (map.hasImage('marker-canyon-' + index)) {
      map.removeImage('marker-canyon-' + index);
    }

    // Create a marker object
    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-canyon-' + index // Use the index as the icon name
      }
    };
    Object.assign(marker.properties, point.properties);

    // Add the marker to the valid markers array
    markersCanyon.push(marker);

    // Add the image as an icon to the map
    map.loadImage(iconMapping[poiTypeCanyon], function (error, image) {
      if (error) {
        console.error('Failed to load image:', error); 
        console.log('Icon URL:', iconMapping[poiTypeCanyon]);
        console.log('Marker index:', index);
        console.log('Marker properties:', feature.properties);

        return;
      }
      map.addImage('marker-canyon-' + index, image);
      console.log('Marker loaded successfully for POI type:', poiTypeCanyon);

    });
  }
});

// Update the data of the cluster source
map.getSource('predefined-poi-markers-canyon').setData({
  type: 'FeatureCollection',
  features: markersCanyon
});


  console.log('Adding source: predefined-poi-markers-canyon');

}






function togglePOIFilterCanyon() {
    console.log('Button clicked');

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
  function clearFilterCanyon() {
    var select = document.getElementById("dropdownpark2");
    select.selectedIndex = 0;
    var filter = ["all"];
    map.setFilter("trailsGC", filter);
    map.setLayoutProperty("trailsGC", "visibility", "visible");
    map.setFilter("boundaryGC", filter);
    map.setLayoutProperty("boundaryGC", "visibility", "visible");
    map.setCenter([-112.039940,36.090173]);
    map.setZoom(8); 
    // Clear the 'filtered' layer if it exists
    if (map.getLayer('filtered-lines-canyon')){
      map.removeLayer('filtered-lines-canyon')
    }
    if (map.getSource('filtered-lines-canyon')) {
      map.removeSource('filtered-lines-canyon');
    }
    if (map.getLayer('filtered-labels-canyon')){
      map.removeLayer('filtered-labels-canyon')
    }
    if (map.getSource('filtered-labels-canyon')) {
      map.removeSource('filtered-labels-canyon');
    }
    if (map.getLayer('filtered-canyon')) {
      map.removeLayer('filtered-canyon');
    }
    if (map.getSource('filtered-canyon')) {
      map.removeSource('filtered-canyon');
    }
  // Clear the 'poi' layer if it exists and toggle off the 'selected' class for the buttons
  if (map.getLayer('individual-markers-canyon')){
    map.removeLayer('individual-markers-canyon')
  }
  if (map.getSource('individual-markers-canyon')) {
    map.removeSource('individual-markers-canyon');
  }
  if (map.getLayer('cluster-marker-canyon')) {
    map.removeLayer('cluster-marker-canyon');
  }
  if (map.getSource('cluster-marker-canyon')) {
    map.removeSource('cluster-marker-canyon');
  }
  if (map.getLayer('predefined-poi-markers-canyon')){
    map.removeLayer('predefined-poi-markers-canyon')
  }
  if (map.getSource('predefined-poi-markers-canyon')) {
    map.removeSource('predefined-poi-markers-canyon');
  }
  if (map.getLayer('individual-markers-filtered-canyon')) {
    map.removeLayer('individual-markers-filtered-canyon');
  }
  if (map.getSource('individual-markers-filtered-canyon')) {
    map.removeSource('individual-markers-filtered-canyon');
  }
  // Clear the 'poi' layer if it exists
  if (map.getLayer('cluster-markers-filtered-canyon')) {
    map.removeLayer('cluster-markers-filtered-canyon');
  }
  if (map.getSource('cluster-markers-filtered-canyon')) {
    map.removeSource('cluster-markers-filtered-canyon');
  }
  if (map.getLayer('poi-markers-canyon')) {
    map.removeLayer('poi-markers-canyon');
  }
  if (map.getSource('poi-markers-canyon')) {
    map.removeSource('poi-markers-canyon');

  if (map.getLayer('predefined-poi-points-canyon')){
    map.removeLayer('predefined-poi-points-canyon')
  }
  if (map.getSource('predefined-poi-points-canyon')) {
    map.removeSource('predefined-poi-points-canyon');
  }
  if (map.getLayer('predefined-poi-labels-canyon')){
    map.removeLayer('predefined-poi-labels-canyon')
  }
  if (map.getSource('predefined-poi-labels-canyon')) {
    map.removeSource('predefined-poi-labels-canyon');
  }
  if (map.getLayer('poi-points-canyon')){
    map.removeLayer('poi-points-canyon')
  }
  if (map.getSource('poi-points-canyon')) {
    map.removeSource('poi-points-canyon');
  }
  if (map.getLayer('poi-labels-canyon')) {
    map.removeLayer('poi-labels-canyon');
  }
  if (map.getSource('poi-labels-canyon')) {
    map.removeSource('poi-labels-canyon');
  }
  if (map.getLayer('poiGC')) {
    map.removeLayer('poiGC');
    var poiButtons = document.getElementsByClassName('poi-filter-button-canyon');
    for (var i = 0; i < poiButtons.length; i++) {
      poiButtons[i].classList.remove('selected');
    }
  }
  if (map.getSource('poiGC')) {
    map.removeSource('poiGC');
  }//clear the 'filtered' layer if it exists
     if (map.getLayer('predefined-poi-canyon')) {
      map.removeLayer('predefined-poi-canyon');
    }
    if (map.getSource('predefined-poi-canyon')) {
      map.removeSource('predefined-poi-canyon');
    }
      // Clear the filteredPointFeatures array
  filteredPointFeatures = [];
  }


var dropdown5 = document.getElementById('dropdown5');

// Add event listener for the 'change' event
dropdown5.addEventListener('change', function() {
  // Get the selected value
  var dropdown51 = dropdown5.value;

  // Call your function with the selected value
  Predefined_Maps(dropdown51);
});}


 