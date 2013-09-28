var actionsWidth = 150;
var statusCodetraceWidth = 370;

function hideEntireActionsPanel() {
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	
	//and the others
	$('#sample1').click(function() {
		$('#kruskals-err').html("");
	});
	
	$('#kruskals').click(function() {
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