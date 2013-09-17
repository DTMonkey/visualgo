surpriseColour = '#00a594'; //override: IT WILL ALWAYS BE DARK TURQUOISE
var studentid;
var studentpw;
var gw = new GraphWidget();

var questionList = new Array(); //of real (jumbled 10 from 20) question numbers - maps 0-9 to the real qn nos.
var qnTextArr = new Array(); //of question text for each of the 10 qns - from mode 1
var qnJSONArr = new Array; //of JSON objects for each of the 10 qns - from mode 2
var answerList = new Array(); //of all 20 questions
var answerClassList = new Array(); //of the vertex class for the 10 local qns
var currentQn;
var localQnNo; //1-based

var infoRefresh;
var clientsideTimeRefresh;
var timeLeft=30; //in seconds

/***** initialising functions *****/
function startTest() {
	generateQns();
	scrambleQns();
	initAns();
	getQnData(0); //all showing/hiding and setting the graph widget state are inside here
}

function initAns() {
	for(var i=0; i<20; i++) {
		answerList[i] = -100;
	}
}

function generateQns() {
	while(questionList.length <5) {
		var n = (Math.floor(Math.random()*10))+1;
		if(questionList.indexOf(n) == -1) {
			questionList.push(n);
		}
	}
	while(questionList.length <8) {
		var n = 10+(Math.floor(Math.random()*6))+1;
		if(questionList.indexOf(n) == -1) {
			questionList.push(n);
		}
	}
	while(questionList.length <10) {
		var n = 16+(Math.floor(Math.random()*4))+1;
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
	/* //FLIPFLOP
	for(var i=0; i<20; i++) {
		qnTextArr[i]="Why did the chicken cross the road? Actual question is qn "+questionList[i];
		if(questionList[i]<10) {
			qnJSONArr[i] = jQuery.parseJSON('{"vl":{"0":{"cx":450,"cy":50,"text":"21","state":0},"1":{"cx":225,"cy":100,"text":"18","state":0},"2":{"cx":675,"cy":100,"text":"50","state":0},"3":{"cx":112.5,"cy":150,"text":"4","state":0},"4":{"cx":337.5,"cy":150,"text":"19","state":0},"5":{"cx":562.5,"cy":150,"text":"23","state":0},"6":{"cx":787.5,"cy":150,"text":"71","state":1},"7":{"cx":168.75,"cy":200,"text":"17","state":0}},"el":{"1":{"vertexA":0,"vertexB":1,"type":0,"weight":1,"state":0,"animateHighlighted":false},"2":{"vertexA":0,"vertexB":2,"type":0,"weight":1,"state":0,"animateHighlighted":false},"3":{"vertexA":1,"vertexB":3,"type":0,"weight":1,"state":0,"animateHighlighted":false},"4":{"vertexA":1,"vertexB":4,"type":0,"weight":1,"state":0,"animateHighlighted":false},"5":{"vertexA":2,"vertexB":5,"type":0,"weight":1,"state":0,"animateHighlighted":false},"6":{"vertexA":2,"vertexB":6,"type":0,"weight":1,"state":0,"animateHighlighted":false},"7":{"vertexA":3,"vertexB":7,"type":0,"weight":1,"state":0,"animateHighlighted":false}},"status":"The current BST","lineNo":0}')
		} else {
			qnJSONArr[i] = jQuery.parseJSON('{"vl":{"2":{"cx":450,"cy":50,"text":"23","state":0},"5":{"cx":675,"cy":100,"text":"71","state":0},"7":{"cx":562.5,"cy":150,"text":"50","state":0},"8":{"cx":618.75,"cy":200,"text":"60","state":0},"9":{"cx":590.625,"cy":250,"text":"55","state":0}},"el":{"5":{"vertexA":2,"vertexB":5,"type":0,"weight":1,"state":0,"animateHighlighted":false},"7":{"vertexA":5,"vertexB":7,"type":0,"weight":1,"state":0,"animateHighlighted":false},"8":{"vertexA":7,"vertexB":8,"type":0,"weight":1,"state":0,"animateHighlighted":false},"9":{"vertexA":8,"vertexB":9,"type":0,"weight":1,"state":0,"animateHighlighted":false}},"status":"Removal of 57 completed","lineNo":0}');
		}
	}
	$('#login-screen').hide();
	$('#info').show();
	$('#question-nav').show();
	$('#question-text').show();
	$('#viz').show();
	//load first question
	gw.startAnimation(qnJSONArr);
	gw.pause();
	showQn(questionList[0]);
	//time, attempt no, and date update
	updateInfo();
	infoRefresh = setInterval(function(){updateInfo()}, 10000);
	timeLeft = 1000;
	clientsideTimeUpdate();
	clientsideTimeRefresh = setInterval(function() {
		clientsideTimeUpdate();
	},1000);
	*/
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
				$.ajax({ // mode 8 to increase counter on server and start timer
					url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=8"
				}).done(function() {});
				$('#login-screen').hide();
				$('#info').show();
				$('#question-nav').show();
				$('#question-text').show();
				$('#viz').show();
				//load first question
				gw.startAnimation(qnJSONArr);
				gw.pause();
				showQn(questionList[0]);
				//time, attempt no, and date update
				updateInfo();
				infoRefresh = setInterval(function(){updateInfo()}, 10000);
				clientsideTimeUpdate();
				clientsideTimeRefresh = setInterval(function() { clientsideTimeUpdate(); },1000);
			}
		});
	});
}

/***** update display functions *****/
function showQn(q) { //answer recording stuff also in here
	currentQn = q;
	localQnNo = questionList.indexOf(q)+1;
	
	/*------question text------*/
	qnText = qnTextArr[localQnNo-1];
	$('#question-text').html(localQnNo+".&nbsp;&nbsp;&nbsp;"+qnText);
	
	/*------question graph------*/
	gw.jumpToIteration(localQnNo-1,250);
	
	/*------bind click events for answer input------*/
	$('#vertexText text').unbind('click');
	
	$('#vertexText text').click( function() {
		//record answer class (vertex number) in answerClassList
		var thisClass = $(this).attr('class');
		answerClassList[localQnNo-1] = thisClass;
		
		//record answer in answerList
		var serializer = new XMLSerializer();
		var thisString = serializer.serializeToString($(this)[0]);
		var val = thisString.split('>')[1].split('</text')[0];
		answerList[currentQn-1] = val;
		
		//use colour to indicate selected
		gw.jumpToIteration(localQnNo-1,1);
		setTimeout(function(){colourCircle(thisClass);}, 2);
		
		//mark as answered
		$('#question-nav .qnno').eq(localQnNo-1).addClass('answered');
	});
	
	/*------answer highlight------*/
	var currentQnAns = answerList[currentQn-1];
	if(currentQnAns != -100) {
		//highlight vertex
		setTimeout(function(){colourCircle(answerClassList[localQnNo-1]);}, 300);
	}
}

function colourCircle(vertexClass) { //helper function for showQn
	//add colour to the right one
	$('.'+vertexClass).each(function() {
		if($(this).prop('tagName')=='circle') { //paint both inner and outer circles black
			$(this).attr('fill','black');
			$(this).attr('stroke','black');
		}
		if($(this).prop('tagName')=='text') { //paint text label white
			$(this).attr('fill','white');
		}
	});
}

function updateInfo() {
	///* //FLIPFLOP
	$.ajax({//update timer
		url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=6"
	}).done(function(timeElapsed) {
		timeLeft = 600-timeElapsed;
		if(timeLeft <=0) {
			endTest();
		}
	});
	$.ajax({//update name
		url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=7"
	}).done(function(name) {
		$('#student-name').html(name);
	});
	$.ajax({//update attempt no
		url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=5"
	}).done(function(n) {
		$('#attempt-count').html("Attempt "+n);
	});
	/*
	$('#student-name').html("ROSE MARIE TAN");
	$('#attempt-count').html("Attempt 1");
	//*/
}

function clientsideTimeUpdate() {
	var m = Math.floor(timeLeft/60).toString();
	var s = (timeLeft%60).toString();
	if(s.length <2){ s = "0"+s; }
	$('#time-left').html(m+": "+s);
	if(timeLeft <=0) {
		endTest();
	} else {
		timeLeft--;
	}
}

/***** after submit functions *****/
function endTest() {
	/*
	var score = -1;
	if(score>=0) {
		var attemptNo = 1;
		if(attemptNo == 1) {
			$('#try-again').css('display','inline-block');
			$('#nope').css('display','inline-block');
			$('#result').html("You scored <div style='padding: 10px 0px; font-size: 36px; font-weight: bold;'>"+score+" out of 10</div>You have 1 more attempt.<br/>Do you want to try again?");
			$('#result-note').html("(The score from your final attempt will be recorded.)");
		} else if(attemptNo==2) {
			$('#try-again').css('display','none');
			$('#nope').css('display','none');
			$('#result').html("<div style='padding-top:50px;'>You scored <div style='padding: 10px 0px; font-size: 36px; font-weight: bold;'>"+score+" out of 10</div>This score will be recorded.<br/>Please show your TA this screen before you leave.<div>");
			$('#result-note').html("");
		}
		clearInterval(infoRefresh);
		clearInterval(clientsideTimeRefresh);
		goToResultScreen();
	} else {
		$('#result').html("<div style='padding-top:80px;'>You have already attempted this quiz twice. This submission will not be recorded.</div>");
		clearInterval(infoRefresh);
		clearInterval(clientsideTimeRefresh);
		goToResultScreen();
	}
	*/ //FLIPFLOP
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
					$('#nope').css('display','inline-block');
					$('#result').html("You scored <div style='padding: 10px 0px; font-size: 36px; font-weight: bold;'>"+score+" out of 10</div>You have 1 more attempt.<br/>Do you want to try again?");
					$('#result-note').html("(The score from your final attempt will be recorded.)");
				} else if(attemptNo==2){
					$('#try-again').css('display','none');
					$('#nope').css('display','none');
					$('#result').html("<div style='padding-top:50px;'>You scored <div style='padding: 10px 0px; font-size: 36px; font-weight: bold;'>"+score+" out of 10</div>This score will be recorded.<div>");
					$('#result-note').html("");
				}
				clearInterval(infoRefresh);
				clearInterval(clientsideTimeRefresh);
				goToResultScreen();
			});
		} else if(score == -1) {
			$('#result').html("<div style='padding-top:80px;'>You have already attempted this quiz twice. This submission will not be recorded.</div>");
			clearInterval(infoRefresh);
			clearInterval(clientsideTimeRefresh);
			goToResultScreen();
		}
	});
}

function goToResultScreen() {
	//hide test stuff
	$('#info').hide();
	$('#question-nav').hide();
	$('#question-text').hide();
	$('#viz').hide();
	//show results screen
	$('#result-screen').show();
}

$(document).ready (function() {
	/***** login functions *****/
	$('#login-id').focusin(function() {
		$(this).css('box-shadow','0px 0px 3px #00a594 inset');
		if ($(this).val() == "user id") {
			$(this).css('color','black');
			$(this).val("");
		}
	}).focusout(function() {
		$(this).css('box-shadow','0px 0px 3px #929292 inset');
		if ($(this).val() == "") {
			$(this).css('color','#888');
			$(this).val("user id");
		}
	});
	$('#login-pw').focusin(function() {
		$(this).css('box-shadow','0px 0px 3px #00a594 inset');
		if ($(this).val() == "password") {
			$(this).attr('type','password');
			$(this).css('color','black');
			$(this).val("");
		}
	}).focusout(function() {
		$(this).css('box-shadow','0px 0px 3px #929292 inset');
		if ($(this).val() == "") {
			$(this).css('color','#888');
			$(this).attr('type','text');
			$(this).val("password");
		}
	});
	
	$('#login').click(function() {
		studentid = $('#login-id').val();
		studentpw = $('#login-pw').val();
		///* //FLIPFLOP
		$.ajax({
			url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=0"
		}).done(function(data) {
			if(data == 0) { //not in database
				$('#login-err').html('Incorrect user id or password');
			} else if(data ==1) { //in database
				$.ajax({ //get no. of attempts
					url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=5"
				}).done(function(data) {
					if(data < 2) { //ok login
						$('#login-err').html("");
						startTest();
					}
					else //no more attempts - don't log in
						$('#login-err').html('You have exhausted your 2 attempts.');
				});
			}
		});
		/*
		if(true) {
			$('#login-err').html("");
			startTest();
		} else {
			$('#login-err').html('Incorrect user id or password');
		}
		//*/
		return false; //to prevent page reload //can put here because it doesn't depend on the ajax call
	});
	
	/***** question navigation *****/
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
		if(localQnNo < 10) {
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo).addClass('selected');
			var number = localQnNo; //+1 to increase, -1 for 1-indexing to 0-indexing
			showQn(questionList[number]);
		}
	});
	
	/***** results stuff *****/
	$('#submit-test').click(function() {
		endTest();
	});
	$('#try-again').click(function() {
		$('#result-screen').hide();
		$('#question-nav .qnno').removeClass('selected').removeClass('answered');
		$('#question-nav .qnno').eq(0).addClass('selected');
		startTest();
	});
	$('#nope').click(function() {
		$('#try-again').hide();
		$(this).hide();
		$('#result-note').html("");
		var tempArr = $('#result').html().split('</div>');
		$('#result').html(tempArr[0]+"</div>Please show your TA this screen before you leave.");
	});
});