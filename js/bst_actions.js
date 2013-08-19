var actionsWidth = 150;
var statusCodetraceWidth = 370;

var isSearchOpen = false;
var isInsertOpen = false;
var isRemoveOpen = false;

function openSearch() {
	if(!isSearchOpen) {
		$('#find-min').animate({
			width: "+="+65
		}, 100, function() {
			$('#find-min p').html("Find min");
			$('#find-max').animate({
				width: "+="+69
			}, 100, function() {
				$('#find-max p').html("Find max");
				$('#search-input').animate({
					width: "+="+32
				}, 100, function() {
					$('#search-go').animate({
						width: "+="+34
					},100);
				});
			});
		});
	}
	isSearchOpen = true;
}
function closeSearch() {
	if(true) {
		$('#search-err').html("");
		$('#search-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#search-input').animate({
				width: "-="+32
			}, 100, function() {
				$('#find-max p').html("Find");
				$('#find-max').animate({
					width: "-="+69
				}, 100, function() {
					$('#find-min p').html("Find");
					$('#find-min').animate({
						width: "-="+65
					},100);
				});
			});
		});
		isSearchOpen = false;
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
function openRemove() {
	if(!isRemoveOpen) {
		$('#remove-input').animate({
			width: "+="+32
		}, 100, function() {
			$('#remove-go').animate({
				width: "+="+34
			},100);
		});
	}
	isRemoveOpen = true;
}
function closeRemove() {
	if(true) {
		$('#remove-err').html("");
		$('#remove-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#remove-input').animate({
				width: "-="+32
			}, 100);
		});
		isRemoveOpen = false;
	}
}

$( document ).ready(function() {
	
	//must define actions-hide click function
	$('#actions-hide').click(function() {
		if(isActionsOpen) {
			closeSearch();
			closeInsert();
			closeRemove();
			hideActionsPanel();
		} else {
			if(isActionsEnabled) {
				showActionsPanel();
			}
		}
	});
	
	//the actions with pullout inputs
	$('#search').click(function() {
		closeInsert();
		closeRemove();
		openSearch();
		$('#inorder-err').html("");
	});
	$('#insert').click(function() {
		closeSearch();
		closeRemove();
		openInsert();
		$('#inorder-err').html("");
	});
	$('#remove').click(function() {
		closeSearch();
		closeInsert();
		openRemove();
		$('#inorder-err').html("");
	});
	
	//and the others
	$('#inorder').click(function() {
		closeSearch();
		closeInsert();
		closeRemove();
	});
		
	//start by showing help overlay -- later control appearance using cookie?
	$('#dark-overlay').fadeIn(function(){
		$('#help').fadeIn();
	});
});