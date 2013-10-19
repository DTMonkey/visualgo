var actionsWidth = 180;
var statusCodetraceWidth = 370;

var isBuildOpen = false;
var isInsertOpen = false;
var isSearchOpen = false;
var isLCSOpen = false;

function openBuild() {
	if(!isBuildOpen){
		$('#build-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#build-go').animate({
				width: "+="+34
			}, 100);
		});
		isBuildOpen = true;
	}
}

function closeBuild() {
	if(isBuildOpen){
		$('#build-err').html("");	
		$('#build-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#build-input').animate({
				width: "-="+200
			}, 250 );
		});
		isBuildOpen = false;
	}
}

function openSearch() {
	if(!isSearchOpen){
		$('#search-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#search-go').animate({
				width: "+="+34
			},100);
		});
		isSearchOpen = true;
	}
}

function closeSearch() {
	if(isSearchOpen){
		$('#search-err').html("");	
		$('#search-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#search-input').animate({
				width: "-="+200
			}, 250 );
		});
		
		isSearchOpen = false;
	}
}

function openLCS() {
	if(!isLCSOpen){
		$('#lcs-input').animate({
			width: "+="+200
		}, 250, function() {
			$('#lcs-go').animate({
				width: "+="+34
			},100);
		});
		isLCSOpen = true;
	}

}

function closeLCS() {
	if(isLCSOpen){
		$('#lcs-err').html("");	
		$('#lcs-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#lcs-input').animate({
				width: "-="+200
			}, 250 );
		});		
		isLCSOpen = false;
	}

}

function hideEntireActionsPanel() {
	closeSearch();
	closeLCS();
	closeBuild();
	hideActionsPanel();
}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#build').click(function() {
		closeSearch();
		closeLCS();
		openBuild();
	});	

	$('#search').click(function() {
		closeBuild();
		closeLCS();
		openSearch();
	});

	$("#LCS").click(function() {
		closeBuild();
		closeSearch();
		openLCS();
	});

	$("#LRS").click(function() {
		closeBuild();
		closeSearch();
		closeLCS();
	});

})