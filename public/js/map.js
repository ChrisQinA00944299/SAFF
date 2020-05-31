const APIKEY = "adf68c474262738c411594f324f0d792b92077232dfa1ebda30cb108"
const RACKS_URL = "https://opendata.vancouver.ca/api/records/1.0/search?dataset=bike-racks"
var markers = [];
var markerCluster;
var layers = [];

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.248499, lng: -123.1},
    zoom: 12,
    mapTypeId: 'roadmap'
  });
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  markerCluster = new MarkerClusterer(map, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
 
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', async function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }


    // Clear out the old markers.
    if (markers.length > 0) {
      markers.forEach((marker) => {
        if (marker) {
          marker.setMap(null);
        }
      });
    }
    if (markerCluster) {
      markerCluster.clearMarkers();
    }
    markers = [];

    // Get the bike racks near current location
    const bikeRacks = await getBikeRacks();
    const lat = places[0].geometry.location.lat();
    const lng = places[0].geometry.location.lng();
    if (places[0]) {
      places = parseRadialData(lat, lng, map, 2, bikeRacks);
    }

    var bounds = new google.maps.LatLngBounds();
    if (!(places && places.length != 0)) {
      $('.location-heading').text("No matches found");
      console.log("There are no places");
      return;
    }
    
    places.forEach(place => {
      // Create a marker for each place.
      const marker = createMarker(place, map);
      markers.push(marker);
      markerCluster.addMarker(marker);
      map.panTo(marker.position);
      
      setTimeout(function(){map.setZoom(14)}, 350)
      

      // Create a div to hold the control.
var controlDiv = document.createElement('div');
controlDiv.style.backgroundColor = 'none';
controlDiv.style.borderRadius = '13px';
controlDiv.setAttribute("class","controlDiv");



// Set CSS for the control border
var controlUI = document.createElement('div');
controlUI.style.backgroundColor = '#484538';
// controlUI.style.border = '2px solid #484538';
controlUI.style.boxShadow = '5px 10px 5px rgba(0, 0, 0, 0.05)';

controlUI.style.top = '130px';
controlUI.style.right = '30px';

controlUI.style.borderRadius = '13px';
controlUI.style.cursor = 'pointer';
controlUI.style.marginBottom = '22px';
controlUI.style.textAlign = 'center';
controlUI.style.zIndex ='1000';
controlUI.style.position = 'absolute';
controlUI.style.height ='30px';
controlUI.style.width = '120px';
controlUI.title = 'Click to recenter the map';
controlUI.style.display = 'flex';
controlUI.style.flexDirection = 'row';
controlUI.style.alignItems = 'center';
controlUI.style.justifyContent = 'center';
controlDiv.appendChild(controlUI);

// Set CSS for the control interior
var controlText = document.createElement('div');
controlText.style.color = '#ffffff';
controlText.style.textDecoration = "none";
controlText.style.textalign = 'center';
controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
controlText.style.fontSize = '15px';
controlText.style.lineHeight = '38px';

controlText.innerHTML = '<a class="text-white">Explore</a>';
controlUI.appendChild(controlText);

document.body.appendChild(controlDiv);
    });
    


    /// add function here

    $(document).ready(function() {
          
          let emptyDiv = $("#location_container");
          var count = 1;

          emptyDiv.empty();
          for(var i = 0; i < 5 ; i++){

            let location_div = $("<div></div>");
            let location_rank = $("<div>"+(i+1)+"</div>")
            let location_rating = $("<div></div>")
          
            bike_data = " " + places[i].Street;
            console.log(places[i].Street);
             
            location_div.append(location_rank);
            location_rank.attr("class","location_ranking");
            location_div.append(bike_data);
            location_div.attr("class","location_info");
            location_div.append(location_rating);
            location_rating.attr("class","location_rating");

            switch(i){
              case 0:
                // location_rating.attr("class","location_rating_safe");
                location_rating.css("background-color","#d4eac8");
                break;
              case 1:
                location_rating.css("background-color","#d4eac8");
                break;
              case 2:
                location_rating.css("background-color","#FDF0CD");
                break;
              case 3:
                location_rating.css("background-color","#FAAF90");
                break;
              case 4:
                location_rating.css("background-color","#F26A6A");
                break;
              default:
                location_rating.css("background-color","#F26A6A");
                break;
            }

            emptyDiv.append(location_div);
          }
  });

  });
  
var heatMapData = [{
location: new google.maps.LatLng(37.782, -122.447), weight: 0.5}
];

$.getJSON("/data/latlongtheft.json", function(data) {
    $.each(data, function(index, d) {
      if (d.Freq > 5)
      heatMapData.push({location: new google.maps.LatLng(parseFloat(d.Latitude), parseFloat(d.Longtitude)), weight: parseFloat(d.Freq)});
    });
    console.log(heatMapData);
    var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData,
      radius: 24,
      opacity: 0.8,
      maxIntensity: 96,
      dissipating: true
    });
    heatmap.setMap(map);
});
  

  
 

  
}

const codeAddress = (geocoder, address) => {
  geocoder.geocode({ 'address': address }, (results, status) => {
      if (status == 'OK') {
        return results[0].geometry.location
      } else {
          alert('Geocode was not successful for the following reason: ' + status);
      }
  });
}

const getBikeRacks = async () => fetch("/data/bike_racks.json").then(res => res.json());
const getCrimeData = async () => fetch("/data/latlongtheft.json").then(res => res.json());


/*const setHeatmapLayer = async (map, lat, lng) => {
  const crimeData = await getCrimeData();

  const coords = crimeData
  .filter(record => record['Latitude'] && record['Longtitude'])
  .map(record => new google.maps.LatLng(parseFloat(record['Latitude']), parseFloat(record['Longitude'])));

  if (layers[0]) {
    layers[0].setMap(null);
    layers[0].pop();
  }
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: coords,
    opacity: 1,
    radius: 2
  });

  heatmap.setMap(map);
  layers.push(heatmap);*/


const parseRadialData = (lat, lng, map, multiplier, data) => {
  return data.filter((bikeRack) => {
    return Math
    .sqrt(Math.abs(bikeRack['Latitude'] - lat) ** 2 + Math.abs(bikeRack['Longitude'] - lng) ** 2) <= 0.002 * multiplier
  });
}

const createMarker = (place, map) => {
  const contentString = `<div class="content">
  <div id="siteNotice"></div>
  <h2 class="heading">${place['Street']}</h2>
  <div class="body-content">
  <h4 class="safety-score">Safety Score: 100%</h4>
  </div>
  </div>`;

  const infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(place['Latitude'], place['Longitude']),
    map: map,
    title: `${place['Street']}`
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
  return marker;
}
