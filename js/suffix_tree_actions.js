var actionsWidth = 150;
var statusCodetraceWidth = 370;

var isBuildv1Open = false;
var isBuildv2Open = false;
var isInsertOpen = false;

function openBuildv1() {
	if(!isBuildv1Open){
		$('#buildv1-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#buildv1-go').animate({
				width: "+="+34
			});
		});
		isBuildv1Open = true;
	}
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#buildv1').click(function() {
		openBuildv1();
	});	
})