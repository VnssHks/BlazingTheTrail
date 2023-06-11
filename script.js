mapboxgl.accessToken = 'pk.eyJ1IjoidmFuZXNzYWhlbmtlcyIsImEiOiJjbDQyZnI1czQwNGJiM21tbG1xOGU1cHUyIn0.90NG-Bfg_Q_tsxUd_UZCfA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vanessahenkes/cl4ehgpd4000114o38wx98v6y',
  center: [-110.629578, 44.480121],
  zoom: 8,
  minZoom: 8,
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Yellowstone_Trails.geojson')
  .then(response => response.json())
  .then(data => {
    map.addLayer({
      'id': 'trails',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': data
      },
      'paint': {
        'line-color': 'black',
        'line-width': 1
      }
    });
  });

  fetch('https://raw.githubusercontent.com/VnssHks/BlazingTheTrail/main/Yellowstone_Boundary.geojson')
  .then(response => response.json())
  .then(data => {
    map.addLayer({
      'id': 'boundary',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': data
      },
      'paint': {
        'line-color': 'dark blue',
        'line-width': 0.5       
      }
    });
  });

  function toggleFilter() {
    var filter = document.getElementById('toggleFilter');
    if (filter.style.display === 'none') {
      filter.style.display = 'block';
    } else {
      filter.style.display = 'none';
    }
  }
  function applyFilter() {

    var select = document.getElementById("dropdown");
    var value = select.value;
    var sliderValue = document.getElementById("slider").value; // Get the value of the slider
    var filter;
  
    if (value === "option1") {
      filter = ["all", ["<", ["get", "Shape_Length"], parseInt(sliderValue)]];
      map.setFilter("trails", filter);
      map.setLayoutProperty("trails", "visibility", "visible");
    } else {
      map.setLayoutProperty("trails", "visibility", "none");
    }
  if (value === "option2") {
    filter = ["all", ["<", ["get", "Shape_Length"], parseInt(sliderValue)]];
    map.setFilter("boundary", filter);
    map.setLayoutProperty("boundary", "visibility", "visible");
  }
  else {
    map.setLayoutProperty("boundary", "visibility", "none");
  }
  //var filterContainer = document.getElementById("filter-container");
 // filterContainer.toggleFilter.display = "none"; // Hide the filter container
}

function clearFilter() {
  var select = document.getElementById("dropdown");
  select.selectedIndex = 0;
  var filter = ["all"];
  map.setFilter("trails", filter);
  map.setLayoutProperty("trails", "visibility", "visible");
  map.setFilter("boundary", filter);
  map.setLayoutProperty("boundary", "visibility", "visible");
}
