var BitmaskWidget = function(){
	
	//attributes
	this.flags = 0;
	this.mask = 0;
	this.op = "OR"; //default
	this.result = 0;
	this.maskInverted = false;
	
	//methods
	this.init = function() {
		this.flags = 42; //default
		this.mask = 1; //default
		this.op = "OR"; //default
		this.update();
	}
	
	this.toBinary = function(v) {
		var r = '';
		while (v > 0) {
			r = (v % 2) + r;
			v = Math.floor(v / 2); // only take the integer part
		}
		return r;
	}
	
	this.update = function() {
		this.result = this.calculateResult();
		d3.selectAll("svg").remove();
		d3.select("#viz").html('<svg id="flags"></svg><svg id="mask"></svg><div id="op">'+this.op+'</div><div id="line"></div><svg id="result"></svg>'); //fix later
		this.drawFlags();
		this.drawMask();
		this.drawResult();
	}
	
	//operations methods
	this.setOp = function(newOp) {
		this.op = newOp;
		this.update();
	}
	
	//flags methods
	this.setFlagsValue = function(newVal) {
		var intRegex = /^\d+$/;
		if(intRegex.test(newVal)) {
			if(newVal > 32767) {
				alert("S exceeds the maximum value of 16-bit signed integer (2^15 - 1 or 32767), we will reduce S to 32767");
				this.flags = 32767;
			} else {
				this.flags = newVal;
			}
			this.update();
		} else {
			alert("Please enter an integer from 1 to 32767.");
		}
	}
	
	this.getCurrentBinLength = function() {
		return this.toBinary(this.flags).toString().length;
	}
	
	this.drawFlags = function() {
		var flagsBitWidget = new BitWidget(this.toBinary(this.flags).toString(), this.getCurrentBinLength(), this.maskInverted&&false);
		var newData = flagsBitWidget.getBitData();
		var svgContainer = d3.select("#flags");
		var bitBackgrounds = svgContainer.selectAll("rect").data(newData).enter().append("rect");
		var text = svgContainer.selectAll("text").data(newData).enter().append("text");
		//Add the rect attributes
		var rectAttributes = bitBackgrounds
                       			.attr("x", function (d) { return d.x; })
                      			.attr("y", function (d) { return d.y; })
                       			.attr("width", function (d) { return d.width; })
                      			.attr("height", function (d) { return d.height; });
		var textLabels = text
						.attr("x", function(d) { return d.x+17; })
						.attr("y", function(d) { return d.y+27; })
						.text( function (d) { return d.bitVal; });
	}
	
	//mask methods
	this.shiftMaskLeft = function() {
		if(this.mask<(Math.pow(2,this.getCurrentBinLength()-1))) {
			this.mask = this.mask<<1;
		}
		this.result = this.calculateResult();
		this.update();
	}
		
	this.shiftMaskRight = function() {
		if(this.mask>1) {
			this.mask = this.mask>>1;
		}
		this.result = this.calculateResult();
		this.update();
	}
	
	this.drawMask = function() {
		var maskBitWidget = new BitWidget(this.toBinary(this.mask).toString(), this.getCurrentBinLength(), this.maskInverted&&true);
		var newData = maskBitWidget.getBitData();
		var svgContainer = d3.select("#mask");
		var bitBackgrounds = svgContainer.selectAll("rect").data(newData).enter().append("rect");
		var text = svgContainer.selectAll("text").data(newData).enter().append("text");
		//Add the rect attributes
		var rectAttributes = bitBackgrounds
                       			.attr("x", function (d) { return d.x; })
                      			.attr("y", function (d) { return d.y; })
                       			.attr("width", function (d) { return d.width; })
                      			.attr("height", function (d) { return d.height; });
		var textLabels = text
						.attr("x", function(d) { return d.x+17; })
						.attr("y", function(d) { return d.y+27; })
						.text( function (d) { return d.bitVal; });
	}
	
	//result methods
	this.calculateResult = function() {
		var ans = 0;
		if(this.op == "OR") {
			this.maskInverted = false;
			ans = this.flags | this.mask;
		} else if (this.op == "AND") {
			this.maskInverted = false;
			ans = this.flags & this.mask;
		} else if (this.op == "XOR") {
			this.maskInverted = false;
			ans = this.flags ^ this.mask;
		} else if (this.op == "NAND") {
			this.maskInverted = true;
			ans = this.flags & (~ this.mask);
		} else if (this.op == "LSOne") {
			this.mask = (~ this.flags)+1;
			ans = this.flags & this.mask;
		}
		return ans;
	}
	
	this.drawResult = function() {
		var resultBitWidget = new BitWidget(this.toBinary(this.result).toString(), this.getCurrentBinLength(), this.maskInverted&&false);
		var newData = resultBitWidget.getBitData();
		var svgContainer = d3.select("#result");
		var bitBackgrounds = svgContainer.selectAll("rect").data(newData).enter().append("rect");
		var text = svgContainer.selectAll("text").data(newData).enter().append("text");
		//Add the rect attributes
		var rectAttributes = bitBackgrounds
                       			.attr("x", function (d) { return d.x; })
                      			.attr("y", function (d) { return d.y; })
                       			.attr("width", function (d) { return d.width; })
                      			.attr("height", function (d) { return d.height; });
		var textLabels = text
						.attr("x", function(d) { return d.x+17; })
						.attr("y", function(d) { return d.y+27; })
						.text( function (d) { return d.bitVal; });
	}

}