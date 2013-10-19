var actionsWidth = 120;
var statusCodetraceWidth = 370;

var isInitOpen = false;
var isSampleOpen = false;
var isFindOpen = false;
var isIsSameSetOpen = false;
var isUnionOpen = false;

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
function openSample() {
	if(!isSampleOpen) {
		$('#sample-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#sample-go').animate({
				width: "+="+34
			},100);
		});
	}
	isSampleOpen = true;
}
function closeSample() {
	if(isSampleOpen) {
		$('#sample-err').html("");
		$('#sample-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#sample-input').animate({
				width: "-="+32
			}, 100);
		});
		isSampleOpen = false;
	}
}
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
function openIsSameSet() {
	if(!isIsSameSetOpen){
		$('#isSameSet-input').animate({
			width: "+="+65
		}, 210, function() {
			$('#arrissamesetj').show();
			$('#isSameSet-go').animate({
				width: "+="+34
			},100);
		});
		isIsSameSetOpen = true;
	}
}
function closeIsSameSet() {
	if(isIsSameSetOpen){
		$('#isSameSet-err').html("");
		$('#isSameSet-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#arrissamesetj').hide();
			$('#isSameSet-input').animate({
				width: "-="+65
			}, 250);
		});
		isIsSameSetOpen = false;
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

function hideEntireActionsPanel() {
	closeInit();
	closeSample();
	closeFind();
	closeIsSameSet();
	closeUnion();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	$('#arrunionj').hide();
	$('#arrissamesetj').hide();
	
	//the actions with pullout inputs
	$('#init').click(function() {
		closeFind();
		closeUnion();
		closeSample();
		closeIsSameSet();
		openInit();
	});
	$('#sample').click(function() {
		closeFind();
		closeUnion();
		closeInit();
		closeIsSameSet();
		openSample();
	});
	$('#find').click(function() {
		closeUnion();
		closeInit();
		closeSample();
		closeIsSameSet();
		openFind();
	});	
	$('#isSameSet').click(function() {
		closeFind();
		closeInit();
		closeSample();
		closeUnion();
		openIsSameSet();
	});
	$('#union').click(function() {
		closeFind();
		closeInit();
		closeSample();
		closeIsSameSet();
		openUnion();
	});
	
	//and the others
	
});