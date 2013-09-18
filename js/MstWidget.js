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

  var internalAdjList = {};
  var internalEdgeList = {};
  var amountVertex = 0;

  this.getGraphWidget = function(){
    return graphWidget;
  }

  this.prim = function(startVertexText, mstTypeConstant){

  }

  this.kruskal = function(mstTypeConstant){

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
        };
        internalEdgeList = {
        };
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

  function createState(internalAdjListObject, internalEdgeListObject){
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

  	return state;
  }
}