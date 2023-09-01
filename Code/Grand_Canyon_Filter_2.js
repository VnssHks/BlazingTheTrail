function toggleFilter3() {
    var filter = document.getElementById('toggleFilter3');
    var filter1 = document.getElementById('toggleFiltercanyon');

    if (filter.style.display === 'none') {
        filter.style.display = 'block';
        filter1.style.display = 'none'; // Close the other filter box
    } else {
        filter.style.display = 'none';
    }
}
  
   var dropdown5park2 = document.getElementById('dropdown5park2');
    // Add event listener for the 'change' event
  dropdown5park2.addEventListener('change', function() {
    toggleFilter3();
      // Get the selected value
      var dropdown51park2 = dropdown5park2.value;
    
      // Call your function with the selected value
      Predefined_Mapspark2(dropdown51park2);
      FilterPointsOfInterestpark2(dropdown51park2);
      addEntranceLayerpark2();
    });
  
    
  
  ///POI FILTERING
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
    // Define the filter criteria based on the selected dropdown value
    let filterCriteria;
    let iconImage;
  
    if (dropdown51park2 === 'Adventurer') {
      // Set filter criteria for Option 1
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
          'Arch',
          'Interpretive Exhibit',
          'Bridge',
          'Airport',
          'Airstrip',
          'Boat Launch',
          'Train Station',
          'Tunnel',  
        ], // Example combination of POITYPE values for Option 2
      };
    } else if (dropdown51park2 === 'Picnicker') {
      // Set filter criteria for Option 3
      filterCriteria = {
        POITYPE: ['Picnic Area'], // Example combination of POITYPE values for Option 3
      };
    } else if (dropdown51park2 === 'Comfort') {
      // Set filter criteria for Option 3
      filterCriteria = {
        POITYPE: ['Food Service', 'Lodging', 'Lodge'], // Example combination of POITYPE values for Option 3
      };
    } else if (dropdown51park2 === 'Backcountry') {
      // Set filter criteria for Option 3
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
        ], // Example combination of POITYPE values for Option 3
      };
    } else {
      return; // Invalid dropdown value
    }
  
    // Filter points of interest based on the filter criteria
    const filteredPointspark2 = POIsGC.features.filter(function (feature) {
      const poiTypepark2 = feature.properties.POITYPE;
      return filterCriteria.POITYPE.includes(poiTypepark2);
    });
  
    // Generate filtered GeoJSON
    const filteredGeoJSONpark2 = {
      type: 'FeatureCollection',
      features: filteredPointspark2,
    };
  
  // Update the filteredGeoJSON features with the appropriate icon image names
  filteredGeoJSONpark2.features.forEach(function (feature) {
    const poiTypepark2 = feature.properties.POITYPE;
    feature.properties.iconImage = iconMapping[poiTypepark2];
    feature.properties = { ...feature.properties };
  });
  
  // Create a cluster source for the filtered points
  map.addSource('clustered-markers-filtered-park2', {
    type: 'geojson',
    data: filteredGeoJSONpark2, // Use the filtered GeoJSON data
    cluster: true,
    clusterRadius: 20 // Adjust the cluster radius as desired
  });
  
  map.on('load', function() {
    // Create a layer for the cluster markers
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
  
  // Create a layer for the individual markers
  map.addLayer({
    id: 'individual-markers-filtered-park2',
    type: 'symbol',
    source: 'clustered-markers-filtered-park2',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': '{icon}', // Use the icon mapping for the marker icons
      'icon-size': 1 // Adjust the icon size as desired
    },
    paint: {}
  });
  
  // Define an empty array to store the filtered markers
  var markersFilteredpark2 = [];
  
  // Iterate through each filtered point
  filteredGeoJSONpark2.features.forEach(function (point, index) {
    var poiTypepark2 = point.properties.POITYPE;
  
    // Check if the poi type has a corresponding icon URL
    if (iconMapping.hasOwnProperty(poiTypepark2)) {
      // Remove the existing image if it exists
      if (map.hasImage('marker-filtered-park2-' + index)) {
        map.removeImage('marker-filtered-park2-' + index);
      }
  
      // Create a marker object
      var marker = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point.geometry.coordinates
        },
        properties: {
          icon: 'marker-filtered-park2-' + index // Use the index as the icon name
        }
      };
      Object.assign(marker.properties, point.properties);
  
      // Add the marker to the valid markers array
      markersFilteredpark2.push(marker);
  
      // Add the image as an icon to the map
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
  
  // Update the data of the cluster source for the filtered points
  map.getSource('clustered-markers-filtered-park2').setData({
    type: 'FeatureCollection',
    features: markersFilteredpark2
  });
  
  
  
      console.log('Number of Features Filtered (poi layer):', filteredPointspark2.length);
    
      const predefinedPOITypespark2 = ['Parking Lot', 'Post Office', 'Ranger Station', 'Potable Water','Restroom', 'Trailhead', 'Entrance Station', 'Barn', 'Building', 'Cemetery', 'Chapel', 'Fire Station', 'First Aid Station', 'Gas Station', 'Headquarters', 'Lake', 'Potable Water', 'Shelter', 'Telephone', 'Tower'];
      // Filter the predefined POI types from the entire dataset
      const predefinedFeaturespark2 = POIs.features.filter((feature) => {
        const poiTypepark2 = feature.properties.POITYPE;
      
        // Check if the POI type is in the predefined types array
        return predefinedPOITypespark2.includes(poiTypepark2);
      });
      predefinedGeoJSONpark2.features = predefinedFeaturespark2;
      
      // Add the predefined POIs as a new source and layer on the map
      map.addSource('predefined-poi-park2', {
        type: 'geojson',
        data: predefinedGeoJSONpark2, 
      });
  // Update the filteredGeoJSON features with the appropriate icon image names
  predefinedGeoJSONpark2.features.forEach(function (feature) {
    const poiTypepark2 = feature.properties.POITYPE;
    feature.properties.iconImage = iconMapping[poiTypepark2];
    feature.properties = { ...feature.properties };
  
  });
  
  // Create a cluster source
  map.addSource('clustered-markers-park2', {
    type: 'geojson',
    data: predefinedGeoJSONpark2,
    cluster: true,
    clusterRadius: 20 // Adjust the cluster radius as desired
  });
  
  map.on('load', function() {
    // Create a layer for the cluster markers
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
  
  // Create a layer for the individual markers
  map.addLayer({
    id: 'individual-markers-park2',
    type: 'symbol',
    source: 'clustered-markers-park2',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': '{icon}', // Use the icon mapping for the marker icons
      'icon-size': 1 // Adjust the icon size as desired
    },
    paint: {}
  });
  // Define an empty array to store the filtered markers
  var markerspark2 = [];
  // Iterate through each predefined point
  predefinedGeoJSONpark2.features.forEach(function (point, index) {
    var poiTypepark2 = point.properties.POITYPE;
  
    // Check if the poi type has a corresponding icon URL
    if (iconMapping.hasOwnProperty(poiTypepark2)) {
      // Remove the existing image if it exists
      if (map.hasImage('marker-park2-' + index)) {
        map.removeImage('marker-park2-' + index);
      }
  
      // Create a marker object
      var marker = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point.geometry.coordinates
        },
        properties: {
          icon: 'marker-park2-' + index // Use the index as the icon name
        }
      };
      Object.assign(marker.properties, point.properties);
  
      // Add the marker to the valid markers array
      markerspark2.push(marker);
  
      // Add the image as an icon to the map
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
  
  // Update the data of the cluster source
  map.getSource('clustered-markers-park2').setData({
    type: 'FeatureCollection',
    features: markerspark2
  });
  addEntranceLayerpark2();
  }
  
  
  
  
  function Predefined_Mapspark2(dropdown51park2) {
    let maxValue;
    let maxValueElev;
    let maxCategory;
    let maxEstimated;
  
    // Set the max value based on the slider value
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
      return; // Invalid slider value
    }
  
    // Filter trails by attribute values (Miles and Elev_gain)
    const filteredFeaturesUpdatedpark2 = trailsGC.features.filter(function (feature) {
      console.log('Feature:', feature);
  
      // Check if the feature has the 'Miles' property
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
  
    // Create a GeoJSON object with the updated filtered features
    const filteredGeoJSONpark2 = turf.featureCollection(filteredFeaturesUpdatedpark2);
    console.log('Filtered GeoJSON:', filteredGeoJSONpark2);
  
    // Clear the 'filtered' layer if it exists
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
  
    // Add the updated filtered features as a new source and layer
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
  
    // Add labels to the 'predefined-poi' layer with a halo effect
    map.addLayer({
      id: 'filtered-labels-park2',
      type: 'symbol',
      source: 'filtered-park2',
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
    addEntranceLayer();
  
  }
  
  
   
  // Function to add the 'entrance' source and layers
  function addEntranceLayerpark2() {
    if (!map.getSource('entrancepark2')) {
      map.addSource('entrancepark2', {
        type: 'geojson',
        data: entranceStationsGC // Use the fetched entrance station data
      });
  
      // Add the 'cluster-markers' layer for entrance stations
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
  
      // Add the 'individual-markers' layer for entrance stations
      map.addLayer({
        id: 'individual-markers-park2',
        type: 'symbol',
        source: 'clustered-entrance-park2',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': '{icon}', // Use the icon mapping for the marker icons
          'icon-size': 1 // Adjust the icon size as desired
        },
        paint: {}
      });
    }
  }