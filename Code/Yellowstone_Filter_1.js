//Here the map is intialised
mapboxgl.accessToken = 'pk.eyJ1IjoidmFuZXNzYWhlbmtlcyIsImEiOiJjbDQyZnI1czQwNGJiM21tbG1xOGU1cHUyIn0.90NG-Bfg_Q_tsxUd_UZCfA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vanessahenkes/cl4ehgpd4000114o38wx98v6y',
  center: [-110.629578, 44.480121],
  zoom: 8,
});


//Here MapBox controls such as Navigation, zoom controls and a scale are added
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
const scale = new mapboxgl.ScaleControl({maxWidth: 80, unit: 'imperial'});
map.addControl(scale, 'bottom-right');

// Define variables
let centerLatitude;
let centerLongitude;
let trails; 


//Below, the geojson data for Grand Canyon NP is loaded and styled from the Github Repository
fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/finals_YS.geojson')
  .then(response => response.json())
  .then(data => {
    trails = data; 

    if (map.getSource('trails')) {
      map.removeSource('trails');
    }

    map.addSource('trails', {
      type: 'geojson',
      data: trails 
    });

    if (map.getLayer('trails')) {
      map.removeLayer('trails');
    }

    map.addLayer({
      id: 'trails',
      type: 'line',
      source: 'trails',
      paint: {
        'line-color': '#A0766E',
        'line-width': 1
      } ,   

    });
    map.moveLayer('trails','cluster-markers-entrance');
    map.moveLayer('trails','individual-markers-entrance');
  })
  .catch(error => {
    console.error('Error fetching trail data:', error);
  });

  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/Yellowstone_POIs.geojson')
  .then(response => response.json())
  .then(data => {
    POIs = data; 

    if (map.getSource('POIs')) {
      map.removeSource('POIs');
    }

    map.addSource('POIs', {
      type: 'geojson',
      data: POIs 
    });

    if (map.getLayer('POIs')) {
      map.removeLayer('POIs');
    }

    map.addLayer({
      id: 'POIs',
      type: 'circle', 
      source: 'POIs',
      paint: {
        'circle-color': 'black', 
        'circle-radius': 2, 
      }
    });
  })
  .catch(error => {
    console.error('Error fetching POIs data:', error);
  });



  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/yellowstone_roads.geojson')
  .then(response => response.json())
  .then(data => {
    Roads = data; 

    if (map.getSource('Roads')) {
      map.removeSource('Roads');
    }

    map.addSource('Roads', {
      type: 'geojson',
      data: Roads 
    });

    if (map.getLayer('Roads')) {
      map.removeLayer('Roads');
    }

    map.addLayer({
      id: 'Roads',
      type: 'line', 
      source: 'Roads',
      paint: {
        'line-color': '#000000',
        'line-width': 0.5,
      }
    });
  })
  .catch(error => {
    console.error('Error fetching Roads data:', error);
  });

fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/Yellowstone_Boundary.geojson')
  .then(response => response.json())
  .then(data => {
    if (map.getSource('boundary')) {
      map.removeSource('boundary');
    }

    map.addSource('boundary', {
      type: 'geojson',
      data: data
    });

    if (map.getLayer('boundary')) {
      map.removeLayer('boundary');
    }

    map.addLayer({
      id: 'boundary',
      type: 'line',
      source: 'boundary',
      paint: {
        'line-color': '#000000',
        'line-width': 1.5
      }
    });
  })
  .catch(error => {
    console.error('Error fetching boundary data:', error);
  });

  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/entrance_stations_YS.geojson')
  .then(response => response.json())
  .then(entranceData => {
    const entranceStations = entranceData;
  
    if (map.getSource('entrance')) {
      map.removeSource('entrance');
    }
  
    map.addSource('entrance', {
      type: 'geojson',
      data: entranceStations 
    });
  
    if (map.getLayer('cluster-markers')) {
      map.removeLayer('cluster-markers');
    }
  
    map.addSource('clustered-entrance', {
      type: 'geojson',
      data: entranceStations,
    });
  
    map.addLayer({
      id: 'cluster-markers-entrance', 
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
      id: 'individual-markers-entrance', 
      type: 'symbol',
      source: 'clustered-entrance',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{icon}', 
        'icon-size': 1, 
      },
      paint: {}
    });


    var entranceMarkers = [];
  
    entranceStations.features.forEach(function (entranceStation, index) {
      var entranceType = entranceStation.properties.POITYPE;
  
      if (iconMapping.hasOwnProperty(entranceType)) {
        if (map.hasImage('entrance-marker-' + index)) {
          map.removeImage('entrance-marker-' + index);
        }
  
        var entranceMarker = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: entranceStation.geometry.coordinates
          },
          properties: {
            icon: 'entrance-marker-' + index 
          }
        };
        Object.assign(entranceMarker.properties, entranceStation.properties);
  
        entranceMarkers.push(entranceMarker);
  
        map.loadImage(iconMapping[entranceType], function (error, image) {
          if (error) {
            console.error('Failed to load image:', error);
            console.log('Icon URL:', iconMapping[entranceType]);
            console.log('Marker index:', index);
            console.log('Marker properties:', entranceStation.properties);
            return;
          }
          map.addImage('entrance-marker-' + index, image);
          console.log('Marker loaded successfully for entrance type:', entranceType);
        });
      }
    });
  
    map.getSource('clustered-entrance').setData({
      type: 'FeatureCollection',
      features: entranceMarkers
    });
  })
  .catch(error => {
    console.error('Error fetching entrance station data:', error);
  });


const highlightedSource = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
};

const highlightedLayer = {
  id: 'highlighted',
  source: 'highlightedSource',
  type: 'line',
  paint: {
    'line-color': '#F7B32B',
    'line-width': 3
  }
};

//These functions makes sure that filtering windows do not open on top of eachother
function toggleFilter() {
  var filter = document.getElementById('toggleFilter');
  var filter2 = document.getElementById('toggleFilter2');

  if (filter.style.display === 'none') {
    filter.style.display = 'block';
    filter2.style.display = 'none';
  } else {
    filter.style.display = 'none';
  }
}

function toggleFiltercanyon() {
  var filter = document.getElementById('toggleFiltercanyon');
  var filter1 = document.getElementById('toggleFilter3');

  if (filter.style.display === 'none') {
      filter.style.display = 'block';
      filter1.style.display = 'none'; 
  } else {
      filter.style.display = 'none';
  }
}

// Function to update the center coordinates, based on the dropdown menu regarding the entrances (Yellowstone)
function updateCenterCoordinates(selectedOption) {
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
    map.setCenter([centerLongitude, centerLatitude]);

}

// Add event listeners for filter and clear buttons
document.getElementById("applyFilterButton").addEventListener("click", applyFilter);
document.getElementById("clearFilterButton").addEventListener("click", clearFilter);

// Function to toggle the selected state of a POI filter button
const poiFilterButtons = document.querySelectorAll('.poi-filter-button');
poiFilterButtons.forEach((button) => {
  button.addEventListener('click', togglePOIFilter);
});
const predefinedGeoJSON = {
  type: 'FeatureCollection',
  features: [] 
};

const filteredPointGeoJSON = {
  type: 'FeatureCollection',
  features: [] 
};

let boundingBox = null;

// Function to apply filters to trails and POIs
function applyFilter() {
    const dropdownValue = document.getElementById("dropdownpark1").value;

    // Calculate bounding box based on slider values and center coordinates
    const sliderValue2 = parseInt(document.getElementById('slider2').value, 10);
    console.log('Slider value:', sliderValue2);
    
    updateCenterCoordinates(dropdownValue);
  
    const sliderValue = document.getElementById("slider").value;
    const bboxWidth = 0.00055; 
    const bboxHeight = 0.00055; 
    const scaledWidth = bboxWidth * sliderValue;
    const scaledHeight = bboxHeight * sliderValue;
    const bboxWidthMeters = turf.distance([centerLongitude, centerLatitude], [centerLongitude + (scaledWidth / 111.32), centerLatitude], { units: 'kilometers' }) * 1000;
    const bboxHeightMeters = turf.distance([centerLongitude, centerLatitude], [centerLongitude, centerLatitude + (scaledHeight / 111.32)], { units: 'kilometers' }) * 1000;
    const bboxSize = bboxWidthMeters * bboxHeightMeters; 
    const bboxCoordinates = [
        centerLongitude - (bboxWidthMeters / 2),
        centerLatitude - (bboxHeightMeters / 2),
        centerLongitude + (bboxWidthMeters / 2),
        centerLatitude + (bboxHeightMeters / 2)
      ];

const bboxPolygon = turf.bboxPolygon(bboxCoordinates);
map.setCenter([centerLongitude, centerLatitude]);

//Comment out UNDERNEATH TO get rid of BBOX DISPLAY - Un-comment when adding new NPs to see whether size, etc. makes sense
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

  filterTrailsByBoundingBox(bboxCoordinates);
  console.log('Filtered Features:', filteredFeatures);
  desiredActivity(sliderValue2, filteredFeatures);
  const poiFilterButtons = document.querySelectorAll('.poi-filter-button.selected');

  const selectedPOITypes = [];

  poiFilterButtons.forEach((button) => {
    const poiType = button.dataset.poiType;
    selectedPOITypes.push(poiType);
  });

  filterPOIs(selectedPOITypes);
filterPOIsByBoundingBox(bboxCoordinates, predefinedGeoJSON, filteredPointGeoJSON);
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
    });map.moveLayer('filtered-lines', 'individual-markers');

  }}
  
const turf = window.turf;
let filteredFeatures; 

// Function to filter trails based on a bounding box
function filterTrailsByBoundingBox(bbox) {
    const bboxPolygon = turf.bboxPolygon(bbox);
      filteredFeatures = trails.features.flatMap(function (feature) { 
      if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
        console.log('Invalid feature:', feature);
        return []; 
      }
  
      if (feature.geometry.type === 'MultiLineString') {
        const lineStrings = feature.geometry.coordinates.flatMap(function (coordinates) {
          const lineString = turf.lineString(coordinates, feature.properties);
  
          const intersects = lineString.geometry.coordinates.some(function (coordinate) {
            const point = turf.point(coordinate);
            return turf.booleanPointInPolygon(point, bboxPolygon);
          });
  
          return intersects ? [lineString] : [];
        });
  
        return lineStrings;
      }
  
      const intersects = feature.geometry.coordinates.some(function (coordinate) {
        const point = turf.point(coordinate);
        return turf.booleanPointInPolygon(point, bboxPolygon);
      });
  
      return intersects ? [feature] : [];
    });
  
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
      maxValue = 1000;
      maxValueElev = 1000;
      maxCategory =  5;
      maxEstimated = 1000;
    } else {
      return; 
    }

const filteredFeaturesUpdated = filteredFeatures.filter(function (feature) {
    console.log('Feature', feature);
 
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

          return attributeMiles < maxValue && (attributeElevGain < maxValueElev || attributeElevGain === 0 || isNaN(attributeElevGain)) && attributeCategory < maxCategory && attributeEstimated < maxEstimated;
        } else {
          console.log('Missing Estimated Value');
          return attributeMiles < maxValue && (attributeElevGain < maxValueElev || attributeElevGain === 0 || isNaN(attributeElevGain)) && attributeCategory < maxCategory;
        }
      } else {
        console.log('Missing Category Value');
        return attributeMiles < maxValue && (attributeElevGain < maxValueElev || attributeElevGain === 0 || isNaN(attributeElevGain));
      }
    } else {
      console.log('Missing Elev_gain value');
      return true; 
    }
  } else {
    console.log('Missing Miles value');
    return true; 
  }
});

const filteredGeoJSON = turf.featureCollection(filteredFeaturesUpdated);
  
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
 
}
let poiTypesArray = [];


// Function to filter POIs based on selected types
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
  const predefinedPOITypes = ['Parking Lot', 'Post Office', 'Ranger Station', 'Restroom', 'Trailhead', 'Entrance Station'];

  map.setLayoutProperty('POIs', 'visibility', 'none');

  const selectedTypes = selectedPOITypes.flatMap((types) =>
    types.split(',').map((type) => type.trim())
  );

  const filteredFeatures = POIs.features.filter((feature) => {
    const poiType = feature.properties.POITYPE;

    return selectedTypes.includes(poiType);
  });
  filteredPointGeoJSON.features = filteredFeatures;

  const filteredGeoJSON = {
    type: 'FeatureCollection',
    features: filteredFeatures,
  };

  map.addSource('poi-features', {
    type: 'geojson',
    data: filteredGeoJSON,
  });

  console.log('Number of Features Filtered (poi layer):', filteredFeatures.length);

  const predefinedFeatures = POIs.features.filter((feature) => {
    const poiType = feature.properties.POITYPE;

    return predefinedPOITypes.includes(poiType);
  });
  predefinedGeoJSON.features = predefinedFeatures;

  map.addSource('predefined-poi-features', {
    type: 'geojson',
    data: predefinedGeoJSON,
  });

  console.log('Number of Features Filtered (predefined-poi layer):', predefinedFeatures.length);
}

// Function to filter POIs by bounding box
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

  const bboxPolygon = turf.bboxPolygon(bbox);

  const filteredPointFeatures = filteredPointGeoJSON.features.filter(function (feature) {
    if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
      console.log('Invalid feature:', feature);
      return false; 
    }

    const point = turf.point(feature.geometry.coordinates, feature.properties);

    return turf.booleanPointInPolygon(point, bboxPolygon);
  });

  console.log('Filtered Point Features:', filteredPointFeatures);


  const filteredPredefinedFeatures = predefinedGeoJSON.features.filter(function (feature) {
    if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
      console.log('Invalid feature:', feature);
      return false; 
    }

    const point = turf.point(feature.geometry.coordinates, feature.properties);

    return turf.booleanPointInPolygon(point, bboxPolygon);
  });

  console.log('Filtered Predefined Features:', filteredPredefinedFeatures);

  const newFilteredPointGeoJSON = {
    type: 'FeatureCollection',
    features: filteredPointFeatures,
  };

  newFilteredPointGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
});
  map.addSource('poi-markers', {
    type: 'geojson',
    data: newFilteredPointGeoJSON,
    cluster: true, 
    clusterRadius: 20
  });

map.on('load', function() {
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
map.addLayer({
  id: 'individual-markers-filtered',
  type: 'symbol',
  source: 'poi-markers',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}',
    'icon-size': 1 
  },
  paint: {}
});

var markersFiltered = [];

newFilteredPointGeoJSON.features.forEach(function (point, index) {
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
map.getSource('poi-markers').setData({
  type: 'FeatureCollection',
  features: markersFiltered
});


  console.log('Adding source: poi');


  const newFilteredPredefinedGeoJSON = {
    type: 'FeatureCollection',
    features: filteredPredefinedFeatures,
  };

newFilteredPredefinedGeoJSON.features.forEach(function (feature) {
  const poiType = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiType];
});

  map.addSource('predefined-poi-markers', {
    type: 'geojson',
    data: newFilteredPredefinedGeoJSON,
    cluster: true,
    clusterRadius: 20
  });

  map.on('load', function() {
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

map.addLayer({
  id: 'individual-markers',
  type: 'symbol',
  source: 'predefined-poi-markers',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', 
    'icon-size': 1 
  },
  paint: {}
});

var markers = [];
newFilteredPredefinedGeoJSON.features.forEach(function (point, index) {
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

map.getSource('predefined-poi-markers').setData({
  type: 'FeatureCollection',
  features: markers
});


  console.log('Adding source: predefined-poi-markers');

}


function togglePOIFilter() {
  this.classList.toggle('selected');
}



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
    map.setZoom(8); 
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
  }
     if (map.getLayer('predefined-poi')) {
      map.removeLayer('predefined-poi');
    }
    if (map.getSource('predefined-poi')) {
      map.removeSource('predefined-poi');
    }
      
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

dropdown5.addEventListener('change', function() {
  var dropdown51 = dropdown5.value;

  Predefined_Maps(dropdown51);
});}


 