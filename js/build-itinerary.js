/** Javascript functionality for the itinerary builder page */
$(function() {
var baseURL = "https://api.foursquare.com/v2/venues/search?client_id=5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514&client_secret=RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";

// Gathers parameters and sends search request to Foursquare API
$("#searchForVenues").click(function() {
	//error checking first - must have venue name and geocode
	$("#error-holder").css("display","none	");
	var error = "";
	var query = $("#query").val();
	var location = $("#location").val();
	if(query == "")
		error += "Please give part of a venue name so we can search for you.<br>";
	if(location == "")
		error += "Please give an area within which to search.";
	//set error to hold either "" or new error(s)
	$("#error-holder").html(error);
	if(error != ""){
		$("#error-holder").css("display","block");
	}
	
	if(error == "") {
		var urlToSend = baseURL + "&query=" + encodeURIComponent(query) + "&near=" + encodeURIComponent(location);
		console.log("Sending request: " + urlToSend);
		
		// send request
		$.ajax({
		  url: urlToSend
		}).done(function( data ) {
			if(!data.response.venues[0]) {
				// display no-results error
				$("#search-results").html("Sorry, we couldn't find any results.");
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
	//TODO: handle no results
	$("#search-results").html(" ");
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
		var map = L.map(mapID).setView([51.505, -0.09], 13);
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			attribution: '',
			maxZoom: 18
		}).addTo(map);
		L.marker([51.5, -0.09]).addTo(map)
			.bindPopup('Pretty popup. <br> Easily customizable.');
	}
}

// Builds the panel for a single search result
function buildResultPanel(number, name, address, id) {
	var html = 
		'<div class="panel panel-primary">' +
			'<div class="panel-heading">' + 
              '<h3 class="panel-title">' + name + '</h3>' +
            '</div>' +
            '<div class="panel-body">' +
              '<div class="panel-text-info">' + address + '</div>' +
			  '<div class="panel-map" id="panel-map-' + number +'"></div>' +
			  '<div class="panel-add-button">Button here<br>id:' + id + '</div>' +
            '</div>' +
          '</div>';
	return html;
}

});