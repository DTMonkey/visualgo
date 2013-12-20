function extractInfo(q, qnJSON) {
	qnTextArr[q] = extractQnText(qnJSON.qTopic, qnJSON.qType, qnJSON.qParams);
	qnTypeArr[q] = extractQnType(qnJSON.aType, qnJSON.aAmt);
	qnParamsArr[q] = extractQnParams(qnJSON.aParams);
	qnNoAnsArr[q] = extractQnNoAns(qnJSON.allowNoAnswer);
	qnGraphArr[q] = extractQnGraph(qnJSON.graphState);
}

function extractQnText(topic, type, params) { //returns string
	switch(topic) {
		case QUESTION_TOPIC_BST:
			switch(type) {
				case QUESTION_TYPE_SEARCH: 		toReturn = BST_SEARCH; break;
				case QUESTION_TYPE_TRAVERSAL: 	toReturn = BST_TRAVERSAL; break; 
				case QUESTION_TYPE_SUCCESSOR:	toReturn = BST_SUCCESSOR; break;
				case QUESTION_TYPE_PREDECESSOR:	toReturn = BST_PREDECESSOR; break;
				case QUESTION_TYPE_MIN_VALUE: 	toReturn = BST_MIN; break;
				case QUESTION_TYPE_MAX_VALUE: 	toReturn = BST_MAX; break;
				case QUESTION_TYPE_SWAP: 		toReturn = BST_SWAP; break;
				case QUESTION_TYPE_IS_AVL:		toReturn = BST_IS_AVL; break;
				case QUESTION_TYPE_HEIGHT:		toReturn = BST_HEIGHT; break;
				case QUESTION_TYPE_AVL_HEIGHT:	toReturn = BST_AVL_HEIGHT; break;
				case QUESTION_TYPE_LEAVES:		toReturn = BST_LEAVES; break;
				case QUESTION_TYPE_ROOT:		toReturn = BST_ROOT; break;
				case QUESTION_TYPE_INTERNAL:	toReturn = BST_INTERNAL; break;
				case QUESTION_TYPE_K_SMALLEST_VALUE:	toReturn = BST_K_SMALLEST_VALUE; break;
				case QUESTION_TYPE_AVL_ROTATION_INSERT:	toReturn = BST_AVL_ROTATION_INSERT; break;
				case QUESTION_TYPE_AVL_ROTATION_DELETE:	toReturn = BST_AVL_ROTATION_DELETE; break;
			}
			break;
		case QUESTION_TOPIC_HEAP:
			switch(type) {
				case QUESTION_TYPE_INSERTION:		toReturn = HEAP_INSERTION; break;
				case QUESTION_TYPE_EXTRACT:			toReturn = HEAP_EXTRACT; break;
				case QUESTION_TYPE_HEAP_SORT:		toReturn = HEAP_HEAP_SORT; break;
				case QUESTION_TYPE_HEAPIFY:			toReturn = HEAP_HEAPIFY; break;
				case QUESTION_TYPE_ROOT:			toReturn = HEAP_ROOT; break;
				case QUESTION_TYPE_LEAVES:			toReturn = HEAP_LEAVES; break;
				case QUESTION_TYPE_INTERNAL:		toReturn = HEAP_INTERNAL; break;
				case QUESTION_TYPE_GREATER_LESS:	toReturn = HEAP_GREATER_LESS; break;
				case QUESTION_TYPE_RELATIONS:		toReturn = HEAP_RELATIONS; break;
				case QUESTION_TYPE_IS_HEAP:			toReturn = HEAP_IS_HEAP; break;
			}
			break;
		case QUESTION_TOPIC_BITMASK:
			switch(type) {
				case QUESTION_TYPE_OPERATION:	toReturn = BITMASK_OPERATIONS; break;
				case QUESTION_TYPE_CONVERT:		toReturn = BITMASK_CONVERT; break;
				case QUESTION_TYPE_NUMBER_ON:	toReturn = BITMASK_NUMBER_ON; break;
				case QUESTION_TYPE_LSONE:		toReturn = BITMASK_LSONE; break;
			}
		case QUESTION_TOPIC_UFDS:
			switch(type) {
				case QUESTION_TYPE_FIND_SET_SEQUENCE:		toReturn = UFDS_FIND_SET_SEQUENCE; break;
				case QUESTION_TYPE_FIND_SET_COMPRESSION:	toReturn = UFDS_FIND_SET_COMPRESSION; break;
				case QUESTION_TYPE_IS_SAME_SET:				toReturn = UFDS_IS_SAME_SET; break;
			}
		case QUESTION_TOPIC_MST:
			switch(type) {
				case QUESTION_TYPE_PRIM_SEQUENCE:			toReturn = MST_PRIM_SEQUENCE; break;
				case QUESTION_TYPE_KRUSKAL_SEQUENCE:		toReturn = MST_KRUSKAL_SEQUENCE; break;
				case QUESTION_TYPE_MINIMAX_EDGE:			toReturn = MST_MINIMAX_EDGE; break;
			}
		case QUESTION_TOPIC_SSSP:
			switch(type) {
				
			}
		default: //nothing
	}
	var matches = toReturn.match(/\|[^|]+\|/g); //words between 2 pipes: |something|
	if(matches != null) {
		for(var i=0; i<matches.length; i++) {
			var p = matches[i].replace(/\|/g, "");
			toReturn = toReturn.replace(matches[i], params[p]);
		}
	}
	return toReturn;
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
		case ANSWER_TYPE_EDGE:
			if(amt==ANSWER_AMT_ONE) {
				return INTERFACE_SINGLE_E;
			} else if(amt==ANSWER_AMT_MULTIPLE) {
				return INTERFACE_MULT_E;
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

function extractQnNoAns(allowNoAns) {
	if(allowNoAns) { return ALLOW_NO_ANS; }
	else return DISALLOW_NO_ANS;
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
		v.cy = (temp/100)*400; //we use 400 instead of MAIN_SVG_WIDTH
	}
	return graph;
}