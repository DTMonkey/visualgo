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
  var suffix_table = new Array();
  var SA = new Array();
  var LCP = new Array();

  mainSvg.style("class", "unselectable");

  mainSvg.attr("height", screenHeight);
  mainSvg.attr("width", screenWidth);
  //graphWidget.addRectVertex(100, 100, "ABC", 1, true);


  function resetEverything() {
    coord = new Array();
    A = new Array();
    amountVertex = 0;
    amountEdge = 0;
    //graphWidget = new GraphWidget();
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
    suffix_table = new Array();
    SA = new Array();
    LCP = new Array();
  }

  function createState(lower_bound) {
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
    /*
    if (typeof(lower_bound)!= "undefined") {
      var key = "lower_bound";
      state["vl"][key] = {};
      state["vl"][key]["state"] = VERTEX_RECT;
      state["vl"][key]["x"] = coord_idx[lower_bound][Object.size(coord_idx[0])-1] + 200;
      state["vl"][key]["y"] = 50 + 30*(lower_bound+1);
      state["vl"][key]["text"] = "Lower bound";    
    }
    */

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
      currentState["vl"][row_id.toString() + "_" + i.toString()]["state"] = VERTEX_HIGHLIGHTED_RECT;
    }
  }

  function colorResultRow(currentState, row_id) {
    for (var i=0; i < Object.size(coord_idx[0]); i++) {
      currentState["vl"][row_id.toString() + "_" + i.toString()]["state"] = VERTEX_RESULT_RECT;
    }
  }

  // Note: data.size must = no of rows
  function addColumn(data) {
    for (var i=0; i < Object.size(data); i++) {
      var tmp = new Array();
      tmp.push(data[i]);
      appendRow(i, tmp);
    }
  }

  function appendRow(row_id, data) {
    var cur_y = 50 + 30*row_id;
    var sz = Object.size(coord_idx[row_id]);
    for (var i=1; i <= Object.size(data); i++) {
      coord_idx[row_id][sz] = coord_idx[row_id][sz-1] + 200;
      coord_data[row_id][sz] = data[i-1];
      //if (i==1) coord_idx[row_id][sz] =coord_idx[row_id][sz-1] + 30;
      graphWidget.addRectVertex(coord_idx[row_id][sz], cur_y, data[i-1], row_id.toString() + "_" + sz.toString(), true, "rect_long");
      sz++;
    }
  }

  function addRow(data) {
    var sz = Object.size(coord_idx);
    coord_idx[sz] = new Array();
    coord_idx[sz][0] = 70;
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
      if (i==1) coord_idx[sz][i] =coord_idx[sz][i-1] + 50;
      graphWidget.addRectVertex(coord_idx[sz][i], cur_y, data[i-1], sz.toString() + "_" + i.toString(), true, "rect_long");
    }
  }

  this.clrscr = function() {
    //graphWidget.addRectVertex(coord_idx[4][Object.size(coord_idx[0])-1] + 200, 50 + 30*(4+1), "Lower bound", "lbound", true, "rect_long");

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
      if (a[i] < b[i]) return -1;
      else if (a[i] > b[i]) return 1;
    }
    if (a.length == b.length) return 0;
    else if (a.length > b.length) return 1;
    return -1;
  }

  this.constructSA_bad = function(T) {
    clearScreen();
    var data = ["SA[i]", "LCP[i]", "Suffix"];
    addRow(data);
 
    suffix_table = new Array();
    SA = new Array();
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
    LCP = new Array();
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

    var data = ["test", "test", "test", "test", "test", "test", "test", "test", "test"];
    //addColumn(data);
    //graphWidget.addRectVertex(coord_idx[4][Object.size(coord_idx[0])-1] + 200, 50 + 30*(4+1), "Lower bound", "lbound", true, "rect_long");


    /*
    var currentState = createState();
    var stateList = new Array();
    currentState["vl"]["4_2"]["state"] = VERTEX_HIGHLIGHTED;
    colorRow(currentState, 6);
    stateList.push(currentState);    
    graphWidget.startAnimation(stateList);
    */
  }

  function strncmp(str1, str2, n) {
    str1 = str1.substring(0, n);
    str2 = str2.substring(0, n);
    return ( ( str1 == str2 ) ? 0 :(( str1 > str2 ) ? 1 : -1 ));
  }

  this.goSearch = function() {
    var P = document.getElementById("search_inp").value;
    var T = document.getElementById("arrv1").value;
    popuatePseudocode(0);
    var stateList = new Array();
    // find lower bound
    var currentState = createState();
    currentState["status"] = "Find lower bound.";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    var lo = 0, hi = T.length - 1, mid = lo;
    while (lo < hi) {
      mid =  Math.floor((lo + hi) / 2);
      currentState = createState();
      currentState["status"] = "Low: " + lo + ". High: " + hi + ". Mid: " + mid;
      currentState["lineNo"] = 
      colorRow(currentState, lo + 1); colorRow(currentState, hi + 1); colorRow(currentState, mid + 1);
      stateList.push(currentState);
      currentState = createState();
      colorRow(currentState, lo + 1); colorRow(currentState, hi + 1); colorRow(currentState, mid + 1);
      var res = strncmp(T.substring(SA[mid]), P, P.length);
      if (res >= 0) {
        hi = mid;
        currentState["status"] = "P is smaller or equal, adjusting High";
      }
      else {
        lo = mid + 1;
        currentState["status"] = "P is bigger, adjusting Low";
      }
      currentState["lineNo"] = 1;
      stateList.push(currentState);
    }
    if (strncmp(T.substring(SA[lo]), P, P.length) != 0) {
      alert("not found");
      return;
    }
    var lower_bound = lo;
    currentState = createState();
    currentState["status"] = "Lower bound is highlighted";
    currentState["lineNo"] = 1;
    colorRow(currentState, lower_bound);
    //graphWidget.addRectVertex(coord_idx[4][Object.size(coord_idx[0])-1] + 200, 50 + 30*(4+1), "Lower bound", "lbound", true, "rect_long");
    //currentState["vl"]["lower_bound"]["stroke"] = "#eeeeee";

    /*
    mainSvg
       .append("text")
       .attr("id", "lower_bound")
       .attr("class", "edgelabel")
       .attr("x", coord_idx[4][Object.size(coord_idx[0])-1] + 190)
       .attr("y", 50 + 30*(4+1))
       .attr("dx", 1)
       .attr("dy", ".35em")
       .attr("text-anchor", "left")     
       .text(function(d) { return "Lower bound" });
    */
    stateList.push(currentState);
    currentState = createState();
    currentState["status"] = "Find upper bound.";
    currentState["lineNo"] = 2;
    stateList.push(currentState);
    // find upper bound
    var lo = 0, hi = T.length - 1, mid = lo;
    while (lo < hi) {
      mid =  Math.floor((lo + hi) / 2);
      currentState = createState();
      currentState["status"] = "Low: " + lo + ". High: " + hi + ". Mid: " + mid;
      currentState["lineNo"] = 2;
      colorRow(currentState, lo + 1); colorRow(currentState, hi + 1); colorRow(currentState, mid + 1);
      stateList.push(currentState);
      currentState = createState();
      colorRow(currentState, lo + 1); colorRow(currentState, hi + 1); colorRow(currentState, mid + 1);
      var res = strncmp(T.substring(SA[mid]), P, P.length);
      if (res > 0) {
        hi = mid;
        currentState["status"] = "P is smaller, adjusting High";
      }
      else {
        lo = mid + 1;
        currentState["status"] = "P is bigger or equal, adjusting Low";
      }
      currentState["lineNo"] = 2;
      stateList.push(currentState);
    }
    if (strncmp(T.substring(SA[hi]), P, P.length) != 0) hi--;
    var h_bound = hi;
    var currentState = createState();
    colorRow(currentState, h_bound);
    currentState["status"] = "Upper bound is highlighted";
    currentState["lineNo"] = 2;
    stateList.push(currentState);
    var currentState = createState();
    currentState["status"] = "Results are highlighted from lower bound to upper bound.";
    currentState["lineNo"] = 3;
    for (var i=lower_bound+1; i < h_bound+2; i++) colorRow(currentState, i);
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);

    return true;
  }

  this.goLRS = function() {
    popuatePseudocode(1);
    var currentState = createState();
    var stateList = new Array();
    currentState["status"] = "Start. Max = 0. Max rows will be colored by green";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    var max = 0, save = new Array();
    for (var i=0; i < Object.size(LCP); i++) {
      var currentState = createState();
      colorRow(currentState, i+1);
      currentState["status"] = "Checking this LCP";
      currentState["lineNo"] = 3;
      for (var j=0; j < Object.size(save); j++) {
        colorResultRow(currentState, save[j]+1);
      }
      stateList.push(currentState);
      currentState = createState();
      currentState["status"] = "LCP[i] = " + LCP[i] + ", ";
      if (LCP[i] > max) {
        currentState["status"] += "Bigger than max. Update max.";
        max = LCP[i];
        save = new Array();
        save.push(i);
        currentState["lineNo"] = 4;
      } else if (LCP[i] == max) {
        currentState["status"] = "Equal to max. Update max";
        save.push(i);
        currentState["lineNo"] =  4;
      } else {
        currentState["status"] = "Smaller than max. Continue";
        currentState["lineNo"] = 2;
        colorRow(currentState, i+1);
      }
      for (var j=0; j < Object.size(save); j++) {
        colorResultRow(currentState, save[j]+1);
      }
      stateList.push(currentState);
    }
    currentState = createState();
    currentState["status"] = "Finish.";
    currentState["lineNo"] = 5;
    for (var j=0; j < Object.size(save); j++) {
      colorResultRow(currentState, save[j]+1);
    }
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);
    return true;
  }

  this.goLCS = function() {
    var owner = new Array();
    popuatePseudocode(2);
    var s1 = document.getElementById("s1").value, s2 = document.getElementById("s2").value;
    var T = s1 + s2;
    this.constructSA_bad(T);
    owner.push("Owner");
    for (var i=0; i < Object.size(SA); i++) {
      var tmp = T.substring(SA[i]);
      if (tmp.indexOf("#") == -1) {
        owner.push(2);
      } else owner.push(1);
    }
    addColumn(owner);
    owner = owner.splice(1);

    var currentState = createState();
    var stateList = new Array();
    var max = 0;
    var save = new Array();
    currentState["status"] = "Start";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    currentState = createState();
    currentState["status"] = "Start at index 1";
    currentState["lineNo"] = 2; 
    colorRow(currentState, 2);
    stateList.push(currentState);
    for (var i=1; i < Object.size(SA); i++) {
      currentState = createState();
      colorRow(currentState, i+1);
      if (owner[i] == owner[i-1]) {
        currentState["status"] = "Same owner as previous index. Continue.";
        currentState["lineNo"] = 3;
      } else {
        currentState["status"] = "Different owner as previous index. ";
        currentState["lineNo"] = 4;
        if (LCP[i] > max) {
          max = LCP[i];
          currentState["status"] += "LCP[i]=" + LCP[i].toString() + " max=" + max.toString() + ". Update max.";
          save = new Array();
          save.push(i);
        } else if (LCP[i] == max) {
          save.push(i);
          currentState["status"] += "LCP[i]=" + LCP[i].toString() + " max=" + max.toString() + ". Update result.";
        } else {
          currentState["status"] += "LCP[i]=" + LCP[i].toString() + " max=" + max.toString() + ". Continue.";          
        }
      }
      for (var j=0; j < Object.size(save); j++) {
        colorResultRow(currentState, save[j]+1);
      }
      stateList.push(currentState);
    }
    currentState = createState();
    currentState["status"] = "Finish.";
    currentState["lineNo"] = 5;
    for (var j=0; j < Object.size(save); j++) {
      colorResultRow(currentState, save[j]+1);
    }
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    return true;
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
      case 0: // Search
        document.getElementById('code1').innerHTML = 'find lower bound';
        document.getElementById('code2').innerHTML = 'find upper bound';
        document.getElementById('code3').innerHTML = 'report results';
        break;
      case 1: // LRS
        document.getElementById('code1').innerHTML = 'max = 0, result = array';
        document.getElementById('code2').innerHTML = 'for i=0 to LCP.size() -1';
        document.getElementById('code3').innerHTML = '&nbsp&nbspif (LCP[i] >= max)';
        document.getElementById('code4').innerHTML = '&nbsp&nbsp&nbsp&nbspupdate max, result';
        document.getElementById('code5').innerHTML = 'return result';
        break;
      case 2: // LCS
        document.getElementById('code1').innerHTML = 'max = 0, result = null'
        document.getElementById('code2').innerHTML = 'for i from 1 to T.length';
        document.getElementById('code3').innerHTML = '&nbsp&nbspif (owner[i] == owner[i-1] continue';
        document.getElementById('code4').innerHTML = '&nbsp&nbsp&if (LCP[i] >= max) update max, result';
        document.getElementById('code5').innerHTML = 'return result';
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



