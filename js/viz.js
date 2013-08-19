//codetrace highlight
function highlightLine(lineNumber) { /*lineNumber has to be an integer in [1, 7]*/
	if(lineNumber == 0) {
		$('#codetrace p').removeClass('highlighted')
	} else {
		$('#codetrace p').removeClass('highlighted');
		$('#code'+lineNumber).addClass('highlighted');
	}
}

//disabling certain panels/player controls when user should not press them
var isActionsEnabled = true;
var isStatusCodetraceEnabled = false;
var isPlayerEnabled = false;

function enablePlayer() {
	isPlayerEnabled = true;
	$('#speed-control').fadeIn(250);
	$('#media-controls').fadeIn(250);
}
function disablePlayer() {
	isPlayerEnabled = false;
	$('#speed-control').fadeOut(250);
	$('#media-controls').fadeOut(250);
}

function enableActionsOnly() {
	$('#current-action').hide();
	$('#actions-hide').css('background-color','#ed5a7d');
	$('#status-hide').css('background-color','#666666');
	$('#codetrace-hide').css('background-color','#666666');
	disablePlayer();
	showActionsPanel();
	hideStatusPanel();
	hideCodetracePanel();
	isActionsEnabled = true;
	isStatusCodetraceEnabled = false;
}
function enableStatusCodetraceOnly() {
	$('#actions-hide').css('background-color','#666666');
	$('#status-hide').css('background-color','#2ebbd1');
	$('#codetrace-hide').css('background-color','#52bc69');
	enablePlayer();
	hideActionsPanel();
	showStatusPanel();
	showCodetracePanel();
	isActionsEnabled = false;
	isStatusCodetraceEnabled = true;
}

//Opening and closing panels
var isActionsOpen = true;
var isStatusOpen = false;
var isCodetraceOpen = false;

//vars actionsWidth and statusCodetraceWidth must be defined in the specific vizname_actions.js file
function showActionsPanel() {
	if(!isActionsOpen) {
		$('#actions-hide img').removeClass('rotateLeft').addClass('rotateRight');
		$('#actions').animate({
			width: "+="+actionsWidth,
		});
		isActionsOpen = true;

	}
}
function hideActionsPanel() {
	if(isActionsOpen) {
		$('#actions-hide img').removeClass('rotateRight').addClass('rotateLeft');
		$('#actions').animate({
			width: "-="+actionsWidth,
		});
		isActionsOpen = false;
	}
}
function showStatusPanel() {
	if(!isStatusOpen) {
		$('#status-hide img').removeClass('rotateLeft').addClass('rotateRight');
		$('#status').animate({
			width: "+="+statusCodetraceWidth,
		});
		isStatusOpen = true;
	}
}
function hideStatusPanel() {
	if(isStatusOpen) {
		$('#status-hide img').removeClass('rotateRight').addClass('rotateLeft');
		$('#status').animate({
			width: "-="+statusCodetraceWidth,
		});
		isStatusOpen = false;
	}
}
function showCodetracePanel() {
	if(!isCodetraceOpen) {
		$('#codetrace-hide img').removeClass('rotateLeft').addClass('rotateRight');
		$('#codetrace').animate({
			width: "+="+statusCodetraceWidth,
		});
		isCodetraceOpen = true;
	}
}
function hideCodetracePanel() {
	if(isCodetraceOpen) {
		$('#codetrace-hide img').removeClass('rotateRight').addClass('rotateLeft');
		$('#codetrace').animate({
			width: "-="+statusCodetraceWidth,
		});
		isCodetraceOpen = false;
	}
}

$( document ).ready(function() {
	
	$('#current-action').hide();

	//title
	$('#title a').click(function() {
		$('#title a').removeClass('selected-viz');
		$(this).addClass('selected-viz');
	});
	
	//mmode menu
	var mode="exploration";
	$('#question').hide();
	//$('#other-modes').hide();
	
	$('#mode-button').click(function() {
		$('#other-modes').toggle();
	});
	$('#mode-menu').hover(function() {
		$('#other-modes').toggle();
	});
	
	$('#mode-menu a').hover(function() {
		$(this).css("background", surpriseColour);
	}, function() {
		$(this).css("background", "black");
	});
	
	$('#mode-menu a').click(function() {
		var currentMode = $('#mode-button').html().split("<")[0];
		var newMode = $(this).html();
		
		$(this).html(currentMode);
		$('#mode-button').html(newMode + '<img src="img/arrow_white.png" alt="Home"/>');
		
		if(newMode=="Exploration Mode") {
			$('#status-hide').show();
			$('#codetrace-hide').show();
			$('#actions-hide').show();
			$('#status').show();
			$('#codetrace').show();
			$('#actions').show();
		/*} else if(newMode=="Training Mode") {
			$('#status').hide();
			$('#codetrace').hide();
			$('#actions').hide();
			$('#status-hide').hide();
			$('#codetrace-hide').hide();
			$('#actions-hide').hide();
			*/
		} else if (newMode=="Tutorial Mode") {
			$('#status-hide').show();
			$('#codetrace-hide').show();
			$('#actions-hide').show();
			$('#status').show();
			$('#codetrace').show();
			$('#actions').show();
			$('#dark-overlay').fadeIn(function(){
				$('#help').fadeIn();
			});
		}
	});
	
	//arrow buttons to show/hide panels	
	//actions-hide is in the vizname_actions.js file
	$('#status-hide').click(function() {
		if(isStatusOpen) {
			hideStatusPanel();
		} else {
			if(isStatusCodetraceEnabled) {
				showStatusPanel();
			}
		}
	});
	$('#codetrace-hide').click(function() {
		if(isCodetraceOpen) {
			hideCodetracePanel();
		} else {
			if(isStatusCodetraceEnabled){
				showCodetracePanel();
			}
		}
	});
	
});