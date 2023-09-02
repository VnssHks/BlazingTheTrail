// Function to toggle the display of filter elements
function toggleFilter3() {
    var filter = document.getElementById('toggleFilter3');
    var filter1 = document.getElementById('toggleFiltercanyon');

    if (filter.style.display === 'none') {
        filter.style.display = 'block';
        filter1.style.display = 'none'; 
    } else {
        filter.style.display = 'none';
    }
}
  // Event listener for changes in the dropdown element with ID 'dropdown5park2'
   var dropdown5park2 = document.getElementById('dropdown5park2');
  dropdown5park2.addEventListener('change', function() {
    toggleFilter3();
      var dropdown51park2 = dropdown5park2.value;
     
      // Call other functions to update the map based on the selected value
      Predefined_Mapspark2(dropdown51park2);
      FilterPointsOfInterestpark2(dropdown51park2);
      addEntranceLayerpark2();
    });
  
    
// Function to filter points of interest on the map
  function FilterPointsOfInterestpark2(dropdown51park2) {
  
    if (map.getLayer('cluster-markers-filtered-park2')) {
      map.removeLayer('cluster-markers-filtered-park2');
    }
    if (map.getSource('cluster-markers-filtered-park2')) {
      map.removeSource('cluster-markers-filtered-park2');
    }
    if (map.getLayer('individual-markers-filtered-park2')) {
      map.removeLayer('individual-markers-filtered-park2');
    }
    if (map.getSource('individual-markers-filtered-park2')) {
      map.removeSource('individual-markers-filtered-park2');
    }
    if (map.getLayer('clustered-markers-filtered-park2')) {
      map.removeLayer('clustered-markers-filtered-park2');
    }
    if (map.getSource('clustered-markers-filtered-park2')) {
      map.removeSource('clustered-markers-filtered-park2');
    }
    
  
    if (map.getLayer('cluster-markers-park2')) {
      map.removeLayer('cluster-markers-park2');
    }
    if (map.getSource('cluster-markers-park2')) {
      map.removeSource('cluster-markers-park2');
    }
    if (map.getLayer('individual-markers-park2')) {
      map.removeLayer('individual-markers-park2');
    }
    if (map.getSource('individual-markers-park2')) {
      map.removeSource('individual-markers-park2');
    }  if (map.getLayer('clustered-markers-park2')) {
      map.removeLayer('clustered-markers-park2');
    }
    if (map.getSource('clustered-markers-park2')) {
      map.removeSource('clustered-markers-park2');
    }
    if (map.getLayer('poiGC')) {
      map.removeLayer('poiGC');
    }
    if (map.getSource('poiGC')) {
      map.removeSource('poiGC');
    }
    if (map.getLayer('predefined-poi-park2')) {
      map.removeLayer('predefined-poi-points-park2');
      map.removeLayer('predefined-poi-park2');
    }
    if (map.getSource('predefined-poi-park2')) {
      map.removeSource('predefined-poi-park2');
    }
    map.setLayoutProperty('POIsGC', 'visibility', 'none');
    let filterCriteria;
    let iconImage;
  
    if (dropdown51park2 === 'Adventurer') {
      filterCriteria = {
        POITYPE: [
          'Museum',
          'Interpretive Exhibit',
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
          'Lodge',
          'Primitive Camping',
          'Arch',
          'Point Of Interest',
          'Showers',
          'Historic Building',
          'Historic Site',
          'Monument',
        ],
      };
    } else if (dropdown51park2 === 'Windshield') {
      filterCriteria = {
        POITYPE: [
          'Museum',
          'Geyser',
          'Amphitheater',
          'Peak',
          'Waterfall',
          'Information',
          'Visitor Center',
          'Arch',
          'Interpretive Exhibit',
          'Bridge',
          'Airport',
          'Airstrip',
          'Boat Launch',
          'Train Station',
          'Tunnel',  
        ], 
      };
    } else if (dropdown51park2 === 'Picnicker') {
      filterCriteria = {
        POITYPE: ['Picnic Area'], 
      };
    } else if (dropdown51park2 === 'Comfort') {
      filterCriteria = {
        POITYPE: ['Food Service', 'Lodging', 'Lodge'], 
      };
    } else if (dropdown51park2 === 'Backcountry') {
      filterCriteria = {
        POITYPE: [
          'Store',
          'Picnic Area',
          'Geyser',
          'Amphitheater',
          'Peak',
          'Waterfall',
          'Arch', 
          'Boat Launch',
          'Interpretive Exhibit',
          'Historic Site',
          'Historic Building',
          'Monument',
          'Viewpoint',
          'Point Of Interest',
        ], 
      };
    } else {
      return; 
    }
  
    const filteredPointspark2 = POIsGC.features.filter(function (feature) {
      const poiTypepark2 = feature.properties.POITYPE;
      return filterCriteria.POITYPE.includes(poiTypepark2);
    });
  
    const filteredGeoJSONpark2 = {
      type: 'FeatureCollection',
      features: filteredPointspark2,
    };
  
  filteredGeoJSONpark2.features.forEach(function (feature) {
    const poiTypepark2 = feature.properties.POITYPE;
    feature.properties.iconImage = iconMapping[poiTypepark2];
    feature.properties = { ...feature.properties };
  });
  
  map.addSource('clustered-markers-filtered-park2', {
    type: 'geojson',
    data: filteredGeoJSONpark2,
    cluster: true,
    clusterRadius: 20 
  });
  
  map.on('load', function() {
    map.addLayer({
      id: 'cluster-markers-filtered-park2',
      type: 'symbol',
      source: 'clustered-markers-filtered-park2',
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
    id: 'individual-markers-filtered-park2',
    type: 'symbol',
    source: 'clustered-markers-filtered-park2',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': '{icon}', 
      'icon-size': 1 
    },
    paint: {}
  });
  
  var markersFilteredpark2 = [];
  
  filteredGeoJSONpark2.features.forEach(function (point, index) {
    var poiTypepark2 = point.properties.POITYPE;
  
    if (iconMapping.hasOwnProperty(poiTypepark2)) {
      if (map.hasImage('marker-filtered-park2-' + index)) {
        map.removeImage('marker-filtered-park2-' + index);
      }
  
      var marker = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point.geometry.coordinates
        },
        properties: {
          icon: 'marker-filtered-park2-' + index 
        }
      };
      Object.assign(marker.properties, point.properties);
  
      markersFilteredpark2.push(marker);
  
      map.loadImage(iconMapping[poiTypepark2], function (error, image) {
        if (error) {
          console.error('Failed to load image:', error);
          console.log('Failed image URL:', iconMapping[poiTypepark2]);
  
          return;
        }
        map.addImage('marker-filtered-park2-' + index, image);
        console.log('Marker loaded successfully for POI type:', poiTypepark2);
  
      });
    }
  });
  
  map.getSource('clustered-markers-filtered-park2').setData({
    type: 'FeatureCollection',
    features: markersFilteredpark2
  });
  
  
  
      console.log('Number of Features Filtered (poi layer):', filteredPointspark2.length);
    
      const predefinedPOITypespark2 = ['Parking Lot', 'Post Office', 'Ranger Station', 'Potable Water','Restroom', 'Trailhead', 'Entrance Station', 'Barn', 'Building', 'Cemetery', 'Chapel', 'Fire Station', 'First Aid Station', 'Gas Station', 'Headquarters', 'Lake', 'Potable Water', 'Shelter', 'Telephone', 'Tower'];
      const predefinedFeaturespark2 = POIs.features.filter((feature) => {
        const poiTypepark2 = feature.properties.POITYPE;
      
        return predefinedPOITypespark2.includes(poiTypepark2);
      });
      predefinedGeoJSONpark2.features = predefinedFeaturespark2;
      
      map.addSource('predefined-poi-park2', {
        type: 'geojson',
        data: predefinedGeoJSONpark2, 
      });

      predefinedGeoJSONpark2.features.forEach(function (feature) {
    const poiTypepark2 = feature.properties.POITYPE;
    feature.properties.iconImage = iconMapping[poiTypepark2];
    feature.properties = { ...feature.properties };
  
  });
  
  map.addSource('clustered-markers-park2', {
    type: 'geojson',
    data: predefinedGeoJSONpark2,
    cluster: true,
    clusterRadius: 20 
  });
  
  map.on('load', function() {
    map.addLayer({
      id: 'cluster-markers-park2',
      type: 'symbol',
      source: 'clustered-markers-park2',
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
    id: 'individual-markers-park2',
    type: 'symbol',
    source: 'clustered-markers-park2',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': '{icon}', 
      'icon-size': 1 
    },
    paint: {}
  });

  var markerspark2 = [];

  predefinedGeoJSONpark2.features.forEach(function (point, index) {
    var poiTypepark2 = point.properties.POITYPE;
  
    if (iconMapping.hasOwnProperty(poiTypepark2)) {
      if (map.hasImage('marker-park2-' + index)) {
        map.removeImage('marker-park2-' + index);
      }
  
      var marker = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point.geometry.coordinates
        },
        properties: {
          icon: 'marker-park2-' + index 
        }
      };
      Object.assign(marker.properties, point.properties);
  
      markerspark2.push(marker);
  
      map.loadImage(iconMapping[poiTypepark2], function (error, image) {
        if (error) {
          console.error('Failed to load image:', error); 
          console.log('Icon URL:', iconMapping[poiTypepark2]);
          console.log('Marker index:', index);
          console.log('Marker properties:', feature.properties);
  
          return;
        }
        map.addImage('marker-park2-' + index, image);
        console.log('Marker loaded successfully for POI type:', poiTypepark2);
  
      });
    }
  
  });
  
  map.getSource('clustered-markers-park2').setData({
    type: 'FeatureCollection',
    features: markerspark2
  });
  addEntranceLayerpark2();
  }
  
  
  
  // Function to update the map based on predefined criteria
  function Predefined_Mapspark2(dropdown51park2) {
    let maxValue;
    let maxValueElev;
    let maxCategory;
    let maxEstimated;
  
    if (dropdown51park2 === 'Adventurer') {
      maxValue = 50;
      maxValueElev = 1000;
      maxCategory = 5;
      maxEstimated = 100;
      console.log(maxValueElev);
      console.log(maxValue);
    } else if (dropdown51park2 === 'Picnicker') {
      maxValue = 10;
      maxValueElev = 200;
      maxCategory = 4;
      maxEstimated = 4;
    } else if (dropdown51park2 === 'Comfort') {
      maxValue = 4;
      maxValueElev = 150;
      maxCategory = 1;
      maxEstimated = 2;
    } else if (dropdown51park2 === 'Windshield') {
      maxValue = 4;
      maxValueElev = 50;
      maxCategory = 1;
      maxEstimated = 2;
    } else if (dropdown51park2 === 'Backcountry') {
      maxValue = 50;
      maxValueElev = 1000;
      maxCategory = 5;
      maxEstimated = 100;
    } else {
      return; 
    }
  
    const filteredFeaturesUpdatedpark2 = trailsGC.features.filter(function (feature) {
      console.log('Feature:', feature);
  
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
          const attributeElevGain = parseFloat(feature.properties.z_range);
          console.log('Attribute Elev_gain:', attributeElevGain);
  
          if (
            feature.properties.Shenandoah_Category !== null &&
            feature.properties.Shenandoah_Category !== undefined
          ) {
            const attributeCategory = parseFloat(feature.properties.Shenandoah_Category);
            console.log('Attribute Category:', attributeCategory);
  
            if (
              feature.properties.Naismith_Hours !== null &&
              feature.properties.Naismith_Hours !== undefined
            ) {
              const attributeEstimated = parseFloat(feature.properties.Naismith_Hours);
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
  
    const filteredGeoJSONpark2 = turf.featureCollection(filteredFeaturesUpdatedpark2);
    console.log('Filtered GeoJSON:', filteredGeoJSONpark2);
  
    if (map.getLayer('filtered-lines-park2')) {
      map.removeLayer('filtered-lines-park2');
    }
    if (map.getSource('filtered-lines-park2')) {
      map.removeSource('filtered-lines-park2');
    }
    if (map.getLayer('filtered-labels-park2')) {
      map.removeLayer('filtered-labels-park2');
    }
    if (map.getSource('filtered-labels-park2')) {
      map.removeSource('filtered-labels-park2');
    }
    if (map.getLayer('filtered-park2')) {
      map.removeLayer('filtered-park2');
    }
    if (map.getSource('filtered-park2')) {
      map.removeSource('filtered-park2');
    }
  
    map.addSource('filtered-park2', {
      type: 'geojson',
      data: filteredGeoJSONpark2
    });
    map.addLayer({
      id: 'filtered-lines-park2',
      type: 'line',
      source: 'filtered-park2',
      paint: {
        'line-color': '#F7B32B',
        'line-width': 4
      }
    });
  
    map.addLayer({
      id: 'filtered-labels-park2',
      type: 'symbol',
      source: 'filtered-park2',
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
    addEntranceLayerpark2();
  
  }
  
  
   // Function to add entrance stations to the map
  function addEntranceLayerpark2() {
    if (!map.getSource('entrancepark2')) {
      map.addSource('entrancepark2', {
        type: 'geojson',
        data: entranceStationsGC 
      });
  
      map.addLayer({
        id: 'cluster-markers-park2',
        type: 'symbol',
        source: 'clustered-entrance-park2',
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
        id: 'individual-markers-park2',
        type: 'symbol',
        source: 'clustered-entrance-park2',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': '{icon}', 
          'icon-size': 1 
        },
        paint: {}
      });
    }
  }