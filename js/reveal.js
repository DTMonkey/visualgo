surpriseColour = '#00a594'; //override: IT WILL ALWAYS BE DARK TURQUOISE
var studentid;
var studentpw;
var studentname;
var gw = new GraphWidget();

var questionList = new Array(); //maps 0-19 to the actual questions 1-20
var qnTextArr = new Array(); //of question text for each of the 20 qns - from mode 1
var qnJSONArr = new Array; //of JSON objects for each of the 20 qns - from mode 2
var answerList = new Array(); //answer key to all 20 qns
var answerClassList = new Array(); //of the vertex class for the 20 qns
var studentAnsList = new Array(); // 20 array of the student's 10 ans
var currentQn;
var localQnNo; //1-based

/***** initialising functions *****/
function startTest() {
	generateQns();
	initAns();
	getStudentAns();
	getQnData(0); //all showing/hiding and setting the graph widget state are inside here
}

function initAns() { //to  be changed to the answer key - just define answerList to be an array of strings
	for(var i=0; i<20; i++) {
		if(i<10) {
			answerList[i] = "17";
		} else {
			answerList[i] = "55";
		}
	}
}

function generateQns() {
	for(var i=0;i<20;i++) {
		questionList.push(i+1);
	}
}

function getQnData(n) {
	/* //FLIPFLOP
	for(var i=0; i<20; i++) {
		qnTextArr[i]="Why did the chicken cross the road? Actual question is qn "+questionList[i];
		if(questionList[i]<=10) {
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
				$('#login-screen').hide();
				$('#info').show();
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
	//*/
}

function getStudentAns() {
	//do ajax here with new mode
	//for now, dummy set:
	studentAnsList = ["4","18","19","17","21","23","50","71","-100","-100"]; //TODO: add 10 more for 11-20
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
	
	/*------overwrite css pointer cursor------*/
	$('#vertexText text').css('cursor','default');
	
	/*------answer key highlight------*/
	var currentQnAns = answerList[currentQn-1];
	if(currentQnAns != -100) {
		//get vertex number if not already known
		if(answerClassList[localQnNo-1] == null) {
			$('#vertexText text').each(function() {
				var serializer = new XMLSerializer();
				var thisString = serializer.serializeToString($(this)[0]);
				val = thisString.split('>')[1].split('</text')[0];
				if(val == currentQnAns) {
					answerClassList[localQnNo-1] = $(this).attr('class');
				}
			});
		}
		//highlight vertex
		setTimeout(function(){colourCircle(answerClassList[localQnNo-1]);}, 350);
	}
	/*------student answer highlight------*/
	var studentAns = studentAnsList[currentQn-1];
	if(studentAns != "-100") {
		$('#vertexText text').each(function() {
			var serializer = new XMLSerializer();
			var thisString = serializer.serializeToString($(this)[0]);
			val = thisString.split('>')[1].split('</text')[0];
			if(val == studentAns) { //found the right vertex-text text object
				//highlight vertex
				var c = $(this).attr('class'); //get its class
				if(studentAns==currentQnAns) {
					setTimeout(function(){colourStudentCircle(c, "#52bc69");}, 350);
				} else {
					setTimeout(function(){colourStudentCircle(c, "#d9513c");}, 350);
				}
			}
		});
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

function colourStudentCircle(vertexClass, c) { //helper function for showQn
	//add colour to the right one
	$('.'+vertexClass).each(function() {
		if(($(this).prop('tagName')=='circle')&&($(this).attr('stroke-width')=='2')) { //outer circle
			$(this).attr('fill',c);
			$(this).attr('stroke',c);
		}
	});
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
				$('#login-err').html("");
				startTest();
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
		if(localQnNo < 20) {
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo).addClass('selected');
			var number = localQnNo; //+1 to increase, -1 for 1-indexing to 0-indexing
			showQn(questionList[number]);
		}
	});
});