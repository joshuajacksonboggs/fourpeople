/** Javascript functionality for the itinerary builder page */
$(function() {
var baseURL = "https://api.foursquare.com/v2/venues/search";
var CLIENT_ID = "5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514";
var CLIENT_SECRET = "RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";

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
		var urlToSend = baseURL + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
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

// TODO
// Add venue to itinerary when add button clicked 
// Note: jQuery .click doesn't pick up elements when added to the page after load,
// so using .on here
$(document).on('click', '.panel-add-button', function(){
	var venueID = $(event.target).children("span.hidden-venue-id").text();
	alert("Venue ID: " + venueID);
});

});