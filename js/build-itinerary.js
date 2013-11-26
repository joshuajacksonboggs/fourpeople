/** Javascript functionality for the itinerary builder page */
$(function() {
var baseURL = "https://api.foursquare.com/v2/venues/search?client_id=5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514&client_secret=RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";

// Gathers parameters and sends search request to Foursquare API
$("#searchForVenues").click(function() {
	//TODO: error check on entries
	var query = $("#query").val();
	var location = $("#location").val();
	
	var urlToSend = baseURL + "&query=" + encodeURIComponent(query) + "&near=" + encodeURIComponent(location);
	console.log("Sending request: " + urlToSend);
	
	// send request
	$.ajax({
	  url: urlToSend
	}).done(function( data ) {
		// display results to user
		showResults(data.response.venues);
		
		// log response for debugging
		if ( console && console.log ) {
		  console.log("Response: " + data);
		}
	});
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
	$("#search-results").html(" ");
	for(var i = 0; i < venues.length; i++) {
		var name = venues[i]["name"];
		$("#search-results").append(buildResultPanel(name, name));
	}
}
function buildResultPanel(panelTitle, panelContent) {
	var html = 
		'<div class="panel panel-primary">' +
			'<div class="panel-heading">' + 
              '<h3 class="panel-title">' + panelTitle + '</h3>' +
            '</div>' +
            '<div class="panel-body">' +
              panelContent +
            '</div>' +
          '</div>';
	return html;
}

});