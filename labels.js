const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true
  });
  
  const addPopupToLayer = (layer, popup) => {
    map.on('click', layer, (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [layer] });
  
      if (!features.length) {
        return;
      }
  
      const feature = features[0];
      const coordinates = e.lngLat;
      const description = feature.properties.MAPLABEL;
      const poiType = feature.properties.POITYPE || '';
  
      let popupContent = `<strong>${poiType}</strong><br>${description}`;
  
      // Conditionally include the 'LENGTH' property for line layers
      if (lineLayers.includes(layer)) {
        const length = feature.properties.Miles || '';
        popupContent += `<br>Length: ${length} miles`;
      }
  
      popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
    });
  };
    
  
  const pointLayers = ['individual-markers', 'individual-markers-filtered', 'cluster-markers', 'cluster-markers-filtered', 'POI'];
  pointLayers.forEach(layer => {
    
    addPopupToLayer(layer, popup);
  });
  
  const lineLayers = ['trails', 'boundary', 'roads', 'filtered-lines'];
  lineLayers.forEach(layer => {
    addPopupToLayer(layer, popup);
  });
  
  map.on('click', (e) => {
    if (!map.queryRenderedFeatures(e.point).length) {
      popup.remove();
    }
  });


