function showAnswerInterface(q) {
	//reset all unclickable
	$('#vertexText text, #vertex circle, #edge path').unbind('click').css('cursor','auto');
	$('#undo-ans').hide(); $('#clear-ans').hide(); $('#current-selection').html("").hide();
	
	switch(qnTypeArr[q]) {
		case 1: //single vertex
			$('#vertexText text, #vertex circle').css('cursor','pointer');
		
			$('#vertexText text, #vertex circle').click( function() {
				var vertexClass = $(this).attr('class');
				
				//find vertex number
				var vertexClassNo = parseInt(vertexClass.substr(1));
				var vNo = parseInt(qnGraphArr[q].vl[vertexClassNo].text);
				
				//mark as answered
				$('#question-nav .qnno').eq(q-1).addClass('answered');
				setAns(q,vNo);
				
				//highlight as answered
				gw.jumpToIteration(q,1);
				showRecordedAns(q);
			});
			break;
			
		case 2: //single edge
			$('#edge path').css('cursor','pointer');
		
			$('#edge path').click( function() {
				var edgeID = $(this).attr('id');
			
				//find vertices it joins
				var edgeIDNo = parseInt(edgeID.substr(1));
				var vertexA = parseInt(qnGraphArr[q].vl[qnGraphArr[q].el[edgeIDNo].vertexA].text);
				var vertexB = parseInt(qnGraphArr[q].vl[qnGraphArr[q].el[edgeIDNo].vertexB].text);
			
				//mark as answered
				$('#question-nav .qnno').eq(q-1).addClass('answered');
				setAns(q,[vertexA, vertexB]);
				
				//highlight as answered
				gw.jumpToIteration(q,1);
				showRecordedAns(q);
			});
			break;
			
		case 3: //multiple vertices
			$('#vertexText text, #vertex circle').css('cursor','pointer');
			$('#undo-ans').show(); $('#clear-ans').show();
			
			$('#vertexText text, #vertex circle').click( function() {
				var vertexList = ansArr[q]; if(vertexList==false) vertexList=new Array();
				var vertexClass = $(this).attr('class');
				
				//find vertex number
				var vertexClassNo = parseInt(vertexClass.substr(1));
				var vNo = parseInt(qnGraphArr[q].vl[vertexClassNo].text);
				
				//mark as answered
				$('#question-nav .qnno').eq(q-1).addClass('answered');
				if(vertexList.indexOf(vNo) == -1) {
					vertexList.push(vNo);
					setAns(q,vertexList);
					printCurrentSelection(q);
				}
				
				//highlight as answered
				showRecordedAns(q);
			});
			break;
		
		case 4: //multiple edges
			$('#edge path').css('cursor','pointer');
			$('#undo-ans').show(); $('#clear-ans').show();
			
			$('#edge path').click( function() {
				var edgeID = $(this).attr('id');
				var edgeList = ansArr[q]; if(edgeList==false) edgeList=new Array();
				
				//find vertices it joins
				var edgeIDNo = parseInt(edgeID.substr(1));
				var vertexA = parseInt(qnGraphArr[q].vl[qnGraphArr[q].el[edgeIDNo].vertexA].text);
				var vertexB = parseInt(qnGraphArr[q].vl[qnGraphArr[q].el[edgeIDNo].vertexB].text);
				var newEdge = [vertexA, vertexB];
				
				//mark as answered
				$('#question-nav .qnno').eq(q-1).addClass('answered');
				if(!containsEdge(edgeList, newEdge)) {
					edgeList.push(newEdge);
					setAns(q,edgeList);
					printCurrentSelection(q);
				}
				
				//highlight as answered
				showRecordedAns(q);
			});
			break;
			
		default: //none
	}
}

function showRecordedAns(q) {
	var ans = ansArr[q].toString();
	switch(qnTypeArr[q]) {
		case 1: //single vertex
			var verticesToHighlight = getVClass(qnGraphArr[q], ans.split(","));
			setTimeout(function(){
				for(var i=0; i<verticesToHighlight.length; i++) {
					colourCircle(verticesToHighlight[i]);
				}
			}, 50);
			break;
			
		case 2: //single edge
			var edgesToHighlight = getEID(qnGraphArr[q], ans.split(","));
			setTimeout(function(){
				for(var i=0; i<edgesToHighlight.length; i++) {
					colourEdge(edgesToHighlight[i]);
				}
			}, 50);
			break;
			
		case 3: //multiple vertices
			var verticesToHighlight = getVClass(qnGraphArr[q], ans.split(","));
			setTimeout(function(){
				for(var i=0; i<verticesToHighlight.length; i++) {
					colourCircle(verticesToHighlight[i]);
				}
			}, 50);
			printCurrentSelection(q);
			break;
			
		case 4: //multiple edges
			var edgesToHighlight = getEID(qnGraphArr[q], ans.split(","));
			setTimeout(function(){
				for(var i=0; i<edgesToHighlight.length; i++) {
					colourEdge(edgesToHighlight[i]);
				}
			}, 50);
			printCurrentSelection(q);
			break;
			
		default: //nothing
	}
}

function printCurrentSelection(q) {
	var thisList = ansArr[q];
	if(thisList == -1) { //no answer
		$('#current-selection').html("").hide();
	} else {
		switch(qnTypeArr[q]) {
			case 3:
				$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+thisList.join(" , ")+"</strong>").show();
				break;
			case 4:
				var temp ="";
				for(var i=0; i<thisList.length; i++) {
					temp += "( "+thisList[i][0]+" , "+thisList[i][1]+" ) , ";
				}
				$('#current-selection').html("Your answer is: &nbsp;&nbsp;<strong>"+temp.slice(0, -3)+"</strong>").show();
				break;
			default: //nothing
		}
	}
}

//helper functions
function getVClass(qraphJSON, vList) { //returns array
	var toReturn = new Array();
	for(var i=0; i<vList.length; i++){ //for each number in the vertex list
		var thisJSONvl = qraphJSON.vl; //look for it in the vl in the JSON object
		for(var key in thisJSONvl) {
			if(parseInt(thisJSONvl[key].text)==vList[i]) { //if it is this vertex
				toReturn.push("v"+key);
			}
		}
	}
	return toReturn;
}

function getEID(graphJSON, eList) {
	var toReturn = new Array();
	for(var i=0; i<eList.length; i+=2){ //for each pair of numbers in the edge list
		eListA = getVClass(graphJSON, [eList[i]])[0].substring(1);
		eListB = getVClass(graphJSON, [eList[i+1]])[0].substring(1);
		var thisJSONel = graphJSON.el; //look for it in the el in the JSON object
		for(var key in thisJSONel) {
			if(parseInt(thisJSONel[key].vertexA)==eListA && parseInt(thisJSONel[key].vertexB)==eListB) { //if it is this edge
				toReturn.push("e"+key);
			}
		}
	}
	return toReturn;
}

function colourCircle(vertexClass) {
	//add colour to the right one
	$('.'+vertexClass).each(function() {
		if($(this).prop('tagName')=='circle') { //paint both inner and outer circles surpriseColour
			$(this).attr('fill',surpriseColour);
			$(this).attr('stroke',surpriseColour);
		}
		if($(this).prop('tagName')=='text') { //paint text label white
			$(this).attr('fill','white');
		}
	});
}

function colourEdge(edgeID) {
	$('#'+edgeID).attr('stroke',surpriseColour);
	$('#'+edgeID).attr('stroke-width',"5");
}

function containsEdge(el, e) { //checks if e is inside el
	for(var i=0; i<el.length; i++) {
		var currEdge = el[i];
		if(currEdge[0]==e[0]&&currEdge[1]==e[1]) return true;
	}
	return false;
}
