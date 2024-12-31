
maptilersdk.config.apiKey = mapKey;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: [77.1025, 28.7041], // starting position [lng, lat]
  zoom: 9, // starting zoom
});