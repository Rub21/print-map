require('mapbox.js');
var $ = require('jquery');
var _ = require('underscore');

document.location.hash = '';

// TODO
// 1. Allow user to prick from multiple sizes / make sizing smart
// 2. Add search
// 3. Integate with print API
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

        $('body').addClass('loading');
        window.setTimeout(function() {
            $('body').removeClass('loading');
        }, 500);

        var url = 'http://api.tiles.mapbox.com/v4/' +
            mapid + '/' +
            map.getCenter().lng + ',' +
            map.getCenter().lat + ',' +
            map.getZoom() + '/' +
            size.join('x') + '@2x.png?access_token=' +
            token;
        $('.js-map').attr('src', url);
    };

};

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

var id = urlParams.id;
var token = 'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww';

// 8 x 10  | 300pdi 2400 x 3000 | @ 150dpi 1200 x 1500
// 12 x 12 | 300pdi 3600 x 3600 | @ 150dpi 1800 x 1800
// 12 x 16 | 300pdi 3600 x 4800 | @ 150dpi 1800 x 2400
// sizes are in inches
var sizes = [[8,10],[12,12],[12,16]];

app(id,sizes,token);
