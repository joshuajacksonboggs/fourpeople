// Dummy London itinerary
var itinerary = 
{
	name: "London",
	id: 1234,
	itinerary: [
		{
			id: "4ace4417f964a5207bcf20e3",
			start: "10:30 AM",
			end: "12:00 PM",
			date: "July 02, 2013"
		},
		{
			id: "4abe4502f964a520558c20e3",
			start: "1:00 PM",
			end: "3:00 PM",
			date: "July 02, 2013"
		},
		{
			id: "4ac518edf964a520c1ac20e3",
			start: "3:30 PM",
			end: "4:15 PM"
		},
		{
			id: "4ac518cdf964a520f2a520e3",
			start: "5:00 PM",
			end: "6:30 PM",
			date: "July 02, 2013"
		},
		{
			id: "4bed4c1e6e8c20a1ae1f7061",
			start: "7:00 PM",
			end: "8:30 PM",
			date: "July 02, 2013"
		}

	]
};



var baseURL = "https://api.foursquare.com/v2/venues/";
var CLIENT_ID = "5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514";
var CLIENT_SECRET = "RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";

var formatVenueLookupURL = function(id) {
	var URL = baseURL + encodeURIComponent(id) + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
	return URL;
}

var lookup = function(venue) {
	var urlToSend = formatVenueLookupURL(venue.id);
	$.ajax({
		  url: urlToSend
		}).done(function(data) {
			venue.venue = data.response.venue;
			console.log(data.response.venue);
			displayVenue(venue);
	});
}

itinerary.itinerary.forEach(function(venue){
	// create and append tr element before lookup, async call might mess up order
	var row = $(document.createElement('tr')).attr("id", "tr-" + venue.id);
	//var expand = $(document.createElement('tr')).attr("id", "tr-expand-" + venue.id);

	$('tbody').append(row);
	lookup(venue);
});

$('h1#itinerary-title').text(itinerary.name);

var cloudMadeAPIKey = '7da9717aa6e646c2b4d6a6a1fbc94765';
var displayVenue = function(venue) {
	var category;
	venue.venue.categories.forEach(function(cat) {
		if (cat.primary) {
			category = cat;
		}
	});
	// Each venue is displayed as a single row in a table
	// Build the row and append to the table body
	// create icon
	var img = $(document.createElement('img')).attr("src", category.icon.prefix + "bg_88" + category.icon.suffix);
	var iconColumn = $(document.createElement('td')).addClass('icon').append(img);
	// venue 
	var name = $(document.createElement('h4')).addClass('list-group-item-heading').text(venue.venue.name);
	var rating = $(document.createElement('h3')).append($(document.createElement('span')).addClass('label').addClass('label-success').text(venue.venue.rating)).addClass('rating');
	var address = $(document.createElement('p')).addClass('list-group-item-text').text(venue.venue.location.address);
	var categoryLabel = $(document.createElement('p')).text(category.shortName);
	var venueInfo = $(document.createElement('div')).addClass('info').append(address).append(categoryLabel);


	// rating and venue info table
	rating = $(document.createElement('td')).append(rating);
	venueInfo = $(document.createElement('td')).append(venueInfo);
	var infoTable = $(document.createElement('table')).append($(document.createElement('tbody')).append($(document.createElement('tr')).append(rating).append(venueInfo)));
	
	var venueColumn = $(document.createElement('td')).addClass('venue').append(name).append(infoTable);//.append(venueInfo);//.append(categoryLabel);
	// time
	var timeColumn = $(document.createElement('td')).addClass('time').text(venue.start + " - " + venue.end);
	// map - create and append the element to DOM before Leaflet loads it
	var map = $(document.createElement('div')).addClass('mini-map').attr('id', 'map' + venue.venue.id);
	var mapEl = $(document.createElement('td')).append(map);

	// append the icon, venue info, time, and map columns to a row element
	var row = $(document.getElementById('tr-' + venue.id)).append(iconColumn).append(venueColumn).append(timeColumn).append(mapEl);



	var leafletMap = L.map('map' + venue.venue.id, {
		center: [venue.venue.location.lat, venue.venue.location.lng],
		zoom: 16,
		dragging: true
	});
	L.tileLayer('http://{s}.tile.cloudmade.com/' + cloudMadeAPIKey + '/997/256/{z}/{x}/{y}.png', {
	    maxZoom: 50
	}).addTo(leafletMap);
	L.marker([venue.venue.location.lat, venue.venue.location.lng]).addTo(leafletMap);

	// more details
}


