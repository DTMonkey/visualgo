var ObjectPair = function(objectOne, objectTwo){
	this.getFirst = function(){
		return objectOne;
	}

	this.getSecond = function(){
		return objectTwo;
	}

	this.setFirst = function(newObjectOne){
		objectOne = newObjectOne;
	}

	this.setSecond = function(newObjectTwo){
		objectTwo = newObjectTwo;
	}
}

ObjectPair.compare = function(objPairOne, objPairTwo){
	if(objPairOne.getFirst() > objPairTwo.getFirst()) return 1;
	else if(objPairOne.getFirst() < objPairTwo.getFirst()) return -1;
	else{
		if(objPairOne.getSecond() > objPairTwo.getSecond()) return 1;
		if(objPairOne.getSecond() < objPairTwo.getSecond()) return -1;
		else return 0;
	}
}

var ObjectTriple = function(objectOne, objectTwo, objectThree){
	this.getFirst = function(){
		return objectOne;
	}

	this.getSecond = function(){
		return objectTwo;
	}

	this.getThird = function(){
		return objectThree;
	}

	this.setFirst = function(newObjectOne){
		objectOne = newObjectOne;
	}

	this.setSecond = function(newObjectTwo){
		objectTwo = newObjectTwo;
	}

	this.setThird = function(newObjectThree){
		objectThree = newObjectThree;
	}
}

ObjectTriple.compare = function(objTripleOne, objTripleTwo){
	if(objTripleOne.getFirst() > objTripleTwo.getFirst()) return 1;
	else if(objTripleOne.getFirst() < objTripleTwo.getFirst()) return -1;
	else{
		if(objTripleOne.getSecond() > objTripleTwo.getSecond()) return 1;
		if(objTripleOne.getSecond() < objTripleTwo.getSecond()) return -1;
		else{
			if(objTripleOne.getThrid() > objTripleTwo.getThrid()) return 1;
			if(objTripleOne.getThrid() < objTripleTwo.getThrid()) return -1;
			else return 0;
		}
	}
}