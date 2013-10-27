// @author Nguyen Hoang Duy, based on Steven Halim's base file
// Defines a Heap object; keeps implementation of Heap internally and interact with GraphWidget to display Heap visualizations

var SuffixArrayWidget = function() {
  var self = this;
  var graphWidget = new GraphWidget();

  /*
   * A: Internal representation of Heap in this object
   * It is a compact 1-based 1-dimensional array (ignoring index 0).
   * The parent/left child/right child can be computed via index manipulation.
   *
   * Elements of A are ObjectPair objects, where first element is the value and the second element is the ID of the vertex SVG corresponding to the value
   */

  /*
   * Edge IDs are the index of the child element, so for example edge A[1]-A[2] will have ID "e2" (edge 2)
   * The edges will be set to not change when vertexes are interchanged
   * This eliminates the need to maintain an Adjacency Matrix / List
   */

  var coord = new Array();
  var A = new Array();
  var amountVertex = 0;
  var amountEdge = 0;

  var stateList = [];
  var edgeGenerator = d3.svg.line()
  .x(function(d){return d.x;})
  .y(function(d){return d.y;})
  .interpolate("linear");
  var mousedown_node = null;
  var mousemove_coor = null;
  var edgeList = [];
  var mousedown_in_progress = false, mousemove_in_progress = false, mouseup_in_progress = false;
  var mousedown_event = null, mousemove_event = null, mouseup_event = null;
  var deleted_vertex_list = [];
  var used_alt = -1;
  var adjMatrix = [], adjList = [];
  var aborted_mousedown = false;
  var move1 = true;
  var screenHeight = window.innerHeight - 100;
  var screenWidth = window.innerWidth - 80;
  var firstNode = -1;
  var isCheckingPointInside = false;
  var cutPolygonState = 0;
  var isPreviousPointInsde = false;
  var isPolygon = false;
  var coord_idx = new Array();
  var coord_data = new Array();

  mainSvg.style("class", "unselectable");

  mainSvg.attr("height", screenHeight);
  mainSvg.attr("width", screenWidth);
  //graphWidget.addRectVertex(100, 100, "ABC", 1, true);


  function resetEverything() {
    coord = new Array();
    A = new Array();
    amountVertex = 0;
    amountEdge = 0;
    graphWidget = new GraphWidget();
    stateList = [];
    edgeGenerator = d3.svg.line()
    .x(function(d){return d.x;})
    .y(function(d){return d.y;})
    .interpolate("linear");
    mousedown_node = null;
    mousemove_coor = null;
    edgeList = [];
    mousedown_in_progress = false, mousemove_in_progress = false, mouseup_in_progress = false;
    mousedown_event = null, mousemove_event = null, mouseup_event = null;
    deleted_vertex_list = [];
    used_alt = -1;
    adjMatrix = [];
    adjList = [];
    aborted_mousedown = false;
    firstNode = -1;
    isCheckingPointInside = false;
    cutPolygonState = 0;
    isPreviousPointInsde = false;
    isPolygon = false;
    coord_idx = new Array();
    coord_data = new Array();
  }

  function createState() {
    var state = {
      "vl":{},
      "el":{},
      "status":{}
    };

    var y0 = 50;
    for (var i=0; i < Object.size(coord_idx); i++) {
      for (var j=0; j < Object.size(coord_idx[0]); j++) {
        var key = i.toString() + "_" + j.toString();
        state["vl"][key] = {};
        state["vl"][key]["state"] = VERTEX_RECT;
        if (i == 0 && j == 0) {
          state["vl"][key]["cx"] = 270;
          state["vl"][key]["cy"] = 50 + i*30;
          state["vl"][key]["text"] = "i";        
          continue;  
        }
        if (j == 0) {
          state["vl"][key]["cx"] = 270;
          state["vl"][key]["cy"] = 50 + i*30;
          state["vl"][key]["text"] = i-1;    
          continue;
        }        
        state["vl"][key]["cx"] = coord_idx[i][j];
        state["vl"][key]["cy"] = 50 + i*30;
        state["vl"][key]["text"] = coord_data[i][j];

      }
    }
    return state;
  }


  this.getGraphWidget = function() { return graphWidget; }
  
  this.getAmountVertex = function() {
    return amountVertex;
  }

  this.getAmountEdge = function() {
    return amountEdge;
  }

  function dist2P(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  }

  // return the circle class id if is inside the circle
  // return -1 if free
  function isUsed(x,y) {
    var i,j;
    for (i=0; i<amountVertex; i++) {
      if (dist2P(x, y, coord[i][0], coord[i][1]) <= 35)
       return i;
   }
   return -1;
  }

  function colorRow(currentState, row_id) {
    for (var i=0; i < Object.size(coord_idx[0]); i++) {
      currentState["vl"][row_id.toString() + "_" + i.toString()]["state"] = VERTEX_HIGHLIGHTED;
    }
  }

  function addRow(data) {
    var sz = Object.size(coord_idx);
    coord_idx[sz] = new Array();
    coord_idx[sz][0] = 270;
    coord_data[sz] = new Array();
    var cur_y = 50 + 30*sz;
    //coord_idx[sz][0][1] = cur_y;
    if (sz==0)
      graphWidget.addRectVertex(270, cur_y, "i",  sz.toString() + "_0", true, "rect");
    else 
      graphWidget.addRectVertex(270, cur_y, (sz-1).toString(),  sz.toString() + "_0", true, "rect");
    for (var i=1; i <= Object.size(data); i++) {
      coord_idx[sz][i] = coord_idx[sz][i-1] + 200;
      coord_data[sz][i] = data[i-1];
      if (i==1) coord_idx[sz][i] =coord_idx[sz][i-1] + 30;
      graphWidget.addRectVertex(coord_idx[sz][i], cur_y, data[i-1], sz.toString() + "_" + i.toString(), true, "rect_long");
    }
  }

  this.clrscr = function() {
  //  graphWidget.addRectVertex(270, 50, "i", "0_0", true, "rect");
  //  graphWidget.addRectVertex(300, 50, "SA[i]", "0_1", true, "rect_long");
  //  graphWidget.addRectVertex(500, 50, "LCP[i]", "0_2", true, "rect_long");
  //  graphWidget.addRectVertex(700, 50, "Suffix", "0_3", true, "rect_long");
 //    var x = mainSvg.selectAll(".v1");
    //x.attr("class", "rect1");
    //x.attr("width", "200");
    clearScreen();
    //createAdjMatrix();
  }
  
  function clearScreen() {
    var i, j;
    
    for (i = 0; i <= 500; i++) {
      try {
        graphWidget.removeEdge(i);
      } catch(err) {}
    }
    
    for (i = 0; i <= 500; i++) {
      try {
        graphWidget.removeVertex(i);
      } catch(err) {}
    }

    for (i = 0; i <= 30; i++) {
      for (j = 0; j <= 5; j++) {
        mainSvg.selectAll(".v" + i.toString() + "_" + j.toString()).remove();
      }
    }

    try {
      graphWidget.removeVertex(0);
    } catch (err) {}

    mainSvg.selectAll(".edgelabel").remove();
    mainSvg.selectAll("text").remove();
    amountVertex = 0;
    resetEverything();
  }  

  function stringCmp(a, b) {
    for (var i=0; i<Math.min(a.length, b.length); i++) {
      if (a[i] < b[i]) return 1;
      else if (a[i] > b[i]) return -1;
    }
    if (a.length == b.length) return 0;
    else if (a.length > b.length) return -1;
    return 1;
  }

  this.constructSA_bad = function(T) {
    clearScreen();
    var data = ["SA[i]", "LCP[i]", "Suffix"];
    addRow(data);
 
    var suffix_table = new Array();
    var SA = new Array();
    for (var i=0; i < T.length; i++) {
      suffix_table.push(T.substring(i));
      SA.push(i);
    }
    for (var i=0; i < T.length-1; i++) 
      for (var j=i+1; j < T.length; j++) {
        if (suffix_table[i] > suffix_table[j]) {
          var tmp = suffix_table[i];
          suffix_table[i] = suffix_table[j];
          suffix_table[j] = tmp;
          tmp = SA[i];
          SA[i] = SA[j];
          SA[j] = tmp;
        }
      }

    // LCP slow
    var LCP = new Array();
    LCP.push(0);
    for (var i=1; i < Object.size(SA); i++) {
      var L = 0;
      while (T[SA[i] + L] == T[SA[i-1] + L]) L++;
      LCP.push(L);
    }
    for (var i=0; i < Object.size(SA); i++) {
      var tmp = new Array();
      tmp.push(SA[i]); tmp.push(LCP[i]); tmp.push(suffix_table[i]);
      addRow(tmp);
    }

    /*
    var currentState = createState();
    var stateList = new Array();
    currentState["vl"]["4_2"]["state"] = VERTEX_HIGHLIGHTED;
    colorRow(currentState, 6);
    stateList.push(currentState);    
    graphWidget.startAnimation(stateList);
    */
  }

  // Javascript addon: get size of an object
  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };


  function popuatePseudocode(act) {
    switch (act) {
      case 0: // Perimeter
        document.getElementById('code1').innerHTML = 'result = 0, sz = size of P';
        document.getElementById('code2').innerHTML = 'for (i=0; i < sz; i++)';
        document.getElementById('code3').innerHTML = '&nbsp&nbspresult += dist(P[i], P[(i+1) % sz]';
        break;
      case 1: // isConvex
        document.getElementById('code1').innerHTML = 'if (sz < 3) polygon is convex';
        document.getElementById('code2').innerHTML = 'isLeft = ccw(P[0], P[1], P[2])';
        document.getElementById('code3').innerHTML = 'for (i=1; i < sz -1; i++)';
        document.getElementById('code4').innerHTML = '&nbsp&nbsptmp = (i+2 == sz ? 1: i+2)';
        document.getElementById('code5').innerHTML = '&nbsp&nbspif ccw(P[i], P[i+1], P[tmp]) != isLeft';
        document.getElementById('code6').innerHTML = '&nbsp&nbsp&nbsp&nbsppolygon is not convex';
        document.getElementById('code7').innerHTML = 'polygon is convex';
        break;
      case 2: // graham scan
        document.getElementById('code1').innerHTML = 'indexing the vertices'
        document.getElementById('code2').innerHTML = 'push P[N-1], P[0], P[1] into stack S';
        document.getElementById('code3').innerHTML = 'while (i < N) // i = 2, N = size of P ';
        document.getElementById('code4').innerHTML = '&nbsp&nbspif (ccw(S[S.size() - 1-1], S[S.size() - 1], P[i])';
        document.getElementById('code5').innerHTML = '&nbsp&nbsp&nbsp&nbsppush P[i] into stack and increase i';
        document.getElementById('code6').innerHTML = '&nbsp&nbspelse pop from S';
        document.getElementById('code7').innerHTML = 'S is the result';
        break;
      case 3: // check point inside polygon
        document.getElementById('code1').innerHTML = 'for (i=0; i < P.size() -1; i++)'
        document.getElementById('code2').innerHTML = '&nbsp&nbsp&nbsp&nbspif ccw(p, P[i], P[i+1]';
        document.getElementById('code3').innerHTML = '&nbsp&nbsp&nbsp&nbspsum += angle(P[i], p, P[i+1])';
        document.getElementById('code4').innerHTML = '&nbsp&nbsp  else sum -= angle(P[i], p, P[i+1])';
        document.getElementById('code5').innerHTML = 'return fabs(fabs(sum) - 2*PI) < EPS';
        break;
      case 4: // cut polygon
        document.getElementById('code1').innerHTML = 'for (point i in polygon)'
        document.getElementById('code2').innerHTML = '&nbsp if left1 > -EPS //left1 = cross(A,B,i)';
        document.getElementById('code3').innerHTML = '&nbsp&nbspadd i to result';
        document.getElementById('code4').innerHTML = '&nbsp if left1*left2 < -EPS //left2 = cross(A,B,i+1)';
        document.getElementById('code5').innerHTML = '&nbsp&nbsp  add intersection to result';
        break;
    } 
  }


}



