/** Javascript functionality for the itinerary builder page */
$(function() {
	$("#holder").html("jQuery ready");
	var urlToSend = "";
	$.ajax({
	  //url: "https://api.foursquare.com/v2/venues/4abf1d17f964a520d39020e3?client_id=5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514&client_secret=RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124",
	  url: "https://api.foursquare.com/v2/venues/search?client_id=5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514&client_secret=RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124&near=New%20York&query=MoMa",
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