surpriseColour = "#227faf"; //override common.js

var qnTextArr = new Array(); //of question text for each qn
var qnJSONArr = new Array; //of JSON objects for each qn
var questionList = new Array(); //of real (jumbled) question numbers - maps 1-20 to the real qn nos. (1-indexing, 0 is undefined)
var currentQn; //the unjumbled qn no (from php)
var localQnNo; //1-based

function submitTest() {
	//TODO: send result to server
	$('#test-screen').fadeOut("fast");
	$('#result-screen').fadeIn("fast");
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
	$('#login-no').hover(function() {
		$(this).css("background", "#eee").css("color", surpriseColour).css("cursor", "auto").val("Yes, you are.");
	}, function() {
		$(this).css("background", "#df3939").css("color", "white").css("cursor", "pointer").val("No! D:");
	}).click(function() { return false; });
	
	/*-------LOG IN AUTHENTIFICATION-------*/
	$('#login-yes').click(function() {
		//TODO: authenticate
		if(true) {
			$('#login-screen').fadeOut("fast");
			$('#instructions-screen').fadeIn("fast");
		}
		return false;
	});
	
	/*-------START TEST-------*/
	$('#start-test').click(function() {
		$('#instructions-screen').fadeOut("fast");
		$('#test-screen').fadeIn("fast");
		return false;
	});
	//TODO: load questions
	localQnNo = 1;
	
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
		showQn(questionList[localQnNo]);
	});
	$('#prev-qn').click(function() {
		if(localQnNo > 1) {
			localQnNo--;
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo-1).addClass('selected'); //eq uses zero-indexing
			showQn(questionList[localQnNo]);
		}
	});
	$('#next-qn').click(function() {
		if(localQnNo < 20) {
			localQnNo++;
			$('#question-nav .qnno').removeClass('selected');
			$('#question-nav .qnno').eq(localQnNo-1).addClass('selected'); //eq uses zero-indexing
			showQn(questionList[localQnNo]);
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
		$('#submit-check p').html('Are you really really sure? You still have '+20+' minutes left.');
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