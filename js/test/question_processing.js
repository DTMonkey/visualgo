function extractInfo(q, qnJSON) {
	qnTextArr[q] = extractQnText(qnJSON.qTopic, qnJSON.qType, qnJSON.qParams);
	qnTypeArr[q] = extractQnType(qnJSON.aType, qnJSON.aAmt, qnJSON.aParams);
	//add additional extraction for allowNoAnswer
	qnGraphArr[q] = extractQnGraph(qnJSON.graphState);
}

function extractQnText(topic, type, params) { //returns string
	switch(topic) {
		case QUESTION_TOPIC_BST:
			switch(type) {
				case QUESTION_TYPE_SEARCH:
					return BST_SEARCH.replace('|value|', params.value);
					break;
				case QUESTION_TYPE_TRAVERSAL:
					return BST_TRAVERSAL.replace('|subtype|', params.subtype);
					break;
			}
			break;
		default: //nothing
	}
}

function extractQnType(type, amt, params) {
	switch(type) {
		case ANSWER_TYPE_VERTEX:
			if(amt==ANSWER_AMT_ONE) {
				return 1;
			} else if(amt==ANSWER_AMT_MULTIPLE) {
				return 3;
			}
			break;
		default: //nothing
	}
	//to add more
}

function extractQnGraph(graph) {
	var vList = graph.vl;
	var eList = graph.el;
	for(var key in vList) {
		var temp;
		var v = vList[key];
		temp = v.cxPercentage;
		v.cxPercentage = v.cx;
		v.cx = (temp/100)*MAIN_SVG_WIDTH;
		temp = v.cyPercentage;
		v.cyPercentage = v.cy;
		v.cy = (temp/100)*MAIN_SVG_HEIGHT;
	}
	return graph;
}

















