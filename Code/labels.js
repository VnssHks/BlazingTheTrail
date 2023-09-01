const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: true
});

function calculateMarkerSize(zoom) {
  const maxMarkerSize = 8; // Set your desired maximum marker size
  const calculatedSize = Math.pow(2, zoom) * 0.003; // Calculate marker size
  return Math.min(calculatedSize, maxMarkerSize); // Limit to the maximum size
}

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
    // Conditionally include the 'LENGTH' property for line layers
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

const pointLayers = ['individual-markers','individual-markers-canyon', 'individual-markers-filtered','individual-markers-filtered-canyon', 'cluster-markers','cluster-markers-canyon', 'cluster-markers-filtered', 'cluster-markers-filtered-canyon','POIs', 'POIsGC', 'individual-markers-filtered-park2'];
pointLayers.forEach(layer => {
  addPopupToLayer(layer, popup);
});

const lineLayers = ['trails', 'boundary', 'roads', 'filtered-lines', 'filtered-lines-canyon','trailsGC'];
lineLayers.forEach(layer => {
  addPopupToLayer(layer, popup);
});

// Update marker size on zoom change
map.on('zoom', () => {
  const currentZoom = map.getZoom();
  const newMarkerSize = calculateMarkerSize(currentZoom);

  // Update marker layer's layout properties with new size
  map.setPaintProperty('POIs', 'circle-radius', newMarkerSize);
  map.setPaintProperty('POIsGC', 'circle-radius', newMarkerSize);
});
