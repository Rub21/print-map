require('mapbox.js');
var $ = require('jquery');
var _ = require('underscore');
var areaSelect = require('./ext/leaflet-areaselect/src/leaflet-areaselect.js');

// Configure
document.location.hash = '';

var config = {
  token: 'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww',
  mapid: 'saman.2os3v7vi'
};

// Initialize map
L.mapbox.accessToken = config.token;
var map = L.mapbox.map('map', config.mapid, {zoomControl: false});
var areaSelect = L.areaSelect({width:480, height:600, keepAspectRatio:true});
areaSelect.addTo(map);

areaSelect.on('change', function() {
  var bounds = this.getBounds();

  $('.js-getimage').on('click', function() {
    var url = 'http://api.tiles.mapbox.com/v4/' + config.mapid + '/' + bounds.getCenter().lng + ',' + bounds.getCenter().lat + ',' + map.getZoom() + '/480x600.png?access_token=' + config.token
    $('.js-map').attr('src', url);
  });

});
