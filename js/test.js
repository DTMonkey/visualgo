var studentid;
var studentpw;
var gw = new GraphWidget();

var easyQnTotal = 10;
var easyQnChoose = easyQnTotal/2;
var medQnTotal = 6;
var medQnChoose = medQnTotal/2;
var diffQnTotal = 4;
var diffQnChoose = diffQnTotal/2;

var questionList = new Array(); //of real (jumbled 10 from 20) question numbers - maps 0-10 to the real qn nos.
var qnTextArr = new Array(); //of question text for each qn - from mode 1
var qnJSONArr = new Array; //of JSON objects for each qn - from mode 2
var answerList = new Array(); //of all 20 questions
var firstLoad = true;
var currentQn;
var localQnNo; //1-based

//initialising functions
function startTest() {
	generateQns();
	scrambleQns();
	initAns();
	getQnData(0); //all showing/hiding and setting the graph widget state are inside here
}

function initAns() {
	for(var i=0; i<(easyQnChoose+medQnChoose+diffQnChoose); i++) {
		answerList[i] = -100;
	}
}

function generateQns() {
	while(questionList.length < easyQnChoose) {
		var n = (Math.floor(Math.random()*easyQnTotal))+1;
		if(questionList.indexOf(n) == -1) {
			questionList.push(n);
		}
	}
	while(questionList.length < (easyQnChoose+medQnChoose)) {
		var n = easyQnTotal+(Math.floor(Math.random()*medQnTotal))+1;
		if(questionList.indexOf(n) == -1) {
			questionList.push(n);
		}
	}
	while(questionList.length < (easyQnChoose+medQnChoose+diffQnChoose)) {
		var n = easyQnTotal+medQnTotal+(Math.floor(Math.random()*diffQnTotal))+1;
		if(questionList.indexOf(n) == -1) {
			questionList.push(n);
		}
	}
}

function scrambleQns() {
	var counter = questionList.length, temp, index;

    // While there are elements in the array
    while (counter--) {
        // Pick a random index
        index = (Math.random() * (counter + 1)) | 0;

        // And swap the last element with it
        temp = questionList[counter];
        questionList[counter] = questionList[index];
        questionList[index] = temp;
    }
}

function getQnData(n) {
	//for text
	$.ajax({
		url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=1&id="+questionList[n]
	}).done(function(data) {
		qnTextArr[n] = data;
		//for JSON
		$.ajax({
			url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=2&id="+questionList[n]
		}).done(function(data) {
			qnJSONArr[n] = jQuery.parseJSON(data);  
			if((n+1)<questionList.length) {
				getQnData(n+1);
			} else { // finished getting all qn data
				$('#login-screen').hide();
				$('#answer-form').show();
				$('#submit-test').show();
				$('#time-left').show();
				$('#question-nav').show();
				$('#question-text').show();
				$('#viz').show();
				//load first question
				gw.startAnimation(qnJSONArr);
				gw.pause();
				showQn(questionList[0]);
			}
		});
	});
}

//update display functions
function showQn(q) {
	currentQn = q;
	localQnNo = questionList.indexOf(q)+1;
	
	/*------question input, for now only: to change when using graph input------*/
	var currentQnAns = answerList[currentQn];
	if(currentQnAns == -100) {
		$('#answer').val("");
	} else {
		$('#answer').val(answerList[currentQn]);
	}
	
	/*------question text------*/
	qnText = qnTextArr[localQnNo-1];
	if(!firstLoad) {
		$('#question-text').animate({
			top: "-=200"
		}, 300, function() {
			changeQnBgColour(colourArray[generatedColours[localQnNo%4]]);
			$('#question-text').html(localQnNo+".&nbsp;&nbsp;&nbsp;"+qnText);
			$('#question-text').animate({
				top: "+=200"
			},300);
		});
	} else {
		changeQnBgColour(colourArray[generatedColours[localQnNo%4]]);
		$('#question-text').html(localQnNo+".&nbsp;&nbsp;&nbsp;"+qnText);
		firstLoad = false;
	}
	
	/*------question graph------*/
	gw.jumpToIteration(localQnNo-1,300);
}

function changeQnBgColour(colour) {
	$('#question-text').css("background-color", colour);
	$('#answer-go').css('background-color', colour);
	$('#question-nav').css('background-color',colour);
	
	if(colour == '#fec515' || colour == '#a7d41e') {
		$('#question-text').css('color', 'black');
		$('#answer-go').css('color', 'black');
		
		$('#answer-go').hover(function() {
			$('#answer-go').css('background-color', 'black');
			$('#answer-go').css('color', 'white');
		}, function() {
			$('#answer-go').css('background-color', colour);
			$('#answer-go').css('color', 'black');
		});
	} else {
		$('#question-text').css('color', 'white');
		$('#answer-go').css('color', 'white');
		
		$('#answer-go').hover(function() {
			$('#answer-go').css('background-color', 'black');
			$('#answer-go').css('color', 'white');
		}, function() {
			$('#answer-go').css('background-color', colour);
			$('#answer-go').css('color', 'white');
		});
	}
}

//after submit functions
function endTest() {
	//get score
	var ansStr = answerList.join('&ans[]=');
	var queryStr = "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=3&ans[]="+ansStr;
	$.ajax({
		url: queryStr
	}).done(function(score) {
		if(score >= 0) {
			//get attempt number to determine text to show
			$.ajax({
				url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=5"
			}).done(function(attemptNo) {
				if(attemptNo==1) {
					$('#try-again').css('display','inline-block');
					$('#result').html("You scored <div style='padding: 10px 0px; font-size: 36px; font-weight: bold;'>"+score+" out of 10</div>You have 1 more attempt.<br/>Do you want to try again?");
					$('#result-note').html("(The score from your final attempt will be recorded.)");
				} else if(attemptNo==2){
					$('#try-again').css('display','none');
					$('#result').html("<div style='padding-top:50px;'>You scored <div style='padding: 10px 0px; font-size: 36px; font-weight: bold;'>"+score+" out of 10</div>This score will be recorded.<div>");
					$('#result-note').html("");
				}
				goToResultScreen();
			});
		} else if(score == -1) {
			$('#result').html("<div style='padding-top:80px;'>You have already attempted this quiz twice. This submission will not be recorded.</div>");
			goToResultScreen();
		}
	});
}

function goToResultScreen() {
	//hide test stuff
	$('#answer-form').hide();
	$('#submit-test').hide();
	$('#time-left').hide();
	$('#question-nav').hide();
	$('#question-text').hide();
	$('#viz').hide();
	//show results screen
	$('#result-screen').show();
}

$(document).ready (function() {
	//login
	$('#login').css('background-color',surpriseColour).hover(function() {
		$('#login').css('background-color','black');
	}, function() {
		$('#login').css('background-color',surpriseColour);
	});
	
	$('#login-id').focusin(function() {
		if ($(this).val() == "user id") {
			$(this).css('color','black');
			$(this).val("");
		}
	}).focusout(function() {
		if ($(this).val() == "") {
			$(this).css('color','#888');
			$(this).val("user id");
		}
	});
	$('#login-pw').focusin(function() {
		if ($(this).val() == "password") {
			$(this).css('color','black');
			$(this).val("");
		}
	}).focusout(function() {
		if ($(this).val() == "") {
			$(this).css('color','#888');
			$(this).val("password");
		}
	});
	
	$('#login').click(function() {
		studentid = $('#login-id').val();
		studentpw = $('#login-pw').val();
		if(true) { //needs to change to some value from the server
			startTest();
		}
		return false; //to prevent page reload
	});
	
	//question navigation stuff
	$('#question-nav .qnno').click(function() {
		$('#question-nav .qnno').removeClass('selected');
		$(this).addClass('selected');
		var number = parseInt($(this).html())-1;
		showQn(questionList[number]);
	});
	
	$('#prev-qn').click(function() {
		if(localQnNo > 1) {
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo-2).addClass('selected');
			var number = localQnNo-2; //-1 to reduce, -1 for 1-indexing to 0-indexing
			showQn(questionList[number]);
		}
	});
	
	$('#next-qn').click(function() {
		if(localQnNo < (easyQnChoose+medQnChoose+diffQnChoose)) {
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo).addClass('selected');
			var number = localQnNo; //+1 to increase, -1 for 1-indexing to 0-indexing
			showQn(questionList[number]);
		}
	});
	
	//answer stuff: to remove after input by point and click
	$('#answer-go').click(function() {
		answerList[currentQn] = $('#answer').val();
		$('#question-nav .qnno').eq(localQnNo-1).addClass('answered');
		return false; // prevents page reload
	});
	
	//results stuff
	$('#submit-test').click(function() {
		endTest();
	});
	$('#try-again').css('background-color',surpriseColour).hover(function() {
		$('#try-again').css('background-color','black');
	}, function() {
		$('#try-again').css('background-color',surpriseColour);
	});
	$('#try-again').click(function() {
		$('#result-screen').hide();
		$('#question-nav .qnno').removeClass('selected');
		$('#question-nav .qnno').eq(0).addClass('selected');
		firstLoad = true;
		startTest();
	});
});