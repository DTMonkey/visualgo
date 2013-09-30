var actionsWidth = 150;
var statusCodetraceWidth = 410;

var isBellmanFordsOpen = false;
var isDijkstrasOpen = false;

function openBellmanFords() {
	if(!isBellmanFordsOpen) {
		$('#bellmanford-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#bellmanford-go').animate({
				width: "+="+34
			},100);
		});
	}
	isBellmanFordsOpen = true;
}
function closeBellmanFords() {
	if(true) {
		$('#bellmanford-err').html("");
		$('#bellmanford-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#bellmanford-input').animate({
				width: "-="+32
			}, 100);
		});
		isBellmanFordsOpen = false;
	}
}
function openDijkstras() {
	if(!isDijkstrasOpen) {
		$('#dijkstra-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#dijkstra-go').animate({
				width: "+="+34
			},100);
		});
	}
	isDijkstrasOpen = true;
}
function closeDijkstras() {
	if(true) {
		$('#dijkstra-err').html("");
		$('#dijkstra-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#dijkstra-input').animate({
				width: "-="+32
			}, 100);
		});
		isDijkstrasOpen = false;
	}
}

function hideEntireActionsPanel() {
	hideActionsPanel();
}

$( document ).ready(function() {
	
	$('#sample1').click(function() {
		closeBellmanFords();
		closeDijkstras();
		$('#sample1-err').html("");
		$('#bellmanford-err').html("");
		$('#dijkstra-err').html("");
	});
	
	$('#bellmanford').click(function() {
		$('#sample1-err').html("");
		$('#bellmanford-err').html("");
		$('#dijkstra-err').html("");
		openBellmanFords();
		closeDijkstras();
	});
	
	$('#dijkstra').click(function() {
		closeBellmanFords();
		openDijkstras();
		$('#sample1-err').html("");
		$('#bellmanford-err').html("");
		$('#dijkstra-err').html("");
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