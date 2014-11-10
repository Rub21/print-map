require('mapbox.js');
var $ = require('jquery');
var _ = require('underscore');

document.location.hash = '';

// TODO
// 1. Add search
// 2. Integate with print API
function app(mapid, sizes, token) {
    L.mapbox.accessToken = token;
    var map = L.mapbox.map('map', mapid, {infocontrol: true, zoomControl: false});

    function renderSizes(sizes) {
        var sizeTemplate = '<input <%= (obj.i === 0) ? "checked" : ""%> id="size-<%=obj.i%>" type="radio" name="sizes" class="js-size-toggle" width="<%=obj.size[0]%>" height="<%=obj.size[1]%>" />' +
                           '<label class="quiet button" for="size-<%=obj.i%>"><%=obj.size[0]%>" x <%=obj.size[1]%>"</label>';
        _.each(sizes, function(size, i) {
            $('.js-sizes').append(_.template(sizeTemplate, {size:size,i:i}));
        });
    }

    renderSizes(sizes);

    $('.js-getimage').on('click', makeStatic);
    $('.js-size-toggle').on('change', makeStatic);
    map.on('moveend', function() {
        if (window.location.hash === '#show-image') {
            makeStatic();
        }
    });

    function makeStatic() {
        var $selection = $('.js-size-toggle:checked');
        var size = [$selection.attr('height')*75,$selection.attr('width')*75];
        // Eventually, I'll want @4x form print, 2x for preview
        var resolution = 2;

        $('.js-map').parent().addClass('loading');
        $('.js-map').load(function() {
            $('.js-map').parent().removeClass('loading');
        });


        var url = 'http://api.tiles.mapbox.com/v4/' +
            mapid + '/' +
            map.getCenter().lng + ',' +
            map.getCenter().lat + ',' +
            map.getZoom() + '/' +
            size.join('x') + '@' +
            resolution + 'x.png?access_token=' +
            token;
        $('.js-map').attr('src', url);
        $('.js-buy').attr('data-cp-url',url);
    };

};

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

var id = urlParams.id;
var token = 'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww';

// CANVAS POP IS DUMB ABOUT RESOLUTION >_<
var sizes = [[10,13],[14,18]];

app(id,sizes,token);
