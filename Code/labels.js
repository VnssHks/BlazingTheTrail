//The following code makes sure all layers have popups on hover (/click for mobile users) with information about the features
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: true
});

//The size of the marker, depending on the zoom level is determined
function calculateMarkerSize(zoom) {
  const maxMarkerSize = 8; 
  const calculatedSize = Math.pow(2, zoom) * 0.003; 
  return Math.min(calculatedSize, maxMarkerSize); 
}

//Here the popups are add to the layers and filled with information
const addPopupToLayer = (layer, popup) => {
  map.on('mouseenter', layer, (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: [layer] });

    if (!features.length) {
      return;
    }

    const feature = features[0];
    const coordinates = e.lngLat;
    const description = feature.properties.POINAME || feature.properties.MAPLABEL ||'';
    const poiType = feature.properties.POITYPE || '';
    const POITYPE = feature.properties.poiType || '';

    let popupContent = `<strong>${poiType}${POITYPE}</strong><br>${description}`;
    console.log(feature.properties)
    if (lineLayers.includes(layer)) {
      const length = feature.properties.Miles || '';
      popupContent += `<br>Length: ${length} miles`;
      const metricLength = feature.properties.Km || feature.properties.KM || '';
      popupContent += `<br>Length: ${metricLength} kilometers`;
    }

    popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
  });

  map.on('mouseleave', layer, () => {
    popup.remove();
  });
};

//These are the layers to which popups are added
const pointLayers = ['individual-markers','individual-markers-canyon', 'individual-markers-filtered','individual-markers-filtered-canyon', 'cluster-markers','cluster-markers-canyon', 'cluster-markers-filtered', 'cluster-markers-filtered-canyon','POIs', 'POIsGC', 'individual-markers-filtered-park2'];
pointLayers.forEach(layer => {
  addPopupToLayer(layer, popup);
});

const lineLayers = ['trails', 'boundary', 'roads', 'filtered-lines', 'filtered-lines-canyon','trailsGC'];
lineLayers.forEach(layer => {
  addPopupToLayer(layer, popup);
});

//This code provides the POIs of both parks with the functionality to get bigger/smaller depending on the zoom layer, with a maximum size change to as to not have everything overlapping
map.on('zoom', () => {
  const currentZoom = map.getZoom();
  const newMarkerSize = calculateMarkerSize(currentZoom);

  map.setPaintProperty('POIs', 'circle-radius', newMarkerSize);
  map.setPaintProperty('POIsGC', 'circle-radius', newMarkerSize);
});
