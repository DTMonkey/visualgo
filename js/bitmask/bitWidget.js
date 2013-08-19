var BitWidget = function(str, length, maskInverted){
	
	//attributes
	this.bitArray = str.split("").reverse(); //because we are drawing from the right
	this.boxWidth = 40;
	this.boxHeight = 40;
	
	//methods
	this.invertBits = function() {
		for(var i=0; i<this.bitArray.length; i++) {
			this.bitArray[i] = 1-this.bitArray[i];
		}
	}
	
	this.padString = function() { //with zeros
		for(var i=0; i<length-str.length; i++) {
			if(!maskInverted) {
				this.bitArray.push("0");
			} else {
				this.bitArray.push("1");
			}
		}
	}
	
	this.getBitData = function() {
		var bitData = [];
		var x = 710;
		var y = 0;
		if(maskInverted) {
			this.invertBits();
		}
		this.padString();
		for(var i=0; i<length; i++) {
			var bit = this.bitArray[i];
			if(bit == "1") { bit = "I"; }
			bitData[i] = { "x": x,"y": y, "width": this.boxWidth, "height" : this.boxHeight, "bitVal": bit };
			x -= 44;
		}
		return bitData;
	}
	
}