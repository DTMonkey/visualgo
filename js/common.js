//surprise colour!
//Referenced to in  home.js and viz.js also
var colourArray = ["#52bc69", "#ed5a7d", "#2ebbd1", "#d9513c", "#fec515", "#4b65ba", "#ff8a27", "#a7d41e"];
					//green, pink, blue, red, yellow, indigo, orange, lime
var n = (Math.floor(Math.random()*colourArray.length));
var surpriseColour = colourArray[n];

$( document ).ready(function() {
	
	$('.colour').css("color", surpriseColour); //name
	$('h4').css("background-color", surpriseColour); //about, contact us etc. button background
	
	//overlays stuff
	$('#trigger-about').click(function(){
		$('#dark-overlay').fadeIn(function(){
			$('#about').fadeIn();
		});
	});
	$('#trigger-team').click(function(){
		$('#dark-overlay').fadeIn(function(){
			$('#team').fadeIn();
		});
	});
	$('#trigger-terms').click(function(){
		$('#dark-overlay').fadeIn(function(){
			$('#termsofuse').fadeIn();
		});
	});
	
	$('.close-overlay').click(function() {
		$('.overlays').fadeOut(function(){
			$('#dark-overlay').fadeOut();
		});
	});
	
	//facebook login stuff
	$('#fb-login').hide();
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '192228707604746', // App ID
			channelUrl : '//www.rosemarietan.com/fyp/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
	
		// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
		// for any authentication related change, such as login, logout or session refresh. This means that
		// whenever someone who was previously logged out tries to log in again, the correct case below 
		// will be handled. 
		FB.Event.subscribe('auth.authResponseChange', function(response) {
		// Here we specify what we do with the response anytime this event occurs. 
			if (response.status === 'connected') {
				FB.api('/me', function(resp) {
					$('#fb-login').show();
					$('#fb-login').html(resp.name);
					$('#fb-login').attr('href', resp.link);
					$('#trick').hide();
				});
			} else if (response.status === 'not_authorized') {
				FB.login();
			} else {
				FB.login();
			}
		});
	};
	
});