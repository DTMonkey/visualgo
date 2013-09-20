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

    for(key in internalAdjList){
      if(key != startVertexText) notVisited[key] = true;
    }

    currentState = createState(internalAdjList, internalEdgeList);
    stateList.push(currentState);

    vertexHighlighted[startVertexText] = true;
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    stateList.push(currentState);

    delete vertexHighlighted[startVertexText];
    vertexTreaversed[startVertexText] = true;

    if(mstTypeConstant == MST_MAX){

    }

    else{
      var minPriorityQueue = [];
      
      for(key in internalAdjList[startVertexText]){
        var enqueuedEdgeId = internalAdjList[startVertexText][key];
        var enqueuedEdge = ObjectTriple(internalEdgeList[edgeId]["weight"], key, enqueuedEdgeId);
        edgeTraversed[enqueuedEdgeId] = true;
        minPriorityQueue.push(enqueuedEdge);
      }

      minPriorityQueue.sort();

      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
      stateList.push(currentState);

      while(Object.keys(notVisited).length > 0){
        var dequeuedEdge = minPriorityQueue.pop();
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
            var enqueuedEdgeId = internalAdjList[otherVertex][key];
            var enqueuedEdge = ObjectTriple(internalEdgeList[edgeId]["weight"], key, enqueuedEdgeId);
            if(edgeHighlighted[enqueuedEdgeId] == null){
              edgeTraversed[enqueuedEdgeId] = true;
              minPriorityQueue.push(enqueuedEdge);
            }
          }

          minPriorityQueue.sort();

          currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
          stateList.push(currentState);
        }

        else{
          delete edgeTraversed[edgeId];

          currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
          stateList.push(currentState);
        }
      }

      edgeTraversed = {};
      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
      stateList.push(currentState);
    }

    /* For MST, I'm considering of NOT using the original graph as the final state
     * This is because:
     * 1. The current GraphWidget doesn't break down if the final state is not the original graph
     * 2. It's less intuitive for the students to NOT display the MST at the final state of the animation
     */

     graphWidget.startAnimation(stateList);
  }

  this.kruskal = function(mstTypeConstant){
    if(mstTypeConstant == MST_MAX){

    }

    else{
      
    }
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
            1:0,
            2:1,
            3:2,
            4:3
          },
          1:{
            0:0,
            2:4
          },
          2:{
            0:1,
            1:4,
            3:5
          },
          3:{
            0:2,
            2:5,
            4:6
          },
          4:{
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

    gw.updateGraph(newState, 500);
  }

  function createState(internalAdjListObject, internalEdgeListObject, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed){
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
}