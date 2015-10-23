// Sets the map on all markers in the array.
function setMapOnAll(map, markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markers) {
  console.log('clearMarkers: ' + markers.length);
  setMapOnAll(null, markers);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map, markers);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers(markers) {
  clearMarkers(markers);
  markers = [];
}
