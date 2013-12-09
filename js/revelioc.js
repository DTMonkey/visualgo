var gw = new GraphWidget();
var studentid;
var studentpw;
var studentname;
surpriseColour = "#227faf"; //override common.js - a blue
var newHighlightColour = "#52bc69";
var sitePrefix = "http://algorithmics.comp.nus.edu.sg/~onlinequiz/quiz2b.php";

var qnTextArr = new Array(); //of question text for each qn - 0 undefined, call for 1-20
var qnJSONArr = new Array; //of JSON objects for each qn
var questionList = new Array(); //of real (jumbled) question numbers - maps 1-20 to the real qn nos. (1-indexing, 0 is undefined)
var ansList = new Array(); //1-based, index 0 is -1
var localQnNo; //1-based

var ansKeyList = new Array(); //1-based, index 0 is -1

var infoRefresh; //setInterval function

function startTest() {
	for(var i=0; i<=20; i++) { questionList[i] = i; } //Initialise questionList with running indices - includes 20 because of 1-based indexing
	//this is the answer key
	var ansKeyStr = "15,80,76,77|1,2|6,13,24,25|1,2,3,4,5|4,5,7|3,5,6,7|1,2,3|3|2,0,1,3,4|8,3,1,2,4|6,1,2,7,0|9,8,2,1,6|1,2,1,6,6,7,0,1,8,9|5,6|2,8|0|0,1,2,3,5|0,5,6,7|1,2,3,4,7|2,7";
	ansKeyList = ansKeyStr.split("|");
	ansKeyList.unshift(-1);
	//fill in dummy values for array index 0
	qnTextArr[0]="Is this a dummy question?";
	qnJSONArr[0] = jQuery.parseJSON('{"vl":{"0":{"cx":450,"cy":50,"text":"21","state":0},"1":{"cx":225,"cy":100,"text":"18","state":0},"2":{"cx":675,"cy":100,"text":"50","state":0},"3":{"cx":112.5,"cy":150,"text":"4","state":0},"4":{"cx":337.5,"cy":150,"text":"19","state":0},"5":{"cx":562.5,"cy":150,"text":"23","state":0},"6":{"cx":787.5,"cy":150,"text":"71","state":1},"7":{"cx":168.75,"cy":200,"text":"17","state":0}},"el":{"1":{"vertexA":0,"vertexB":1,"type":0,"weight":1,"state":0,"animateHighlighted":false},"2":{"vertexA":0,"vertexB":2,"type":0,"weight":1,"state":0,"animateHighlighted":false},"3":{"vertexA":1,"vertexB":3,"type":0,"weight":1,"state":0,"animateHighlighted":false},"4":{"vertexA":1,"vertexB":4,"type":0,"weight":1,"state":0,"animateHighlighted":false},"5":{"vertexA":2,"vertexB":5,"type":0,"weight":1,"state":0,"animateHighlighted":false},"6":{"vertexA":2,"vertexB":6,"type":0,"weight":1,"state":0,"animateHighlighted":false},"7":{"vertexA":3,"vertexB":7,"type":0,"weight":1,"state":0,"animateHighlighted":false}},"status":"The current BST","lineNo":0}')
	getStudentAns();
	loadQns(1); //fill qnTextArr and qnJSONArr
}

/*-------START TEST FUNCTIONS-------*/
function getStudentAns() {
	$.ajax({
		url: sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=9"
	}).done(function(data) { //assume data is a string of |-separated values
		ansList = data.toString().split("|");
		ansList.unshift(-1);
	});
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
				//show test screen
				$('#login-screen').fadeOut("fast");
				$('#test-screen').fadeIn("fast");
				//load first question
				gw.startAnimation(qnJSONArr); //start graph widget
				gw.pause();
				localQnNo = 1; //start with qn 1
				showQn(localQnNo);
				//time, attempt no, and date update
				updateInfo();
				infoRefresh = setInterval(function(){updateInfo()}, 10000); //10 sec
			}
		});
	});
}

/*-------QUESTION AND ANSWER DISPLAY FUNCTIONS-------*/
function showQn(q) { //q is local qn no	
	$('#qn-no').html(q+".");
	$('#qn-text p').html(qnTextArr[q]);
	gw.jumpToIteration(localQnNo,1);
	$('#current-selection').html("").hide();
	$('#ans-key').html("").hide();
	showRecordedAns(q);
}

function showRecordedAns(q) {
	var actualQn = parseInt(questionList[localQnNo]);
	
	var studentAns = ansList[actualQn];
	var correctAns = ansKeyList[actualQn];
	var isCorrect = (studentAns==correctAns);
	
	if(actualQn >= 13 && actualQn <= 15) {
	/*---EDGE UI---*/
		var STedgesToHighlight = getEID(studentAns.split(","));
		var edgesToHighlight = getEID(correctAns.split(","));
		setTimeout(function(){
			for(var i=0; i<STedgesToHighlight.length; i++) {
				colourEdge(STedgesToHighlight[i], "#df3939");
			}
			for(var i=0; i<edgesToHighlight.length; i++) {
				colourEdge(edgesToHighlight[i], newHighlightColour);
			}
		}, 50);
		printCurrentSelection(isCorrect);
	} else {
	/*---VERTEX UI---*/	
		var STverticesToHighlight = getVClass(studentAns.split(","));
		var verticesToHighlight = getVClass(correctAns.split(","));
		setTimeout(function(){
			for(var i=0; i<STverticesToHighlight.length; i++) {
				colourCircle(STverticesToHighlight[i], "#df3939");
			}
			for(var i=0; i<verticesToHighlight.length; i++) {
				colourCircle(verticesToHighlight[i], newHighlightColour);
			}
		}, 50);
		printCurrentSelection(isCorrect);
	}
}

function getVClass(vList) { //returns array
	var toReturn = new Array();
	for(var i=0; i<vList.length; i++){ //for each number in the vertex list
		var thisJSONvl = qnJSONArr[localQnNo].vl; //look for it in the vl in the JSON object
		for(var key in thisJSONvl) {
			if(parseInt(thisJSONvl[key].text)==vList[i]) { //if it is this vertex
				toReturn.push("v"+key);
			}
		}
	}
	return toReturn;
}

function getEID(eList) {
	var toReturn = new Array();
	for(var i=0; i<eList.length; i+=2){ //for each pair of numbers in the edge list
		var thisJSONel = qnJSONArr[localQnNo].el; //look for it in the el in the JSON object
		for(var key in thisJSONel) {
			if(parseInt(thisJSONel[key].vertexA)==eList[i] && parseInt(thisJSONel[key].vertexB)==eList[i+1]) { //if it is this edge
				toReturn.push("e"+key);
			}
		}
	}
	return toReturn;
}

function colourCircle(vertexClass, colour) { //helper function for showInputUI
	//add colour to the right one
	$('.'+vertexClass).each(function() {
		if($(this).prop('tagName')=='circle') { //paint both inner and outer circles colour
			$(this).attr('fill',colour);
			$(this).attr('stroke',colour);
		}
		if($(this).prop('tagName')=='text') { //paint text label white
			$(this).attr('fill','white');
		}
	});
}

function colourEdge(edgeID, colour) { //helper function for showInputUI
	$('#'+edgeID).attr('stroke',colour);
	$('#'+edgeID).attr('stroke-width',"5");
}

function printCurrentSelection(isCorrect) {
	var thisList = ansList[questionList[localQnNo]];
	var theCorrectList = ansKeyList[questionList[localQnNo]];
	
	//edge list questions
	if(questionList[localQnNo]>=13 && questionList[localQnNo]<=15) {
		var tempArr = thisList.split(",");
		var tempArr2 = theCorrectList.split(",");
		var temp ="";
		var temp2="";
		for(var i=0; i<tempArr.length; i+=2) {
			temp += "( "+tempArr[i]+" , "+tempArr[i+1]+" ) , ";
		}
		for(var i=0; i<tempArr2.length; i+=2) {
			temp2 += "( "+tempArr2[i]+" , "+tempArr2[i+1]+" ) , ";
		}
		if(isCorrect) {
			$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+temp.slice(0, -3)+"</strong>").css('color',newHighlightColour).show();
			$('#ans-key').html("You answered this question correctly! :)").show();
		} else {
			if(thisList == "-1" || thisList == "-1,") { //did not answer
				$('#current-selection').html("<strong>You did not answer this question.</strong>").css('color','#df3939').show();
			} else { //wrong answer
				$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+temp.slice(0, -3)+"</strong>").css('color','#df3939').show();
			}
			$('#ans-key').html("The correct answer is: &nbsp;&nbsp;<strong>"+temp2.slice(0, -3)+"</strong>").show();
		}
		
	//vertex list questions
	} else {
		if(isCorrect) {
			$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+thisList.split(",").join(" , ")+"</strong>").css('color',newHighlightColour).show();
			$('#ans-key').html("You answered this question correctly! :)").show();
		} else {
			if(thisList == "-1" || thisList == "-1,") { //did not answer
				$('#current-selection').html("<strong>You did not answer this question.</strong>").css('color','#df3939').show();
			} else { //wrong answer
				$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+thisList.split(",").join(" , ")+"</strong>").css('color','#df3939').show();
			}
			$('#ans-key').html("The correct answer is: &nbsp;&nbsp;<strong>"+theCorrectList.split(",").join(" , ")+"</strong>").show();
		}
	}
}

/*-------INFO/TIME UPDATE FUNCTIONS-------*/
function updateInfo() {
	$.ajax({//update name
		url: sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=7"
	}).done(function(name) {
		$('#student-name').html(name);
		studentname = name;
	});
}

$(document).ready (function() {
	
	/*-------LOG IN CSS-------*/
	$('#login-id').focusin(function() {
		$(this).css('box-shadow','0px 0px 3px #227faf inset');
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
		$(this).css('box-shadow','0px 0px 3px #227faf inset');
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
	
	/*-------LOG IN AUTHENTIFICATION-------*/
	$('#login-yes').click(function() {
		studentid = $('#login-id').val();
		studentpw = $('#login-pw').val();
		//authenticate
		$.ajax({
			url: sitePrefix+"?uid="+studentid+"&pwd="+studentpw+"&mode=0"
		}).done(function(data) {
			if(data == 0) { //not in database
				$('#login-err').html('Incorrect user id or password');
			} else if(data ==1) { //in database
				$('#login-err').html("");
				startTest();
			}
		});
		return false;
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
	
});