
$("#search-itinerary-by-id").click(function(){
	var idNum = parseInt($("#search-id-input").val());
	if(idNum != NaN) {
		window.location.href = "itinerary.html?id=" + idNum;
	}
	else {
		//TODO: display error
		alert("The id must be a number");
	}
});