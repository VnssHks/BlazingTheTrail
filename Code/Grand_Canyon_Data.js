fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/trails_GC.geojson')
  .then(response => response.json())
  .then(data => {
    trailsGC = data; // Store the fetched trails data in the variable

    // Check if the 'trails' source already exists in the map
    if (map.getSource('trailsGC')) {
      // If the source exists, remove it from the map
      map.removeSource('trailsGC');
    }

    // Add the 'trails' source to the map
    map.addSource('trailsGC', {
      type: 'geojson',
      data: trailsGC // Use the fetched trails data
    });

    // Check if the 'trails' layer already exists in the map
    if (map.getLayer('trailsGC')) {
      // If the layer exists, remove it from the map
      map.removeLayer('trailsGC');
    }

    // Add the 'trails' layer to the map
    map.addLayer({
      id: 'trailsGC',
      type: 'line',
      source: 'trailsGC',
      paint: {
        'line-color': '#A0766E',
        'line-width': 1
      } ,   

    });
    map.moveLayer('trailsGC','cluster-markers-entranceGC');
    map.moveLayer('trailsGC','individual-markers-entranceGC');
  })
  .catch(error => {
    console.error('Error fetching trailGC data:', error);
  });

  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/Canyon_POI.geojson')
  .then(response => response.json())
  .then(data => {
    POIsGC = data; // Store the fetched trails data in the variable
    
    // Check if the 'trails' source already exists in the map
    if (map.getSource('POIsGC')) {
      // If the source exists, remove it from the map
      map.removeSource('POIsGC');
    }

    // Add the 'trails' source to the map
    map.addSource('POIsGC', {
      type: 'geojson',
      data: POIsGC // Use the fetched trails data
    });

    // Check if the 'trails' layer already exists in the map
    if (map.getLayer('POIsGC')) {
      // If the layer exists, remove it from the map
      map.removeLayer('POIsGC');
    }

    map.addLayer({
      id: 'POIsGC',
      type: 'circle', // Change the type to 'circle' for a point layer
      source: 'POIsGC',
      paint: {
        'circle-color': 'black', // Set the point color
        'circle-radius': 2, // Set the point radius
      }
    });
  })
  .catch(error => {
    console.error('Error fetching POIsGC data:', error);
  });



  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/canyon_roads.geojson')
  .then(response => response.json())
  .then(data => {
    RoadsGC = data; // Store the fetched trails data in the variable

    // Check if the 'trails' source already exists in the map
    if (map.getSource('RoadsGC')) {
      // If the source exists, remove it from the map
      map.removeSource('RoadsGC');
    }

    // Add the 'trails' source to the map
    map.addSource('RoadsGC', {
      type: 'geojson',
      data: RoadsGC // Use the fetched trails data
    });

    // Check if the 'trails' layer already exists in the map
    if (map.getLayer('RoadsGC')) {
      // If the layer exists, remove it from the map
      map.removeLayer('RoadsGC');
    }

    map.addLayer({
      id: 'RoadsGC',
      type: 'line', // Change the type to 'circle' for a point layer
      source: 'RoadsGC',
      paint: {
        'line-color': '#000000',
        'line-width': 0.5,
      }
    });
  })
  .catch(error => {
    console.error('Error fetching RoadsGC data:', error);
  });

fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/canyon_Boundary.geojson')
  .then(response => response.json())
  .then(dataGC => {
    // Check if the 'boundary' source already exists in the map
    if (map.getSource('boundaryGC')) {
      // If the source exists, remove it from the map
      map.removeSource('boundaryGC');
    }

    // Add the 'boundary' source to the map
    map.addSource('boundaryGC', {
      type: 'geojson',
      data: dataGC
    });

    // Check if the 'boundary' layer already exists in the map
    if (map.getLayer('boundaryGC')) {
      // If the layer exists, remove it from the map
      map.removeLayer('boundaryGC');
    }

    // Add the 'boundary' layer to the map
    map.addLayer({
      id: 'boundaryGC',
      type: 'line',
      source: 'boundaryGC',
      paint: {
        'line-color': '#000000',
        'line-width': 1.5
      }
    });
    map.moveLayer('boundaryGC', 'cluster-markers-entranceGC');

  })
  .catch(error => {
    console.error('Error fetching boundaryGC data:', error);
  });

  // Fetch entrance station data from URL
  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/entrance_station_canyon.geojson')
  .then(response => response.json())
  .then(entranceDataGC => {
    // Store the fetched entrance station data in the variable
    const entranceStationsGC = entranceDataGC;
  
    // Check if the 'entrance' source already exists in the map
    if (map.getSource('entranceGC')) {
      // If the source exists, remove it from the map
      map.removeSource('entranceGC');
    }
  
    // Add the 'entrance' source to the map
    map.addSource('entranceGC', {
      type: 'geojson',
      data: entranceStationsGC // Use the fetched entrance station data
    });
  
    // Check if the 'cluster-markers' layer already exists in the map
    if (map.getLayer('cluster-markersGC')) {
      // If the layer exists, remove it from the map
      map.removeLayer('cluster-markersGC');
    }
  
    // Create a cluster source for the entrance stations
    map.addSource('clustered-entranceGC', {
      type: 'geojson',
      data: entranceStationsGC,
    });
  
    // Add the 'cluster-markers' layer for entrance stations
    map.addLayer({
      id: 'cluster-markers-entranceGC', // Give it a unique ID
      type: 'symbol',
      source: 'clustered-entranceGC',
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
      id: 'individual-markers-entranceGC', // Give it a unique ID
      type: 'symbol',
      source: 'clustered-entranceGC',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{icon}', // Use the icon mapping for the marker icons
        'icon-size': 1, // Adjust the icon size as desired
      },
      paint: {}
    });

    map.moveLayer('trailsGC','boundaryGC', 'cluster-markers-entranceGC');

    // Define an empty array to store the filtered markers
    var entranceMarkers = [];
  
    // Iterate through each entrance station
    entranceStationsGC.features.forEach(function (entranceStation, index) {
      var entranceType = entranceStation.properties.POITYPE;
  
      // Check if the entrance type has a corresponding icon URL
      if (iconMapping.hasOwnProperty(entranceType)) {
        // Remove the existing image if it exists
        if (map.hasImage('entrance-marker-' + index)) {
          map.removeImage('entrance-marker-' + index);
        }
  
        // Create a marker object
        var entranceMarker = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: entranceStation.geometry.coordinates
          },
          properties: {
            icon: 'entrance-marker-' + index // Use the index as the icon name
          }
        };
        Object.assign(entranceMarker.properties, entranceStation.properties);
  
        // Add the marker to the valid markers array
        entranceMarkers.push(entranceMarker);
  
        // Add the image as an icon to the map
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
  
    // Update the data of the cluster source
    map.getSource('clustered-entranceGC').setData({
      type: 'FeatureCollection',
      features: entranceMarkers
    });
  })
  .catch(error => {
    console.error('Error fetching entrance station GC data:', error);
  });


  // Define center and zoom for the two national parks
  const park1Center = [-110.629578, 44.480121]; // Replace with the coordinates of the first park
  const park1Zoom = 8; // Replace with the desired zoom level for the first park
  
  const park2Center = [-112.139072, 36.098145]; // Replace with the coordinates of the second park
  const park2Zoom = 8; // Replace with the desired zoom level for the second park
const park1Filters = document.getElementById('park1filters');
const park2Filters = document.getElementById('park2filters');
const currentCenter = map.getCenter();
const diffToPark1 = Math.abs(currentCenter.lat - park1Center[1]);
const diffToPark2 = Math.abs(currentCenter.lat - park2Center[1]);


const isFirstParkDisplayed = diffToPark1 < diffToPark2;
// Function to toggle visibility of filtering controls based on displayed park
function toggleFilterControls(isFirstParkDisplayed) {
  console.log('isFirstParkDisplayed:', isFirstParkDisplayed);

  if (isFirstParkDisplayed) {
    park1Filters.style.display = 'block';
    park2Filters.style.display = 'none';
    park1pre.style.display = 'block';
    park2pre.style.display = 'none';
    togglealertsbutton.style.display = 'block';
    togglealertsbuttoncanyon.style.display = 'none';
  } else {
    park1Filters.style.display = 'none';
    park2Filters.style.display = 'block';
    park1pre.style.display = 'none';
    park2pre.style.display = 'block';
    togglealertsbutton.style.display = 'none';
    togglealertsbuttoncanyon.style.display = 'block';
  }
}
// Set the default filtering window to Park 1 when the site loads
window.addEventListener('load', function() {
    // Call toggleFilterContainers with isFirstParkDisplayed as true for Park 1
    toggleFilterControls(true);
  
  });

// Get the "Switch" button element
const switchButton = document.getElementById('switch');

// Add an event listener to the button
switchButton.addEventListener('click', function() {
  // Get the current map center and zoom
  const currentCenter = map.getCenter();
  const currentZoom = map.getZoom();

  // Calculate the difference in latitude between the current center and each park's center
  const diffToPark1 = Math.abs(currentCenter.lat - park1Center[1]);
  const diffToPark2 = Math.abs(currentCenter.lat - park2Center[1]);
  const isFirstParkDisplayed = diffToPark2 < diffToPark1;
  console.log('Switch button clicked, isFirstParkDisplayed:', isFirstParkDisplayed);


  // Decide which park to focus on based on the latitude difference
  let targetCenter, targetZoom;
  if (diffToPark2 < diffToPark1) {
    targetCenter = park1Center;
    targetZoom = park1Zoom;
  } else {
    targetCenter = park2Center;
    targetZoom = park2Zoom;
  }

  // Set the map's center and zoom to focus on the chosen park
  map.flyTo({
    center: targetCenter,
    zoom: targetZoom,
    essential: true
  });
  toggleFilterControls(isFirstParkDisplayed);
});
