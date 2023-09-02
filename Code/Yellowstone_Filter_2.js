// Function to toggle the display of filter elements
function toggleFilter2() {
  var filter = document.getElementById('toggleFilter2');
  var filter1 = document.getElementById('toggleFilter');

  if (filter.style.display === 'none') {
    filter.style.display = 'block';
    filter1.style.display = 'none'; 
  } else {
    filter.style.display = 'none';
  }
}

  // Event listener for changes in the dropdown element with ID 'dropdown5park2'
    var dropdown5 = document.getElementById('dropdown5');
    dropdown5.addEventListener('change', function() {
    toggleFilter2();
    var dropdown51 = dropdown5.value;
    
    // Call other functions to update the map based on the selected value
    Predefined_Maps(dropdown51);
    FilterPointsOfInterest(dropdown51);
    addEntranceLayer();
  });

  
// Function to filter points of interest on the map
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
  let filterCriteria;
  let iconImage;

  if (dropdown51 === 'Adventurer') {
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
    filterCriteria = {
      POITYPE: [
        'Museum',
        'Geyser',
        'Amphitheater',
        'Peak',
        'Waterfall',
        'Information',
        'Visitor Center',
      ], 
    };
  } else if (dropdown51 === 'Picnicker') {
    filterCriteria = {
      POITYPE: ['Picnic Area'], 
    };
  } else if (dropdown51 === 'Comfort') {
    filterCriteria = {
      POITYPE: ['Food Service', 'Lodging'], 
    };
  } else if (dropdown51 === 'Backcountry') {
    filterCriteria = {
      POITYPE: [
        'Store',
        'Picnic Area',
        'Geyser',
        'Amphitheater',
        'Peak',
        'Waterfall',
        'Food Service',
      ], 
    };
  } else {
    return; 
  }

  const filteredPoints = POIs.features.filter(function (feature) {
    const poiType = feature.properties.POITYPE;
    return filterCriteria.POITYPE.includes(poiType);
  });

  const filteredGeoJSON = {
    type: 'FeatureCollection',
    features: filteredPoints,
  };

filteredGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
  feature.properties = { ...feature.properties };
});

map.addSource('clustered-markers-filtered', {
  type: 'geojson',
  data: filteredGeoJSON, 
  cluster: true,
  clusterRadius: 20 
});

map.on('load', function() {
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

map.addLayer({
  id: 'individual-markers-filtered',
  type: 'symbol',
  source: 'clustered-markers-filtered',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', 
    'icon-size': 1 
  },
  paint: {}
});

var markersFiltered = [];

filteredGeoJSON.features.forEach(function (point, index) {
  var poiType = point.properties.POITYPE;

  if (iconMapping.hasOwnProperty(poiType)) {
    if (map.hasImage('marker-filtered-' + index)) {
      map.removeImage('marker-filtered-' + index);
    }

    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-filtered-' + index 
      }
    };
    Object.assign(marker.properties, point.properties);

    markersFiltered.push(marker);

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

map.getSource('clustered-markers-filtered').setData({
  type: 'FeatureCollection',
  features: markersFiltered
});



    console.log('Number of Features Filtered (poi layer):', filteredPoints.length);
  
    const predefinedPOITypes = ['Parking Lot', 'Post Office', 'Ranger Station', 'Restroom', 'Trailhead', 'Entrance Station'];
    const predefinedFeatures = POIs.features.filter((feature) => {
      const poiType = feature.properties.POITYPE;
    
      return predefinedPOITypes.includes(poiType);
    });
    predefinedGeoJSON.features = predefinedFeatures;
    
    map.addSource('predefined-poi', {
      type: 'geojson',
      data: predefinedGeoJSON, 
    });
predefinedGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
  feature.properties = { ...feature.properties };

});

map.addSource('clustered-markers', {
  type: 'geojson',
  data: predefinedGeoJSON,
  cluster: true,
  clusterRadius: 20 
});

map.on('load', function() {
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

map.addLayer({
  id: 'individual-markers',
  type: 'symbol',
  source: 'clustered-markers',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', 
    'icon-size': 1 
  },
  paint: {}
});

var markers = [];
predefinedGeoJSON.features.forEach(function (point, index) {
  var poiType = point.properties.POITYPE;

  if (iconMapping.hasOwnProperty(poiType)) {
    if (map.hasImage('marker-' + index)) {
      map.removeImage('marker-' + index);
    }
    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-' + index 
      }
    };
    Object.assign(marker.properties, point.properties);

    markers.push(marker);

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

map.getSource('clustered-markers').setData({
  type: 'FeatureCollection',
  features: markers
});
addEntranceLayer();
}

  // Function to update the map based on predefined criteria
function Predefined_Maps(dropdown51) {
  let maxValue;
  let maxValueElev;
  let maxCategory;
  let maxEstimated;

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
    return;
  }

  const filteredFeaturesUpdated = trails.features.filter(function (feature) {
    console.log('Feature:', feature);

    if (
      feature.properties &&
      feature.properties.Miles !== null &&
      feature.properties.Miles !== undefined
    ) {
      const attributeMiles = parseFloat(feature.properties.Miles.replace(',', '.'));
      console.log('Attribute Miles:', attributeMiles);

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

  const filteredGeoJSON = turf.featureCollection(filteredFeaturesUpdated);
  console.log('Filtered GeoJSON:', filteredGeoJSON);

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

  map.addLayer({
    id: 'filtered-labels',
    type: 'symbol',
    source: 'filtered',
    layout: {
      'symbol-placement': 'line',
      'text-field': ['get', 'MAPLABEL'],
      'text-font': ['Open Sans Regular'],
      'text-size': 12,
      'text-offset': [0, 1], 
      'text-anchor': 'center'
    },
    paint: {
      'text-color': 'black',
      'text-halo-color': 'white', 
      'text-halo-width': 2, 
    },
  });
  addEntranceLayer();

}


 
// Function to add entrance stations to the map
function addEntranceLayer() {
  if (!map.getSource('entrance')) {
    map.addSource('entrance', {
      type: 'geojson',
      data: entranceStations 
    });

    map.addLayer({
      id: 'cluster-markers',
      type: 'symbol',
      source: 'clustered-entrance',
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

    map.addLayer({
      id: 'individual-markers',
      type: 'symbol',
      source: 'clustered-entrance',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{icon}', 
        'icon-size': 1 
      },
      paint: {}
    });
  }
}