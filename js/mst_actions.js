var actionsWidth = 150;
var statusCodetraceWidth = 430;

var isPrimsOpen = false;

function openPrims() {
	if(!isPrimsOpen) {
		$('#prims-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#prims-go').animate({
				width: "+="+34
			},100);
		});
	}
	isPrimsOpen = true;
}
function closePrims() {
	if(true) {
		$('#prims-err').html("");
		$('#prims-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#prims-input').animate({
				width: "-="+32
			}, 100);
		});
		isPrimsOpen = false;
	}
}

function hideEntireActionsPanel() {
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#prims').click(function() {
		$('#sample1-err').html("");
		$('#kruskals-err').html("");
		openPrims();
	});
	
	//and the others
	$('#sample1').click(function() {
		closePrims();
		$('#kruskals-err').html("");
	});
	
	$('#kruskals').click(function() {
		closePrims();
		$('#sample1-err').html("");
	});
		
	//tutorial mode
	$('#heap-tutorial-1 .tutorial-next').click(function() {
		showActionsPanel();
	});
	$('#heap-tutorial-2 .tutorial-next').click(function() {
		hideEntireActionsPanel();
	});
	$('#heap-tutorial-3 .tutorial-next').click(function() {
		showStatusPanel();
	});
	$('#heap-tutorial-4 .tutorial-next').click(function() {
		hideStatusPanel();
		showCodetracePanel();
	});
	$('#heap-tutorial-5 .tutorial-next').click(function() {
		hideCodetracePanel();
	});
});