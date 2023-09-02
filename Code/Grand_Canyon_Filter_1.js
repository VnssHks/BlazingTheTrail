// Function to update the center coordinates, based on the dropdown menu regarding the entrances (Grand Canyon)
function updateCenterCoordinatescanyon(selectedOption) {
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
      map.setCenter([centerLongitudeCanyon, centerLatitudeCanyon]);
  
  }

// Define variables and set up event listeners
let trailsGC; 
let filteredFeaturesCanyon; 

const filteredPointGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: []
  };

const predefinedGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: [] 
  };

// Add event listeners for filter and clear buttons
document.getElementById("applyFilterButtonCanyon").addEventListener("click", applyFilterCanyon);
document.getElementById("clearFilterButtonCanyon").addEventListener("click", clearFilterCanyon);

// Function to toggle the selected state of a POI filter button
const poiFilterButtonsCanyon = document.querySelectorAll('.poi-filter-button-canyon');
poiFilterButtonsCanyon.forEach((button) => {
  button.addEventListener('click', togglePOIFilterCanyon);
});
function togglePOIFilterCanyon() {
    this.classList.toggle('selected');
  }
  
// Function to apply filters to trails and POIs
function applyFilterCanyon() {
    const dropdownValueCanyon = document.getElementById("dropdownpark2").value;
    
    // Calculate bounding box based on slider values and center coordinates
    const sliderValue2canyon = parseInt(document.getElementById('slider2canyon').value, 10);
    console.log('Slider value:', sliderValue2canyon);

    updateCenterCoordinatescanyon(dropdownValueCanyon);
    
    const sliderValuecanyon = document.getElementById("slidercanyon").value;

    const bboxWidth = 0.00025; 
    const bboxHeight = 0.00025; 
    const scaledWidth = bboxWidth * sliderValuecanyon;
    const scaledHeight = bboxHeight * sliderValuecanyon;
    const bboxWidthMeters = turf.distance([centerLongitudeCanyon, centerLatitudeCanyon], [centerLongitudeCanyon + (scaledWidth / 111.32), centerLatitudeCanyon], { units: 'kilometers' }) * 1000;
    const bboxHeightMeters = turf.distance([centerLongitudeCanyon, centerLatitudeCanyon], [centerLongitudeCanyon, centerLatitudeCanyon + (scaledHeight / 111.32)], { units: 'kilometers' }) * 1000;
    const bboxSize = bboxWidthMeters * bboxHeightMeters; 
    const bboxCoordinatesCanyon = [
        centerLongitudeCanyon - (bboxWidthMeters / 2),
        centerLatitudeCanyon - (bboxHeightMeters / 2),
        centerLongitudeCanyon + (bboxWidthMeters / 2),
        centerLatitudeCanyon + (bboxHeightMeters / 2)
      ];

const bboxPolygon = turf.bboxPolygon(bboxCoordinatesCanyon);
map.setCenter([centerLongitudeCanyon, centerLatitudeCanyon]);

//Comment out UNDERNEATH TO get rid of BBOX DISPLAY - Uncomment to check whether the box makes sense in size, etc. when adding new NPs
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


  filterTrailsByBoundingBoxCanyon(bboxCoordinatesCanyon);
  console.log('Filtered Features:', filteredFeaturesCanyon); 
  desiredActivityCanyon(sliderValue2canyon, filteredFeaturesCanyon);
  const poiFilterButtonsCanyon = document.querySelectorAll('.poi-filter-button-canyon.selected');

  const selectedPOITypesCanyon = [];

  poiFilterButtonsCanyon.forEach((button) => {
    const poiTypeCanyon = button.dataset.poiType;
    selectedPOITypesCanyon.push(poiTypeCanyon);
  });

  filterPOIsCanyon(selectedPOITypesCanyon);
  filterPOIsByBoundingBoxCanyon(bboxCoordinatesCanyon, predefinedGeoJSONCanyon, filteredPointGeoJSONCanyon);
 
  if (!map.getSource('entranceGC')) {
    map.addSource('entranceGC', {
      type: 'geojson',
      data: entranceStationsGC 
    });

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

    map.addLayer({
      id: 'individual-markers-canyon',
      type: 'symbol',
      source: 'clustered-entrance-canyon',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{icon}', 
        'icon-size': 1 
      },
      paint: {}
    });
  }


}

// Function to filter trails based on a bounding box
function filterTrailsByBoundingBoxCanyon(bbox) {
    const bboxPolygon = turf.bboxPolygon(bbox);
  
    filteredFeaturesCanyon = trailsGC.features.flatMap(function (feature) { // Remove 'let' here
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
    
    map.addLayer({
      id: 'filtered-labels-canyon',
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
      return; 
    }

    const filteredFeaturesUpdatedCanyon = filteredFeaturesCanyon.filter(function (feature) {
    console.log('Feature', feature);
  if (
    feature.properties &&
    feature.properties.Miles !== null &&
    feature.properties.Miles !== undefined
  ) {
  const attributeMiles = parseFloat(feature.properties.Miles);
    console.log('Attribute Miles:', attributeMiles);

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
      return true; 
    }
  } else {
    console.log('Missing Miles value');
    return true; 
  }
});

  const filteredGeoJSONCanyon = turf.featureCollection(filteredFeaturesUpdatedCanyon);
  
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
  
  map.addLayer({
    id: 'filtered-labels-canyon',
    type: 'symbol',
    source: 'filtered-canyon',
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

// Function to filter POIs based on selected types
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
  const predefinedPOITypesCanyon = ['Parking Lot', 'Post Office', 'Ranger Station','Restroom', 'Trailhead', 'Entrance Station', 'Barn', 'Building', 'Cemetery', 'Chapel', 'Fire Station', 'First Aid Station', 'Gas Station', 'Headquarters', 'Lake', 'Potable Water', 'Shelter', 'Telephone', 'Tower'];

  map.setLayoutProperty('POIsGC', 'visibility', 'none');
  console.log('Selected POI Types:', selectedPOITypesCanyon);

  const selectedTypesCanyon = selectedPOITypesCanyon.flatMap((types) =>
    types.split(',').map((type) => type.trim())
  );
  console.log(selectedTypesCanyon); 

  const filteredFeaturesCanyon = POIsGC.features.filter((feature) => {
    const poiTypeCanyon = feature.properties.POITYPE;

    return selectedTypesCanyon.includes(poiTypeCanyon);
  });
  filteredPointGeoJSONCanyon.features = filteredFeaturesCanyon;

  const filteredGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: filteredFeaturesCanyon,
  };

  map.addSource('poi-features-canyon', {
    type: 'geojson',
    data: filteredGeoJSONCanyon,
  });


  console.log('Number of Features Filtered (poi layer):', filteredFeaturesCanyon.length);

  const predefinedFeaturesCanyon = POIsGC.features.filter((feature) => {
    const poiTypeCanyon = feature.properties.POITYPE;

    return predefinedPOITypesCanyon.includes(poiTypeCanyon);
  });
  predefinedGeoJSONCanyon.features = predefinedFeaturesCanyon;

  map.addSource('predefined-poi-features-canyon', {
    type: 'geojson',
    data: predefinedGeoJSONCanyon,
  });

  

  console.log('Number of Features Filtered (predefined-poi layer):', predefinedFeaturesCanyon.length);
}

// Function to filter POIs by bounding box
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

  const bboxPolygon = turf.bboxPolygon(bbox);

  const filteredPointFeaturesCanyon = filteredPointGeoJSONCanyon.features.filter(function (feature) {
    if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
      console.log('Invalid feature:', feature);
      return false; 
    }

    const point = turf.point(feature.geometry.coordinates, feature.properties);

    return turf.booleanPointInPolygon(point, bboxPolygon);
  });

  console.log('Filtered Point Features:', filteredPointFeaturesCanyon);


  const filteredPredefinedFeaturesCanyon = predefinedGeoJSONCanyon.features.filter(function (feature) {
    if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
      console.log('Invalid feature:', feature);
      return false;
    }
    const point = turf.point(feature.geometry.coordinates, feature.properties);
    return turf.booleanPointInPolygon(point, bboxPolygon);
  });

  console.log('Filtered Predefined Features:', filteredPredefinedFeaturesCanyon);
  const newFilteredPointGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: filteredPointFeaturesCanyon,
  };

  newFilteredPointGeoJSONCanyon.features.forEach(function (feature) {
  const poiTypeCanyon = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiTypeCanyon];
});

map.addSource('poi-markers-canyon', {
    type: 'geojson',
    data: newFilteredPointGeoJSONCanyon,
    cluster: true, 
    clusterRadius: 20
  });

map.on('load', function() {
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

map.addLayer({
  id: 'individual-markers-filtered-canyon',
  type: 'symbol',
  source: 'poi-markers-canyon',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': '{icon}', 
    'icon-size': 1 
  },
  paint: {}
});

var markersFilteredCanyon = [];

newFilteredPointGeoJSONCanyon.features.forEach(function (point, index) {
  var poiTypeCanyon = point.properties.POITYPE;

  if (iconMapping.hasOwnProperty(poiTypeCanyon)) {
    if (map.hasImage('marker-filtered-canyon-' + index)) {
      map.removeImage('marker-filtered-canyon-' + index);
    }

    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-filtered-canyon-' + index 
      }
    };
    Object.assign(marker.properties, point.properties);

    markersFilteredCanyon.push(marker);

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
map.getSource('poi-markers-canyon').setData({
  type: 'FeatureCollection',
  features: markersFilteredCanyon
});

  console.log('Adding source: poi');

  const newFilteredPredefinedGeoJSONCanyon = {
    type: 'FeatureCollection',
    features: filteredPredefinedFeaturesCanyon,
  };

  newFilteredPredefinedGeoJSONCanyon.features.forEach(function (feature) {
  const poiTypeCanyon = feature.properties.POITYPE;
  feature.properties.iconImage = iconMapping[poiTypeCanyon];
});

  map.addSource('predefined-poi-markers-canyon', {
    type: 'geojson',
    data: newFilteredPredefinedGeoJSONCanyon,
    cluster: true,
    clusterRadius: 20
  });

  map.on('load', function() {
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

    map.addLayer({
      id: 'individual-markers-canyon',
      type: 'symbol',
      source: 'predefined-poi-markers-canyon',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{icon}', 
       'icon-size': 1
      },
     paint: {}
    });

    var markersCanyon = [];
    newFilteredPredefinedGeoJSONCanyon.features.forEach(function (point, index) {
      var poiTypeCanyon = point.properties.POITYPE;

  if (iconMapping.hasOwnProperty(poiTypeCanyon)) {
    if (map.hasImage('marker-canyon-' + index)) {
      map.removeImage('marker-canyon-' + index);
    }

    var marker = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates
      },
      properties: {
        icon: 'marker-canyon-' + index 
      }
    };
    Object.assign(marker.properties, point.properties);

    markersCanyon.push(marker);

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

map.getSource('predefined-poi-markers-canyon').setData({
  type: 'FeatureCollection',
  features: markersCanyon
});
  console.log('Adding source: predefined-poi-markers-canyon');
}


function togglePOIFilterCanyon() {
    console.log('Button clicked');

  this.classList.toggle('selected');
}


// Function to clear all filters and reset the map view
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
  }
     if (map.getLayer('predefined-poi-canyon')) {
      map.removeLayer('predefined-poi-canyon');
    }
    if (map.getSource('predefined-poi-canyon')) {
      map.removeSource('predefined-poi-canyon');
    }
  filteredPointFeatures = [];
  }

var dropdown5 = document.getElementById('dropdown5');

dropdown5.addEventListener('change', function() {
  var dropdown51 = dropdown5.value;
  Predefined_Maps(dropdown51);
});}


 