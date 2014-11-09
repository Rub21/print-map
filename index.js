require('mapbox.js');
var $ = require('jquery');

document.location.hash = '';

// TODO
// 1. Allow user to pick from set of maps
// 2. Add bookmarks + search
// 3. Integate with print API

function app(maps, bookmarks, size, token) {
    L.mapbox.accessToken = token;

    var map = L.mapbox.map('map', maps[0], {zoomControl: false});

    $('.js-getimage').on('click', makeStatic);

    $('.js-rotate').on('click', function() {
        size.reverse();
        makeStatic();
    });

    map.on('moveend', function() {
        if (window.location.hash === '#show-image') {
            makeStatic();
        }
    });

    function makeStatic() {

        $('body').addClass('loading');
        window.setTimeout(function() {
            $('body').removeClass('loading');
        }, 500);

        var url = 'http://api.tiles.mapbox.com/v4/' +
            maps[0] + '/' +
            map.getCenter().lng + ',' +
            map.getCenter().lat + ',' +
            map.getZoom() + '/' +
            size.join('x') + '@2x.png?access_token=' +
            token;
        $('.js-map').attr('src', url);
    };
};

var token = 'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww';
app(['saman.2os3v7vi'],[],[480,600],token);

