var actionsWidth = 120;
var statusCodetraceWidth = 370;

var isFindOpen = false;
var isUnionOpen = false;
var isInitOpen = false;

function openFind() {
	if(!isFindOpen){
		$('#find-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#find-go').animate({
				width: "+="+34
			},100);
		});
		isFindOpen = true;
	}
}
function closeFind() {
	if(isFindOpen){
		$('#find-err').html("");
		$('#find-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#find-input').animate({
				width: "-="+32
			}, 250 );
		});
		isFindOpen = false;
	}
}
function openUnion() {
	if(!isUnionOpen){
		$('#union-input').animate({
			width: "+="+65
		}, 210, function() {
			$('#arrunionj').show();
			$('#union-go').animate({
				width: "+="+34
			},100);
		});
		isUnionOpen = true;
	}
}
function closeUnion() {
	if(isUnionOpen){
		$('#union-err').html("");
		$('#union-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#arrunionj').hide();
			$('#union-input').animate({
				width: "-="+65
			}, 250);
		});
		isUnionOpen = false;
	}
}
function openInit() {
	if(!isInitOpen) {
		$('#init-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#init-go').animate({
				width: "+="+34
			},100);
		});
	}
	isInitOpen = true;
}
function closeInit() {
	if(isInitOpen) {
		$('#init-err').html("");
		$('#init-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#init-input').animate({
				width: "-="+32
			}, 100);
		});
		isInitOpen = false;
	}
}

function hideEntireActionsPanel() {
	closeFind();
	closeUnion();
	closeInit();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	$('#arrunionj').hide();
	
	//the actions with pullout inputs
	$('#find').click(function() {
		closeUnion();
		closeInit();
		openFind();
	});	
	$('#union').click(function() {
		closeFind();
		closeInit();
		openUnion();
	});
	$('#init').click(function() {
		closeFind();
		closeUnion();
		openInit();
	});
	
	//and the others
	
});