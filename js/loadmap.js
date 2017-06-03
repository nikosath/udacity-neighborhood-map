var mapApiUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdMTqVzLOVsy-ipiPA3ZXJwwu4kOyq-mE&callback=initMap";
$.getScript(mapApiUrl)
  .fail(function () {
    window.alert("Map couldn't be loaded.");
    // console.log("map error");
  });
