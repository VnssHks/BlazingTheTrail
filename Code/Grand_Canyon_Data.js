//Below, the geojson data for Grand Canyon NP is loaded and styled from the Github Repository
fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/trails_GC.geojson')
  .then(response => response.json())
  .then(data => {
    trailsGC = data; 

    if (map.getSource('trailsGC')) {
      map.removeSource('trailsGC');
    }

    map.addSource('trailsGC', {
      type: 'geojson',
      data: trailsGC 
    });

    if (map.getLayer('trailsGC')) {
      map.removeLayer('trailsGC');
    }

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
    POIsGC = data; 
    
    if (map.getSource('POIsGC')) {
      map.removeSource('POIsGC');
    }

    map.addSource('POIsGC', {
      type: 'geojson',
      data: POIsGC
    });

    if (map.getLayer('POIsGC')) {
      map.removeLayer('POIsGC');
    }

    map.addLayer({
      id: 'POIsGC',
      type: 'circle', 
      source: 'POIsGC',
      paint: {
        'circle-color': 'black', 
        'circle-radius': 2, 
      }
    });
  })
  .catch(error => {
    console.error('Error fetching POIsGC data:', error);
  });



  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/canyon_roads.geojson')
  .then(response => response.json())
  .then(data => {
    RoadsGC = data; 

    if (map.getSource('RoadsGC')) {
      map.removeSource('RoadsGC');
    }

    map.addSource('RoadsGC', {
      type: 'geojson',
      data: RoadsGC
    });

    if (map.getLayer('RoadsGC')) {
      map.removeLayer('RoadsGC');
    }

    map.addLayer({
      id: 'RoadsGC',
      type: 'line', 
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
    if (map.getSource('boundaryGC')) {
      map.removeSource('boundaryGC');
    }

    map.addSource('boundaryGC', {
      type: 'geojson',
      data: dataGC
    });

    if (map.getLayer('boundaryGC')) {
      map.removeLayer('boundaryGC');
    }

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

  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Data/entrance_station_canyon.geojson')
  .then(response => response.json())
  .then(entranceDataGC => {
    const entranceStationsGC = entranceDataGC;
  
    if (map.getSource('entranceGC')) {
      map.removeSource('entranceGC');
    }
  
    map.addSource('entranceGC', {
      type: 'geojson',
      data: entranceStationsGC 
    });
  
    if (map.getLayer('cluster-markersGC')) {
      map.removeLayer('cluster-markersGC');
    }
  
    map.addSource('clustered-entranceGC', {
      type: 'geojson',
      data: entranceStationsGC,
    });
  
    map.addLayer({
      id: 'cluster-markers-entranceGC', 
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

    map.addLayer({
      id: 'individual-markers-entranceGC', 
      type: 'symbol',
      source: 'clustered-entranceGC',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{icon}', 
        'icon-size': 1, 
      },
      paint: {}
    });

    map.moveLayer('trailsGC','boundaryGC', 'cluster-markers-entranceGC');

    var entranceMarkers = [];
  
    entranceStationsGC.features.forEach(function (entranceStation, index) {
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
  
    map.getSource('clustered-entranceGC').setData({
      type: 'FeatureCollection',
      features: entranceMarkers
    });
  })
  .catch(error => {
    console.error('Error fetching entrance station GC data:', error);
  });


const park1Center = [-110.629578, 44.480121];
const park1Zoom = 8; 
const park2Center = [-112.139072, 36.098145]; 
const park2Zoom = 8; 
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
window.addEventListener('load', function() {
    toggleFilterControls(true);
  
  });

// Functionality for the 'switch' button
const switchButton = document.getElementById('switch');
switchButton.addEventListener('click', function() {
  const currentCenter = map.getCenter();
  const currentZoom = map.getZoom();

  const diffToPark1 = Math.abs(currentCenter.lat - park1Center[1]);
  const diffToPark2 = Math.abs(currentCenter.lat - park2Center[1]);
  const isFirstParkDisplayed = diffToPark2 < diffToPark1;
  console.log('Switch button clicked, isFirstParkDisplayed:', isFirstParkDisplayed);

  let targetCenter, targetZoom;
  if (diffToPark2 < diffToPark1) {
    targetCenter = park1Center;
    targetZoom = park1Zoom;
  } else {
    targetCenter = park2Center;
    targetZoom = park2Zoom;
  }

  map.flyTo({
    center: targetCenter,
    zoom: targetZoom,
    essential: true
  });
  toggleFilterControls(isFirstParkDisplayed);
});
