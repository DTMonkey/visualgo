var actionsWidth = 150;
var statusCodetraceWidth = 370;

var isBuildv1Open = false;
var isBuildv2Open = false;
var isInsertOpen = false;
var isSearch = false;
var isLCS = false;

function openBuildv1() {
	if(!isBuildv1Open){
		$('#buildv1-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#buildv1-go').animate({
				width: "+="+34
			});
		});
		isBuildv1Open = true;
	}
}

function closeBuildv1() {
	if(isBuildv1Open){
		$('#buildv1-err').html("");	
		$('#buildv1-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#buildv1-input').animate({
				width: "-="+200
			}, 250 );
		});
		isBuildv1Open = false;
	}
}

function openSearch() {
	if(!isSearch){
		$('#search-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#search-go').animate({
				width: "+="+34
			});
		});
		isSearch = true;
	}
}

function closeSearch() {
	if(isSearch){
		$('#search-err').html("");	
		$('#search-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#search-input').animate({
				width: "-="+200
			}, 250 );
		});
		
		isSearch = false;
	}
}

function openLCS() {
	if(!isLCS){
		$('#lcs-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#lcs-go').animate({
				width: "+="+34
			});
		});
		isLCS = true;
	}

}

function closeLCS() {
	if(isLCS){
		$('#lcs-err').html("");	
		$('#lcs-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#lcs-input').animate({
				width: "-="+200
			}, 250 );
		});		
		isLCS = false;
	}

}

function hideEntireActionsPanel() {
	closeSearch();
	closeLCS();
	closeBuildv1();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#buildv1').click(function() {
		closeSearch();
		closeLCS();
		openBuildv1();
	});	

	$('#search').click(function() {
		closeBuildv1();
		closeLCS();
		openSearch();
	});

	$("#LCS").click(function() {
		closeBuildv1();
		closeSearch();
		openLCS();
	});

	$("#LRS").click(function() {
		closeBuildv1();
		closeSearch();
		closeLCS();
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

})