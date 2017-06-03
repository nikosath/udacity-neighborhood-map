var locations = [{
    label: 'Acropolis of Athens',
    lat: 37.971545,
    lng: 23.725723
  },
  {
    label: 'Temple of Olympian Zeus, Athens',
    lat: 37.969300,
    lng: 23.733111
  },
  {
    label: 'Acropolis Museum',
    lat: 37.968444,
    lng: 23.728505
  },
  {
    label: 'Odeon of Herodes Atticus',
    lat: 37.970777,
    lng: 23.724512
  },
  {
    label: 'Roman Agora',
    lat: 37.974375,
    lng: 23.725522
  }
];

function initMap() {
  var map;

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: locations[0]
  });

  locations.forEach(function (loc) {
    loc.marker = new google.maps.Marker({
      position: loc,
      // label: loc.label[0],
      title: loc.label,
      icon: 'http://maps.google.com/mapfiles/marker' + loc.label[0] + '.png',
      map: map,
      wikiDesc: null
    });
    loc.marker.addListener('click', onMarkerClick);
  });

  var infowindow = new google.maps.InfoWindow({
    maxWidth: 300
  });

  function onMarkerClick() {
    var marker = this;

    animateMarker(marker);

    if (marker.wikiDesc === null) {
      infowindow.setContent('Loading...');
      fetchWikiDesc(marker);

    } else {
      infowindow.setContent(marker.wikiDesc);
    }
    infowindow.open(map, marker);
  }

  function fetchWikiDesc(marker) {
    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      data: {
        action: 'parse',
        page: marker.title,
        prop: 'text',
        section: '0',
        format: 'json'
      },
      dataType: 'jsonp',
      success: function (data) {
        marker.wikiDesc = processData(data);
        infowindow.setContent(marker.wikiDesc);
      },
      error: function () {
        infowindow.setContent('Unable to retrieve data.');
      }
    });
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

    return $(blurb).find('p').html();
  }

  function animateMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 1400);
  }

}

function MyViewModel() {
  var self = this;

  self.locationFilter = ko.observable('');
  self.filteredLocations = ko.computed(function () {
    return locations.filter(function (loc) {
      var isMatch = loc.label.toLowerCase().includes(self.locationFilter().toLowerCase());
      if (loc.marker !== undefined) {
        loc.marker.setVisible(isMatch);
      }
      return isMatch;
    });
  });

  self.onListItemClick = function (location) {
    google.maps.event.trigger(location.marker, 'click', {});
  };

  /* Set the width of the sidebar to 250px */
  self.openBar = function () {
    document.getElementById("mySidebar").style.width = "250px";
  };

  /* Set the width of the sidebar to 0 */
  self.closeBar = function () {
    document.getElementById("mySidebar").style.width = "0";
  };
}

ko.applyBindings(new MyViewModel());
