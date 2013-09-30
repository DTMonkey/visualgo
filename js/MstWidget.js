// @author  Ivan Reinaldo
// Defines a MST object; keeps implementation of graph internally and interact with GraphWidget to display Prim and Kruskal MST visualizations

// MST Example Constant
var MST_EXAMPLE_TESSELLATION = 0;
var MST_EXAMPLE_K5 = 1;
var MST_EXAMPLE_RAIL = 2;
var MST_EXAMPLE_CP4P9 = 3;
var MST_EXAMPLE_CP4P13 = 4;

// MST Type Constant
var MST_MIN = 0; // Minimum Spanning Tree
var MST_MAX = 1; // Maximum Spanning Tree

var MST = function(){
  var self = this;
  var graphWidget = new GraphWidget();

  var valueRange = [1, 100]; // Range of valid values of BST vertexes allowed

  /*
   *  Structure of internalAdjList: JS object with
   *  - key: vertex number
   *  - value: JS object with
   *           - key: the other vertex number that is connected by the edge
   *           - value: ID of the edge, NOT THE WEIGHT OF THE EDGE
   *
   *  The reason why the adjList didn't store edge weight is because it will be easier to create bugs
   *  on information consistency between the adjList and edgeList
   *
   *  Structure of internalEdgeList: JS object with
   *  - key: edge ID
   *  - value: JS object with the following keys:
   *           - vertexA
   *           - vertexB
   *           - weight
   */

  var internalAdjList = {};
  var internalEdgeList = {};
  var amountVertex = 0;
  var amountEdge = 0;

  this.getGraphWidget = function(){
    return graphWidget;
  }

  this.prim = function(startVertexText, mstTypeConstant){
    var key;
    var i;
    var notVisited = {};
    var vertexHighlighted = {}, edgeHighlighted = {}, vertexTraversed = {}, edgeTraversed = {};
    var stateList = [];
    var currentState;
	
	//add error checks
	if(amountVertex == 0) { //no graph
		$('#prims-err').html("There is no graph to run this on. Please select a sample graph first.");
		return false;
	}
	if(startVertexText >= amountVertex) { //start vertex not in range
		$('#prims-err').html("This vertex does not exist in the graph");
		return false;
	}

    for(key in internalAdjList){
      if(key == "cx" || key == "cy") continue;
      if(key != startVertexText) notVisited[key] = true;
    }

    currentState = createState(internalAdjList, internalEdgeList);
    stateList.push(currentState);

    vertexHighlighted[startVertexText] = true;
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    stateList.push(currentState);

    delete vertexHighlighted[startVertexText];
    vertexTraversed[startVertexText] = true;

    var sortedArray = [];
    
    for(key in internalAdjList[startVertexText]){
      if(key == "cx" || key == "cy") continue;

      var enqueuedEdgeId = internalAdjList[startVertexText][key];
      var enqueuedEdge;
      if(mstTypeConstant == MST_MAX)
        enqueuedEdge = enqueuedEdge = new ObjectTriple(-1*internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
      else enqueuedEdge = new ObjectTriple(internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
      edgeTraversed[enqueuedEdgeId] = true;
      sortedArray.push(enqueuedEdge);
    }

    sortedArray.sort(ObjectTriple.compare);

    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    stateList.push(currentState);

    while(Object.keys(notVisited).length > 0){
      var dequeuedEdge = sortedArray.shift();
      var otherVertex = dequeuedEdge.getSecond();
      var edgeId = dequeuedEdge.getThird();
      if(notVisited[otherVertex] != null){
        delete edgeTraversed[edgeId];
        edgeHighlighted[edgeId] = true;
        vertexHighlighted[otherVertex] = true;

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
        currentState["el"][edgeId]["animateHighlighted"] = true;
        stateList.push(currentState);

        delete notVisited[otherVertex];

        delete vertexHighlighted[otherVertex];
        vertexTraversed[otherVertex] = true;

        for(key in internalAdjList[otherVertex]){
          if(key == "cx" || key == "cy") continue;

          var enqueuedEdgeId = internalAdjList[otherVertex][key];
          var enqueuedEdge;
          if(mstTypeConstant == MST_MAX)
            enqueuedEdge = enqueuedEdge = new ObjectTriple(-1*internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
          else enqueuedEdge = new ObjectTriple(internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
          if(edgeHighlighted[enqueuedEdgeId] == null){
            edgeTraversed[enqueuedEdgeId] = true;
            sortedArray.push(enqueuedEdge);
          }
        }

        sortedArray.sort(ObjectTriple.compare);

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
        stateList.push(currentState);
      }

      else{
        delete edgeTraversed[edgeId];

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
        stateList.push(currentState);
      }
    }

    /* For MST, I'm considering of NOT using the original graph as the final state
     * This is because:
     * 1. The current GraphWidget doesn't break down if the final state is not the original graph
     * 2. It's less intuitive for the students to NOT display the MST at the final state of the animation
     */

    edgeTraversed = {};
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    stateList.push(currentState);

    console.log(stateList);

	populatePseudocode(0);
    graphWidget.startAnimation(stateList);
	return true;
  }

  this.kruskal = function(mstTypeConstant){
    var key;
    var i;
    var stateList = [];
    var currentState;
    var vertexHighlighted = {}, edgeHighlighted = {}, vertexTraversed = {}, edgeTraversed = {};
    var sortedArray = [];
    var tempUfds = new UfdsHelper();
	
	//add error checks
	if(amountVertex == 0) { //no graph
		$('#kruskals-err').html("There is no graph to run this on. Please select a sample graph first.");
		return false;
	}

    currentState = createState(internalAdjList, internalEdgeList);

    for(key in internalAdjList){
      tempUfds.insert(key);
    }

    for(key in internalEdgeList){
      var enqueuedEdge;
      if(mstTypeConstant == MST_MAX) enqueuedEdge = new ObjectPair(-1*internalEdgeList[key]["weight"], key);
      else enqueuedEdge = new ObjectPair(internalEdgeList[key]["weight"], key);
      sortedArray.push(enqueuedEdge);
    }

    sortedArray.sort(ObjectPair.compare);
	
	var sortedArrayToString = "";
	for(var i=0; i<sortedArray.length; i++) {
		var thisEdgeId = sortedArray[i].getSecond();
		sortedArrayToString += "("+internalEdgeList[thisEdgeId]["vertexA"]+","+internalEdgeList[thisEdgeId]["vertexB"]+")";
		if(i < (sortedArray.length-1)) {
			sortedArrayToString += ", ";
		}
	}
	currentState["status"] = 'Edges are sorted in increasing order of weight: '+sortedArrayToString;
	currentState["lineNo"] = [1,2];
    stateList.push(currentState);

    while(sortedArray.length > 0){
      var dequeuedEdge = sortedArray.shift();
      var dequeuedEdgeId = dequeuedEdge.getSecond();
      var vertexA = internalEdgeList[dequeuedEdgeId]["vertexA"];
      var vertexB = internalEdgeList[dequeuedEdgeId]["vertexB"];

      edgeTraversed[dequeuedEdgeId] = true;
      vertexHighlighted[vertexA] = true;
      vertexHighlighted[vertexB] = true;

      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
	  currentState["status"] = 'Checking if adding edge ('+vertexA+','+vertexB+') forms a cycle';
	  currentState["lineNo"] = 4;
      stateList.push(currentState);

	  var noCycle = false;
      if(!tempUfds.isSameSet(vertexA, vertexB)){
		noCycle = true;
        tempUfds.unionSet(vertexA, vertexB);
        edgeHighlighted[dequeuedEdgeId] = true;
        vertexTraversed[vertexA] = true;
        vertexTraversed[vertexB] = true;
      }

      delete edgeTraversed[dequeuedEdgeId];
      delete vertexHighlighted[vertexA];
      delete vertexHighlighted[vertexB];

      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
	  if(noCycle) {
	  	currentState["status"] = 'Edge ('+vertexA+','+vertexB+') does not form a cycle, so add it to T';
	  	currentState["lineNo"] = 5;
	  } else {
		currentState["status"] = 'Edge ('+vertexA+','+vertexB+') forms a cycle, so ignore it';
	  	currentState["lineNo"] = 6;
	  }
      stateList.push(currentState);
    }
	
	currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
	currentState["status"] = 'The highlighted edges form a Minimum Spanning Tree';
	currentState["lineNo"] = 7;
    stateList.push(currentState);
	
	populatePseudocode(1);
    graphWidget.startAnimation(stateList);
	return true;
  }

  this.examples = function(mstExampleConstant){
    switch(mstExampleConstant){
      case MST_EXAMPLE_TESSELLATION:
        internalAdjList = {
        };
        internalEdgeList = {
        };
        break;
      case MST_EXAMPLE_K5:
        internalAdjList = {
        };
        internalEdgeList = {
        };
        break;
      case MST_EXAMPLE_RAIL:
        internalAdjList = {
        };
        internalEdgeList = {
        };
        break;
      case MST_EXAMPLE_CP4P9:
        internalAdjList = {
          0:{
            "cx": 150,
            "cy": 150,
            1:0,
            2:1,
            3:2,
            4:3
          },
          1:{
            "cx": 200,
            "cy": 100,
            0:0,
            2:4
          },
          2:{
            "cx": 250,
            "cy": 150,
            0:1,
            1:4,
            3:5
          },
          3:{
            "cx": 200,
            "cy": 200,
            0:2,
            2:5,
            4:6
          },
          4:{
            "cx": 150,
            "cy": 250,
            0:3,
            3:6
          }
        };
        internalEdgeList = {
          0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 4
          },
          1:{
              "vertexA": 0,
              "vertexB": 2,
              "weight": 4
          },
          2:{
              "vertexA": 0,
              "vertexB": 3,
              "weight": 6
          },
          3:{
              "vertexA": 0,
              "vertexB": 4,
              "weight": 6
          },
          4:{
              "vertexA": 1,
              "vertexB": 2,
              "weight": 2
          },
          5:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 8
          }
          ,
          6:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 9
          }
        };
        amountVertex = 5;
        amountEdge = 7;
        break;
      case MST_EXAMPLE_CP4P13:
        internalAdjList = {
        };
        internalEdgeList = {
        };
        break;
    }

    var newState = createState(internalAdjList, internalEdgeList);

    graphWidget.updateGraph(newState, 500);
	return true;
  }

  function createState(internalAdjListObject, internalEdgeListObject, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed){
    if(vertexHighlighted == null) vertexHighlighted = {};
    if(edgeHighlighted == null) edgeHighlighted = {};
    if(vertexTraversed == null) vertexTraversed = {};
    if(edgeTraversed == null) edgeTraversed = {};

  	var key;
  	var state = {
      "vl":{},
      "el":{}
    };

  	for(key in internalAdjListObject){
  		state["vl"][key] = {};

  		state["vl"][key]["cx"] = internalAdjListObject[key]["cx"];
  		state["vl"][key]["cy"] = internalAdjListObject[key]["cy"];
  		state["vl"][key]["text"] = key;
  		state["vl"][key]["state"] = VERTEX_DEFAULT;
  	}

  	for(key in internalEdgeListObject){
  		state["el"][key] = {};

      state["el"][key]["vertexA"] = internalEdgeListObject[key]["vertexA"];
      state["el"][key]["vertexB"] = internalEdgeListObject[key]["vertexB"];
      state["el"][key]["type"] = EDGE_TYPE_UDE;
      state["el"][key]["weight"] = internalEdgeListObject[key]["weight"];
      state["el"][key]["state"] = EDGE_DEFAULT;
      state["el"][key]["displayWeight"] = true;
      state["el"][key]["animateHighlighted"] = false;
  	}

    for(key in vertexHighlighted){
      state["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
    }

    for(key in edgeHighlighted){
      state["el"][key]["state"] = EDGE_HIGHLIGHTED;
    }

    for(key in vertexTraversed){
      state["vl"][key]["state"] = VERTEX_TRAVERSED;
    }

    for(key in edgeTraversed){
      state["el"][key]["state"] = EDGE_TRAVERSED;
    }

  	return state;
  }
  
  function populatePseudocode(act) {
    switch (act) {
      case 0: // Prim's
        $('#code1').html('');
        $('#code2').html('');
        $('#code3').html('');
        $('#code4').html('');
        $('#code5').html('');
        $('#code6').html('');
        $('#code7').html('');
        break;
      case 1: // Kruskal's
        $('#code1').html('Sort E edges by increasing weight');
		$('#code2').html('T = empty set');
        $('#code3').html('for (i=0; i&lt;edgeList.length; i++)');
        $('#code4').html('&nbsp;&nbsp;if adding e=edgelist[i] does not form a cycle');
        $('#code5').html('&nbsp;&nbsp;&nbsp;&nbsp;add e to T');
        $('#code6').html('&nbsp;&nbsp;else ignore e');
        $('#code7').html('T is a MST');
        break;
    }
  }
}