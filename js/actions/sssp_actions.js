var actionsWidth = 150;
var statusCodetraceWidth = 410;

var isSamplesOpen = false;
var isBFSOpen = false;
var isBellmanFordsOpen = false;
var isDijkstrasOpen = false;

function openSamples() {
	if(!isSamplesOpen) {
		$('#samples-submenu').animate({
			width: "+="+550
		}, 350);
	}
	isSamplesOpen = true;
}
function closeSamples() {
	if(true) {
		$('#samples-err').html("");
		$('#samples-submenu').animate({
			width: "-="+550
		}, 350);
		isSamplesOpen = false;
	}
}

function openBFS() {
	if(!isBFSOpen) {
		$('#bfs-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#bfs-go').animate({
				width: "+="+34
			},100);
		});
	}
	isBFSOpen = true;
}
function closeBFS() {
	if(true) {
		$('#bfs-err').html("");
		$('#bfs-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#bfs-input').animate({
				width: "-="+32
			}, 100);
		});
		isBFSOpen = false;
	}
}
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
			$('#dijkstra-go1').animate({
				width: "+="+61
			},100, function(){
				$('#dijkstra-go2').css('border-left', '1px solid black');
				$('#dijkstra-go2').animate({
					width: "+="+64
				},100);
			});
		});
	}
	isDijkstrasOpen = true;
}
function closeDijkstras() {
	if(true) {
		$('#dijkstra-err').html("");
		$('#dijkstra-go2').animate({
			width: "-="+64
		}, 100, function() {
			$('#dijkstra-go2').css('border-left', 'none');
			$('#dijkstra-go1').animate({
				width: "-="+61
			}, 100, function() {
				$('#dijkstra-input').animate({
					width: "-="+32
				}, 100);
			});
		});
		isDijkstrasOpen = false;
	}
}

function hideEntireActionsPanel() {
	closeSamples();
	closeBFS();
	closeBellmanFords();
	closeDijkstras();
	hideActionsPanel();
}

$( document ).ready(function() {
	$('#sample').click(function() {
		openSamples();
		closeBFS();
		closeBellmanFords();
		closeDijkstras();
	});
	
	$('#bfs').click(function() {
		closeSamples();
		openBFS();
		closeBellmanFords();
		closeDijkstras();
	});

	$('#bellmanford').click(function() {
		closeSamples();
		closeBFS();
		openBellmanFords();
		closeDijkstras();
	});
	
	$('#dijkstra').click(function() {
		closeSamples();
		closeBFS();
		closeBellmanFords();
		openDijkstras();
	});
	
	//overwrite some viz.js stuff here
  	$('#samples-submenu').css('background-color','#eee');
	$('#samples-submenu').children().css('background-color', colourTheSecond);
	if(colourTheSecond == '#fec515' || colourTheSecond == '#a7d41e') {
		$('#samples-submenu').children().css('color', 'black');
	}
		
	//tutorial mode
	$('#sssp-tutorial-1 .tutorial-next').click(function() {
		showActionsPanel();
	});
	$('#sssp-tutorial-2 .tutorial-next').click(function() {
		hideEntireActionsPanel();
	});
	$('#sssp-tutorial-3 .tutorial-next').click(function() {
		showStatusPanel();
	});
	$('#sssp-tutorial-4 .tutorial-next').click(function() {
		hideStatusPanel();
		showCodetracePanel();
	});
	$('#sssp-tutorial-5 .tutorial-next').click(function() {
		hideCodetracePanel();
	});
});