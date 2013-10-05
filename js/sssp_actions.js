var actionsWidth = 150;
var statusCodetraceWidth = 410;

var isSamplesOpen = false;
var isBFSOpen = false;
var isBellmanFordsOpen = false;
var isDijkstrasOpen = false;

function openSamples() {
	if(!isSamplesOpen) {
		$('#sample1').animate({
			width: "+="+150
		}, 100);
		$('#sample2').animate({
			width: "+="+150
		}, 100);
		$('#sample3').animate({
			width: "+="+150
		}, 100);
		$('#sample4').animate({
			width: "+="+150
		}, 100);
/*
		, function() {
			$('#sample2').animate({
				width: "+="+150
			}, 100, function() {
				$('#sample3').animate({
					width: "+="+150
				}, 100,	function() {
					$('#sample4').animate({
						width: "+="+150
					}, 100);
				});
			});
		});*/
	}
	isSamplesOpen = true;
}
function closeSamples() {
	if(true) {
		$('#sample-err').html("");
		$('#sample1').animate({
			width: "-="+150
		}, 100); //, function() {
		$('#sample2').animate({
			width: "-="+150
		}, 100);
		$('#sample3').animate({
			width: "-="+150
		}, 100);
		$('#sample4').animate({
			width: "-="+150
		}, 100);
/*			$('#sample2').animate({
				width: "-="+150
			}, 100, function() {
				$('#sample3').animate({
					width: "-="+150
				}, 100, function() {
					$('#sample4').animate({
						width: "-="+150
					}, 100);
				});
			});
		});*/
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
				width: "+="+70
			},100);
			$('#dijkstra-go2').animate({
				width: "+="+70
			},100);
		});
	}
	isDijkstrasOpen = true;
}
function closeDijkstras() {
	if(true) {
		$('#dijkstra-err').html("");
		$('#dijkstra-go1').animate({
			width: "-="+70
		}, 100);
		$('#dijkstra-go2').animate({
			width: "-="+70
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
	closeSamples();
	closeBFS();
	closeBellmanFords();
	closeDijkstras();
}

$( document ).ready(function() {
	$('#sample').click(function() {
		openSamples();
		closeBFS();
		closeBellmanFords();
		closeDijkstras();
		$('#sample1-err').html("");
		$('#bellmanford-err').html("");
		$('#dijkstra-err').html("");
	});
	
	$('#bfs').click(function() {
		closeSamples();
		openBFS();
		closeBellmanFords();
		closeDijkstras();
		$('#sample1-err').html("");
		$('#bfs-err').html("");
		$('#bellmanford-err').html("");
		$('#dijkstra-err').html("");
	});

	$('#bellmanford').click(function() {
		closeSamples();
		closeBFS();
		openBellmanFords();
		closeDijkstras();
		$('#sample1-err').html("");
		$('#bfs-err').html("");
		$('#bellmanford-err').html("");
		$('#dijkstra-err').html("");
	});
	
	$('#dijkstra').click(function() {
		closeSamples();
		closeBFS();
		closeBellmanFords();
		openDijkstras();
		$('#sample1-err').html("");
		$('#bfs-err').html("");
		$('#bellmanford-err').html("");
		$('#dijkstra-err').html("");
	});
		
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