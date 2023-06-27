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
  toggleFilter2();
    // Get the selected value
    var dropdown51 = dropdown5.value;
  
    // Call your function with the selected value
    Predefined_Maps(dropdown51);
    FilterPointsOfInterest(dropdown51);
  });
  

  function Predefined_Maps(dropdown51) {
    let maxValue;
    let maxValueElev;
    let maxCategory;
    let maxEstimated;
  
    // Set the max value based on the slider value
    if (dropdown51 === 'Adventurer') {
      maxValue = 50;
      maxValueElev = 1000;
      maxCategory = 5;
      maxEstimated = 100;
      console.log(maxValueElev);
      console.log(maxValue);
    } else if (dropdown51 === 'Picnicker') {
      maxValue = 10;
      maxValueElev = 200;
      maxCategory = 4;
      maxEstimated = 4;
    } else if (dropdown51 === 'Comfort') {
      maxValue = 4;
      maxValueElev = 150;
      maxCategory = 1;
      maxEstimated = 2;
    } else if (dropdown51 === 'Windshield') {
      maxValue = 4;
      maxValueElev = 50;
      maxCategory = 1;
      maxEstimated = 2;
    } else if (dropdown51 === 'Backcountry') {
      maxValue = 50;
      maxValueElev = 1000;
      maxCategory = 5;
      maxEstimated = 100;
    } else {
      return; // Invalid slider value
    }
  
    // Filter trails by attribute values (Miles and Elev_gain)
    const filteredFeaturesUpdated = trails.features.filter(function (feature) {
      console.log('Feature:', feature);
  
      // Check if the feature has the 'Miles' property
      if (
        feature.properties &&
        feature.properties.Miles !== null &&
        feature.properties.Miles !== undefined
      ) {
        const attributeMiles = parseFloat(feature.properties.Miles.replace(',', '.'));
        console.log('Attribute Miles:', attributeMiles);
  
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
            const attributeCategory = parseFloat(feature.properties.Category.replace(',', '.'));
            console.log('Attribute Category:', attributeCategory);
  
            if (
              feature.properties.Estimated !== null &&
              feature.properties.Estimated !== undefined
            ) {
              const attributeEstimated = parseFloat(feature.properties.Estimated);
              console.log('Attribute Estimated:', attributeEstimated);
  
              return attributeMiles < maxValue && attributeElevGain < maxValueElev && attributeCategory < maxCategory && attributeEstimated < maxEstimated;
            } else {
              console.log('Missing Estimated Value');
              return attributeMiles < maxValue && attributeElevGain < maxValueElev && attributeCategory < maxCategory;
            }
          } else {
            console.log('Missing Category Value');
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
    console.log('Filtered GeoJSON:', filteredGeoJSON);
  
    // Clear the 'filtered' layer if it exists
    if (map.getLayer('filtered-lines')) {
      map.removeLayer('filtered-lines');
    }
    if (map.getSource('filtered-lines')) {
      map.removeSource('filtered-lines');
    }
    if (map.getLayer('filtered-labels')) {
      map.removeLayer('filtered-labels');
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
        'line-color': '#F7B32B',
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
  

///POI FILTERING
function FilterPointsOfInterest(dropdown51) {

  if (map.getLayer('cluster-markers-filtered')) {
    map.removeLayer('cluster-markers-filtered');
  }
  if (map.getSource('cluster-markers-filtered')) {
    map.removeSource('cluster-markers-filtered');
  }
  if (map.getLayer('individual-markers-filtered')) {
    map.removeLayer('individual-markers-filtered');
  }
  if (map.getSource('individual-markers-filtered')) {
    map.removeSource('individual-markers-filtered');
  }
  if (map.getLayer('clustered-markers-filtered')) {
    map.removeLayer('clustered-markers-filtered');
  }
  if (map.getSource('clustered-markers-filtered')) {
    map.removeSource('clustered-markers-filtered');
  }
  

  if (map.getLayer('cluster-markers')) {
    map.removeLayer('cluster-markers');
  }
  if (map.getSource('cluster-markers')) {
    map.removeSource('cluster-markers');
  }
  if (map.getLayer('individual-markers')) {
    map.removeLayer('individual-markers');
  }
  if (map.getSource('individual-markers')) {
    map.removeSource('individual-markers');
  }  if (map.getLayer('clustered-markers')) {
    map.removeLayer('clustered-markers');
  }
  if (map.getSource('clustered-markers')) {
    map.removeSource('clustered-markers');
  }
  if (map.getLayer('poi')) {
    map.removeLayer('poi');
  }
  if (map.getSource('poi')) {
    map.removeSource('poi');
  }
  if (map.getLayer('predefined-poi')) {
    map.removeLayer('predefined-poi-points');
    map.removeLayer('predefined-poi');
  }
  if (map.getSource('predefined-poi')) {
    map.removeSource('predefined-poi');
  }
  map.setLayoutProperty('POIs', 'visibility', 'none');
  // Define the filter criteria based on the selected dropdown value
  let filterCriteria;
  let iconImage;

  if (dropdown51 === 'Adventurer') {
    // Set filter criteria for Option 1
    filterCriteria = {
      POITYPE: [
        'Museum',
        'Geyser',
        'Amphitheater',
        'Peak',
        'Waterfall',
        'Information',
        'Visitor Center',
        'Store',
        'Picnic Area',
        'Food Service',
        'Lodging',
        'Campground',
        'Campsite',
        'RV Campground',
        'Dump Station',
      ],
    };
  } else if (dropdown51 === 'Windshield') {
    // Set filter criteria for Option 2
    filterCriteria = {
      POITYPE: [
        'Museum',
        'Geyser',
        'Amphitheater',
        'Peak',
        'Waterfall',
        'Information',
        'Visitor Center',
      ], // Example combination of POITYPE values for Option 2
    };
  } else if (dropdown51 === 'Picnicker') {
    // Set filter criteria for Option 3
    filterCriteria = {
      POITYPE: ['Picnic Area'], // Example combination of POITYPE values for Option 3
    };
  } else if (dropdown51 === 'Comfort') {
    // Set filter criteria for Option 3
    filterCriteria = {
      POITYPE: ['Food Service', 'Lodging'], // Example combination of POITYPE values for Option 3
    };
  } else if (dropdown51 === 'Backcountry') {
    // Set filter criteria for Option 3
    filterCriteria = {
      POITYPE: [
        'Store',
        'Picnic Area',
        'Geyser',
        'Amphitheater',
        'Peak',
        'Waterfall',
        'Food Service',
      ], // Example combination of POITYPE values for Option 3
    };
  } else {
    return; // Invalid dropdown value
  }

  // Filter points of interest based on the filter criteria
  const filteredPoints = POIs.features.filter(function (feature) {
    const poiType = feature.properties.POITYPE;
    return filterCriteria.POITYPE.includes(poiType);
  });

  // Generate filtered GeoJSON
  const filteredGeoJSON = {
    type: 'FeatureCollection',
    features: filteredPoints,
  };

// Update the filteredGeoJSON features with the appropriate icon image names
filteredGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
  feature.properties = { ...feature.properties };
});

// Create a cluster source for the filtered points
map.addSource('clustered-markers-filtered', {
  type: 'geojson',
  data: filteredGeoJSON, // Use the filtered GeoJSON data
  cluster: true,
  clusterRadius: 20 // Adjust the cluster radius as desired
});

map.on('load', function() {
  // Create a layer for the cluster markers
  map.addLayer({
    id: 'cluster-markers-filtered',
    type: 'symbol',
    source: 'clustered-markers-filtered',
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
  source: 'clustered-markers-filtered',
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
filteredGeoJSON.features.forEach(function (point, index) {
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
    Object.assign(marker.properties, point.properties);

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
map.getSource('clustered-markers-filtered').setData({
  type: 'FeatureCollection',
  features: markersFiltered
});



    console.log('Number of Features Filtered (poi layer):', filteredPoints.length);
  
    const predefinedPOITypes = ['Parking Lot', 'Entrance Station', 'Post Office', 'Ranger Station', 'Restroom', 'Trailhead'];
    // Filter the predefined POI types from the entire dataset
    const predefinedFeatures = POIs.features.filter((feature) => {
      const poiType = feature.properties.POITYPE;
    
      // Check if the POI type is in the predefined types array
      return predefinedPOITypes.includes(poiType);
    });
    predefinedGeoJSON.features = predefinedFeatures;
    
    // Add the predefined POIs as a new source and layer on the map
    map.addSource('predefined-poi', {
      type: 'geojson',
      data: predefinedGeoJSON, 
    });
// Update the filteredGeoJSON features with the appropriate icon image names
predefinedGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
  feature.properties = { ...feature.properties };

});

// Create a cluster source
map.addSource('clustered-markers', {
  type: 'geojson',
  data: predefinedGeoJSON,
  cluster: true,
  clusterRadius: 20 // Adjust the cluster radius as desired
});

map.on('load', function() {
  // Create a layer for the cluster markers
  map.addLayer({
    id: 'cluster-markers',
    type: 'symbol',
    source: 'clustered-markers',
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
  source: 'clustered-markers',
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
predefinedGeoJSON.features.forEach(function (point, index) {
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
    Object.assign(marker.properties, point.properties);

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
map.getSource('clustered-markers').setData({
  type: 'FeatureCollection',
  features: markers
});

}



