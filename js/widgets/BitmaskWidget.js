var BitmaskWidget = function(){
	
	//bit object
	var Bit = function(v, h) {
		this.val = v;
		this.highlight = h;
	}
	
	//CONSTANTS
	var STATUS = 3;
	var LINE = 4;
	
	//attributes (default)
	var flags = 0;
	var mask = 0;
	var op = "";
	var result = 0;
	
	var statelist = new Array();
	var transitionTime = 500;
	var currentStep = 0;
	var animInterval;
	var issPlaying; //so named so as not to mess with the isPlaying in viz.js
	
	this.init = function() {
		flags = 42;
		mask = 0;
		result = this.calculateResult();
		
		var basicState = this.createBasicState();
		drawState(basicState);
		$('#op-text').html("");
		$('#result-text').html("");
	}
	
	//misc methods
	this.toBinary = function(v) { //input: integer, output: string
		if(v>=0) {
			return v.toString(2);
		} else {
			v = (v << 1) >>> 1;
			vStr = v.toString(2);
			return vStr.substr(-this.getCurrentBinLength());
		}
	}
	this.getCurrentBinLength = function() {
		return this.toBinary(flags).toString().length;
	}
	this.calculateResult = function() {
		switch(op) {
			case "set":
				return flags | mask;
			case "check":
				return flags & mask;
			case "toggle":
				return flags ^ mask; //XOR
			case "clear":
				return flags & mask;
			case "lsone":
				return flags & mask;
		}
	}
	
	//creating state objects
	this.getFlagsState = function() {
		var flagsStr = this.toBinary(flags); //flagsStr is a string
		var flagsArr = new Array(); // flagsArr is an array of Bit objects
		for(var i=0; i<flagsStr.length; i++) {
			var newBit = new Bit(flagsStr.charAt(i),false);
			flagsArr.push(newBit);
		}
		return flagsArr;
	}
	this.getMaskState = function() {
		var maskStr = this.toBinary(mask); //maskStr is a string
		var maskArr = new Array(); // maskArr is an array of Bit objects
		for(var i=0; i<maskStr.length; i++) {
			var newBit = new Bit(maskStr.charAt(i),false);
			maskArr.push(newBit);
		}
		var padAmt = this.getCurrentBinLength() - maskStr.length//padAmt is an int
		for(var i=padAmt; i>0; i--) {
			maskArr.unshift(new Bit(0,false));
		}
		return maskArr;
	}
	this.getResultState = function() {
		var resultStr = this.toBinary(result); // resultStr is a string
		var resultArr = new Array(); // resultArr is an array of Bit objects
		for(var i=0; i<resultStr.length; i++) {
			var newBit = new Bit(resultStr.charAt(i),false);
			resultArr.push(newBit);
		}
		var padAmt = this.getCurrentBinLength() - resultStr.length//padAmt is an int
		for(var i=padAmt; i>0; i--) {
			resultArr.unshift(new Bit(0,false));
		}
		return resultArr;
	}	
	this.createBasicState = function() {
		var basicState = new Array();
		basicState.push(this.getFlagsState()); //index 0
		basicState.push(this.getMaskState()); //index 1
		basicState.push(this.getResultState()); //index 2
		return basicState;
	}

	//drawing functions
	drawState = function(stateArr) {
		$('#viz').html("");
		var f = stateArr[0];
		var m = stateArr[1];
		var r = stateArr[2];
		var length = f.length;
		var totalwidth = length*32 + (length-1)*3;
		var startx = (900-totalwidth)/2;
		
		//for flags
		for(var i=0; i<length; i++) {
			var left = (startx+(35*i));
			var val = (f[i].val == 1 ? "I" : "0");
			var bgCol = (f[i].highlight ? surpriseColour : "#ddd");
			var col = (f[i].highlight ? "white" : "black");
			var padding = (f[i].val == 1 ? "4px 13px" : "4px 11px");
			$('#viz').append('<span class="bit" style="top: 100px; left:'+left+'px; background:'+bgCol+'; padding:'+padding+'; color:'+col+';">'+val+'</span>');
		}
		//for mask
		for(var i=0; i<length; i++) {
			var left = (startx+(35*i));
			var val = (m[i].val == 1 ? "I" : "0");
			var bgCol = (m[i].highlight ? surpriseColour : "#ddd");
			var col = (m[i].highlight ? "white" : "black");
			var padding = (m[i].val == 1 ? "4px 13px" : "4px 11px");
			$('#viz').append('<span class="bit" style="top: 135px; left:'+left+'px; background:'+bgCol+'; padding:'+padding+'; color:'+col+';">'+val+'</span>');
		}
		//for result
		for(var i=0; i<length; i++) {
			var left = (startx+(35*i));
			var val = (r[i].val == 1 ? "I" : "0");
			var bgCol = (r[i].highlight ? surpriseColour : "#ddd");
			var col = (r[i].highlight ? "white" : "black");
			var padding = (r[i].val == 1 ? "4px 13px" : "4px 11px");
			$('#viz').append('<span class="bit" style="top: 186px; left:'+left+'px; background:'+bgCol+'; padding:'+padding+'; color:'+col+';">'+val+'</span>');
		}
		//for operation
		var logicalOp = "";
		var SText = "= S";
		var jText = "= j";
		var resultText = "= New S";
		switch (op) {
			case "set":
				logicalOp = "OR";
				break;
			case "check":
				logicalOp = "AND";
				break;
			case "toggle":
				logicalOp = "XOR";
				break;
			case "clear":
				logicalOp = "AND";
				break;
			case "lsone":
				logicalOp = "AND";
				resultText = "= Result";
				break;
		}
		$('#viz').append('<span class="viz-text" id="op-text" style="top: 139px; left:'+(startx-90)+'px;">'+logicalOp+'</span>');
		$('#viz').append('<span class="viz-text" id="S-text" style="left:'+(startx+totalwidth+20)+'px;">'+SText+'</span>');
		$('#viz').append('<span class="viz-text" id="j-text" style="left:'+(startx+totalwidth+20)+'px;">'+jText+'</span>');
		$('#viz').append('<span class="viz-text" id="result-text" style="left:'+(startx+totalwidth+20)+'px;">'+resultText+'</span>');
		$('#viz').append('<span id="divider" style="top: 175px; left:'+(startx-60)+'px; width:'+(totalwidth+60)+'px;"></span>');
		
		$('#status p').html(stateArr[STATUS]);
		highlightLine(stateArr[LINE]);
	}

	//main bitmask functions
	this.checkSetToggle = function(j, opp) { //j is an int
		if(j>=this.getCurrentBinLength()) {
			$('#'+opp+'-err').html("You cannot "+opp+" a bit that is not within range!");
			return false;
		}		
		mask = 1;
		op = opp;
		result = this.calculateResult();
		var basicState = this.createBasicState();
		basicState[1][basicState[1].length-1].highlight = true;
		basicState[STATUS] = "Shift j left by "+j+" bits";
		basicState[LINE] = 1;
		statelist.push(basicState);
		
		for(var i=2; i<=j; i++) {
			mask = mask << 1;
			result = this.calculateResult();
			
			basicState = this.createBasicState();
			basicState[1][basicState[1].length-i].highlight = true;
			basicState[STATUS] = "Shift j left by "+j+" bits";
			basicState[LINE] = 1;
			statelist.push(basicState);
		}
		if(j > 0) {
			mask = mask << 1;
			result = this.calculateResult();		
			basicState = this.createBasicState();
		}
		
		basicState[0][basicState[0].length-j-1].highlight = true;
		basicState[1][basicState[1].length-j-1].highlight = true;
		basicState[2][basicState[2].length-j-1].highlight = true;
		var logicalOpp = "OR";
		if(opp=="check") {
			logicalOpp = "AND";
		} else if(opp=="toggle") {
			logicalOpp = "XOR";
		}
		basicState[STATUS] = "Result of "+flags+" "+logicalOpp+" "+mask+" is "+result;
		basicState[LINE] = 2;
		statelist.push(basicState);
		
		populateCodetrace(opp);
		this.play();
		return true;
	}
	
	this.setFlags = function(f) {
		f = parseInt(f);
		var intRegex = /^\d+$/;
		if(!intRegex.test(f)) {
			$('#setFlags-err').html("Please enter an integer from 1 to 32767!");
			return false;
		} else {
			if(f > 32767) {
				$('#setFlags-err').html("S exceeds the maximum value of 16-bit signed integer (2^15 - 1 or 32767)");
				return false;
			} else {
				flags = f;
				mask = 0;
				result = 0;
		
				var basicState = this.createBasicState();
				drawState(basicState);
				$('#op-text').html("");
				$('#result-text').html("");
		
				return true;
			}
		}
	}
	
	this.clear = function(j) {
		if(j>=this.getCurrentBinLength()) {
			$('#clear-err').html("You cannot clear a bit that is not within range!");
			return false;
		}
		//shifting left
		mask = 1;
		op = "clear";
		result = this.calculateResult();
		var basicState = this.createBasicState();
		basicState[1][basicState[1].length-1].highlight = true;
		basicState[STATUS] = "Shift j left by "+j+" bits";
		basicState[LINE] = 1;
		statelist.push(basicState);
		
		for(var i=2; i<=j; i++) {
			mask = mask << 1;
			result = this.calculateResult();
			
			basicState = this.createBasicState();
			basicState[1][basicState[1].length-i].highlight = true;
			basicState[STATUS] = "Shift j left by "+j+" bits";
			basicState[LINE] = 1;
			statelist.push(basicState);
		}
		if(j > 0) {
			mask = mask << 1;
			result = this.calculateResult();		
			basicState = this.createBasicState();
			basicState[1][basicState[1].length-j-1].highlight = true;
			basicState[STATUS] = "Shift j left by "+j+" bits";
			basicState[LINE] = 1;
			statelist.push(basicState);
		}
		
		//invert mask
		mask = ~mask;
		result = this.calculateResult();
		basicState = this.createBasicState();
		for(var i=0; i<basicState[1].length; i++) {
			basicState[1][i].highlight = true;
		}
		basicState[STATUS] = "Inverted j is "+mask;
		basicState[LINE] = 2;
		statelist.push(basicState);
		
		//highlight result
		basicState = this.createBasicState();
		basicState[0][basicState[0].length-j-1].highlight = true;
		basicState[1][basicState[1].length-j-1].highlight = true;
		basicState[2][basicState[2].length-j-1].highlight = true;
		basicState[STATUS] = "Result of "+flags+" AND "+mask+" is "+result;
		basicState[LINE] = 3;
		statelist.push(basicState);
		
		populateCodetrace("clear");
		this.play();
		return true;
	}
	
	this.LSOne = function() {
		mask = (~flags)+1;
		op = "lsone";
		result = this.calculateResult();
		var basicState = this.createBasicState();
		for(var i=0; i<basicState[1].length; i++) {
			basicState[1][i].highlight = true;
		}
		basicState[STATUS] = "j is "+mask;
		basicState[LINE] = 1;
		statelist.push(basicState);
		
		basicState = this.createBasicState();
		for(var i=basicState[2].length-1; i>=0; i--) {
			if(basicState[2][i].val == 0) {
				continue;
			} else { //the 1
				basicState[2][i].highlight =true;
				basicState[0][i].highlight =true;
				basicState[STATUS] = "Result of "+flags+" AND "+mask+" is "+result;
				basicState[LINE] = 2;
				statelist.push(basicState);
			}
		}
		
		populateCodetrace("lsone");
		this.play();
		return true;
	}
	
	//animation functions		
	drawCurrentState = function() {
		$('#progress-bar').slider("value", currentStep);
		drawState(statelist[currentStep]);
		if(currentStep == (statelist.length-1)) {
			  pause(); //in html file
			  $('#play img').attr('src','img/replay.png').attr('alt','replay').attr('title','replay');
		  } else {
			  $('#play img').attr('src','img/play.png').attr('alt','play').attr('title','play');
		  }
	}
	
	this.getAnimationDuration = function() {
		return transitionTime;
	}
	this.setAnimationDuration = function(x) {
		transitionTime = x;
		if(issPlaying) {
			clearInterval(animInterval);
			animInterval = setInterval(function(){
					drawCurrentState();
					if(currentStep < (statelist.length-1)) {
						currentStep++;
					} else {
						clearInterval(animInterval);
					}
				}, transitionTime);
		}
	}
	this.getCurrentIteration = function() {
		return currentStep;
	}
	this.getTotalIteration = function() {
		return statelist.length;
	}
	
	this.forceNext = function() {
		if((currentStep+1)<(statelist.length)) {
			currentStep++;
		}
		drawCurrentState();
	}
	this.forcePrevious = function() {
		if((currentStep-1)>=0) {
			currentStep--;
		}
		drawCurrentState();
	}
	this.jumpToIteration = function(n) {
		currentStep = n;
		drawCurrentState();
	}
	
	this.play = function() {
		issPlaying = true;
		drawCurrentState();
		animInterval = setInterval(function(){
				drawCurrentState();
				if(currentStep < (statelist.length-1)) {
					currentStep++;
				} else {
					clearInterval(animInterval);
				}
			}, transitionTime);
	}
	this.pause = function() {
		issPlaying = false;
		clearInterval(animInterval);
	}
	this.replay = function() {
		issPlaying = true;
		currentStep = 0;
		drawCurrentState();
		animInterval = setInterval(function(){
				drawCurrentState();
				if(currentStep < (statelist.length-1)) {
					currentStep++;
				} else {
					clearInterval(animInterval);
				}
			}, transitionTime);
	}
	this.stop = function() {
		issPlaying = false;
		statelist = new Array(); //clear statelist
		currentStep = 0;
	}
	
	//codetrace stuff
	function populateCodetrace(n) {
		switch(n) {
			case "lsone":
				$('#code1').html("j = NOT(S)+1");
				$('#code2').html("S AND j");
				$('#code3').html("");
				$('#code4').html("");
				$('#code5').html("");
				$('#code6').html("");
				$('#code7').html("");
				break;
			case "clear":
				$('#code1').html("shift left j");
				$('#code2').html("invert j");
				$('#code3').html("S AND j");
				$('#code4').html("");
				$('#code5').html("");
				$('#code6').html("");
				$('#code7').html("");
				break;
			case "set":
				$('#code1').html("shift left j");
				$('#code2').html("S OR j");
				$('#code3').html("");
				$('#code4').html("");
				$('#code5').html("");
				$('#code6').html("");
				$('#code7').html("");
				break;
			case "check":
				$('#code1').html("shift left j");
				$('#code2').html("S AND j");
				$('#code3').html("");
				$('#code4').html("");
				$('#code5').html("");
				$('#code6').html("");
				$('#code7').html("");
				break;
			case "toggle":
				$('#code1').html("shift left j");
				$('#code2').html("S XOR j");
				$('#code3').html("");
				$('#code4').html("");
				$('#code5').html("");
				$('#code6').html("");
				$('#code7').html("");
				break;
		}
	}
}










