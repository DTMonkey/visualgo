var actionsWidth = 150;
var statusCodetraceWidth = 370;

var isBuildv1Open = false;
var isBuildv2Open = false;
var isInsertOpen = false;
var isSearch = false;
var isLCS = false;
var isGraham = false;

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

function openGrahamScan() {
	if(!isGraham){
		$('#graham-go').animate({
			width: "+="+35
		});
		isGraham = true;
	}
}

function closeGrahamScan() {
	if(isGraham){
		$('#graham-go').animate({
			width: "-="+35
		});		
		isGraham = false;
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

function closeSearch() {
	if(isSearch){
		$('#lcs-err').html("");	
		$('#lcs-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#lcs-input').animate({
				width: "-="+200
			}, 250 );
		});		
		isSearch = false;
	}

}

$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#buildv1').click(function() {
		closeGrahamScan();
		closeLCS();
		openBuildv1();
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
})