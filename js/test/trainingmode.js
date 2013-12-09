var gw = new GraphWidget();
var newHighlightColour = "#52bc69";
var sitePrefix = "http://algorithmics.comp.nus.edu.sg/~onlinequiz/quiz2.php";

var qnTextArr = new Array(); //of question text for each qn - 0 undefined, call for 1-20
var qnJSONArr = new Array; //of JSON objects for each qn
var qnTypeArr = new Array; //of each qn's type, for UI display and answer recording
var questionList = new Array(); //of real (jumbled) question numbers - maps 1-20 to the real qn nos. (1-indexing, 0 is undefined)
var ansList = new Array(); //1-based, index 0 is false
var ansClassIDList = new Array(); //1-based, index 0 is undefined
var localQnNo; //1-based
var nAnswered = 0;

function startTraining() {
	for(var i=0; i<=20; i++) { ansList[i] = -1; } //Initialise ansArr with all false - includes 20 because of 1-based indexing
	for(var i=0; i<=20; i++) { ansClassIDList[i] = false; } //Initialise ansClassIDList with all false - includes 20 because of 1-based indexing
	for(var i=0; i<20; i++) {  questionList[i] = i+1; } //Initialise questionList with running indices - 0-indexing, will unshift after scrambling
	scrambleQns();
	questionList.unshift(false); //now 1-based indexing
	//fill in dummy values for array index 0
	qnTextArr[0]="Is this a dummy question?";
	qnJSONArr[0] = jQuery.parseJSON('{"vl":{"0":{"cx":450,"cy":50,"text":"21","state":0},"1":{"cx":225,"cy":100,"text":"18","state":0},"2":{"cx":675,"cy":100,"text":"50","state":0},"3":{"cx":112.5,"cy":150,"text":"4","state":0},"4":{"cx":337.5,"cy":150,"text":"19","state":0},"5":{"cx":562.5,"cy":150,"text":"23","state":0},"6":{"cx":787.5,"cy":150,"text":"71","state":1},"7":{"cx":168.75,"cy":200,"text":"17","state":0}},"el":{"1":{"vertexA":0,"vertexB":1,"type":0,"weight":1,"state":0,"animateHighlighted":false},"2":{"vertexA":0,"vertexB":2,"type":0,"weight":1,"state":0,"animateHighlighted":false},"3":{"vertexA":1,"vertexB":3,"type":0,"weight":1,"state":0,"animateHighlighted":false},"4":{"vertexA":1,"vertexB":4,"type":0,"weight":1,"state":0,"animateHighlighted":false},"5":{"vertexA":2,"vertexB":5,"type":0,"weight":1,"state":0,"animateHighlighted":false},"6":{"vertexA":2,"vertexB":6,"type":0,"weight":1,"state":0,"animateHighlighted":false},"7":{"vertexA":3,"vertexB":7,"type":0,"weight":1,"state":0,"animateHighlighted":false}},"status":"The current BST","lineNo":0}')
	loadQns(1); //fill qnTextArr and qnJSONArr
}

function submitTest() {
	//get score
	ansList.shift();
	var ansStr = ansList.join('&ans[]=');
	var queryStr = sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=3&ans[]="+ansStr;
	$.ajax({
		url: queryStr
	}).done(function(score) {
		score = parseInt(score);
		$('#score').html(score+" out of 20");
		$('#test-screen').fadeOut("fast");
		$('#result-screen').fadeIn("fast");
	});
}

/*-------START TEST FUNCTIONS-------*/
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

function loadQns(n) {
	//for text
	$.ajax({
		url: sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=1&id="+questionList[n]
	}).done(function(data) {
		qnTextArr[n] = data;
		//for JSON
		$.ajax({
			url: sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=2&id="+questionList[n]
		}).done(function(data) {
			qnJSONArr[n] = jQuery.parseJSON(data);  
			if((n+1)<questionList.length) {
				loadQns(n+1);
			} else { // finished getting all qn data
				$.ajax({ // mode 8 to increase counter on server and start timer
					url: sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=8"
				}).done(function() {});
				//show test screen
				$('#test-screen').fadeIn("fast");
				$('#submit-test').hide();
				//load first question
				gw.startAnimation(qnJSONArr); //start graph widget
				gw.pause();
				localQnNo = 1; //start with qn 1
				showQn(localQnNo);
			}
		});
	});
}

/*-------QUESTION AND ANSWER DISPLAY FUNCTIONS-------*/
function showQn(q) { //q is local qn no	
	$('#qn-no').html(q+".");
	$('#qn-text p').html(qnTextArr[q]);
	gw.jumpToIteration(localQnNo,1);
	showInputUI(q);
	showRecordedAns(q);
}

function showInputUI(q) {
	//reset all unclickable
	$('#vertexText text, #vertex circle, #edge path').unbind('click').css('cursor','auto');
	$('#undo-ans').hide(); $('#clear-ans').hide(); $('#current-selection').html("").hide();
	
	//should shift this part to the php in the future (new mode to tell which input type):
	var actualQn = parseInt(questionList[q]);
	if(actualQn == 13) {
	/*---MULTIPLE EDGES UI---*/
		$('#edge path').css('cursor','pointer');
		$('#undo-ans').show(); $('#clear-ans').show(); printCurrentSelection();
		
		$('#edge path').click( function() {
			var edgeID = $(this).attr('id');
			var edgeList = ansList[actualQn]; if(edgeList==-1) edgeList=new Array();
			var edgeIDList = ansClassIDList[q]; if(edgeIDList===false) edgeIDList=new Array();
			
			//find vertices it joins
			var edgeIDNo = parseInt(edgeID.substr(1));
			var vertexA = qnJSONArr[q].el[edgeIDNo].vertexA;
			var vertexB = qnJSONArr[q].el[edgeIDNo].vertexB;
			var newEdge = [vertexA, vertexB];
			
			//use colour to indicate selected
			setTimeout(function(){colourEdge(edgeID);}, 2);
			
			//mark as answered
			$('#question-nav .qnno').eq(q-1).addClass('answered');
			if(!containsEdge(edgeList, newEdge)) {
				edgeList.push(newEdge);
				setAns(q,edgeList);
				edgeIDList.push(edgeID);
				ansClassIDList[q] = edgeIDList;
				printCurrentSelection();
			}
		});
		
	} else if(actualQn == 14 || actualQn == 15) {
	/*---SINGLE EDGE UI---*/
		$('#edge path').css('cursor','pointer');
		
		$('#edge path').click( function() {
			var edgeID = $(this).attr('id');
			
			//find vertices it joins
			var edgeIDNo = parseInt(edgeID.substr(1));
			var vertexA = qnJSONArr[q].el[edgeIDNo].vertexA;
			var vertexB = qnJSONArr[q].el[edgeIDNo].vertexB;
			
			//use colour to indicate selected
			gw.jumpToIteration(q,1);
			setTimeout(function(){colourEdge(edgeID);}, 2);
			
			//mark as answered
			$('#question-nav .qnno').eq(q-1).addClass('answered');
			ansClassIDList[q] = edgeID;
			setAns(q,[vertexA, vertexB]);
		});
		
	} else if(actualQn == 16) {
	/*---SINGLE VERTEX UI---*/	
		$('#vertexText text, #vertex circle').css('cursor','pointer');
		
		$('#vertexText text, #vertex circle').click( function() {
			var vertexClass = $(this).attr('class');
			
			//find vertex number
			var vertexClassNo = parseInt(vertexClass.substr(1));
			var vNo = parseInt(qnJSONArr[q].vl[vertexClassNo].text);
			
			//use colour to indicate selected
			gw.jumpToIteration(q,1);
			setTimeout(function(){colourCircle(vertexClass);}, 2);
			
			//mark as answered
			$('#question-nav .qnno').eq(q-1).addClass('answered');
			ansClassIDList[q] = vertexClass;
			setAns(q,vNo);
		});
	
	} else {
	/*---MULTIPLE VERTICES UI---*/
		$('#vertexText text, #vertex circle').css('cursor','pointer');
		$('#undo-ans').show(); $('#clear-ans').show(); printCurrentSelection();
		
		$('#vertexText text, #vertex circle').click( function() {
			var vertexList = ansList[actualQn]; if(vertexList==-1) vertexList=new Array();
			var vertexClassList = ansClassIDList[q]; if(vertexClassList===false) vertexClassList=new Array();
			var vertexClass = $(this).attr('class');
			
			//find vertex number
			var vertexClassNo = parseInt(vertexClass.substr(1));
			var vNo = parseInt(qnJSONArr[q].vl[vertexClassNo].text);
			
			//use colour to indicate selected
			setTimeout(function(){colourCircle(vertexClass);}, 2);
			
			//mark as answered
			$('#question-nav .qnno').eq(q-1).addClass('answered');
			if(vertexList.indexOf(vNo) == -1) {
				vertexList.push(vNo);
				setAns(q,vertexList);
				vertexClassList.push(vertexClass);
				ansClassIDList[q] = vertexClassList;
				printCurrentSelection();
			}
		});
	}
}

function showRecordedAns(q) {
	if(ansClassIDList[q] != false) { //if there is a recorded answer
		//should shift this part to the php in the future (new mode to tell which input type):
		var actualQn = parseInt(questionList[localQnNo]);
		if(actualQn == 13) {
		/*---MULTIPLE EDGES UI---*/
			setTimeout(function(){
				var edgesToHighlight = ansClassIDList[q];
				for(var i=0; i<edgesToHighlight.length; i++) {
					colourEdge(edgesToHighlight[i]);
				}
			}, 50);
			printCurrentSelection();
		} else if(actualQn == 14 || actualQn == 15) {
		/*---SINGLE EDGE UI---*/
			setTimeout(function(){colourEdge(ansClassIDList[q]);}, 50);
		} else if(actualQn == 16) {
		/*---SINGLE VERTEX UI---*/	
			setTimeout(function(){colourCircle(ansClassIDList[q]);}, 50);
		} else {
		/*---MULTIPLE VERTICES UI---*/
			setTimeout(function(){
				var verticesToHighlight = ansClassIDList[q];
				for(var i=0; i<verticesToHighlight.length; i++) {
					colourCircle(verticesToHighlight[i]);
				}
			}, 50);
			printCurrentSelection();
		}
	}
}

function colourCircle(vertexClass) { //helper function for showInputUI
	//add colour to the right one
	$('.'+vertexClass).each(function() {
		if($(this).prop('tagName')=='circle') { //paint both inner and outer circles surpriseColour
			$(this).attr('fill',newHighlightColour);
			$(this).attr('stroke',newHighlightColour);
		}
		if($(this).prop('tagName')=='text') { //paint text label white
			$(this).attr('fill','white');
		}
	});
}

function colourEdge(edgeID) { //helper function for showInputUI
	$('#'+edgeID).attr('stroke',newHighlightColour);
	$('#'+edgeID).attr('stroke-width',"5");
}

function containsEdge(el, e) { //helper function for showInputUI - checks if e is inside el
	for(var i=0; i<el.length; i++) {
		var currEdge = el[i];
		if(currEdge[0]==e[0]&&currEdge[1]==e[1]) return true;
	}
	return false;
}

function printCurrentSelection() {
	var thisList = ansList[questionList[localQnNo]];
	if(thisList == -1) { //no answer
		$('#current-selection').html("").hide();
	} else if(questionList[localQnNo]==13) { //edgeList
		var temp ="";
		for(var i=0; i<thisList.length; i++) {
			temp += "( "+thisList[i][0]+" , "+thisList[i][1]+" ) , ";
		}
		$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+temp.slice(0, -3)+"</strong>").show();
	} else { //vertextList
		$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+thisList.join(" , ")+"</strong>").show();
	}
}

/*-------ANSWER HANDLING FUNCTIONS-------*/
function setAns(q, ans) { //q is localQnNo
	var actualQn = parseInt(questionList[q]);
	if(ansList[actualQn] == -1) {
		nAnswered++;
	}
	ansList[actualQn] = ans;
	checkComplete();
}

function clearAns(q) { //q is localQnNo
	var actualQn = parseInt(questionList[q]);
	if(ansList[actualQn] != -1) {
		nAnswered--;
	}
	ansClassIDList[q] = false; //ansClassIDList uses the scrambled numbering
	ansList[actualQn] = -1;
	checkComplete();
}

function checkComplete() {
	if(nAnswered == 20) {
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
		$('#topics-screen').fadeOut("fast");
	});
	
	/*-------UNDO OR CLEAR INPUT-------*/
	$('#undo-ans').click(function() {
		var actualQn = parseInt(questionList[localQnNo]);
		var currAns = ansList[actualQn];
		var currClassID = ansClassIDList[localQnNo];
		if(currAns.length <= 1) {
			$('#question-nav .qnno').eq(localQnNo-1).removeClass('answered');
			clearAns(localQnNo);
			gw.jumpToIteration(localQnNo,1);
		} else {
			currAns.pop();
			setAns(localQnNo, currAns);
			currClassID.pop();
			ansClassIDList[localQnNo] = currClassID;
			gw.jumpToIteration(localQnNo,1);
			showRecordedAns(localQnNo);
		}
		printCurrentSelection();
	});
	
	$('#clear-ans').click(function() {
		$('#question-nav .qnno').eq(localQnNo-1).removeClass('answered');
		clearAns(localQnNo);
		gw.jumpToIteration(localQnNo,1);
		printCurrentSelection();
	});
	
	/*-------QN NAVIGATION-------*/
	//populate html with 20 numbers
	$('#question-nav').append('<a id="prev-qn" style="margin-right: 20px; opacity: 1.0; cursor: pointer;">PREV QN</a>');
	for(var i=0; i<20; i++) { $('#question-nav').append('<a class="qnno">'+(i+1)+'</a>'); }
	$('#question-nav').append('<a id="next-qn" style="margin-left: 20px; opacity: 1.0; cursor: pointer;">NEXT QN</a>');
	$('#question-nav .qnno').eq(0).addClass('selected');
	
	$('#question-nav .qnno').click(function() {
		$('#question-nav .qnno').removeClass('selected');
		$(this).addClass('selected');
		localQnNo = parseInt($(this).html());
		showQn(localQnNo);
	});
	$('#prev-qn').click(function() {
		if(localQnNo > 1) {
			localQnNo--;
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo-1).addClass('selected'); //eq uses zero-indexing
			showQn(localQnNo);
		}
	});
	$('#next-qn').click(function() {
		if(localQnNo < 20) {
			localQnNo++;
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo-1).addClass('selected'); //eq uses zero-indexing
			showQn(localQnNo);
		}
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