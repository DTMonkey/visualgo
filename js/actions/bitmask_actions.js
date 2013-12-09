//actions panel stuff
var actionsWidth = 150;
var statusCodetraceWidth = 350;

var isSetFlagsOpen = false;
var isSetOpen = false;
var isCheckOpen = false;
var isToggleOpen = false;
var isClearOpen = false;

function openSetFlags() {
	if(!isSetFlagsOpen) {
		$('#setFlags-input').animate({
			width: "+="+42
		}, 120, function() {
			$('#setFlags-go').animate({
				width: "+="+34
			},100);
		});
	}
	isSetFlagsOpen = true;
}
function closeSetFlags() {
	if(isSetFlagsOpen) {
		$('#setFlags-err').html("");
		$('#setFlags-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#setFlags-input').animate({
				width: "-="+42
			},120);
		});
		isSetFlagsOpen = false;
	}
}
function openSet() {
	if(!isSetOpen) {
		$('#set-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#set-go').animate({
				width: "+="+34
			},100);
		});
	}
	isSetOpen = true;
}
function closeSet() {
	if(isSetOpen) {
		$('#set-err').html("");
		$('#set-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#set-input').animate({
				width: "-="+32
			},100);
		});
		isSetOpen = false;
	}
}
function openCheck() {
	if(!isCheckOpen) {
		$('#check-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#check-go').animate({
				width: "+="+34
			},100);
		});
	}
	isCheckOpen = true;
}
function closeCheck() {
	if(isCheckOpen) {
		$('#check-err').html("");
		$('#check-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#check-input').animate({
				width: "-="+32
			},100);
		});
		isCheckOpen = false;
	}
}
function openToggle() {
	if(!isToggleOpen) {
		$('#toggle-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#toggle-go').animate({
				width: "+="+34
			},100);
		});
	}
	isToggleOpen = true;
}
function closeToggle() {
	if(isToggleOpen) {
		$('#toggle-err').html("");
		$('#toggle-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#toggle-input').animate({
				width: "-="+32
			},100);
		});
		isToggleOpen = false;
	}
}
function openClear() {
	if(!isClearOpen) {
		$('#clear-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#clear-go').animate({
				width: "+="+34
			},100);
		});
	}
	isClearOpen = true;
}
function closeClear() {
	if(isClearOpen) {
		$('#clear-err').html("");
		$('#clear-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#clear-input').animate({
				width: "-="+32
			},100);
		});
		isClearOpen = false;
	}
}
function hideEntireActionsPanel() {
	closeSetFlags();
	closeSet();
	closeCheck();
	closeToggle();
	closeClear();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#setFlags').click(function() {
		closeSet();
		closeCheck();
		closeToggle();
		closeClear();
		openSetFlags();
	});
	
	$('#set').click(function() {
		closeSetFlags();
		closeCheck();
		closeToggle();
		closeClear();
		openSet();
	});
	
	$('#check').click(function() {
		closeSetFlags();
		closeSet();
		closeToggle();
		closeClear();
		openCheck();
	});
	
	$('#toggle').click(function() {
		closeSetFlags();
		closeSet();
		closeCheck();
		closeClear();
		openToggle();
	});
	
	$('#clear').click(function() {
		closeSetFlags();
		closeSet();
		closeCheck();
		closeToggle();
		openClear();
	});
	
	//tutorial mode
});