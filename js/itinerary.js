/** Javascript functionality for itinerary */

var baseURL = "https://api.foursquare.com/v2/venues/";
var CLIENT_ID = "5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514";
var CLIENT_SECRET = "RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";
var cloudMadeAPIKey = '7da9717aa6e646c2b4d6a6a1fbc94765';

//=============================================================================
//=============================================================================
// Viewing current itinerary
//=============================================================================
//=============================================================================

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

//=============================================================================
//=============================================================================
// Adding to current itinerary
//=============================================================================
//=============================================================================

// Hide adding venues div at first
$("#add-venues-content").hide();

var durLength = 400;
// When click "Add venues," show search sidebar
$("#show-add-venues").click(function() {
	$("#itinerary-content").animate({
       width: '50%'
    }, { duration: durLength, queue: false });
    $("#add-venues-content").show({
		effect: "slide",
		duration: durLength,
		queue: false,
		direction: "right"
	});
	$("#hide-add-venues").show();
	$("#show-add-venues").hide();
});

// When click "Done adding," hide search sidebar
$("#hide-add-venues").click(function() {
	$("#itinerary-content").animate({
       width: '100%'
    }, { duration: durLength, queue: false });
    $("#add-venues-content").hide({
		effect: "slide",
		duration: durLength,
		queue: false,
		direction: "right"
	});
	$("#show-add-venues").show();
	$("#hide-add-venues").hide();
});

// Gathers parameters and sends search request to Foursquare API
$("#searchForVenues").click(function() {
	//error checking first - must have venue name and geocode for search
	$("#error-holder").css("display","none");
	var error = "";
	var query = $("#query").val();
	var location = $("#location").val();
	if(query == "") {
		error += "Please give part of a venue name so we can search for you.<br>";
	}
	if(location == "") {
		error += "Please give an area within which to search.";
	}
	
	//set error to hold either "" or new error(s)
	$("#error-holder").html(error);
	if(error != ""){
		$("#error-holder").css("display","block");
	}
	
	// if no errors, send search request and parse results
	if(error == "") {
		var urlToSend = baseURL + "search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
		urlToSend += "&query=" + encodeURIComponent(query) + "&near=" + encodeURIComponent(location);
		console.log("Sending request: " + urlToSend);
		
		// display loading gif to user
		$("#loading-image").css("display", "block");
		$("#search-results").html(" ");
		
		// send request
		$.ajax({
		  url: urlToSend
		}).done(function( data ) {
			// hide loading gif
			$("#loading-image").css("display", "none");
			
			// parse response data
			if(!data.response.venues[0]) {
				// display no-results error
				$("#search-results").html("Sorry, we couldn't find any matching results.");
			} else {
				// display results to user
				showResults(data.response.venues);
			}
			
			// log response for debugging
			if ( console && console.log ) {
			  console.log(data);
			}
		});
	}
});

// Next two functions allow user to search by hitting ENTER
$("#query").keypress(function(e){
	if(e.which == 13) {
		$("#searchForVenues").click();
	}
});
$("#location").keypress(function(e){
	if(e.which == 13) {
		$("#searchForVenues").click();
	}
});

// Displays results for user
function showResults(venues) {
	for(var i = 0; i < venues.length; i++) {
		var name = venues[i].name;
		var address = "";
		if(venues[i].location.address) {
			address += venues[i].location.address;
		} else {
			address += "(No address provided)";
		}
		if(venues[i].location.crossStreet) {
			address += "<br>Cross Street: " + venues[i].location.crossStreet + "";
		}
		var id = venues[i].id;
		$("#search-results").append(buildResultPanel(i, name, address, id));
		
		var mapID = 'panel-map-' + i;
		var lat = venues[i].location.lat;
		var lng = venues[i].location.lng;
		var map = L.map(mapID).setView([lat, lng], 16);
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			attribution: '',
			maxZoom: 18
		}).addTo(map);
		L.marker([lat, lng]).addTo(map)
			.bindPopup('Pretty popup. <br> Easily customizable.');
	}
}

// Builds the panel for a single search result
function buildResultPanel(number, name, address, id) {
	var html = 
		'<div class="panel panel-default">' +
			'<div class="panel-heading">' + 
              '<h3 class="panel-title">' + name + '</h3>' +
            '</div>' +
            '<div class="panel-body">' +
              '<div class="panel-text-info">' + address + '</div>' +
			  '<div class="panel-map" id="panel-map-' + number +'"></div>' +
			  '<div class="panel-add-button btn btn-lg btn-primary">+<br>Add<br>'+
			  '<span class="hidden-venue-id">' + id + '</span></div>' +
            '</div>' +
          '</div>';
	return html;
}

// very similar to lookup function, but uses venueID directly
// TODO: have user select time and date instead of hard-coded
var lookupByID = function(venueID) {
	var urlToSend = formatVenueLookupURL(venueID);
	$.ajax({
		  url: urlToSend
		}).done(function(data) {
			var fullVenue = data.response.venue;
			console.log(fullVenue);
			
			itinerary.itinerary.push({
				id: venueID,
				start: "10:30 AM",
				end: "12:00 PM",
				date: "July 02, 2013",
				venue: fullVenue
			});
			var lastIndex = itinerary.itinerary.length-1;
			var venueToDisplay = itinerary.itinerary[lastIndex];
			displayVenue(venueToDisplay);
	});
}

// Add venue to itinerary when add button clicked 
// Note: jQuery .click doesn't pick up elements when added to the page after load,
// so using .on here
$(document).on('click', '.panel-add-button', function(){
	var venueID = $(event.target).children("span.hidden-venue-id").text();
	console.log("Venue ID: " + venueID);
	
	// create and append tr element before lookup, async call might mess up order
	var row = $(document.createElement('tr')).attr("id", "tr-" + venueID);
	$('tbody#venue-table-tbody').append(row);
	
	lookupByID(venueID);
});