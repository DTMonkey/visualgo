var gw = new GraphWidget();
var sitePrefix = "http://algorithmics.comp.nus.edu.sg/~onlinequiz/quiz2.php";

//The following arrays use 1-based indexing. Index 0 is a dummy value.
var qnTextArr = new Array(); //of question text for each qn
var qnGraphArr = new Array(); //of JSON objects for each qn
var qnTypeArr = new Array(); //of each qn's input type, for UI display and answer recording
var ansArr = new Array(); //answers to be sent to server

var qnNo; //1-based
var nQns; //total number of questions
var nAnswered = 0;

function startTraining() {
	nQns = getNumberOfQns();
	init();
	getQnsAndStart(); //fill qnTextArr, qnGraphArr, and qnTypeArr
}

function submitTraining() {
	//get score
	ansArr.shift();
	var ansStr = ansArr.join('&ans[]=');
	var queryStr = sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=3&ans[]="+ansStr;
	$.ajax({
		url: queryStr
	}).done(function(score) {
		score = parseInt(score);
		$('#score').html(score+" out of "+nQns);
		$('#test-screen').fadeOut("fast");
		$('#result-screen').fadeIn("fast");
	});
}

/*-------START TEST FUNCTIONS-------*/
function getNumberOfQns() {
	//later use AJAX
	return 15;
}

function init() {
	//fill in dummy values for array index 0
	qnTextArr[0]="Is this a dummy question?";
	qnGraphArr[0] = jQuery.parseJSON('{"vl":{"0":{"cx":450,"cy":50,"text":"21","state":0},"1":{"cx":225,"cy":100,"text":"18","state":0},"2":{"cx":675,"cy":100,"text":"50","state":0},"3":{"cx":112.5,"cy":150,"text":"4","state":0},"4":{"cx":337.5,"cy":150,"text":"19","state":0},"5":{"cx":562.5,"cy":150,"text":"23","state":0},"6":{"cx":787.5,"cy":150,"text":"71","state":1},"7":{"cx":168.75,"cy":200,"text":"17","state":0}},"el":{"1":{"vertexA":0,"vertexB":1,"type":0,"weight":1,"state":0,"animateHighlighted":false},"2":{"vertexA":0,"vertexB":2,"type":0,"weight":1,"state":0,"animateHighlighted":false},"3":{"vertexA":1,"vertexB":3,"type":0,"weight":1,"state":0,"animateHighlighted":false},"4":{"vertexA":1,"vertexB":4,"type":0,"weight":1,"state":0,"animateHighlighted":false},"5":{"vertexA":2,"vertexB":5,"type":0,"weight":1,"state":0,"animateHighlighted":false},"6":{"vertexA":2,"vertexB":6,"type":0,"weight":1,"state":0,"animateHighlighted":false},"7":{"vertexA":3,"vertexB":7,"type":0,"weight":1,"state":0,"animateHighlighted":false}},"status":"The current BST","lineNo":0}');
	qnTypeArr[0] = 0;
	for(var i=0; i<=nQns; i++) { ansArr[i] = false; } //Initialise ansArr with all false - not answered yet
	
	prepareQnNav(nQns);
}

function prepareQnNav(n) { //n is the number of questions
	$('#question-nav').append('<a id="prev-qn" style="margin-right: 20px; opacity: 1.0; cursor: pointer;">PREV QN</a>');
	for(var i=0; i<n; i++) { $('#question-nav').append('<a class="qnno">'+(i+1)+'</a>'); }
	$('#question-nav').append('<a id="next-qn" style="margin-left: 20px; opacity: 1.0; cursor: pointer;">NEXT QN</a>');
	$('#question-nav .qnno').eq(0).addClass('selected');
	
	$('#question-nav .qnno').click(function() {
		$('#question-nav .qnno').removeClass('selected');
		$(this).addClass('selected');
		qnNo = parseInt($(this).html());
		showQn(qnNo);
	});
	$('#prev-qn').click(function() {
		if(qnNo > 1) {
			qnNo--;
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(qnNo-1).addClass('selected'); //eq uses zero-indexing
			showQn(qnNo);
		}
	});
	$('#next-qn').click(function() {
		if(qnNo < n) {
			qnNo++;
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(qnNo-1).addClass('selected'); //eq uses zero-indexing
			showQn(qnNo);
		}
	});
}

//this function gets all the qn data, and displays the ui for qn 1
function getQnsAndStart() {
	//get text
	//later use AJAX
	for(var i=1; i<=nQns; i++) { qnTextArr[i] = "Is this a dummy question?"; }
	//get graphs
	//later use AJAX
	for(var i=1; i<=nQns; i++) { qnGraphArr[i] = jQuery.parseJSON('{"vl":{"0":{"cx":450,"cy":50,"text":"21","state":0},"1":{"cx":225,"cy":100,"text":"18","state":0},"2":{"cx":675,"cy":100,"text":"50","state":0},"3":{"cx":112.5,"cy":150,"text":"4","state":0},"4":{"cx":337.5,"cy":150,"text":"19","state":0},"5":{"cx":562.5,"cy":150,"text":"23","state":0},"6":{"cx":787.5,"cy":150,"text":"71","state":1},"7":{"cx":168.75,"cy":200,"text":"17","state":0}},"el":{"1":{"vertexA":0,"vertexB":1,"type":0,"weight":1,"state":0,"animateHighlighted":false},"2":{"vertexA":0,"vertexB":2,"type":0,"weight":1,"state":0,"animateHighlighted":false},"3":{"vertexA":1,"vertexB":3,"type":0,"weight":1,"state":0,"animateHighlighted":false},"4":{"vertexA":1,"vertexB":4,"type":0,"weight":1,"state":0,"animateHighlighted":false},"5":{"vertexA":2,"vertexB":5,"type":0,"weight":1,"state":0,"animateHighlighted":false},"6":{"vertexA":2,"vertexB":6,"type":0,"weight":1,"state":0,"animateHighlighted":false},"7":{"vertexA":3,"vertexB":7,"type":0,"weight":1,"state":0,"animateHighlighted":false}},"status":"The current BST","lineNo":0}'); }
	//get input type
	//later use AJAX
	for(var i=1; i<=nQns; i++) { qnTypeArr[i] = i%4; if(qnTypeArr[i]==0) qnTypeArr[i]=4;}
	
	//start timer
	//later use AJAX
	
	//switch screens
	$('#topics-screen').fadeOut("fast");
	$('#test-screen').fadeIn("fast");
	$('#submit-test').hide();
	
	//show first question
	gw.startAnimation(qnGraphArr); //start graph widget
	gw.pause();
	qnNo = 1; //start with qn 1
	showQn(qnNo);
}

function showQn(q) { //q is qn no	
	$('#qn-no').html(q+".");
	$('#qn-text p').html(qnTextArr[q]);
	gw.jumpToIteration(q,1);
	showAnswerInterface(q);
	if(ansArr[q]) { //if it has been answered (recall unanswered = false)
		showRecordedAns(q);
	}
}

/*-------ANSWER HANDLING FUNCTIONS-------*/
function setAns(q, ans) { //q is localQnNo
	if(ansArr[q] == false) {
		nAnswered++;
	}
	ansArr[q] = ans;
	checkComplete();
}

function clearAns(q) { //q is localQnNo
	if(ansArr[q] != false) {
		nAnswered--;
	}
	ansArr[q] = false;
	checkComplete();
}

function checkComplete() {
	if(nAnswered == nQns) {
		$('#submit-test').show();
	} else {
		$('#submit-test').hide();
	}
}

$(document).ready (function() {
	
	/*-------TOPIC SELECTION-------*/
	$('#topics-screen .topic').each(function() {
		if($(this).hasClass('topic-selected')) {
			$(this).children('img').css('-webkit-filter', 'grayscale(0%)');
		} else {
			$(this).children('img').css('-webkit-filter', 'grayscale(100%)');
		}
	});
	$('#topics-screen .topic').click(function() {
		if($(this).hasClass('topic-selected')) { //deselect it
			$(this).children('img').css('-webkit-filter', 'grayscale(100%)');
			$(this).removeClass('topic-selected');
		} else { //select it
			$(this).children('img').css('-webkit-filter', 'grayscale(0%)');
			$(this).addClass('topic-selected');
		}
	});
	$('#start-training').css("background-color", surpriseColour);
	$('#start-training').hover(function() {
		$(this).css("background-color", "black");
	}, function() {
		$(this).css("background-color", surpriseColour);
	});
	
	/*-------START TRAINING-------*/
	$('#start-training').click(function() {
		startTraining();
	});
	
	/*-------UNDO OR CLEAR INPUT-------*/
	$('#undo-ans').click(function() {
		var currAns = ansArr[qnNo];
		if(currAns.length <= 1) {
			$('#question-nav .qnno').eq(qnNo-1).removeClass('answered');
			clearAns(qnNo);
			gw.jumpToIteration(qnNo,1);
		} else {
			currAns.pop();
			setAns(qnNo, currAns);
			gw.jumpToIteration(qnNo,1);
			showRecordedAns(qnNo);
		}
		printCurrentSelection(qnNo);
	});
	
	$('#clear-ans').click(function() {
		$('#question-nav .qnno').eq(qnNo-1).removeClass('answered');
		clearAns(qnNo);
		gw.jumpToIteration(qnNo,1);
		printCurrentSelection(qnNo);
	});

	/*-------SUBMIT QUIZ-------*/
	$('#submit-test').click(function() {
		$('#dark-overlay').fadeIn("fast", function() {
			$('#submit-check').fadeIn("fast");
			$('#submit-yes1').show(); $('#submit-no1').show();
			$('#submit-yes2').hide(); $('#submit-no2').hide();
			$('#submit-check p').html('You only have 1 attempt on this quiz. Are you sure you want to submit it?');
		});
	});
	$('#submit-yes1').click(function() {
		$('#submit-yes1').hide(); $('#submit-no1').hide();
		$('#submit-yes2').show(); $('#submit-no2').show();
		var minLeft = Math.floor(timeLeft/60);
		var secLeft = timeLeft%60;
		var showTime;
		if(minLeft < 1) {
			showTime = secLeft.toString() + " seconds";
		} else {
			showTime = minLeft.toString() + " minutes";
		}
		$('#submit-check p').html('Are you really really sure? You still have '+showTime+' left.');
	});
	$('#submit-no1').click(function() {
		$('#submit-check').fadeOut("fast", function() {
			$('#dark-overlay').fadeOut("fast");
		});
	});
	$('#submit-yes2').click(function() {
		$('#submit-check').fadeOut("fast", function() {
			$('#dark-overlay').fadeOut("fast");
		});
		submitTest();
	});
	$('#submit-no2').click(function() {
		$('#submit-check').fadeOut("fast", function() {
			$('#dark-overlay').fadeOut("fast");
		});
	});
	
});