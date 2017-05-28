var locations = [{
    label: 'Acropolis of Athens',
    lat: 37.971545,
    lng: 23.725723
  },
  {
    label: 'Temple of Olympian Zeus',
    lat: 37.969300,
    lng: 23.733111
  }
];

function initMap() {
  var map;

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
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

  var infowindow = new google.maps.InfoWindow();
  // var infowindow = new google.maps.InfoWindow({
  //   content: '<h1>Zelia</h1>'
  //   // content: function () {
  //   //
  //   // }
  // });

  function onMarkerClick() {
    var marker = this;

    animateMarker(marker);

    infowindow.setContent(getWikipediaData(marker.title));
    // infowindow.setContent('<h3>' + marker.title + '</h3>');
    // console.log(marker);
    infowindow.open(map, marker);
  }
  // var playListURL = 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=India&prop=revisions&rvprop=content&callback=?';
  // http://en.wikipedia.org/w/api.php?format=json&action=query&titles=Acropolis of Athens&prop=revisions&rvprop=content
  function getWikipediaData(place) {
    var processedData;
    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      data: {
        action: 'parse',
        // action: 'query',
        // titles: place,
        page: place,
        // prop: 'revisions',
        prop: 'text',
        section: '0',
        // rvprop: 'content',
        // list: 'search',
        format: 'json'
      },
      dataType: 'jsonp',
      success: function (data) {
        processedData = processData(data);
      }
    });
    console.log(processedData);
    return processedData;
  }

  function processData(data) {
    var markup = data.parse.text["*"];
    var blurb = $('<div></div>').html(markup);

    // remove links as they will not work
    blurb.find('a').each(function () {
      $(this).replaceWith($(this).html());
    });

    // remove any references
    blurb.find('sup').remove();

    // remove cite error
    blurb.find('.mw-ext-cite-error').remove();
    // $('#article').html($(blurb).find('p'));

    console.log(data);
    console.log(blurb);
    // $.each(result.query.pages, function (i, item) {
    //   console.log(item.title);
    // });
    return $(blurb).find('p');

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
    // console.log(location.marker);
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
