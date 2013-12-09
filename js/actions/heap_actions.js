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
			},100, function() {
				$('#buildv1-sample').animate({
				width: "+="+95}, 180);
			});
		});
		isBuildv1Open = true;
	}
}
function closeBuildv1() {
	if(isBuildv1Open){
		$('#buildv1-err').html("");
		$('#buildv1-sample').animate({
			width: "-="+95
		}, 180, function() {
			$('#buildv1-go').animate({
				width: "-="+34
			}, 100, function() {
				$('#buildv1-input').animate({
					width: "-="+200
				}, 250 );
			});
		});
		isBuildv1Open = false;
	}
}
function openBuildv2() {
	if(!isBuildv2Open){
		$('#buildv2-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#buildv2-go').animate({
				width: "+="+34
			},100, function() {
				$('#buildv2-sample').animate({
				width: "+="+95}, 180);
			});
		});
		isBuildv2Open = true;
	}
}
function closeBuildv2() {
	if(isBuildv2Open){
		$('#buildv2-err').html("");
		$('#buildv2-sample').animate({
			width: "-="+95
		}, 180, function() {
			$('#buildv2-go').animate({
				width: "-="+34
			}, 100, function() {
				$('#buildv2-input').animate({
					width: "-="+200
				}, 250 );
			});
		});
		isBuildv2Open = false;
	}
}
function openInsert() {
	if(!isInsertOpen) {
		$('#insert-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#insert-go').animate({
				width: "+="+34
			},100);
		});
	}
	isInsertOpen = true;
}
function closeInsert() {
	if(true) {
		$('#insert-err').html("");
		$('#insert-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#insert-input').animate({
				width: "-="+32
			}, 100);
		});
		isInsertOpen = false;
	}
}

function hideEntireActionsPanel() {
	closeBuildv1();
	closeBuildv2();
	closeInsert();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#buildv1').click(function() {
		closeBuildv2();
		closeInsert();
		$('#extractmax-err').html("");
		$('#heapsort-err').html("");
		openBuildv1();
	});	
	$('#buildv2').click(function() {
		closeBuildv1();
		closeInsert();
		$('#extractmax-err').html("");
		$('#heapsort-err').html("");
		openBuildv2();
	});
	$('#insert').click(function() {
		closeBuildv1();
		closeBuildv2();
		$('#extractmax-err').html("");
		$('#heapsort-err').html("");
		openInsert();
	});
	
	//and the others
	$('#extractmax').click(function() {
		closeBuildv1();
		closeBuildv2();
		closeInsert();
		$('#heapsort-err').html("");
	});
	
	$('#heapsort').click(function() {
		closeBuildv1();
		closeBuildv2();
		closeInsert();
		$('#extractmax-err').html("");
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