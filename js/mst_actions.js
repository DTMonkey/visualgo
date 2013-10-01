var actionsWidth = 150;
var statusCodetraceWidth = 430;

var isSamplesOpen = false;
var isPrimsOpen = false;

function openSamples() {
	if(!isSamplesOpen) {
		$('#samples-submenu').animate({
			width: "+="+320
		}, 250);
	}
	isSamplesOpen = true;
}
function closeSamples() {
	if(true) {
		$('#samples-err').html("");
		$('#samples-submenu').animate({
			width: "-="+320
		}, 250);
		isSamplesOpen = false;
	}
}

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
	closeSamples();
	closePrims();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#samples').click(function() {
		closePrims();
		$('#kruskals-err').html("");
		openSamples();
	})
	
	$('#prims').click(function() {
		closeSamples();
		$('#kruskals-err').html("");
		openPrims();
	});
	
	//and the others
	$('#kruskals').click(function() {
		closeSamples();
		closePrims();
	});
	
	//overwrite some viz.js stuff here
  	$('#samples-submenu').css('background-color','#eee');
	$('#samples-submenu').children().css('background-color', colourTheSecond);
	if(colourTheSecond == '#fec515' || colourTheSecond == '#a7d41e') {
		$('#samples-submenu').children().css('color', 'black');
	}
		
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