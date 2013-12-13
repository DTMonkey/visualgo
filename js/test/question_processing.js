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
				case QUESTION_TYPE_SEARCH: return BST_SEARCH.replace('|value|', params.value);
				case QUESTION_TYPE_TRAVERSAL: return BST_TRAVERSAL.replace('|subtype|', params.subtype);
				case QUESTION_TYPE_SUCCESSOR: return BST_SUCCESSOR.replace('|value|', params.value);
				case QUESTION_TYPE_PREDECESSOR: return BST_PREDECESSOR.replace('|value|', params.value);
				case QUESTION_TYPE_MIN_VALUE: return BST_MIN;
				case QUESTION_TYPE_MAX_VALUE: return BST_MAX;
				case QUESTION_TYPE_SWAP: return BST_SWAP;
				case QUESTION_TYPE_IS_AVL: return BST_IS_AVL;
				case QUESTION_TYPE_HEIGHT: return BST_HEIGHT;
				case QUESTION_TYPE_AVL_ROTATION_INSERT: return BST_AVL_ROTATION_INSERT.replace('|limitBtm|', params.limitBtm)
																					.replace('|limitTop|', params.limitTop)
																					.replace('|rotationAmt|', params.rotationAmt);
				case QUESTION_TYPE_AVL_ROTATION_DELETE: return BST_AVL_ROTATION_DELETE.replace('|limitBtm|', params.limitBtm)
																					.replace('|limitTop|', params.limitTop)
																					.replace('|rotationAmt|', params.rotationAmt);
				case QUESTION_TYPE_AVL_HEIGHT: return BST_AVL_HEIGHT;
			}
			break;
		case QUESTION_TOPIC_HEAP:
			switch(type) {
				
			}
		default: //nothing
	}
}

function extractQnType(type, amt) {
	switch(type) {
		case ANSWER_TYPE_VERTEX:
			if(amt==ANSWER_AMT_ONE) {
				return INTERFACE_SINGLE_V;
			} else if(amt==ANSWER_AMT_MULTIPLE) {
				return INTERFACE_MULT_V;
			}
			break;
		case ANSWER_TYPE_MCQ:
			return INTERFACE_MCQ;
			break;
		case ANSWER_TYPE_VERTEX_MCQ:
			if(amt==ANSWER_AMT_ONE) {
				return INTERFACE_SUBSET_SINGLE;
			} else if(amt==ANSWER_AMT_MULTIPLE) {
				return INTERFACE_SUBSET_MULT;
			}
		case ANSWER_TYPE_FILL_BLANKS:
			return INTERFACE_BLANK;
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