function extractInfo(q, qnJSON) {
	qnTextArr[q] = extractQnText(qnJSON.qTopic, qnJSON.qType, qnJSON.qParams);
	qnTypeArr[q] = extractQnType(qnJSON.aType, qnJSON.aAmt);
	qnParamsArr[q] = extractQnParams(qnJSON.aParams);
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
				case QUESTION_TYPE_SUCCESSOR:
					return BST_SUCCESSOR.replace('|value|', params.value);
					break;
				case QUESTION_TYPE_PREDECESSOR:
					return BST_PREDECESSOR.replace('|value|', params.value);
					break;
				case QUESTION_TYPE_MIN_VALUE:
					return BST_MIN;
					break;
				case QUESTION_TYPE_MAX_VALUE:
					return BST_MAX;
					break;
				case QUESTION_TYPE_SWAP:
					return BST_SWAP;
					break;
				case QUESTION_TYPE_IS_AVL:
					return BST_IS_AVL;
					break;
				case QUESTION_TYPE_AVL_ROTATION:
					return BST_AVL_ROTATION.replace('|subtype|', params.subtype)
						.replace('|limitBtm|', params.limitBtm)
						.replace('|limitTop|', params.limitTop)
						.replace('|rotationAmt|', params.rotationAmt);
				case QUESTION_TYPE_AVL_HEIGHT:
					return BST_AVL_HEIGHT;
			}
			break;
		default: //nothing
	}
}

function extractQnType(type, amt) {
	switch(type) {
		case ANSWER_TYPE_VERTEX:
			if(amt==ANSWER_AMT_ONE) {
				return 1;
			} else if(amt==ANSWER_AMT_MULTIPLE) {
				return 3;
			}
			break;
		case ANSWER_TYPE_MCQ:
			return 5;
			break;
		default: //nothing
	}
	//to add more
}

function extractQnParams(params) {
	var toReturn = new Array();
	for(var key in params) {
		toReturn.push([key,params[key]]);
	}
	return toReturn;
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