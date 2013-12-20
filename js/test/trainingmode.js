var MODE = "TRAINING";

function startTraining() {
	nQns = getNumberOfQns();
	init();
	getQnsAndStart(); //fill qnTextArr, qnGraphArr, and qnTypeArr
}

function submitTraining() {
	//get score
	ansArr.shift();
	var ansStr = ansArr.join('&ans[]=');
	var queryStr = sitePrefix+"?mode="+MODE_CHECK_ANSWERS+"&ans[]="+ansStr+"&seed="+seed+"&qAmt="+nQns+"&topics="+topics.toString();
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
//this function gets all the qn data, and displays the ui for qn 1
function getQnsAndStart() {
	console.log(sitePrefix+"?mode="+MODE_GENERATE_QUESTIONS+"&qAmt="+nQns+"&seed="+seed+"&topics="+topics.toString());
	$.ajax({
		url: sitePrefix+"?mode="+MODE_GENERATE_QUESTIONS+"&qAmt="+nQns+"&seed="+seed+"&topics="+topics.toString()
	}).done(function(data) {
		//console.log(data);
		data = JSON.parse(data);
		for(var i=1; i<=nQns; i++) {
			extractInfo(i, data[i-1]);
		}
		
		//switch screens
		prepareQnNav(nQns);
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

$(document).ready (function() {
	
	$('#question-nav').css("background-color", surpriseColour);
	
	/*-------TOPIC SELECTION-------*/
	$('#topics-screen .topic').each(function() {
		if($(this).hasClass('topic-selected')) {
			$(this).children('img').css('-webkit-filter', 'grayscale(0%)');
			topics.push($(this).attr('name'));
		} else {
			$(this).children('img').css('-webkit-filter', 'grayscale(100%)');
		}
	});
	$('#topics-screen .topic').click(function() {
		if($(this).hasClass('topic-selected')) { //deselect it
			$(this).children('img').css('-webkit-filter', 'grayscale(100%)');
			$(this).removeClass('topic-selected');
			var indexToDel = topics.indexOf($(this).attr('name'));
			topics.splice(indexToDel,1);
		} else { //select it
			$(this).children('img').css('-webkit-filter', 'grayscale(0%)');
			$(this).addClass('topic-selected');
			topics.push($(this).attr('name'));
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