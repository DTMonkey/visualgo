// @author Steven Halim
// Defines an SSSP object; keeps implementation of graph internally and interact with GraphWidget to display Bellman Ford's and Dijkstra's SSSP visualizations

// SSSP Example Constants
var SSSP_EXAMPLE_CP3_4_3 = 0;
var SSSP_EXAMPLE_CP3_4_17 = 1;
var SSSP_EXAMPLE_CP3_4_18 = 2;
var SSSP_EXAMPLE_CP3_4_19 = 3;

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

  this.bfs = function(sourceVertex) {
    var key;
    var i;
    var notVisited = {};
    var vertexHighlighted = {}, edgeHighlighted = {}, vertexTraversed = {}, edgeTraversed = {};
    var stateList = [];
    var currentState;

    // error checks
    if (amountVertex == 0) { // no graph
      $('#bfs-err').html("There is no graph to run this on. Please select a sample graph first.");
      return false;
    }

    if (sourceVertex >= amountVertex) { // source vertex not in range
      $('#bfs-err').html("This vertex does not exist in the graph. Please select another source vertex.");
      return false;
    }

    for (var j = 0; j < amountEdge; j++)
      if (internalEdgeList[j]["weight"] > 1) {
        $('#bfs-err').html("At least one edge of this graph has weight > 1. We cannot run BFS to get the SSSP information of this graph.");
        return false;
      }

    for (key in internalAdjList) {
      if (key == "cx" || key == "cy") continue;
      if (key != sourceVertex) notVisited[key] = true;
    }

    var d = {};
    var p = {};
    for (var i = 0; i < amountVertex; i++) {
      d[i] = 1000;
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
    for (key in internalEdgeList)
      delete edgeTraversed[key];

    var q = [];
    q.push(sourceVertex);
    var EdgeProcessed = 0;

    while (q.length > 0) {
      vertexHighlighted[q[0]] = true;
      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
      currentState["status"] = 'The queue is now {' + q + '}<br>Exploring neighbors of vertex u = ' + q[0];
      currentState["lineNo"] = 2;
      stateList.push(currentState);

      var u = q.shift(); // front most item
    
      for (var j = 0; j < amountEdge; j++) {
        var vertexA = internalEdgeList[j]["vertexA"];
        var vertexB = internalEdgeList[j]["vertexB"];
        var weightAB = internalEdgeList[j]["weight"];

        if (u == vertexA) {
          vertexTraversed[vertexA] = true;

          edgeTraversed[j] = true;
          EdgeProcessed = EdgeProcessed + 1;
          var thisStatus = 'relax(' + vertexA + ',' + vertexB + ',' + weightAB + '), #edge processed = ' + EdgeProcessed;
          if (d[vertexA] + weightAB < d[vertexB]) {
            d[vertexB] = d[vertexA] + weightAB;
            p[vertexB] = vertexA;
            internalAdjList[vertexB + amountVertex]["text"] = d[vertexB];
            thisStatus = thisStatus + '<br>We update d[' + vertexB + '] = ' + d[vertexB] + ' and p[' + vertexB + '] = ' + p[vertexB];
            q.push(vertexB);
          }
          else
            thisStatus = thisStatus + '<br>No change';

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
    }
 
    for (key in internalAdjList)
      delete vertexHighlighted[key];
    for (key in internalAdjList)
      delete vertexTraversed[key];
    for (key in internalEdgeList)
      delete edgeHighlighted[key];
    edgeTraversed = {};
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    currentState["status"] = 'BFS processes O(V + E) = ' + EdgeProcessed + ' edges.<br>The BFS/SSSP spanning tree from source = ' + sourceVertex + ' is shown on the right side.';
    stateList.push(currentState);

    console.log(stateList);

    populatePseudocode(0);
    graphWidget.startAnimation(stateList);
    return true;
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
      d[i] = 1000;
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
    currentState["status"] = 'Start from source s = ' + sourceVertex + '<br>Set p[v] = -1 for all v and d[' + sourceVertex + '] = 0';
    currentState["lineNo"] = 1;
    stateList.push(currentState);

    delete vertexHighlighted[sourceVertex];
    var EdgeProcessed = 0;

    for (var i = 1; i < amountVertex; i++) { // V-1 passes of Bellman Ford's
      for (key in internalEdgeList)
        delete edgeHighlighted[key];

      currentState = createState(internalAdjList, internalEdgeList);
      currentState["status"] = 'Pass number: ' + i;
      currentState["lineNo"] = 2;
      stateList.push(currentState);

      for (var j = 0; j < amountEdge; j++) {
        // turn off highlights first
        for (var k = 0; k < 2 * amountVertex; k++)
          delete vertexHighlighted[k];
        for (var k = amountEdge; k < 2 * amountEdge; k++)
          internalEdgeList[k]["state"] = OBJ_HIDDEN;
        for (var k = amountEdge; k < 2 * amountEdge; k++)
          delete edgeHighlighted[k];

        EdgeProcessed = EdgeProcessed + 1;
        var vertexA = internalEdgeList[j]["vertexA"];
        var vertexB = internalEdgeList[j]["vertexB"];
        var weightAB = internalEdgeList[j]["weight"];
        var thisStatus = 'Pass number: ' + i + ', relax(' + vertexA + ',' + vertexB + ',' + weightAB + '), #edge processed = ' + EdgeProcessed;

        // highlight the edge being relaxed in the input graph
        vertexHighlighted[vertexA] = true;
        vertexHighlighted[vertexB] = true;
        edgeHighlighted[j] = true;

        // if we can relax vertex B, do updates and some more highlights
        if (d[vertexA] != 1000 && d[vertexA] + weightAB < d[vertexB]) {
          d[vertexB] = d[vertexA] + weightAB;
          p[vertexB] = vertexA;
          internalAdjList[vertexB + amountVertex]["text"] = d[vertexB];
          thisStatus = thisStatus + '<br>We update d[' + vertexB + '] = ' + d[vertexB] + ' and p[' + vertexB + '] = ' + p[vertexB];
          vertexHighlighted[vertexB + amountVertex] = VERTEX_HIGHLIGHTED;
          edgeHighlighted[j + amountEdge] = EDGE_HIGHLIGHTED;
        }
        else
          thisStatus = thisStatus + '<br>No change';

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

    for (var k = 0; k < 2 * amountVertex; k++)
      delete vertexHighlighted[k];
    for (var k = 0; k < 2 * amountEdge; k++)
      delete edgeHighlighted[k];
    currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
    currentState["status"] = 'Bellman Ford\'s processes O(VE) = ' + (amountVertex-1) + '*' + amountEdge + ' = ' + EdgeProcessed + '  edges.<br>The SSSP spanning tree from source = ' + sourceVertex + ' is shown on the right side.';
    stateList.push(currentState);

    console.log(stateList);

    populatePseudocode(1);
    graphWidget.startAnimation(stateList);
    return true;
  }

  this.dijkstra = function(sourceVertex, versiontype) {
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
      d[i] = 1000;
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
    for (key in internalEdgeList)
      delete edgeTraversed[key];

    var pq = [];
    var done = [];

    if (versiontype == 1) { // original
      for (var i = 0; i < amountVertex; i++)
        if (i == sourceVertex)
          pq.push(new ObjectPair(0, i));
        else
          pq.push(new ObjectPair(1000, i));
    }
    else // modified
      pq.push(new ObjectPair(0, sourceVertex)); // only push one

    var EdgeProcessed = 0;
  
    while (pq.length > 0) {
      pq.sort(ObjectPair.compare); // sort by distance, then by vertex number, lousy O(n log n) PQ update
      if (versiontype == 2 && EdgeProcessed > 50) { // to prevent infinite loop in Modified Dijkstra on negative cycle
        currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
        currentState["status"] = 'Modified Dijkstra\'s algorithm is stopped prematurely<br>in order to prevent infinite loop';
        stateList.push(currentState);
        break;
      }

      vertexTraversed[pq[0].getSecond()] = true;
      done.push(pq[0].getSecond());
      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
      currentState["status"] = 'The priority queue is now {(';
      // for debugging the entire PQ
      //      for (var k = 0; k < pq.length; k++)
      //        currentState["status"] += '(' + pq[k].getFirst() + ',' + pq[k].getSecond() + ') ';
      currentState["status"] += pq[0].getFirst() + ',' + pq[0].getSecond() + ')';
      if (pq.length > 1)
        currentState["status"] += ', (' + pq[1].getFirst() + ',' + pq[1].getSecond() + ')';
      if (pq.length > 2)
        currentState["status"] += ', (' + pq[2].getFirst() + ',' + pq[2].getSecond() + ')';
      if (pq.length > 3)
        currentState["status"] += ', ...';
      var frontitem = pq.shift(); // front most item
      var dist = frontitem.getFirst(); // not used in original dijkstra
      var u = frontitem.getSecond();
      if (versiontype == 2 && dist > d[u]) {
        currentState["status"] += '}<br>But this pair (' + dist + ',' + u + ') is an old information and skipped';
        currentState["lineNo"] = [2,3];
      }
      else {
        currentState["status"] += '}<br>Exploring neighbors of vertex u = ' + u;
        currentState["lineNo"] = 2;
      }
      stateList.push(currentState);

      for (var j = 0; j < amountEdge; j++) {
        var vertexA = internalEdgeList[j]["vertexA"];
        var vertexB = internalEdgeList[j]["vertexB"];
        var weightAB = internalEdgeList[j]["weight"];

        if (u == vertexA) {
          vertexTraversed[vertexA] = true;
          edgeTraversed[j] = true;
          EdgeProcessed = EdgeProcessed + 1;
          var thisStatus = 'relax(' + vertexA + ',' + vertexB + ',' + weightAB + '), #edge processed = ' + EdgeProcessed;

          if (d[vertexA] + weightAB < d[vertexB]) {
            d[vertexB] = d[vertexA] + weightAB;
            if (versiontype == 1)
              for (var k = 0; k < pq.length; k++) // lousy O(n) PQ update, but it works for this animation (only for version 1)
                if (pq[k].getSecond() == vertexB) {
                  pq.splice(k, 1);
                  break;
                }
            p[vertexB] = vertexA;
            internalAdjList[vertexB + amountVertex]["text"] = d[vertexB];
            thisStatus = thisStatus + '<br>We update d[' + vertexB + '] = ' + d[vertexB] + ' and p[' + vertexB + '] = ' + p[vertexB];

            var canRelaxThis = true;
            for (var k = 0; k < done.length; k++)
              if (done[k] == vertexB) {
                canRelaxThis = false;
                break;
              }

            if (versiontype == 2 || canRelaxThis) // for standard dijkstra
              pq.push(new ObjectPair(d[vertexB], vertexB));
          }
          else
            thisStatus = thisStatus + '<br>No change';

          for (var k = amountEdge; k < 2 * amountEdge; k++)
            internalEdgeList[k]["state"] = OBJ_HIDDEN;
          for (var k = 0; k < amountVertex; k++)
            if (p[k] != -1)
              for (var l = 0; l < amountEdge; l++)
                if (internalEdgeList[l]["vertexA"] == p[k] && internalEdgeList[l]["vertexB"] == k)
                  internalEdgeList[l + amountEdge]["state"] = EDGE_HIGHLIGHTED;

          currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
          currentState["status"] = thisStatus;
          if (versiontype == 1)    
            currentState["lineNo"] = [3,4];
          else
            currentState["lineNo"] = [4,5];
          stateList.push(currentState);
        }
      }
    }

    if (versiontype == 1 || (versiontype == 2 && EdgeProcessed <= 50)) { // to prevent infinite loop in Modified Dijkstra on negative cycle
      for (key in internalAdjList)
        delete vertexHighlighted[key];
      for (key in internalAdjList)
        delete vertexTraversed[key];
      for (key in internalEdgeList)
        delete edgeHighlighted[key];
      edgeTraversed = {};
      currentState = createState(internalAdjList, internalEdgeList, vertexHighlighted, edgeHighlighted, vertexTraversed, edgeTraversed);
      currentState["status"] = 'Dijkstra\'s processes O((V + E) * log V) = ' + EdgeProcessed + ' edges.<br>The SSSP spanning tree from source = ' + sourceVertex + ' is shown on the right side.';
      stateList.push(currentState);
    }

    console.log(stateList);

    if (versiontype == 1)    
      populatePseudocode(2);
    else
      populatePseudocode(3);

    graphWidget.startAnimation(stateList);
    return true;
  }

  this.examples = function(ssspExampleConstant) {
    if (internalAdjList != null) {
      for (key in internalAdjList)
        delete internalAdjList[key];
    }
    if (internalEdgeList != null) {
      for (key in internalEdgeList)
        delete internalEdgeList[key];
    }

    switch (ssspExampleConstant) {
      case SSSP_EXAMPLE_CP3_4_3:
        internalAdjList = {
          0:{
            "cx": 20,
            "cy": 20,
            "text": 0
          },
          1:{
            "cx": 90,
            "cy": 20,
            "text": 1
          },
          2:{
            "cx": 160,
            "cy": 20,
            "text": 2
          },
          3:{
            "cx": 230,
            "cy": 20,
            "text": 3
          },

          4:{
            "cx": 20,
            "cy": 90,
            "text": 4
          },
          5:{
            "cx": 90,
            "cy": 90,
            "text": 5
          },
          6:{
            "cx": 160,
            "cy": 90,
            "text": 6
          },
          7:{
            "cx": 230,
            "cy": 90,
            "text": 7
          },

          8:{
            "cx": 20,
            "cy": 160,
            "text": 8
          },

          9:{
            "cx": 20,
            "cy": 230,
            "text": 9
          },
          10:{
            "cx": 90,
            "cy": 230,
            "text": 10
          },
          11:{
            "cx": 160,
            "cy": 230,
            "text": 11
          },
          12:{
            "cx": 230,
            "cy": 230,
            "text": 12
          },

          13:{
            "cx": 420,
            "cy": 20,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          14:{
            "cx": 490,
            "cy": 20,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          15:{
            "cx": 560,
            "cy": 20,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          16:{
            "cx": 630,
            "cy": 20,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },

          17:{
            "cx": 420,
            "cy": 90,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          18:{
            "cx": 490,
            "cy": 90,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          19:{
            "cx": 560,
            "cy": 90,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          20:{
            "cx": 630,
            "cy": 90,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },

          21:{
            "cx": 420,
            "cy": 160,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },

          22:{
            "cx": 420,
            "cy": 230,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          23:{
            "cx": 490,
            "cy": 230,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          24:{
            "cx": 560,
            "cy": 230,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          25:{
            "cx": 630,
            "cy": 230,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          }
        };

        internalEdgeList = {
          0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 1
          },
          1:{
              "vertexA": 0,
              "vertexB": 4,
              "weight": 1
          },

          2:{
              "vertexA": 1,
              "vertexB": 0,
              "weight": 1
          },
          3:{
              "vertexA": 1,
              "vertexB": 2,
              "weight": 1
          },
          4:{
              "vertexA": 1,
              "vertexB": 5,
              "weight": 1
          },

          5:{
              "vertexA": 2,
              "vertexB": 1,
              "weight": 1
          },
          6:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 1
          },
          7:{
              "vertexA": 2,
              "vertexB": 6,
              "weight": 1
          },

          8:{
              "vertexA": 3,
              "vertexB": 2,
              "weight": 1
          },
          9:{
              "vertexA": 3,
              "vertexB": 7,
              "weight": 1
          },

          10:{
              "vertexA": 4,
              "vertexB": 0,
              "weight": 1
          },
          11:{
              "vertexA": 4,
              "vertexB": 8,
              "weight": 1
          },

          12:{
              "vertexA": 5,
              "vertexB": 1,
              "weight": 1
          },
          13:{
              "vertexA": 5,
              "vertexB": 6,
              "weight": 1
          },
          14:{
              "vertexA": 5,
              "vertexB": 10,
              "weight": 1
          },

          15:{
              "vertexA": 6,
              "vertexB": 2,
              "weight": 1
          },
          16:{
              "vertexA": 6,
              "vertexB": 5,
              "weight": 1
          },
          17:{
              "vertexA": 6,
              "vertexB": 11,
              "weight": 1
          },

          18:{
              "vertexA": 7,
              "vertexB": 3,
              "weight": 1
          },
          19:{
              "vertexA": 7,
              "vertexB": 12,
              "weight": 1
          },

          20:{
              "vertexA": 8,
              "vertexB": 4,
              "weight": 1
          },
          21:{
              "vertexA": 8,
              "vertexB": 9,
              "weight": 1
          },

          22:{
              "vertexA": 9,
              "vertexB": 8,
              "weight": 1
          },
          23:{
              "vertexA": 9,
              "vertexB": 10,
              "weight": 1
          },

          24:{
              "vertexA": 10,
              "vertexB": 5,
              "weight": 1
          },
          25:{
              "vertexA": 10,
              "vertexB": 9,
              "weight": 1
          },
          26:{
              "vertexA": 10,
              "vertexB": 11,
              "weight": 1
          },

          27:{
              "vertexA": 11,
              "vertexB": 6,
              "weight": 1
          },
          28:{
              "vertexA": 11,
              "vertexB": 10,
              "weight": 1
          },
          29:{
              "vertexA": 11,
              "vertexB": 12,
              "weight": 1
          },

          30:{
              "vertexA": 12,
              "vertexB": 7,
              "weight": 1
          },
          31:{
              "vertexA": 12,
              "vertexB": 11,
              "weight": 1
          },

          32:{
              "vertexA": 13,
              "vertexB": 14,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          33:{
              "vertexA": 13,
              "vertexB": 17,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          34:{
              "vertexA": 14,
              "vertexB": 13,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          35:{
              "vertexA": 14,
              "vertexB": 15,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          36:{
              "vertexA": 14,
              "vertexB": 18,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          37:{
              "vertexA": 15,
              "vertexB": 14,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          38:{
              "vertexA": 15,
              "vertexB": 16,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          39:{
              "vertexA": 15,
              "vertexB": 19,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          40:{
              "vertexA": 16,
              "vertexB": 15,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          41:{
              "vertexA": 16,
              "vertexB": 20,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          42:{
              "vertexA": 17,
              "vertexB": 13,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          43:{
              "vertexA": 17,
              "vertexB": 21,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          44:{
              "vertexA": 18,
              "vertexB": 14,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          45:{
              "vertexA": 18,
              "vertexB": 19,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          46:{
              "vertexA": 18,
              "vertexB": 23,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          47:{
              "vertexA": 19,
              "vertexB": 15,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          48:{
              "vertexA": 19,
              "vertexB": 18,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          49:{
              "vertexA": 19,
              "vertexB": 24,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          50:{
              "vertexA": 20,
              "vertexB": 16,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          51:{
              "vertexA": 20,
              "vertexB": 25,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          52:{
              "vertexA": 21,
              "vertexB": 17,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          53:{
              "vertexA": 21,
              "vertexB": 22,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          54:{
              "vertexA": 22,
              "vertexB": 21,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          55:{
              "vertexA": 22,
              "vertexB": 23,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          56:{
              "vertexA": 23,
              "vertexB": 18,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          57:{
              "vertexA": 23,
              "vertexB": 22,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          58:{
              "vertexA": 23,
              "vertexB": 24,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          59:{
              "vertexA": 24,
              "vertexB": 19,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          60:{
              "vertexA": 24,
              "vertexB": 23,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          61:{
              "vertexA": 24,
              "vertexB": 25,
              "weight": 1,
        "state": OBJ_HIDDEN
          },

          62:{
              "vertexA": 25,
              "vertexB": 20,
              "weight": 1,
        "state": OBJ_HIDDEN
          },
          63:{
              "vertexA": 25,
              "vertexB": 24,
              "weight": 1,
        "state": OBJ_HIDDEN
          }

        };
        amountVertex = 13;
        amountEdge = 32;
        break;
      case SSSP_EXAMPLE_CP3_4_17:
        internalAdjList = {
          0:{
            "cx": 210,
            "cy": 190,
            "text": 0,
            4:3
          },
          1:{
            "cx": 50,
            "cy": 50,
            "text": 1,
            3:1,
            4:0
          },
          2:{
            "cx": 170,
            "cy": 120,
            "text": 2,
            0:4,
            1:2,
            3:6
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
            "cx": 610,
            "cy": 190,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            9:10
          },
          6:{
            "cx": 450,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            8:8,
            9:7
          },
          7:{
            "cx": 570,
            "cy": 120,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            5:11,
            6:9,
            8:13
          },
          8:{
            "cx": 730,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            9:12
          },
          9:{
            "cx": 640,
            "cy": 280,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          }
        };
        internalEdgeList = {
          0:{
              "vertexA": 1,
              "vertexB": 4,
              "weight": 6
          },
          1:{
              "vertexA": 1,
              "vertexB": 3,
              "weight": 3
          },
          2:{
              "vertexA": 2,
              "vertexB": 1,
              "weight": 2
          },
          3:{
              "vertexA": 0,
              "vertexB": 4,
              "weight": 1
          },
          4:{
              "vertexA": 2,
              "vertexB": 0,
              "weight": 6
          },
          5:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 5
          },
          6:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 7
          },
          7:{
              "vertexA": 6,
              "vertexB": 9,
              "weight": 6,
              "state": OBJ_HIDDEN
          },
          8:{
              "vertexA": 6,
              "vertexB": 8,
              "weight": 3,
              "state": OBJ_HIDDEN
          },
          9:{
              "vertexA": 7,
              "vertexB": 6,
              "weight": 2,
              "state": OBJ_HIDDEN
          },
          10:{
              "vertexA": 5,
              "vertexB": 9,
              "weight": 1,
              "state": OBJ_HIDDEN
          },
          11:{
              "vertexA": 7,
              "vertexB": 5,
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
              "vertexA": 7,
              "vertexB": 8,
              "weight": 7,
              "state": OBJ_HIDDEN
          }
        };
        amountVertex = 5;
        amountEdge = 7;
        break;
      case SSSP_EXAMPLE_CP3_4_18:
        internalAdjList = {
          0:{
            "cx": 50,
            "cy": 125,
            "text": 0,
            1:0,
            2:3
          },
          1:{
            "cx": 150,
            "cy": 50,
            "text": 1,
            3:2
          },
          2:{
            "cx": 150,
            "cy": 200,
            "text": 2,
            3:4
          },
          3:{
            "cx": 250,
            "cy": 125,
            "text": 3,
            4:2
          },
          4:{
            "cx": 350,
            "cy": 125,
            "text": 4,
          },
          5:{
            "cx": 450,
            "cy": 125,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            6:5,
            7:8
          },
          6:{
            "cx": 550,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            8:6
          },
          7:{
            "cx": 550,
            "cy": 200,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            8:9
          },
          8:{
            "cx": 650,
            "cy": 125,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            9:7
          },
          9:{
            "cx": 750,
            "cy": 125,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          }
        };
        internalEdgeList = {
          0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 1
          },
          1:{
              "vertexA": 1,
              "vertexB": 3,
              "weight": 2
          },
          2:{
              "vertexA": 3,
              "vertexB": 4,
              "weight": 3
          },
          3:{
              "vertexA": 0,
              "vertexB": 2,
              "weight": 10
          },
          4:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": -10
          },
          5:{
              "vertexA": 5,
              "vertexB": 6,
              "weight": 1,
              "state": OBJ_HIDDEN
          },
          6:{
              "vertexA": 6,
              "vertexB": 8,
              "weight": 2,
              "state": OBJ_HIDDEN
          },
          7:{
              "vertexA": 8,
              "vertexB": 9,
              "weight": 3,
              "state": OBJ_HIDDEN
          },
          8:{
              "vertexA": 5,
              "vertexB": 7,
              "weight": 10,
              "state": OBJ_HIDDEN
          },
          9:{
              "vertexA": 7,
              "vertexB": 8,
              "weight": -10,
              "state": OBJ_HIDDEN
          }
        };
        amountVertex = 5;
        amountEdge = 5;
        break;
      case SSSP_EXAMPLE_CP3_4_19:
        internalAdjList = {
          0:{
            "cx": 50,
            "cy": 50,
            "text": 0,
            1:0,
            4:4
          },
          1:{
            "cx": 150,
            "cy": 50,
            "text": 1,
            2:1
          },
          2:{
            "cx": 250,
            "cy": 50,
            "text": 2,
            1:2,
            3:3
          },
          3:{
            "cx": 350,
            "cy": 50,
            "text": 3
          },
          4:{
            "cx": 150,
            "cy": 125,
            "text": 4
          },
          5:{
            "cx": 450,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            6:5,
            9:9
          },
          6:{
            "cx": 550,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            7:6
          },
          7:{
            "cx": 650,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN,
            6:7,
            8:8
          },
          8:{
            "cx": 750,
            "cy": 50,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          },
          9:{
            "cx": 550,
            "cy": 125,
            "text": 'Inf',
            "state": OBJ_HIDDEN
          }
        };
        internalEdgeList = {
          0:{
              "vertexA": 0,
              "vertexB": 1,
              "weight": 99
          },
          1:{
              "vertexA": 1,
              "vertexB": 2,
              "weight": 15
          },
          2:{
              "vertexA": 2,
              "vertexB": 1,
              "weight": -42
          },
          3:{
              "vertexA": 2,
              "vertexB": 3,
              "weight": 10
          },
          4:{
              "vertexA": 0,
              "vertexB": 4,
              "weight": -99
          },
          5:{
              "vertexA": 5,
              "vertexB": 6,
              "weight": 99,
              "state": OBJ_HIDDEN
          },
          6:{
              "vertexA": 6,
              "vertexB": 7,
              "weight": 15,
              "state": OBJ_HIDDEN
          },
          7:{
              "vertexA": 7,
              "vertexB": 6,
              "weight": -42,
              "state": OBJ_HIDDEN
          },
          8:{
              "vertexA": 7,
              "vertexB": 8,
              "weight": 10,
              "state": OBJ_HIDDEN
          },
          9:{
              "vertexA": 5,
              "vertexB": 9,
              "weight": -99,
              "state": OBJ_HIDDEN
          }
        };
        amountVertex = 5;
        amountEdge = 5;
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
      state["el"][key]["type"] = EDGE_TYPE_DE; // HOW TO MAKE THIS DIRECTED?
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
      case 0: // BFS
        $('#code1').html('initSSSP');
        $('#code2').html('while the queue Q is not empty');
        $('#code3').html('&nbsp;&nbsp;for each neighbor v of u = Q.front()');
        $('#code4').html('&nbsp;&nbsp;&nbsp;&nbsp;relax(u, v, w(u, v))');
        $('#code5').html('');
        $('#code6').html('');
        $('#code7').html('');
        break;
      case 1: // Bellman Ford's
        $('#code1').html('initSSSP');
        $('#code2').html('for i = 1 to |V|-1');
        $('#code3').html('&nbsp;&nbsp;for each edge(u, v) in E');
        $('#code4').html('&nbsp;&nbsp;&nbsp;&nbsp;relax(u, v, w(u, v))');
        $('#code5').html('');
        $('#code6').html('');
        $('#code7').html('');
        break;
      case 2: // Original Dijkstra's
        $('#code1').html('initSSSP');
        $('#code2').html('while the priority queue PQ is not empty');
        $('#code3').html('&nbsp;&nbsp;for each neighbor v of u = PQ.front()');
        $('#code4').html('&nbsp;&nbsp;&nbsp;&nbsp;relax(u, v, w(u, v)) + update PQ');
        $('#code5').html('');
        $('#code6').html('');
        $('#code7').html('');
        break;
      case 3: // Modified Dijkstra's
        $('#code1').html('initSSSP');
        $('#code2').html('while the priority queue PQ is not empty');
        $('#code3').html('&nbsp;&nbsp;if the front pair is invalid, skip');
        $('#code4').html('&nbsp;&nbsp;for each neighbor v of u = PQ.front()');
        $('#code5').html('&nbsp;&nbsp;&nbsp;&nbsp;relax(u, v, w(u, v)) + insert new pair to PQ');
        $('#code6').html('');
        $('#code7').html('');
        break;
    }
  }
}
