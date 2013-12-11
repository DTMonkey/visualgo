var gw = new GraphWidget();
var sitePrefix = document.URL.replace("/trainingmode.html","")+"/php/Test.php";
var MODE = "TRAINING";

//The following arrays use 1-based indexing. Index 0 is a dummy value.
var qnTextArr = new Array(); //of question text for each qn
var qnGraphArr = new Array(); //of JSON objects for each qn
var qnTypeArr = new Array(); //of each qn's input type, for UI display and answer recording
var qnParamsArr = new Array(); //empty when no params, array of key-val options for mcqs
var ansArr = new Array(); //answers to be sent to server

var seed = "1280733249";
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
	var queryStr = sitePrefix+"?mode="+MODE_CHECK_ANSWERS+"&ans[]="+ansStr+"&seed="+seed+"&qAmt="+nQns;
	console.log(queryStr); //to remove later
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
	//how many questions?
	return 10;
}

function init() {
	//fill in dummy values for array index 0
	qnTextArr[0]="Is this a dummy question?";
	qnGraphArr[0] = jQuery.parseJSON('{"vl":{"0":{"cx":450,"cy":50,"text":"21","state":0},"1":{"cx":225,"cy":100,"text":"18","state":0},"2":{"cx":675,"cy":100,"text":"50","state":0},"3":{"cx":112.5,"cy":150,"text":"4","state":0},"4":{"cx":337.5,"cy":150,"text":"19","state":0},"5":{"cx":562.5,"cy":150,"text":"23","state":0},"6":{"cx":787.5,"cy":150,"text":"71","state":1},"7":{"cx":168.75,"cy":200,"text":"17","state":0}},"el":{"1":{"vertexA":0,"vertexB":1,"type":0,"weight":1,"state":0,"animateHighlighted":false},"2":{"vertexA":0,"vertexB":2,"type":0,"weight":1,"state":0,"animateHighlighted":false},"3":{"vertexA":1,"vertexB":3,"type":0,"weight":1,"state":0,"animateHighlighted":false},"4":{"vertexA":1,"vertexB":4,"type":0,"weight":1,"state":0,"animateHighlighted":false},"5":{"vertexA":2,"vertexB":5,"type":0,"weight":1,"state":0,"animateHighlighted":false},"6":{"vertexA":2,"vertexB":6,"type":0,"weight":1,"state":0,"animateHighlighted":false},"7":{"vertexA":3,"vertexB":7,"type":0,"weight":1,"state":0,"animateHighlighted":false}},"status":"The current BST","lineNo":0}');
	qnTypeArr[0] = 0;
	qnParamsArr[0] = false;
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
	$.ajax({
		url: sitePrefix+"?mode="+MODE_GENERATE_QUESTIONS+"&qAmt="+nQns+"&seed="+seed
	}).done(function(data) {
		data = JSON.parse(data);
		for(var i=1; i<=nQns; i++) {
			extractInfo(i, data[i-1]);
		}
		
		//switch screens
		$('#topics-screen').fadeOut("fast");
		$('#test-screen').fadeIn("fast");
		$('#ans-key').hide();
		$('#submit-test').hide();
		
		//show first question
		gw.startAnimation(qnGraphArr); //start graph widget
		gw.pause();
		qnNo = 1; //start with qn 1
		showQn(qnNo);
	});
	
	//start timer
	//later use AJAX
}

function showQn(q) { //q is qn no	
	$('#qn-no').html(q+".");
	$('#qn-text p').html(qnTextArr[q]);
	gw.jumpToIteration(q,1);
	showAnswerInterface(q, MODE);
	if(hasBeenAnswered(q)) {
		showRecordedAns(q);
	}
}

/*-------ANSWER HANDLING FUNCTIONS-------*/
function hasBeenAnswered(q) {
	return !(typeof ansArr[q] == "boolean" && ansArr[q] == false);
}

function setAns(q, ans) { //q is localQnNo
	if(!hasBeenAnswered(q)) {
		nAnswered++;
	}
	ansArr[q] = ans;
	checkComplete();
}

function clearAns(q) { //q is localQnNo
	if(hasBeenAnswered(q)) {
		nAnswered--;
	}
	$('#current-selection').html("").hide();
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
	
	$('#question-nav').css("background-color", surpriseColour);
	
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
		submitTraining();
	});
	$('#goto-answer').css("background-color", surpriseColour);
	$('#goto-answer').hover(function() {
		$(this).css("background-color", "black");
	}, function() {
		$(this).css("background-color", surpriseColour);
	});
	$('#goto-answer').click(function() {
		MODE = "ANSWER";
		$('#result-screen').fadeOut('fast');
		$('#test-screen').fadeIn('fast');
		$('#ans-key').show();
		$('#undo-ans').hide();
		$('#clear-ans').hide();
		$('#info').hide();
		
		ansArr.unshift(false);
		
		$('#question-nav .qnno').removeClass('selected');
		$('#question-nav .qnno').eq(0).addClass('selected');
		qnNo = 1; //start with qn 1
		showQn(qnNo);
	});	
});