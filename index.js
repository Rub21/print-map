require('mapbox.js');
var $ = require('jquery');
var _ = require('underscore');
var areaSelect = require('./ext/leaflet-areaselect/src/leaflet-areaselect.js');

// Initialize map
L.mapbox.accessToken = 'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww';
var map = L.mapbox.map('map', 'saman.2os3v7vi');

var areaSelect = L.areaSelect({width:160, height:200, keepAspectRatio:true});
areaSelect.addTo(map);

// Get a callback when the bounds change
areaSelect.on("change", function() {
    var bounds = this.getBounds();

    // Assemble params for rendering big image
    var params = {
        zoom: map.getZoom(),
        scale: 8.3125, // 300 dpi
        bbox: [bounds.getSouthWest().lng,bounds.getSouthWest().lat,bounds.getNorthEast().lng,bounds.getNorthEast().lat],
        format: 'png',
        quality: 256
    }
    console.log(params);
});

// Maybe someday...
