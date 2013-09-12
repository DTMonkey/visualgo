var easyQnTotal = 10;
var easyQnChoose = easyQnTotal/2;
var medQnTotal = 6;
var medQnChoose = medQnTotal/2;
var diffQnTotal = 4;
var diffQnChoose = diffQnTotal/2;

var questionList = new Array();
var answerList = new Array();
var currentQn;
var localQnNo;

function initAns() {
	for(var i=0; i<20; i++) {
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

var firstLoad = true;
var qnText = "";

/*
mode 1 gives question text
mode 2 gives JSON object for drawing question graph
mode 3 gives the total score for the 20 qns
*/

function showQn(q) {
	currentQn = q;
	localQnNo = questionList.indexOf(q)+1;
	
	/*------question input, for now only: to change when using graph input------*/
	$('#answer').val(answerList[currentQn]);
	
	/*------question text------*/
	$.ajax({
		url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid=rose&mode=1&id="+q
	}).done(function(data) {
		qnText = data;
	});
	//qnText = "Given the normal Binary Search Tree (not AVL tree) shown below, which leaf vertex should be deleted to decrease the overall height of the tree?"; //to remove

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
	$.ajax({
		url: "http://algorithmics.comp.nus.edu.sg/realtest.php?uid=rose&mode=2&id="+q
	}).done(function(data) {
		jsondata = jQuery.parseJSON(data);  
		gw.updateGraph(jsondata, 100);  
	});
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

function checkAns() {
	var ansStr = answerList.join('&ans[]=');
	var queryStr = "http://algorithmics.comp.nus.edu.sg/realtest.php?uid=rose&mode=3&ans[]="+ansStr;
	console.log(queryStr);
	$.ajax({
		url: queryStr
	}).done(function(data) {
		if (data >= 0) {
			alert('Number of correct answers = ' + data); // correct
		} else if (data == -1) {
			alert('You have already used up your 2 attempts'); // wrong
		}
	});
}

$(document).ready (function() {
	var gw = new GraphWidget();
	var jsondata = "";
	
	//load first question
	generateQns();
	scrambleQns();
	initAns();
	showQn(questionList[0]);
	
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
	
	//answer stuff
	$('#answer-go').click(function() {
		answerList[currentQn] = $('#answer').val();
		return false;
	});
});