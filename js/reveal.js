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

function initAns() {
	answerList = [17, 55, 3, 15, 6, 53, 4, 43, 45, 89, 44, 40, 20, 42, 45, -42, 3, -7, 7, 35];
	//also init answerClassList
	for(var i=0;i<20;i++) {
		answerClassList[i] = "unknown";
	}
}

function generateQns() {
	for(var i=0;i<20;i++) {
		questionList.push(i+1);
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
	///*
	$.ajax({
		url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid="+studentid+"&pwd="+studentpw+"&mode=9"
	}).done(function(data) { //assume data is a string of comma-separated values
		var tempArr = data.toString().split(",");
		for(var i=0;i<20;i++) {
			studentAnsList[i]=tempArr[i];
		}
	});
	/*
	//testing set:
	var data = "-100,-100,3,15,6,-100,-100,-100,45,89,44,40,-100,-100,45,-100,-100,-100,7,12";
	var tempArr = data.toString().split(",");
	for(var i=0;i<20;i++) {
		studentAnsList[i]=parseInt(tempArr[i]);
	}
	//*/
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
	$('#vertexText circle').css('cursor','default');
	
	setTimeout(function(){
		/*------answer key highlight------*/
		var currentQnAns = answerList[currentQn-1];
		if(currentQnAns != -100) {
			//get vertex number if not already known
			if(answerClassList[localQnNo-1] == "unknown") {
				$('#vertexText text').each(function() {
					var serializer = new XMLSerializer();
					var thisString = serializer.serializeToString($(this)[0]);
					val = parseInt(thisString.split('>')[1].split('</text')[0]);
					if((val == currentQnAns) && ($(this).attr('font-size')=="16")) { //font-size check because of some graph-drawing artifacts
						answerClassList[localQnNo-1] = $(this).attr('class');
					}
				});
			}
			//highlight vertex
			colourCircle(answerClassList[localQnNo-1]);
		}
		/*------student answer highlight------*/
		var studentAns = studentAnsList[currentQn-1];
		if(studentAns != -100) { // student answered this question
			$('#vertexText text').each(function() {
				var serializer = new XMLSerializer();
				var thisString = serializer.serializeToString($(this)[0]);
				val = thisString.split('>')[1].split('</text')[0];
				if((val == studentAns) && ($(this).attr('font-size')=="16")) { //found the right vertex-text text object
					//highlight vertex
					var c = $(this).attr('class'); //get its class
					if(studentAns==currentQnAns) {
						colourStudentCircle(c, "#52bc69");
						$('#question-text').append("<br/><br/>You answered this correctly :)");
					} else {
						colourStudentCircle(c, "#d9513c");
						$('#question-text').append("<br/><br/>You got this question wrong :(");
					}
				}
			});
		}
	}, 350);
}

function colourCircle(vertexClass) { //helper function for showQn
	//add colour to the right one
	console.log("highlighting answer class "+vertexClass);
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