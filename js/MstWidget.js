// @author  Ivan Reinaldo
// Defines a MST object; keeps implementation of graph internally and interact with GraphWidget to display Prim and Kruskal MST visualizations

// MST Example Constant
var MST_EXAMPLE_TESSELLATION = 0;
var MST_EXAMPLE_K5 = 1;
var MST_EXAMPLE_RAIL = 2;
var MST_EXAMPLE_CP4P10 = 3;
var MST_EXAMPLE_CP4P14 = 4;

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
    var vertexHighlighted = {}, edgeHighlighted = {}, vertexTraversed = {}, edgeTraversed = {}, edgeQueued = {};
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
    currentState["status"] = 'The original graph';
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    vertexTraversed[startVertexText] = true;
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
    currentState["status"] = 'add '+startVertexText+' to set T';
    currentState["lineNo"] = 1;
    stateList.push(currentState);

    delete vertexHighlighted[startVertexText];
    vertexTraversed[startVertexText] = true;

    var sortedArray = [];

    function sortedArrayToString() {
      var ansStr = "";
	  var maxLength = Math.min(sortedArray.length, 6);
      for(var i=0; i<maxLength; i++) {
        var thisTriple = sortedArray[i];
        ansStr += "("+thisTriple.getFirst()+","+thisTriple.getSecond()+")";
        if(i < (maxLength-1)) {
          ansStr += ", ";
        }
      }
	  if(sortedArray.length > 6) {ansStr += "..";}
	  if(ansStr == "") {ansStr = "empty";}
      return ansStr;
    }
     
    var enqueuedToString = "";
    
    for(key in internalAdjList[startVertexText]){
      if(key == "cx" || key == "cy") continue;

      var enqueuedEdgeId = internalAdjList[startVertexText][key];
      var enqueuedEdge;
      if(mstTypeConstant == MST_MAX)
        enqueuedEdge = enqueuedEdge = new ObjectTriple(-1*internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
      else enqueuedEdge = new ObjectTriple(internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
      edgeQueued[enqueuedEdgeId] = true;
      enqueuedToString += "("+internalEdgeList[enqueuedEdgeId]["weight"]+","+key+"), ";
      sortedArray.push(enqueuedEdge);
    }

    enqueuedToString = enqueuedToString.substring(0,enqueuedToString.length-2);

    sortedArray.sort(ObjectTriple.compare);

    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
    currentState["status"] = 'Add '+enqueuedToString+' to the PQ.<br/>The PQ is now '+sortedArrayToString()+'.';
    currentState["lineNo"] = 2;
    stateList.push(currentState);

    while(/*Object.keys(notVisited).length > 0*/sortedArray.length>0){
      var dequeuedEdge = sortedArray.shift();
      var otherVertex = dequeuedEdge.getSecond();
      var edgeId = dequeuedEdge.getThird();

	  vertexHighlighted[otherVertex] = true;
	  edgeHighlighted[edgeId] = true;
      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
      currentState["status"] = 'Remove pair ('+dequeuedEdge.getFirst()+','+otherVertex+') from PQ. Check if vertex '+otherVertex+' is in T.<br/>The PQ is now '+sortedArrayToString()+'.';
      currentState["lineNo"] = 4;
      stateList.push(currentState);

      if(notVisited[otherVertex] != null){
        delete edgeHighlighted[edgeId];
        edgeHighlighted[edgeId] = true;
        vertexHighlighted[otherVertex] = true;

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
        //currentState["el"][edgeId]["animateHighlighted"] = true;
        currentState["status"] = otherVertex+' is not in T';
        currentState["lineNo"] = 4;
        stateList.push(currentState);

        delete notVisited[otherVertex];
        delete vertexHighlighted[otherVertex];
		delete edgeHighlighted[edgeId];
		edgeTraversed[edgeId] = true;
        vertexTraversed[otherVertex] = true;

        var enqueuedToString = "";

        for(key in internalAdjList[otherVertex]){
          if(key == "cx" || key == "cy") continue;
          if(notVisited[key] == null) continue;

          var enqueuedEdgeId = internalAdjList[otherVertex][key];
          var enqueuedEdge;
          if(mstTypeConstant == MST_MAX)
            enqueuedEdge = enqueuedEdge = new ObjectTriple(-1*internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
          else enqueuedEdge = new ObjectTriple(internalEdgeList[enqueuedEdgeId]["weight"], key, enqueuedEdgeId);
          if(edgeQueued[enqueuedEdgeId] == null){
            edgeQueued[enqueuedEdgeId] = true;
            enqueuedToString += "("+internalEdgeList[enqueuedEdgeId]["weight"]+","+key+"), ";
            sortedArray.push(enqueuedEdge);
          }
        }

        enqueuedToString = enqueuedToString.substring(0,enqueuedToString.length-2);
        sortedArray.sort(ObjectTriple.compare);

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
        currentState["status"] = 'so add '+otherVertex+' to T, and add '+enqueuedToString+' to the Priority Queue.<br/>The PQ is now '+sortedArrayToString()+'.';
        currentState["lineNo"] = 5;
        stateList.push(currentState);
      }

      else{
        delete edgeQueued[edgeId];
		delete edgeHighlighted[edgeId];

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
        currentState["status"] = otherVertex+' is in T, so ignore this edge';
        currentState["lineNo"] = 6;
        stateList.push(currentState);
      }
    }

    /* For MST, I'm considering of NOT using the original graph as the final state
     * This is because:
     * 1. The current GraphWidget doesn't break down if the final state is not the original graph
     * 2. It's less intuitive for the students to NOT display the MST at the final state of the animation
     */

    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
    currentState["status"] = 'The highlighted vertices and edges form a Minimum Spanning Tree';
    currentState["lineNo"] = 7;
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
    var vertexHighlighted = {}, edgeHighlighted = {}, vertexTraversed = {}, edgeTraversed = {}, edgeQueued={};
    var sortedArray = [];
    var tempUfds = new UfdsHelper();
    var totalWeight = 0;

    //add error check
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
      if(mstTypeConstant == MST_MAX) {
		  edgeQueued[key]=true;
		  enqueuedEdge = new ObjectPair(-1*internalEdgeList[key]["weight"], parseInt(key));
	  }
      else {
		  edgeQueued[key]=true;
		  enqueuedEdge = new ObjectPair(internalEdgeList[key]["weight"], parseInt(key));
	  }
      sortedArray.push(enqueuedEdge);
    }

    sortedArray.sort(ObjectPair.compare);

    function sortedArrayToString() {
      var ansStr = "";
	  var maxLength = Math.min(sortedArray.length, 10);
      for(var i=0; i<maxLength; i++) {
        var thisEdgeId = sortedArray[i].getSecond();
        ansStr += "("+internalEdgeList[thisEdgeId]["weight"]+",("+internalEdgeList[thisEdgeId]["vertexA"]+","+internalEdgeList[thisEdgeId]["vertexB"]+"))";
        if(i < (maxLength-1)) {
          ansStr += ", ";
        }
      }
	  if(sortedArray.length > 10) {
		  ansStr += " ...";
	  }
      return ansStr;
    }
    
	currentState = createState(internalAdjList, internalEdgeList,vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
    currentState["status"] = 'Edges are sorted in increasing order of weight: '+sortedArrayToString();
    currentState["lineNo"] = [1,2];
    stateList.push(currentState);

    while(sortedArray.length > 0){
      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
      if(sortedArray.length > 1) {
        currentState["status"] = 'The remaining edges are '+sortedArrayToString();
      } else if(sortedArray.length == 1) {
      	currentState["status"] = 'The remaining edge is '+sortedArrayToString();
      }
      currentState["lineNo"] = 3;
      stateList.push(currentState);

      var dequeuedEdge = sortedArray.shift();
      var dequeuedEdgeId = dequeuedEdge.getSecond();
      var vertexA = internalEdgeList[dequeuedEdgeId]["vertexA"];
      var vertexB = internalEdgeList[dequeuedEdgeId]["vertexB"];
      var thisWeight = internalEdgeList[dequeuedEdgeId]["weight"];

      edgeHighlighted[dequeuedEdgeId] = true;
      vertexHighlighted[vertexA] = true;
      vertexHighlighted[vertexB] = true;

      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
      currentState["status"] = 'Checking if adding edge ('+thisWeight+',('+vertexA+','+vertexB+')) forms a cycle';
      currentState["lineNo"] = 4;
      stateList.push(currentState);

      var noCycle = false;

      if(!tempUfds.isSameSet(vertexA, vertexB)){
        noCycle = true;
        tempUfds.unionSet(vertexA, vertexB);
        edgeTraversed[dequeuedEdgeId] = true;
        vertexTraversed[vertexA] = true;
        vertexTraversed[vertexB] = true;
        totalWeight += parseInt(thisWeight);
      }

      delete edgeHighlighted[dequeuedEdgeId];
	  delete edgeQueued[dequeuedEdgeId]
      delete vertexHighlighted[vertexA];
      delete vertexHighlighted[vertexB];

      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
      if(noCycle) {
        currentState["status"] = 'Adding edge ('+vertexA+','+vertexB+') with weight '+thisWeight+' does not form a cycle, so add it to T. The current weight of T is '+totalWeight+'.';
        currentState["lineNo"] = 5;
      } else {
      	currentState["status"] = 'Adding edge ('+vertexA+','+vertexB+') will form a cycle, so ignore it. The current weight of T remains at '+totalWeight+'.';
        currentState["lineNo"] = 6;
      }
      stateList.push(currentState);
    }

    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued);
    currentState["status"] = 'The highlighted vertices and edges form a Minimum Spanning Tree with MST weight = '+totalWeight;
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
		  0:{
            "cx": 200,
            "cy": 50,
            1:0,
			2:1
          },
		  1:{
            "cx": 200,
            "cy": 170,
            0:0,
			2:2,
			3:3,
			4:4
          },
		  2:{
            "cx": 350,
            "cy": 110,
            0:1,
			1:2,
			3:5,
			6:6
          },
		  3:{
            "cx": 500,
            "cy": 170,
            1:3,2:5,4:7,5:8,6:9,7:10,8:11
          },
		  4:{
            "cx": 275,
            "cy": 290,
            1:4,3:7,5:12
          },
		  5:{
            "cx": 500,
            "cy": 290,
            3:8,4:12,7:13
          },
		  6:{
            "cx": 600,
            "cy": 50,
            2:6,3:9,8:14
          },
		  7:{
            "cx": 640,
            "cy": 240,
            3:10,5:13,8:15
          },
		  8:{
            "cx": 700,
            "cy": 120,
            3:11,6:14,7:15
          }
        };
        internalEdgeList = {
		  0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 8
          },
		  1:{
              "vertexA": 0,
              "vertexB": 2,
              "weight": 12
          },
		  2:{
              "vertexA": 1,
              "vertexB": 2,
              "weight": 13
          },
		  3:{
              "vertexA": 1,
              "vertexB": 3,
              "weight": 25
          },
		  4:{
              "vertexA": 1,
              "vertexB": 4,
              "weight": 9
          },
		  5:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 14
          },
		  6:{
              "vertexA": 2,
              "vertexB": 6,
              "weight": 21
          },
		  7:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 20
          },
		  8:{
              "vertexA": 3,
              "vertexB": 5,
              "weight": 8
          },
		  9:{
              "vertexA": 3,
              "vertexB": 6,
              "weight": 12
          },
		  10:{
              "vertexA": 3,
              "vertexB": 7,
              "weight": 12
          },
		  11:{
              "vertexA": 3,
              "vertexB": 8,
              "weight": 16
          },
		  12:{
              "vertexA": 4,
              "vertexB": 5,
              "weight": 19
          },
		  13:{
              "vertexA": 5,
              "vertexB": 7,
              "weight": 11
          },
		  14:{
              "vertexA": 6,
              "vertexB": 8,
              "weight": 11
          },
		  15:{
              "vertexA": 7,
              "vertexB": 8,
              "weight": 9
          },
        };
		amountVertex = 9;
        amountEdge = 16;
        break;
      case MST_EXAMPLE_K5:
        internalAdjList = {
		  0:{
            "cx": 280,
            "cy": 150,
            1:0,
			2:1,
			3:2,
			4:3
          },
		  1:{
            "cx": 620,
            "cy": 150,
            0:0,
			2:4,
			3:5,
			4:6
          },
		  2:{
            "cx": 350,
            "cy": 340,
            0:1,
			1:4,
			3:7,
			4:8
          },
		  3:{
            "cx": 450,
            "cy": 50,
            0:2,
			1:5,
			2:7,
			4:9
          },
		  4:{
            "cx": 550,
            "cy": 340,
            0:3,
			1:6,
			2:8,
			3:9
          }
        };
        internalEdgeList = {
		  0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 24
          },
		  1:{
              "vertexA": 0,
              "vertexB": 2,
              "weight": 13
          },
		  2:{
              "vertexA": 0,
              "vertexB": 3,
              "weight": 13
          },
		  3:{
              "vertexA": 0,
              "vertexB": 4,
              "weight": 22
          },
		  4:{
              "vertexA": 1,
              "vertexB": 2,
              "weight": 22
          },
		  5:{
              "vertexA": 1,
              "vertexB": 3,
              "weight": 13
          },
		  6:{
              "vertexA": 1,
              "vertexB": 4,
              "weight": 13
          },
		  7:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 19
          },
		  8:{
              "vertexA": 2,
              "vertexB": 4,
              "weight": 14
          },
		  9:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 19
          },
        };
		amountVertex = 5;
        amountEdge = 10;
        break;
      case MST_EXAMPLE_RAIL:
        internalAdjList = {
          0:{
            "cx": 50,
            "cy": 100,
            1:0
          },
          1:{
            "cx": 250,
            "cy": 100,
            0:0,
            2:1,
            6:2,
            7:3
          },
          2:{
            "cx": 450,
            "cy": 100,
            1:1,
            3:4,
            7:5,
            8:6
          },
          3:{
            "cx": 650,
            "cy": 100,
            2:4,
            4:7,
            8:8
          },
          4:{
            "cx": 850,
            "cy": 100,
            3:7
          },
          5:{
            "cx": 50,
            "cy": 250,
            6:9
          },
          6:{
            "cx": 250,
            "cy": 250,
            1:2,
            5:9,
            7:10
          },
          7:{
            "cx": 450,
            "cy": 250,
            1:3,
            2:5,
            6:10,
            8:11
          },
          8:{
            "cx": 650,
            "cy": 250,
            2:6,
            3:8,
            7:11,
            9:12
          },
          9:{
            "cx": 850,
            "cy": 250,
            8:12
          }
        };
        internalEdgeList = {
          0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 10
          },
          1:{
              "vertexA": 1,
              "vertexB": 2,
              "weight": 10
          },
          2:{
              "vertexA": 1,
              "vertexB": 6,
              "weight": 8
          },
          3:{
              "vertexA": 1,
              "vertexB": 7,
              "weight": 13
          },
          4:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 10
          },
          5:{
              "vertexA": 2,
              "vertexB": 7,
              "weight": 8
          },
          6:{
              "vertexA": 2,
              "vertexB": 8,
              "weight": 13
          },
          7:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 10
          },
          8:{
              "vertexA": 3,
              "vertexB": 8,
              "weight": 8
          },
          9:{
              "vertexA": 5,
              "vertexB": 6,
              "weight": 10
          },
          10:{
              "vertexA": 6,
              "vertexB": 7,
              "weight": 10
          },
          11:{
              "vertexA": 7,
              "vertexB": 8,
              "weight": 10
          },
          12:{
              "vertexA": 8,
              "vertexB": 9,
              "weight": 10
          }
        };
        amountVertex = 10;
        amountEdge = 13;
        break;
      case MST_EXAMPLE_CP4P10:
        internalAdjList = {
          0:{
            "cx": 350,
            "cy": 150,
            1:0,
            2:1,
            3:2,
            4:3
          },
          1:{
            "cx": 450,
            "cy": 50,
            0:0,
            2:4
          },
          2:{
            "cx": 550,
            "cy": 150,
            0:1,
            1:4,
            3:5
          },
          3:{
            "cx": 450,
            "cy": 250,
            0:2,
            2:5,
            4:6
          },
          4:{
            "cx": 350,
            "cy": 350,
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
      case MST_EXAMPLE_CP4P14:
        internalAdjList = {
          0:{
            "cx": 300,
            "cy": 50,
            1:0,
            2:1
          },
          1:{
            "cx": 450,
            "cy": 200,
            0:0,
            2:2,
            3:3,
            4:4
          },
          2:{
            "cx": 450,
            "cy": 50,
            0:1,
            1:2,
            3:5
          },
          3:{
            "cx": 650,
            "cy": 200,
            1:3,
            2:5,
            4:6
          },
          4:{
            "cx": 450,
            "cy": 350,
            1:4,
            3:6
          }
        };
        internalEdgeList = {
          0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 9
          },
          1:{
              "vertexA": 0,
              "vertexB": 2,
              "weight": 75
          },
          2:{
              "vertexA": 1,
              "vertexB": 2,
              "weight": 95
          },
          3:{
              "vertexA": 1,
              "vertexB": 3,
              "weight": 19
          },
          4:{
              "vertexA": 1,
              "vertexB": 4,
              "weight": 42
          },
          5:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 51
          }
          ,
          6:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 31
          }
        };
        amountVertex = 5;
        amountEdge = 7;
        break;
    }

    var newState = createState(internalAdjList, internalEdgeList);

    graphWidget.updateGraph(newState, 500);
	return true;
  }

  function createState(internalAdjListObject, internalEdgeListObject, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed, edgeQueued){
	var isDefaultGrey = true;
	if((vertexHighlighted == null)&&(edgeHighlighted == null)&&(vertexTraversed == null)&&(edgeTraversed == null)&&(edgeQueued == null)) isDefaultGrey = false;
    if(vertexHighlighted == null) vertexHighlighted = {};
    if(edgeHighlighted == null) edgeHighlighted = {};
    if(vertexTraversed == null) vertexTraversed = {};
    if(edgeTraversed == null) edgeTraversed = {};
	if(edgeQueued == null) edgeQueued = {};

  	var key;
  	var state = {
      "vl":{},
      "el":{}
    };
	
	if(isDefaultGrey){
		for(key in internalAdjListObject){
			state["vl"][key] = {};
	
			state["vl"][key]["cx"] = internalAdjListObject[key]["cx"];
			state["vl"][key]["cy"] = internalAdjListObject[key]["cy"];
			state["vl"][key]["text"] = key;
			state["vl"][key]["state"] = VERTEX_GREY_OUTLINE;
		}
		for(key in internalEdgeListObject){
			state["el"][key] = {};
	
		  state["el"][key]["vertexA"] = internalEdgeListObject[key]["vertexA"];
		  state["el"][key]["vertexB"] = internalEdgeListObject[key]["vertexB"];
		  state["el"][key]["type"] = EDGE_TYPE_UDE;
		  state["el"][key]["weight"] = internalEdgeListObject[key]["weight"];
		  state["el"][key]["state"] = EDGE_GREY;
		  state["el"][key]["displayWeight"] = true;
		  state["el"][key]["animateHighlighted"] = false;
		}
    } else {
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
	}
	
	for(key in edgeQueued){
	  key1 = state["el"][key]["vertexA"];
	  key2 = state["el"][key]["vertexB"]
	  state["vl"][key1]["state"] = VERTEX_DEFAULT;
	  state["vl"][key2]["state"] = VERTEX_DEFAULT;
      state["el"][key]["state"] = EDGE_DEFAULT;
    }

    for(key in vertexHighlighted){
      state["vl"][key]["state"] = VERTEX_BLUE_FILL;
    }

    for(key in edgeHighlighted){
      state["el"][key]["state"] = EDGE_BLUE;
    }

    for(key in vertexTraversed){
      state["vl"][key]["state"] = VERTEX_GREEN_FILL;
    }

    for(key in edgeTraversed){
      state["el"][key]["state"] = EDGE_GREEN;
    }

  	return state;
  }

  function populatePseudocode(act) {
    switch (act) {
      case 0: // Prim's
        $('#code1').html('T = {s}');
        $('#code2').html('enqueue edges connected to s in PQ by weight');
        $('#code3').html('while (!PQ.isEmpty)');
        $('#code4').html('&nbsp;&nbsp;if (vertex v linked with e=PQ.remove is not in T)');
        $('#code5').html('&nbsp;&nbsp;&nbsp;&nbsp;T = T &cup; v, enqueue edges connected to v');
        $('#code6').html('&nbsp;&nbsp;else ignore e');
        $('#code7').html('T is an MST');
        break;
      case 1: // Kruskal's
        $('#code1').html('Sort E edges by increasing weight');
        $('#code2').html('T = empty set');
        $('#code3').html('for (i=0; i&lt;edgeList.length; i++)');
        $('#code4').html('&nbsp;&nbsp;if adding e=edgelist[i] does not form a cycle');
        $('#code5').html('&nbsp;&nbsp;&nbsp;&nbsp;add e to T');
        $('#code6').html('&nbsp;&nbsp;else ignore e');
        $('#code7').html('T is an MST');
        break;
    }
  }
}