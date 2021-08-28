//Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
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


// Create the colors and bucket for the Earthquakes
d3.json(link).then(function (data) {
    function getColor(depth) {
        if (depth < 10) {
            return "#A3F600"
        }
        else if (depth < 30) {
            return "#DCF400"
        }
        else if (depth < 50) {
            return "#F7DB11"
        }
        else if (depth < 70) {
            return "#FDB72A"
        }
        else if (depth < 90) {
            return "#FCA35D"
        }
        else {
            return "#FF5F65"
        }
    }

    function getRadius(magnitude) {
        return (magnitude) * 5;
    }

    // Get Fill color from Coordinates (hint from instuctions)
    L.geoJson(data, {
        pointToLayer: 
        function (feature, latlng) {
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: getColor(feature.geometry.coordinates[2]), //"#00000",
                color: "#000",
                radius: getRadius(feature.properties.mag),
                weight: 1,
                opacity: 1,
                fillOpacity: 1,
            }
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },

       // Add the pop-up for each earthquate and add to map 
        onEachFeature: function(feature, layer){
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

    // create the legend/html/css for the colors
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var bucket = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+']
      var colors = ['#A3F600', '#DCF400', '#F7DB11', '#FDB72A', '#FCA35D', '#FF5F65']

      for (let i = 0; i < bucket.length; i++) {
        div.innerHTML += "<p style='background: " + colors[i] + "'></p>" + bucket[i] + "<br>";
      }
  
      // Add min & max
    //   var legendInfo = "<h1>Median Income</h1>" +
    //     "<div class=\"labels\">" +
    //       "<div class=\"min\">" + bucket[0] + "</div>" +
    //       "<div class=\"max\">" + colors[colors.length - 1] + "</div>" +
    //     "</div>";
  
    //   div.innerHTML = legendInfo;
  
    //   limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //   });
  
    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    legend.addTo(myMap);

});
