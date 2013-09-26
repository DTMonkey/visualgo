var actionsWidth = 150;
var statusCodetraceWidth = 370;

var isBuildv1Open = false;
var isBuildv2Open = false;
var isInsertOpen = false;
var isSearch = false;

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

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#buildv1').click(function() {
		closeSearch();
		openBuildv1();
	});	

	$('#search').click(function() {
		closeBuildv1();
		openSearch();
	});
})