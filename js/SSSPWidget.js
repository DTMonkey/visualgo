// @author Steven Halim
// Defines an SSSP object; keeps implementation of graph internally and interact with GraphWidget to display Bellman Ford's and Dijkstra's SSSP visualizations

// SSSP Example Constants
var SSSP_EXAMPLE_CP4P17 = 0;

var SSSP = function(){
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

  this.bellmanford = function(sourceVertex) {
    var key;
    var i;
    var notVisited = {};
    var vertexHighlighted = {}, edgeHighlighted = {}, vertexTraversed = {}, edgeTraversed = {};
    var stateList = [];
    var currentState;

    // error checks
    if (amountVertex == 0) { // no graph
      $('#bellmanford-err').html("There is no graph to run this on. Please select a sample graph first.");
  		return false;
    }

    if (sourceVertex >= amountVertex) { // source vertex not in range
      $('#bellmanford-err').html("This vertex does not exist in the graph. Please select another source vertex.");
      return false;
    }

    for (key in internalAdjList) {
      if (key == "cx" || key == "cy") continue;
      if (key != sourceVertex) notVisited[key] = true;
    }

    var d = {};
    var p = {};
    for (var i = 0; i < amountVertex; i++) {
      d[i] = 1000000000;
      p[i] = -1;
    }
    d[sourceVertex] = 0;

    for (key in internalAdjList)
      internalAdjList[key]["state"] = VERTEX_DEFAULT;
    for (var k = amountVertex; k < 2 * amountVertex; k++)
      internalAdjList[k]["text"] = 'Inf';
    for (var k = amountEdge; k < 2 * amountEdge; k++)
      internalEdgeList[k]["state"] = OBJ_HIDDEN;

    vertexHighlighted[sourceVertex] = true;
    internalAdjList[sourceVertex + amountVertex]["text"] = 0;
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    currentState["status"] = 'Start from source s = ' + sourceVertex + '<br>Set d[' + sourceVertex + '] = 0';
    currentState["lineNo"] = 1;
    stateList.push(currentState);

    delete vertexHighlighted[sourceVertex];

    for (var i = 1; i < amountVertex; i++) {
      for (key in internalEdgeList)
        delete edgeHighlighted[key];

      currentState = createState(internalAdjList, internalEdgeList);
      currentState["status"] = 'Pass number: ' + i;
      currentState["lineNo"] = 2;
      stateList.push(currentState);

      for (var j = 0; j < amountEdge; j++) {
        edgeHighlighted[j] = true;
        var vertexA = internalEdgeList[j]["vertexA"];
        var vertexB = internalEdgeList[j]["vertexB"];
        var weightAB = internalEdgeList[j]["weight"];
        var thisStatus = 'Pass number: ' + i + ', relax(' + vertexA + ',' + vertexB + ',' + weightAB + ')';
        if (d[vertexA] + weightAB < d[vertexB]) {
          d[vertexB] = d[vertexA] + weightAB;
          p[vertexB] = vertexA;
          internalAdjList[vertexB + amountVertex]["text"] = d[vertexB];
          thisStatus = thisStatus + '<br>We update d[' + vertexB + '] = ' + d[vertexB] + ' and p[' + vertexB + '] = ' + vertexA;
        }

        for (var k = amountEdge; k < 2 * amountEdge; k++)
          internalEdgeList[k]["state"] = OBJ_HIDDEN;
        for (var k = 0; k < amountVertex; k++)
          if (p[k] != -1)
            for (var l = 0; l < amountEdge; l++)
              if (internalEdgeList[l]["vertexA"] == p[k] && internalEdgeList[l]["vertexB"] == k)
                internalEdgeList[l + amountEdge]["state"] = EDGE_HIGHLIGHTED;

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
        currentState["status"] = thisStatus;
        currentState["lineNo"] = [3,4];
        stateList.push(currentState);
      }
    }

    edgeTraversed = {};
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    currentState["status"] = 'Bellman Ford\'s algorithm is complete.';
    stateList.push(currentState);

    console.log(stateList);

    populatePseudocode(0);
    graphWidget.startAnimation(stateList);
    return true;
  }

  this.dijkstra = function(sourceVertex) {
    var key;
    var i;
    var notVisited = {};
    var vertexHighlighted = {}, edgeHighlighted = {}, vertexTraversed = {}, edgeTraversed = {};
    var stateList = [];
    var currentState;

    // error checks
    if (amountVertex == 0) { // no graph
      $('#dijkstra-err').html("There is no graph to run this on. Please select a sample graph first.");
      return false;
    }

    if (sourceVertex >= amountVertex) { // source vertex not in range
      $('#dijkstra-err').html("This vertex does not exist in the graph. Please select another source vertex.");
      return false;
    }

    for (key in internalAdjList) {
      if (key == "cx" || key == "cy") continue;
      if (key != sourceVertex) notVisited[key] = true;
    }

    var d = {};
    var p = {};
    for (var i = 0; i < amountVertex; i++) {
      d[i] = 1000000000;
      p[i] = -1;
    }
    d[sourceVertex] = 0;

    for (key in internalAdjList)
      internalAdjList[key]["state"] = VERTEX_DEFAULT;
    for (var k = amountVertex; k < 2 * amountVertex; k++)
      internalAdjList[k]["text"] = 'Inf';
    for (var k = amountEdge; k < 2 * amountEdge; k++)
      internalEdgeList[k]["state"] = OBJ_HIDDEN;

    vertexHighlighted[sourceVertex] = true;
    internalAdjList[sourceVertex + amountVertex]["text"] = 0;
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    currentState["status"] = 'Start from source s = ' + sourceVertex + '<br>Set d[' + sourceVertex + '] = 0';
    currentState["lineNo"] = 1;
    stateList.push(currentState);

    delete vertexHighlighted[sourceVertex];

    var pq = {};

/*    for (var i = 1; i < amountVertex; i++) {
      for (key in internalEdgeList)
        delete edgeHighlighted[key];

      currentState = createState(internalAdjList, internalEdgeList);
      currentState["status"] = 'Pass number: ' + i;
      currentState["lineNo"] = 2;
      stateList.push(currentState);

      for (var j = 0; j < amountEdge; j++) {
        edgeHighlighted[j] = true;
        var vertexA = internalEdgeList[j]["vertexA"];
        var vertexB = internalEdgeList[j]["vertexB"];
        var weightAB = internalEdgeList[j]["weight"];
        var thisStatus = 'Pass number: ' + i + ', relax(' + vertexA + ',' + vertexB + ',' + weightAB + ')';
        if (d[vertexA] + weightAB < d[vertexB]) {
          d[vertexB] = d[vertexA] + weightAB;
          p[vertexB] = vertexA;
          internalAdjList[vertexB + amountVertex]["text"] = d[vertexB];
          thisStatus = thisStatus + '<br>We update d[' + vertexB + '] = ' + d[vertexB] + ' and p[' + vertexB + '] = ' + vertexA;
        }

        for (var k = amountEdge; k < 2 * amountEdge; k++)
          internalEdgeList[k]["state"] = OBJ_HIDDEN;
        for (var k = 0; k < amountVertex; k++)
          if (p[k] != -1)
            for (var l = 0; l < amountEdge; l++)
              if (internalEdgeList[l]["vertexA"] == p[k] && internalEdgeList[l]["vertexB"] == k)
                internalEdgeList[l + amountEdge]["state"] = EDGE_HIGHLIGHTED;

        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
        currentState["status"] = thisStatus;
        currentState["lineNo"] = [3,4];
        stateList.push(currentState);
      }
    }
*/

    edgeTraversed = {};
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    currentState["status"] = 'Dijkstra\'s algorithm is complete.';
    stateList.push(currentState);

    console.log(stateList);

    populatePseudocode(1);
    graphWidget.startAnimation(stateList);
    return true;
  }

  this.examples = function(ssspExampleConstant) {
    switch (ssspExampleConstant) {
      case SSSP_EXAMPLE_CP4P17:
        internalAdjList = {
          0:{
            "cx": 210,
            "cy": 190,
            "text": 0,
            4:6
          },
          1:{
            "cx": 50,
            "cy": 50,
            "text": 1,
            3:3,
            4:4
          },
          2:{
            "cx": 170,
            "cy": 120,
            "text": 2,
            0:0,
            1:1,
            3:2
          },
          3:{
            "cx": 330,
            "cy": 50,
            "text": 3,
            4:5
          },
          4:{
            "cx": 240,
            "cy": 280,
            "text": 4,
          },
          5:{
            "cx": 710,
            "cy": 190,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            4:6
          },
          6:{
            "cx": 550,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            3:3,
            4:4
          },
          7:{
            "cx": 670,
            "cy": 120,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            0:0,
            1:1,
            3:2
          },
          8:{
            "cx": 830,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            4:5
          },
          9:{
            "cx": 740,
            "cy": 280,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          }
        };
        internalEdgeList = {
          0:{
              "vertexA": 2,
              "vertexB": 0,
              "weight": 6
          },
          1:{
              "vertexA": 2,
              "vertexB": 1,
              "weight": 2
          },
          2:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 7
          },
          3:{
              "vertexA": 1,
              "vertexB": 3,
              "weight": 3
          },
          4:{
              "vertexA": 1,
              "vertexB": 4,
              "weight": 6
          },
          5:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 5
          },
          6:{
              "vertexA": 0,
              "vertexB": 4,
              "weight": 1
          },
          7:{
              "vertexA": 7,
              "vertexB": 5,
              "weight": 6,
              "state": OBJ_HIDDEN
          },
          8:{
              "vertexA": 7,
              "vertexB": 6,
              "weight": 2,
              "state": OBJ_HIDDEN
          },
          9:{
              "vertexA": 7,
              "vertexB": 8,
              "weight": 7,
              "state": OBJ_HIDDEN
          },
          10:{
              "vertexA": 6,
              "vertexB": 8,
              "weight": 3,
              "state": OBJ_HIDDEN
          },
          11:{
              "vertexA": 6,
              "vertexB": 9,
              "weight": 6,
              "state": OBJ_HIDDEN
          },
          12:{
              "vertexA": 8,
              "vertexB": 9,
              "weight": 5,
              "state": OBJ_HIDDEN
          },
          13:{
              "vertexA": 5,
              "vertexB": 9,
              "weight": 1,
              "state": OBJ_HIDDEN
          }
        };
        amountVertex = 5;
        amountEdge = 7;
        break;
      case SSSP_EXAMPLE_OTHERS:
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
      state["vl"][key]["text"] = internalAdjListObject[key]["text"];
      if (internalAdjListObject[key]["state"] == OBJ_HIDDEN)
        state["vl"][key]["state"] = OBJ_HIDDEN;
  		else
        state["vl"][key]["state"] = VERTEX_DEFAULT;
  	}

  	for(key in internalEdgeListObject){
  		state["el"][key] = {};

      state["el"][key]["vertexA"] = internalEdgeListObject[key]["vertexA"];
      state["el"][key]["vertexB"] = internalEdgeListObject[key]["vertexB"];
      state["el"][key]["type"] = EDGE_TYPE_UDE;
      state["el"][key]["weight"] = internalEdgeListObject[key]["weight"];
      if (internalEdgeListObject[key]["state"] == OBJ_HIDDEN)
        state["el"][key]["state"] = OBJ_HIDDEN;
      else
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
      case 0: // Bellman Ford's
        $('#code1').html('initSSSP');
        $('#code2').html('for i = 1 to |V|-1');
        $('#code3').html('&nbsp;&nbsp;for each edge(u, v) in E');
        $('#code4').html('&nbsp;&nbsp;&nbsp;&nbsp;relax(u, v, w_u_v)');
        $('#code5').html('');
        $('#code6').html('');
        $('#code7').html('');
        break;
      case 1: // Dijkstra's
        $('#code1').html('TBA');
     		$('#code2').html('TBA');
        $('#code3').html('TBA');
        $('#code4').html('TBA');
        $('#code5').html('');
        $('#code6').html('');
        $('#code7').html('');
        break;
    }
  }
}
