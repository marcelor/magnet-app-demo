var markers = []

function initializeMaps(map, current_location, bounds) {
  var api_root_url = 'https://magnet-backend.herokuapp.com/api/v1';
  //var api_root_url = 'http://localhost:8100/api/v1';
  var facebook_id = '1122334455667788';
  var latitude = current_location.lat();
  var longitude = current_location.lng();

  deleteMarkers(markers);

  $.get(api_root_url + '/venues/near/?facebook_id=' + facebook_id + '&latitude='+ latitude + '&longitude=' + longitude,
    function(venues) {

      var nearest_point = null;

      venues.forEach(function(venue) {
          if (venue.nearest == true) {
            nearest_point = venue;
          }

          var pos = new google.maps.LatLng(venue.latitude, venue.longitude);

          generateIcon(venue.checkin_counter, function(src) {
            marker = new google.maps.Marker({
              position: pos,
              map: map,
              icon: src
            });

            markers.push(marker);

            google.maps.event.addListener(marker, 'click', function() {
                var checkin_data = {
                  'user': 58,
                  'venue': venue.id
                }
                $.post(api_root_url + '/checkins', checkin_data, function(data) {
                  alert('Welcome to ' + venue.name);
                  //location.reload();
                }, "json");
            })
          });
      });

      if (bounds && nearest_point != null) {
        nearest_point = new google.maps.LatLng(nearest_point.latitude, nearest_point.longitude);

        bounds.extend(nearest_point);

        map.fitBounds(bounds);
      };
  })
}

var generateIconCache = {};

function generateIcon(number, callback) {
  if (generateIconCache[number] !== undefined) {
    callback(generateIconCache[number]);
  }

  // var fontSize = 16,
  //   imageWidth = imageHeight = 35;

  // if (number >= 1000) {
  //   fontSize = 10;
  //   imageWidth = imageHeight = 55;
  // } else if (number < 1000 && number > 100) {
  //   fontSize = 14;
  //   imageWidth = imageHeight = 45;
  // }

  var fontSize = 16, imageWidth = imageHeight = number * 2;

  var svg = d3.select(document.createElement('div')).append('svg')
    .attr('viewBox', '0 0 54.4 54.4')
    .append('g')

  var circles = svg.append('circle')
    .style("stroke", "#D9B857")
    .style("stroke-width", 0.5)
    .style('fill', '#202020')
    .attr('cx', '27.2')
    .attr('cy', '27.2')
    .attr('r', '21.2')
    .style('opacity', 0.9);
    //.on("mouseclick", function() { })

  // var path = svg.append('path')
  //   .attr('d', 'M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z')
  //   .attr('fill', '#D9B857')
  //   .attr('stroke-width', 1)
  //   .attr('opacity', 0.9);

  // var path = svg.append('path')
  //   .attr('d', 'M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z')
  //   .attr('fill', '#D9B857')
  //   .attr('stroke-width', 1)
  //   .attr('opacity', 0.9);

  var text = svg.append('text')
    .attr('dx', 27)
    .attr('dy', 32)
    .attr('text-anchor', 'middle')
    .attr('style', 'font-size:' + fontSize + 'px; fill: #D9B857; font-family: Arial, Verdana; font-weight: bold')
    .text(number);

  var svgNode = svg.node().parentNode.cloneNode(true),
    image = new Image();

  d3.select(svgNode).select('clippath').remove();

  var xmlSource = (new XMLSerializer()).serializeToString(svgNode);

  image.onload = (function(imageWidth, imageHeight) {
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      dataURL;

    d3.select(canvas)
      .attr('width', imageWidth)
      .attr('height', imageHeight);

    context.drawImage(image, 0, 0, imageWidth, imageHeight);

    dataURL = canvas.toDataURL();
    generateIconCache[number] = dataURL;

    callback(dataURL);
  }).bind(this, imageWidth, imageHeight);

  image.src = 'data:image/svg+xml;base64,' + btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

//initializeMaps();
