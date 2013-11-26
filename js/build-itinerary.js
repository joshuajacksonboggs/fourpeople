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
	$.ajax({
	  url: urlToSend,
	  beforeSend: function() {
		// can put something here
	  }
	})
	  .done(function( data ) {
		if ( console && console.log ) {
		  //console.log("Response: " + JSON.stringify(data));
		  $("#holder").html("<pre><code>" + JSON.stringify(data, null, 2) + "</code></pre>");
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

});