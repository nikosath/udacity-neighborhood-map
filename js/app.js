var locations = [{
    label: 'Home',
    lat: -31.563910,
    lng: 147.154312
  },
  {
    label: 'Work',
    lat: -33.718234,
    lng: 150.363181
  }
];
var map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: locations[0]
  });

  // var markers = locations.map(function (location, i) {
  //   return new google.maps.Marker({
  //     position: location,
  //     label: location.label[0],
  //     map: map
  //   });
  // });

  locations.forEach(function (loc) {
    loc.marker = new google.maps.Marker({
      position: loc,
      // label: loc.label[0],
      title: loc.label,
      icon: 'http://maps.google.com/mapfiles/marker' + loc.label[0] + '.png',
      map: map
    });
    loc.marker.addListener('click', onMarkerClick);
  });
  var infowindow = new google.maps.InfoWindow({
    content: '<h1>Zelia</h1>'
  });

  function onMarkerClick() {
    var marker = this;
    animateMarker(marker);
    infowindow.open(map, marker);
  }

  function animateMarker(marker) {
    // var self = this;
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 2000);
  }
}


// Overall viewmodel for this screen, along with initial state
function MyViewModel() {
  var self = this;
  // Editable data
  //self.filteredLocations = ko.observableArray(locations);
  self.locationFilter = ko.observable('');
  self.filteredLocations = ko.computed(function () {
    return locations.filter(function (loc) {
      var isMatch = loc.label.includes(self.locationFilter());
      if (loc.marker !== undefined) {
        loc.marker.setVisible(isMatch);
        // loc.marker.setMap(isMatch ? map : null);
      }
      return isMatch;
    });
  });

  self.onListItemClick = function (location) {
    console.log(location.marker);
    // location.marker.click();
    google.maps.event.trigger(location.marker, 'click', {});
    // console.log(123);
  };
  // var self = this;
  //
  // // Non-editable catalog data - would come from the server
  // self.availableMeals = [
  //     { mealName: "Standard (sandwich)", price: 0 },
  //     { mealName: "Premium (lobster)", price: 34.95 },
  //     { mealName: "Ultimate (whole zebra)", price: 290 }
  // ];
  //
  // // Editable data
  // self.seats = ko.observableArray([
  //     new SeatReservation("Steve", self.availableMeals[0]),
  //     new SeatReservation("Bert", self.availableMeals[0])
  // ]);
  //
  // // Operations
  // self.addSeat = function() {
  //     self.seats.push(new SeatReservation("", self.availableMeals[1]));
  // }
}

ko.applyBindings(new MyViewModel());
