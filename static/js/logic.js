
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(link).then(function (data) {
    function getColor(depth) {
        if (depth < 1) {
            return "#A3F600"
        }
        else if (depth < 5) {
            return "#DCF400"
        }
        else if (depth < 10) {
            return "#F7DB11"
        }
        else if (depth < 25) {
            return "#FDB72A"
        }
        else if (depth < 50) {
            return "#FCA35D"
        }
        else {
            return "#FF5F65"
        }
    }

    function getRadius(magnitude) {
        return (magnitude) * 5;
    }

    L.geoJson(data, {
        pointToLayer: 
        function (feature, latlng) {
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: getColor(feature.properties.mag), //"#00000",
                color: "#000",
                radius: getRadius(feature.properties.mag),
                weight: 1,
                opacity: 1,
                fillOpacity: 1,
            }
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(myMap);

});
