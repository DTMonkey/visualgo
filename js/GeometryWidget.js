// @author Nguyen Hoang Duy, based on Steven Halim's base file
// Defines a Heap object; keeps implementation of Heap internally and interact with GraphWidget to display Heap visualizations

var Geometry = function() {
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
   var previous_option = null;

   mainSvg.style("class", "unselectable");
   mainSvg.append('svg:defs').append('svg:marker')
   .attr('id', 'end-arrow')
   .attr('viewBox', '0 -5 10 10')
   .attr('refX', 9)
   .attr('markerWidth', 4)
   .attr('markerHeight', 3)
   .attr('orient', 'auto')
   .append('svg:path')
   .attr('d', 'M0,-5L10,0L0,5')
   .attr('fill', '#000');
   mainSvg.style("cursor", "crosshair");

  mainSvg.attr("height", screenHeight);
  mainSvg.attr("width", screenWidth);
  //x.attr("style", "width:200");
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
    previous_option = null;
  }

  function addExtraEdge() {    
    //addIndirectedEdge(1, 1, ++amountEdge, EDGE_TYPE_UDE, 1, true);
    //mainSvg.select("#e" + amountEdge.toString()).style("visibility", "hidden");      
  }

  // add weight text on a path with id e
  function addWeightText(e, value) {
    var edge = edgeList[e];
    var Pt = calculateEdge(
              coord[edge[0]][0],
              coord[edge[0]][1],
              coord[edge[1]][0],
              coord[edge[1]][1]
            );
    var x1, y1, x2, y2;
    x1 = Pt[0].x; y1 = Pt[0].y;
    x2 = Pt[1].x; y2 = Pt[1].y;
    var slope = (y1 - y2)/ (x1 - x2);
    var b1  = y1 - slope*x1;
    // y = slope * x + b1
    // y = slope * x + b2

    var x_text, y_text;
    if ((x1 < x2) && (y1 < y2)) {
      if (y2 - y1 > 15) {
        var b2 = b1 + 4 + slope*17;
        y_text = (y2 - y1)* 9/10 + y1;
        x_text = (y_text - b2) / slope;
      } else {
        // treat as equal
        if (x1 > x2) {
          y_text = y1 - 10;
          x_text = x2 + (x1 - x2)* 1/3;
        } else {
          y_text = y1 + 10;
          x_text = x1 + (x2 - x1)* 2/3;
        }
        y_text += 4;
      }
    } else if ((x1 > x2) && (y1 < y2)) {
      if (y2 - y1 > 15) {
        var b2 = b1 - 4 + slope*17;
        y_text = (y2 - y1)* 1/1.8 + y1;
        x_text = (y_text - b2) / slope; 
      } else {
        // treat as equal
        if (x1 > x2) {
          y_text = y1 - 10;
          x_text = x2 + (x1 - x2)* 1/3;
        } else {
          y_text = y1 + 10;
          x_text = x1 + (x2 - x1)* 2/3;
        }
      }
    } else if ((x1 > x2) && (y1 > y2)) {
      if (y1 - y2 > 15) {
        var b2 = b1 + 4 + slope*17;
        y_text = (y1 - y2)* 9/10 + y2;
        x_text = (y_text - b2) / slope; 
        var x_mid = (x1 + x2)/2, y_mid = (y1 + y2)/2;
        y_text = 2*y_mid - y_text;
        x_text = 2*x_mid - x_text;
      } else {
        // treat as equal
        if (x1 > x2) {
          y_text = y1 - 10;
          x_text = x2 + (x1 - x2)* 1/3;
        } else {
          y_text = y1 + 10;
          x_text = x1 + (x2 - x1)* 2/3;
        }
        y_text-=3;
      }
    } else if ((x1 < x2) && (y1 > y2)) {
      if (y1 - y2 > 15) {
        var b2 = b1 - 4 + slope*17;
        y_text0 = (y1 - y2)* 1/1.8 + y2;
        x_text0 = (y_text0 - b2) / slope; 
        var x_mid = (x1 + x2)/2, y_mid = (y1 + y2)/2;
        y_text = 2*y_mid - y_text0;
        x_text = 2*x_mid - x_text0;
      } else {
        // treat as equal
        if (x1 > x2) {
          y_text = y1 - 10;
          x_text = x2 + (x1 - x2)* 1/3;
        } else {
          y_text = y1 + 10;
          x_text = x1 + (x2 - x1)* 2/3;
        }
      }
    } else if (x1 == x2) {
      if (y1 > y2) {
        x_text = x1 + 10;
        y_text = (y1 - y2)*1/3 + y2;
      } else {
        x_text = x1 - 10;
        y_text = (y2 - y1)*2/3 + y1;
      }
    } else if (y1 == y2) {
      if (x1 > x2) {
        y_text = y1 - 10;
        x_text = x2 + (x1 - x2)* 1/3;
      } else {
        y_text = y1 + 10;
        x_text = x1 + (x2 - x1)* 2/3;
      }
    }
    
    if (x_text && y_text) {
      e = e.replace("#","");
      mainSvg
       .append("text")
       .attr("id", "w_" + e)
       .attr("class", "edgelabel")
       .attr("x", x_text)
       .attr("y", y_text)
       .attr("dx", 1)
       .attr("dy", ".35em")
       .attr("text-anchor", "middle")     
       .text(function(d) { return value.toString() });
    }
  }

  // move weight text on a path with id e
  function moveWeightedText(e) {
    var edge = edgeList["#e" + e];
    if (typeof(edge)== "undefined") return;
    var Pt = calculateEdge(
              coord[edge[0]][0],
              coord[edge[0]][1],
              coord[edge[1]][0],
              coord[edge[1]][1]
            );
    var x1, y1, x2, y2;
    x1 = Pt[0].x; y1 = Pt[0].y;
    x2 = Pt[1].x; y2 = Pt[1].y;
    var slope = (y1 - y2)/ (x1 - x2);
    var b1  = y1 - slope*x1;
    // y = slope * x + b1
    // y = slope * x + b2

    var x_text, y_text;
    if ((x1 < x2) && (y1 < y2)) {
      var b2 = b1 + 4 + slope*17;
      y_text = (y2 - y1)* 9/10 + y1;
      x_text = (y_text - b2) / slope;
    } else if ((x1 > x2) && (y1 < y2)) {
      var b2 = b1 - 4 + slope*17;
      y_text = (y2 - y1)* 1/1.8 + y1;
      x_text = (y_text - b2) / slope; 
    } else if ((x1 > x2) && (y1 > y2)) {
      var b2 = b1 + 4 + slope*17;
      y_text = (y1 - y2)* 9/10 + y2;
      x_text = (y_text - b2) / slope; 
      var x_mid = (x1 + x2)/2, y_mid = (y1 + y2)/2;
      y_text = 2*y_mid - y_text;
      x_text = 2*x_mid - x_text;
    } else if ((x1 < x2) && (y1 > y2)) {
      var b2 = b1 - 4 + slope*17;
      y_text0 = (y1 - y2)* 1/1.8 + y2;
      x_text0 = (y_text0 - b2) / slope; 
      var x_mid = (x1 + x2)/2, y_mid = (y1 + y2)/2;
      y_text = 2*y_mid - y_text0;
      x_text = 2*x_mid - x_text0;
    } else if (x1 == x2) {
      if (y1 > y2) {
        x_text = x1 + 10;
        y_text = (y1 - y2)*1/3 + y2;
      } else {
        x_text = x1 - 10;
        y_text = (y2 - y1)*2/3 + y1;
      }
    } else if (y1 == y2) {
      if (x1 > x2) {
        y_text = y1 - 10;
        x_text = x2 + (x1 - x2)* 1/3;
      } else {
        y_text = y1 + 10;
        x_text = x1 + (x2 - x1)* 2/3;
      }
    }
   
    mainSvg.selectAll("#w_e" + e)
     .attr("x", x_text)
     .attr("y", y_text);
  }

  function getNextVertexId() {
    var circles = mainSvg.selectAll("text");
    var max = 0;
    var x =  Object.size(circles[0]);
    for (var i=0; i < Object.size(circles[0]) - 1; i++) {
      var y = circles[0][i].attributes.class;
    if (y)
      if ((y.nodeValue.toString()!="edgelabel")) {
        var cur = parseInt(circles[0][i].textContent);
        if (cur > max) max = cur;
      }
    }
    return (max + 2);
  }

  // create new node on graph
  function doclick2(cur) {
    var is_deleted = 0;
    if (isUsed(cur[0],cur[1]) == -1) {
      var new_vertex_id = getNextVertexId();
      if (deleted_vertex_list.length > 0) {
        is_deleted = 1;
        new_vertex_id = deleted_vertex_list[0];
        deleted_vertex_list.splice(0, 1);
      }

      coord[amountVertex] = new Array();
      coord[amountVertex][0] = cur[0];
      coord[amountVertex][1] = cur[1];
      if (cutPolygonState == 0)
        A[amountVertex] = new ObjectPair(amountVertex, amountVertex);
      else if (cutPolygonState == 1) {
        A[amountVertex] = new ObjectPair("A", amountVertex);
        cutPolygonState++;
      } else {
        A[amountVertex] = new ObjectPair("B", amountVertex);
        cutPolygonState++;
      }
      graphWidget.addVertex(cur[0], cur[1], A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);
      if (firstNode == -1) {
        firstNode = amountVertex-1;
      }
      if (isCheckingPointInside) {
        goPointInside();
        return;
      }
      var text = mainSvg.selectAll(".v" + ((amountVertex-1)).toString());

      text[0] = text[0].splice(2,1);
      var ii = new_vertex_id -2;
      text.on("mouseover", function () {                
      })
      .on("mouseout", function () { 

      })
      .on("click", function () {
          // hold ctrl to delete node
          if (d3.event.ctrlKey) {
            return;
            //alert("click + ctrl");
            // TODO: delete node and associated edges
            console.log(d3.select(this).attr("class"));
            console.log(d3.selectAll(d3.select(this).attr("class")));
            mainSvg.selectAll("." + d3.select(this).attr("class")).remove();
            var current_id = d3.select(this).attr("class");
            var current_id_num = "";
            for (var i=1; i < current_id.length; i++) {
              current_id_num += current_id[i];
            }
            current_id_num = parseInt(current_id_num);
            coord[current_id_num][0] = -1;
            coord[current_id_num][1] = -1;
            var tmp_e = "#e";
            for (var i=1; i <= Object.size(edgeList); i++) {
              var tmp_edge_id = tmp_e + i.toString();
              console.log(edgeList[tmp_edge_id]);
              if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                mainSvg.select("#w_e" + i.toString()).remove();
              }
            }            
            var islast = true;
            var temp = d3.select(this);
            temp = temp[0][0].textContent;
            var current_id_num1 = parseInt(temp) + 1;
            for (var i=0; i < deleted_vertex_list.length; i++) {
              if (deleted_vertex_list[i] > current_id_num1) {
                // insert 
                deleted_vertex_list.splice(i, 0, current_id_num1);
                islast = false;
                break;
              }
            }
            if (islast) deleted_vertex_list.push(current_id_num1);
            //createAdjMatrix();    
            return;
          } else {
            if (mousedown_node != null) {
              if (ii != firstNode) return;
              if (isCheckingPointInside)  return;
              if (cutPolygonState > 0) return;
              addIndirectedEdge(mousedown_node, ii, ++amountEdge, EDGE_TYPE_UDE, 0, true);
              //edgeList["#e" + amountEdge] = 
              isPolygon = true;
              mainSvg.on("mousedown", null);
            }
          }
        }
      );
      circle = mainSvg.selectAll(".v" + (amountVertex-1).toString());
      circle.style("cursor", "pointer");
      console.log(circle[0][2].textContent);
      //circle[0][2].textContent = new_vertex_id.toString();
      console.log(circle[0][2].textContent);
      var text = mainSvg.selectAll("text").selectAll(".v" + (amountVertex-1).toString());
      text.style("pointer-events", "none");

      console.log("v"+(amountVertex-1).toString());      
      circle[0] = circle[0].splice(0,2);
      //console.log(circle[0]);
      //console.log(circle);
      circle.on("mouseover", function () { 
       
      })
      .on("mouseout", function () { 
      })
      .on("mousedown", function() {
        //mousedown_node = d3.mouse(this);              
      })
      .on("click", function() {
              // hold ctrl to delete node
              if (d3.event.ctrlKey) {
                return;
                //alert("click + ctrl");
                // TODO: delete node and associated edges
                console.log(d3.select(this).attr("class"));
                console.log(d3.selectAll(d3.select(this).attr("class")));
                var temp = mainSvg.selectAll("." + d3.select(this).attr("class"));
                temp = temp[0][2].textContent;
                mainSvg.selectAll("." + d3.select(this).attr("class")).remove();
                var current_id = d3.select(this).attr("class");                  
                var current_id_num = "";
                for (var i=1; i < current_id.length; i++) {
                  current_id_num += current_id[i];
                }
                current_id_num = parseInt(current_id_num);
                coord[current_id_num][0] = -1;
                coord[current_id_num][1] = -1;
                var tmp_e = "#e";
                for (var i=1; i <= Object.size(edgeList); i++) {
                  var tmp_edge_id = tmp_e + i.toString();
                  console.log(edgeList[tmp_edge_id]);
                  if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                    mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                    mainSvg.select("#w_e" + i.toString()).remove();
                  }
                }  
                coord[current_id_num][0] = -1;
                coord[current_id_num][1] = -1;
                var islast = true;                  
                var current_id_num1 = parseInt(temp) + 1;
                for (var i=0; i < deleted_vertex_list.length; i++) {
                  if (deleted_vertex_list[i] > current_id_num1) {
                    // insert 
                    deleted_vertex_list.splice(i, 0, current_id_num1);
                    islast = false;
                    break;
                  }
                }
                if (islast) deleted_vertex_list.push(current_id_num1);
                //createAdjMatrix();   
                return;
              } else {
                if (mousedown_node != null) {
                  if (ii != firstNode) return;
                  if (isCheckingPointInside)  return;
                  if (cutPolygonState > 0) return;
                  addIndirectedEdge(mousedown_node, ii, ++amountEdge, EDGE_TYPE_UDE, 0, true);
                  mainSvg.on("mousedown", null);
                  isPolygon = true;
                }
              }       
            });
    }
  }

  function doclick3(cur) {
    var is_deleted = 0;
    if (isUsed(cur[0],cur[1]) == -1) {
      var new_vertex_id = getNextVertexId();
      if (deleted_vertex_list.length > 0) {
        is_deleted = 1;
        new_vertex_id = deleted_vertex_list[0];
        deleted_vertex_list.splice(0, 1);
      }

      coord[amountVertex] = new Array();
      coord[amountVertex][0] = cur[0];
      coord[amountVertex][1] = cur[1];
      A[amountVertex] = new ObjectPair("", amountVertex);
      graphWidget.addVertex(cur[0], cur[1], A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);
    }
  }


  function doMouseDown() {
    if (d3.event.ctrlKey) return;
    mousedown_in_progress = true;
    var cur = d3.mouse(mousedown_event);
    var is_used = isUsed(cur[0], cur[1]);
    var prev = mousedown_node;
    if (is_used == -1) {
      doclick2(cur);
      if (mousedown_node != null && cutPolygonState!=2) {
        addIndirectedEdge(amountVertex-1, mousedown_node, ++amountEdge, EDGE_TYPE_UDE, 0, true);
        if (cutPolygonState == 3) {
          var sz = Object.size(coord)-2;
          for (var i=0; i < sz; i++) {
            var nxt = (i == sz - 1) ? 0 : i+1;
            var left1 = cross(coord[amountVertex-1][0], coord[amountVertex-1][1], coord[mousedown_node][0], coord[mousedown_node][1], coord[i][0], coord[i][1]);
            var left2 = cross(coord[amountVertex-1][0], coord[amountVertex-1][1], coord[mousedown_node][0], coord[mousedown_node][1], coord[nxt][0], coord[nxt][1]);
            if (left1 * left2 > -0.000001) continue;
            var sect = lineIntersectSeg(coord[i][0], coord[i][1],
                                        coord[nxt][0], coord[nxt][1],
                                        coord[amountVertex-1][0], coord[amountVertex-1][1],
                                        coord[mousedown_node][0], coord[mousedown_node][1]);
            coord[amountVertex] = new Array();
            coord[amountVertex][0] = sect[0];
            coord[amountVertex][1] = sect[1];
            A[amountVertex] = new ObjectPair("", amountVertex);
            graphWidget.addVertex(sect[0], sect[1], A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);
            var ed = getEdgeConnectTwoVertex(i, nxt);
            graphWidget.removeEdge(ed);
            delete edgeList["#e" + ed.toString()];
            addIndirectedEdge(i, amountVertex-1, ++amountEdge, EDGE_TYPE_UDE, 0, true);
            addIndirectedEdge(nxt, amountVertex-1, ++amountEdge, EDGE_TYPE_UDE, 0, true);
          }
          var in1 = isInsidePolygon(coord[amountVertex-3][0], coord[amountVertex-3][1]);
          var in2 = isInsidePolygon(coord[amountVertex-4][0], coord[amountVertex-4][1]);
          var dis31 = dist2P(coord[amountVertex-1][0], coord[amountVertex-1][1],
                             coord[amountVertex-3][0], coord[amountVertex-3][1]);
          var dis32 = dist2P(coord[amountVertex-2][0], coord[amountVertex-2][1],
                           coord[amountVertex-3][0], coord[amountVertex-3][1]);
          var con3 = amountVertex-1, con4 = amountVertex-2;
          if (dis31 > dis32) {
            con3 = amountVertex-2;
            con4 = amountVertex-1;
          }
          addIndirectedEdge(con3, amountVertex-3, ++amountEdge, EDGE_TYPE_UDE, 0, true);
          addIndirectedEdge(con4, amountVertex-4, ++amountEdge, EDGE_TYPE_UDE, 0, true);

          if (!in1 && !in2) { // both outside
            var ed = getEdgeConnectTwoVertex(amountVertex-3, amountVertex-4);
            graphWidget.removeEdge(ed);
            delete edgeList["#e" + ed.toString()];
            addIndirectedEdge(amountVertex-1, amountVertex-2, ++amountEdge, EDGE_TYPE_UDE, 0, true);
          } else if (in1 && in2) { // both inside

          } else { // 1 inside 1 outside
            var in_idx = amountVertex-3; var con_idx = con4;
            if (in2) {
              in_idx = amountVertex-4;
              con_idx = con3;
            }
            var ed = getEdgeConnectTwoVertex(amountVertex-3, amountVertex-4);
            graphWidget.removeEdge(ed);
            delete edgeList["#e" + ed.toString()];
            addIndirectedEdge(in_idx, con_idx, ++amountEdge, EDGE_TYPE_UDE, 0, true);                          
          }
          goCutPolygon();
        }
      }
      mousedown_node = amountVertex-1;
    } //else mousedown_node = is_used;
  }

  function doMouseDownGraham() {
    if (d3.event.ctrlKey) return;
    mousedown_in_progress = true;
    var cur = d3.mouse(mousedown_event);
    var is_used = isUsed(cur[0], cur[1]);
    var prev = mousedown_node;
    if (is_used == -1) {
      doclick3(cur);
      mousedown_node = amountVertex-1;
    } 
  }

  
  mainSvg.on("mousedown", function (d) { 
    mousedown_event = this;
    doMouseDown();
  });

  mainSvg.on("mousemove", function (d) {
    //mousemove_event = this;
    //doMouseMove();

  });

  function insertToDeletedList(current_id_num) {
    var islast = true;
    for (var i=0; i < deleted_vertex_list.length; i++) {
      if (deleted_vertex_list[i] > current_id_num) {
             // insert 
             deleted_vertex_list.splice(i, 0, current_id_num);
             islast = false;
             break;
           }
      }
    if (islast) deleted_vertex_list.push(current_id_num);
  }

  function createState(internalHeapObject) {
    var state = {
      "vl":{},
      "el":{},
      "status":{}
    };

    for (var i = 0; i < Object.size(internalHeapObject); i++) {
      var key = internalHeapObject[i].getSecond();
      //var key = i;
      state["vl"][key] = {};

      state["vl"][key]["cx"] = coord[key][0];
      state["vl"][key]["cy"] = coord[key][1];
      state["vl"][key]["text"] = internalHeapObject[i].getFirst();
      state["vl"][key]["state"] = VERTEX_DEFAULT;
    }

    var count = 0;
    for (edgeId in edgeList) {
      if (edgeList.hasOwnProperty(edgeId)) {
        var id = parseInt(edgeId.substring(2));
        state["el"][id] = {};
        state["el"][id]["vertexA"] = edgeList[edgeId][0];
        state["el"][id]["vertexB"] = edgeList[edgeId][1];
        state["el"][id]["type"] = EDGE_TYPE_UDE;
        state["el"][id]["weight"] = 1;
        state["el"][id]["state"] = EDGE_DEFAULT;
        state["el"][id]["animateHighlighted"] = false;
      }
    }
    return state;
  }

  function getEdgeConnectTwoVertex(v0, v1) {
    for (var i=1; i <= amountEdge; i++) {
      var e = edgeList["#e" + i.toString()];
      if (typeof(e) == "undefined") continue;
      if ((e[0] == v0 && e[1] == v1) || (e[0] == v1 && e[1] == v0))
        return i;
    }   
    return null;
  }

  // redraw the polygon
  function refresh(k) {
    var tmp_coord = new Array();
    for (var i=0; i < Object.size(coord)-k; i++) {
      tmp_coord.push(coord[i]);
    }      
    clearScreen();
    for (var i=0; i < Object.size(tmp_coord); i++) {
      var tmp = tmp_coord[i];
      doclick2(tmp);
      if (i > 0) {
        addIndirectedEdge(i-1, i, ++amountEdge, EDGE_TYPE_UDE, 0, true);
      }
      if (i == Object.size(tmp_coord)-1) {
        addIndirectedEdge(i, 0, ++amountEdge, EDGE_TYPE_UDE, 0, true);
      }
    }
    isPolygon = true;
  }

  this.findPerimeter = function() {
    /*
    if (isPreviousPointInsde) {
      graphWidget.removeVertex(amountVertex-1);
      delete coord[amountVertex-1];
      delete A[amountVertex-1];
    }
    */

    if (previous_option == "grahamScan") {
      if (!isPolygon)
        alert("Please clear screen and draw your polygon first.");
      return;
    } else if (previous_option == "goPointInside") {
      refresh(1);  
    }    
    else if (previous_option == "goCutPolygon") {
      refresh(4);
    }

    previous_option = "findPerimeter";
    var stateList = new Array();
    var currentState = createState(A);
    popuatePseudocode(0);
    if (!isPolygon) {
      currentState["status"] = "Not a polygon yet. Please finish drawing";
      stateList.push(currentState);
      graphWidget.startAnimation(stateList);
      return;
    }
    mainSvg.on("mousedown", null);


    currentState["status"] = "Start. result = 0";
    currentState["lineNo"] = 1;
    stateList.push(currentState);

    var dist = 0, over_dist = 0;
    var prevs = new Array();
    var prev_es = new Array();
    for (var i=0; i < Object.size(coord); i++) {
      currentState = createState(A);
      for (var j=0; j < Object.size(prevs); j++) {
        currentState["vl"][prevs[j]]["state"] = VERTEX_TRAVERSED;
      }
      for (var j=0; j < Object.size(prev_es); j++) {
        currentState["el"][prev_es[j]]["state"] = EDGE_TRAVERSED;
      }
      var v0 = isUsed(coord[i][0], coord[i][1]);
      var k = (i == Object.size(coord) -1) ? 0 : i+1;
      var v1 = isUsed(coord[k][0], coord[k][1]);
      currentState["vl"][v0]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][v1]["state"] = VERTEX_HIGHLIGHTED;
      prevs.push(v0);prevs.push(v1);
      var e = getEdgeConnectTwoVertex(v0, v1);
      currentState["el"][e]["state"] = EDGE_HIGHLIGHTED;
      //currentState["el"][1]["state"] = EDGE_TRAVERSED;      
      prev_es.push(e);
      dist = dist2P(coord[i][0], coord[i][1], coord[k][0], coord[k][1]);
      over_dist += dist;
      currentState["status"] = "Distance between these 2 vertices = " + dist.toFixed(2) + ". result = " + over_dist.toFixed(2) + ".";
      currentState["lineNo"] = 3;
      stateList.push(currentState);
    }
    currentState = createState(A);
    for (var j=0; j < Object.size(prevs); j++) {
      currentState["vl"][prevs[j]]["state"] = VERTEX_TRAVERSED;
    }
    for (var j=0; j < Object.size(prev_es); j++) {
      currentState["el"][prev_es[j]]["state"] = EDGE_TRAVERSED;
    }
    currentState["status"] = "result = " + over_dist.toFixed(2) + ".";
    stateList.push(currentState);
    currentState = createState(A);
    currentState["status"] = "Finish.";
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);

    return true;
  }

  function cross(px, py, qx, qy, rx, ry) {
    return (rx - qx)*(py - qy) - (ry - qy)*(px - qx);
  }

  function ccw(x1, y1, x2, y2, x3, y3) {
    return cross(x1, y1, x2, y2, x3, y3) < 0;
  }

  this.isConvex = function() {
    if (previous_option == "grahamScan") {
      if (!isPolygon)
        alert("Please clear screen and draw your polygon first.");
      return;
    } else if (previous_option == "goPointInside") {
      refresh(1);  
    }    
    else if (previous_option == "goCutPolygon") {
      refresh(4);
    }
    previous_option = "isConvex";
    var sz = Object.size(coord);
    var stateList = new Array();
    popuatePseudocode(1);
    var currentState = createState(A);
    var prevs = new Array();
    var prev_es = new Array();
    if (!isPolygon) {
      currentState["status"] = "Not a polygon yet. Please finish drawing";
      stateList.push(currentState);
      //graphWidget.startAnimation(stateList);
      return;
    }

    currentState["status"] = "Start";
    //currentState["lineNo"] = 2;
    if (sz < 3) {
      currentState["status"] = "Point or line are not convex";      
      stateList.push(currentState);
      graphWidget.startAnimation(stateList);
      return true;
    }
    stateList.push(currentState);
    currentState = createState(A);    

    var isLeft = ccw(coord[0][0], coord[0][1], coord[1][0], coord[1][1], coord[2][0], coord[2][1]);
    currentState["status"] = "First 3 points ccw = " + isLeft;
    currentState["lineNo"] = 2;
    var v0 = isUsed(coord[0][0], coord[0][1]);
    var v1 = isUsed(coord[1][0], coord[1][1]);
    var v2 = isUsed(coord[2][0], coord[2][1]);
    currentState["vl"][v0]["state"] = VERTEX_HIGHLIGHTED;
    currentState["vl"][v1]["state"] = VERTEX_HIGHLIGHTED;
    currentState["vl"][v2]["state"] = VERTEX_HIGHLIGHTED;
    prevs.push(v0);
    var e = getEdgeConnectTwoVertex(v0, v1);
    currentState["el"][e]["state"] = EDGE_HIGHLIGHTED;
    var e1 = getEdgeConnectTwoVertex(v1, v2);
    currentState["el"][e1]["state"] = EDGE_HIGHLIGHTED;
    stateList.push(currentState);
    //currentState = createState(A);
    for (var i=1; i < sz; i++) {
      currentState = createState(A);
      for (var j=0; j < Object.size(prevs); j++) {
        currentState["vl"][prevs[j]]["state"] = VERTEX_TRAVERSED;
      }
      for (var j=0; j < Object.size(prev_es); j++) {
        currentState["el"][prev_es[j]]["state"] = EDGE_TRAVERSED;
      }
      v0 = isUsed(coord[i][0], coord[i][1]);
      prevs.push(v0);
      var k = (i == Object.size(coord) -1) ? 0 : i+1;
      v1 = isUsed(coord[k][0], coord[k][1]);
      var l;
      if (i == Object.size(coord) - 2) l = 0;
      else if (i == Object.size(coord) - 1) l = 1;
      else l = i + 2;
      v2 = isUsed(coord[l][0], coord[l][1]);
      e = getEdgeConnectTwoVertex(v0, v1);
      currentState["el"][e]["state"] = EDGE_HIGHLIGHTED;
      prev_es.push(e);
      e1 = getEdgeConnectTwoVertex(v1, v2);
      prev_es.push(e1);
      currentState["el"][e1]["state"] = EDGE_HIGHLIGHTED;
      currentState["vl"][v0]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][v1]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][v2]["state"] = VERTEX_HIGHLIGHTED;
      var tmp = ccw(coord[i][0], coord[i][1], coord[k][0], coord[k][1], coord[l][0], coord[l][1]);
      var status = "These 3 points ccw = " + tmp + ". ";

      if (tmp == isLeft) {
        status += "The same as first ccw. Continue."
        currentState["lineNo"] = 5;
      } else {
        status += "Different from first ccw. Stop."
        currentState["status"] = status;
        currentState["lineNo"] = 6;
        stateList.push(currentState);
        currentState = createState(A);
        currentState["status"] = "Polygon is not convex.";
        stateList.push(currentState);
        graphWidget.startAnimation(stateList);
        return true;
      }
      currentState["status"] = status;
      stateList.push(currentState);
    }
    currentState = createState(A);
    for (var j=0; j < Object.size(prevs); j++) {
      currentState["vl"][prevs[j]]["state"] = VERTEX_TRAVERSED;
    }
    for (var j=0; j < Object.size(prev_es); j++) {
      currentState["el"][prev_es[j]]["state"] = EDGE_TRAVERSED;
    }
    currentState["status"] = "Polygon is convex.";
    currentState["lineNo"] = 7;
    stateList.push(currentState);
    currentState = createState(A);
    currentState["status"] = "Finish.";
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);
    return true;
  }

  function getCircleLineIntersectionPoint(x1, y1, x2, y2, r, cx, cy) {
    var baX = x2 - x1; //pointB.x - pointA.x;
    var baY = y2 - y1; //pointB.y - pointA.y;
    var caX = cx - x1; //center.x - pointA.x;
    var caY = cy - y1; //center.y - pointA.y;

    var a = baX * baX + baY * baY;
    var bBy2 = baX * caX + baY * caY;
    var c = caX * caX + caY * caY - r * r;

    var pBy2 = bBy2 / a;
    var q = c / a;
    
    var disc = pBy2 * pBy2 - q;
    var tmpSqrt = Math.sqrt(disc);
    var abScalingFactor1 = -pBy2 + tmpSqrt;
    var abScalingFactor2 = -pBy2 - tmpSqrt;

    var r_x1 = x1 - baX * abScalingFactor1;
    var r_y1 = y1 - baY * abScalingFactor1
    //Point p1 = new Point(pointA.x - baX * abScalingFactor1, pointA.y
    //      - baY * abScalingFactor1);
    var r_x2 = x1 - baX * abScalingFactor2;
    var r_y2 = y1 - baY * abScalingFactor2

    //Point p2 = new Point(pointA.x - baX * abScalingFactor2, pointA.y
    //       - baY * abScalingFactor2);
    var res = new Array();
    res[0] = r_x1; 
    res[1] = r_y1;
    res[2] = r_x2;
    res[3] = r_y2 ;
    return res;
  }

  function moveCircle(x, y, class_id) {
    mainSvg.selectAll(".v" + class_id)
    .attr("cx", x)
    .attr("cy", y);
    
    
    var b = mainSvg.selectAll(".v" + class_id);
    b[0] = b[0].splice(2,1);
    b.attr("y", y + 3);
    b.attr("x", x);
  
    for (var i=1; i <= Object.size(edgeList); i++) {
      var e = edgeList["#e" + i.toString()];
      if (typeof(e) == "undefined") continue;
      if (e[0] == class_id || e[1] == class_id)
        moveWeightedText(i);
    }     
  }

  function calculateEdge(x1, y1, x2, y2) {
    var pts = getCircleLineIntersectionPoint(x1, y1, x2, y2, 15, x1, y1);
    var pts2 = getCircleLineIntersectionPoint(x1, y1, x2, y2, 15, x2, y2);
    var min = 5000;
    var save1 = 0, save2 = 0;
    for (var i=1; i<=3; i+=2) 
      for (var j=1; j<=3; j+=2) 
      {
        var d = Math.sqrt((pts[i-1]-pts2[j-1])*(pts[i-1]-pts2[j-1]) + (pts[i] - pts2[j])*(pts[i] - pts2[j]));
        if (d < min) {
          min = d;
          save1 = i; save2 = j;
        }
      }
      
      var beginPoint = {"x": pts[save1-1], "y": pts[save1]};
      var endPoint = {"x": pts2[save2-1], "y": pts2[save2]};

      return [beginPoint, endPoint];
    }

  // ax + by = c
  // return coordinate of intersection point
  // if parallel, return [-1,-1]
  function getLinesIntersection(a1, b1, c1, a2, b2, c2) {
    if (a1*b2 - a2*b1 == 0) return [-1, 1];
    return [(c1*b2 - b1*c2)/(a1*b2 - b1*a2), (a1*c2 - c1*a2)/(a1*b2 - b1*a2)];
  }

  // return distance from (x, y) to ax + by + c = 0
  function getDistancePointToLine(x, y, a, b, c) {    
    return (Math.abs(a*x + y*b + c))/Math.sqrt(a*a + b*b);
  }

  // x1 is the origin
  function getStraightLineCoordinate(x1, y1, x2, y2) {
    // intersection with x - y - x1 + y1 = 0
    var intersection = getLinesIntersection(1, 1, x2 + y2, 1, -1, x1 - y1);
    var min = getDistancePointToLine(x2, y2, 1, -1, -x1 + y1);
    var save = intersection;
    // intersection with x + y - x1 - y1 = 0
    intersection = getLinesIntersection(-1, 1, -x2 + y2, 1, 1, x1 + y1);
    var dist = getDistancePointToLine(x2, y2, 1, 1, -x1 - y1);
    if (min > dist) {
      min = dist;
      save = intersection;
    }
    // intersection with x - x1 = 0
    intersection = getLinesIntersection(0, 1, y2, 1, 0, x1);
    dist = getDistancePointToLine(x2, y2, 1, 0, -x1);
    if (min > dist) {
      min = dist;
      save = intersection;
    }
    // intersection with y - y1 = 0
    intersection = getLinesIntersection(-1, 0, -x2, 0, 1, y1);
    dist = getDistancePointToLine(x2, y2, 0, 1, -y1);
    if (min > dist) {
      min = dist;
      save = intersection;
    }
    return save;
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

 function addVertexWithHover(x, y, first, second, property, class_id) {
  graphWidget.addVertex(x, y, first, second, property, class_id);
  var circle = mainSvg.selectAll(".v" + (class_id).toString());
  circle.style("cursor", "pointer");

  var text = mainSvg.selectAll("text").selectAll(".v" + (amountVertex-1).toString());
  text = mainSvg.selectAll(".v" + (class_id).toString());

  text[0] = text[0].splice(2,1);
  var ii = isUsed(x, y);
    //text.style("pointer-events", "none");
    text.on("mouseover", function () { 
      var cc = d3.mouse(this);      
      var circle2 = mainSvg.selectAll(".v" + ii.toString());
      circle2[0][2].value = circle2[0][2].value;
      circle2[0] = circle2[0].splice(0,2);
      circle2.style("fill", surpriseColour);
      
    })
    .on("mouseout", function () { 
      //var circle2 = mainSvg.selectAll(".v" + ( (isUsed)).toString());
      var circle2 = mainSvg.selectAll(".v" + ii.toString());
      circle2[0] = circle2[0].splice(0,2);
      circle2.style("fill", "#eeeeee");
    })
    .on("click", function () {
              // hold ctrl to delete node
              if (d3.event.ctrlKey) {
                //alert("click + ctrl");
                // TODO: delete node and associated edges
                console.log(d3.select(this).attr("class"));
                console.log(d3.selectAll(d3.select(this).attr("class")));
                mainSvg.selectAll("." + d3.select(this).attr("class")).remove();
                var current_id = d3.select(this).attr("class");
                var current_id_num = "";
                for (var i=1; i < current_id.length; i++) {
                  current_id_num += current_id[i];
                }
                current_id_num = parseInt(current_id_num);
                coord[current_id_num][0] = -1;
                coord[current_id_num][1] = -1;
                var tmp_e = "#e";
                for (var i=1; i <= Object.size(edgeList); i++) {
                  var tmp_edge_id = tmp_e + i.toString();
                  console.log(edgeList[tmp_edge_id]);
                  if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                    mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                    mainSvg.select("#w_e" + i.toString()).remove();
                  }
                }  
                coord[current_id_num][0] = -1;
                coord[current_id_num][1] = -1;
                var islast = true;
                var temp = d3.select(this);
                temp = temp[0][0].textContent;
                var current_id_num1 = parseInt(temp) + 1;
                for (var i=0; i < deleted_vertex_list.length; i++) {
                  if (deleted_vertex_list[i] > current_id_num1) {
                    // insert 
                    deleted_vertex_list.splice(i, 0, current_id_num1);
                    islast = false;
                    break;
                  }
                }
                if (islast) deleted_vertex_list.push(current_id_num1);     
                //createAdjMatrix();    
                return;
              }      
            });

    circle[0] = circle[0].splice(1,1);
    circle.on("mouseover", function () { 
     var cc = d3.mouse(this);      
     var circle2 = mainSvg.selectAll(".v" + ii.toString());
     circle2[0][2].value = circle2[0][2].value;
     circle2[0] = circle2[0].splice(0,2);
     circle2.style("fill", surpriseColour);

    })
    .on("mouseout", function () { 
          //var circle2 = mainSvg.selectAll(".v" + ( (isUsed)).toString());
          var circle2 = mainSvg.selectAll(".v" + ii.toString());
          circle2[0] = circle2[0].splice(0,2);
          circle2.style("fill", "#eeeeee");
        })
    .on("click", function () {
                  // hold ctrl to delete node
                  if (d3.event.ctrlKey) {
                    //alert("click + ctrl");
                    // TODO: delete node and associated edges
                    console.log(d3.select(this).attr("class"));
                    console.log(d3.selectAll(d3.select(this).attr("class")));
                    //mainSvg.selectAll("." + d3.select(this).attr("class")).style("visibility", "hidden");
                    var current_id = d3.select(this).attr("class");
                    var current_id_num = "";
                    for (var i=1; i < current_id.length; i++) {
                      current_id_num += current_id[i];
                    }
                    current_id_num = parseInt(current_id_num);
                    //coord.splice(current_id_num, 1);
                    coord[current_id_num][0] = -1;
                    coord[current_id_num][1] = -1;
                    // modify deleted_list
                    var temp = d3.select(this);
                    temp = temp[0][0].textContent;
                    var current_id_num1 = parseInt(temp) + 1;
                    var islast = true;
                    for (var i=0; i < deleted_vertex_list.length; i++) {
                      if (deleted_vertex_list[i] > current_id_num1) {
                        // insert 
                        deleted_vertex_list.splice(i, 0, current_id_num1);
                        islast = false;
                        break;
                      }
                    }
                    if (islast) deleted_vertex_list.push(current_id_num1);
                    //d3.select(this).remove();
                    mainSvg.selectAll(".v" + (class_id).toString()).remove();
                    var tmp_e = "#e";
                    for (var i=1; i <= Object.size(edgeList); i++) {
                      var tmp_edge_id = tmp_e + i.toString();
                      console.log(edgeList[tmp_edge_id]);
                      if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                        mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                        mainSvg.select("#w_e" + i.toString()).remove();
                      }
                    }              
                    
                    return;
                  }      
                });
    }


  this.clrscr = function() {
    clearScreen();
    //createAdjMatrix();
  }
  
  function clearScreen() {
    var i;
    mainSvg.on("mousedown", function (d) { 
      mousedown_event = this;
      doMouseDown();
    });

   
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


    try {
      mainSvg.selectAll(".ude").remove();
    } catch(err) {}

    try {
      //graphWidget.selectAll(".path").remove();
    } catch(err) {}
  
    try {
      graphWidget.removeVertex(0);
    } catch (err) {}

    mainSvg.selectAll(".edgelabel").remove();
    mainSvg.selectAll("text").remove();
    amountVertex = 0;
    resetEverything();
  }  

  // Javascript addon: get size of an object
  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  function addDirectedEdge(vertexClassA, vertexClassB, edgeIdNumber, type, weight, show) {
    graphWidget.addEdge(vertexClassA, vertexClassB, edgeIdNumber, type, weight, show);
    var edgeId = "#e" + edgeIdNumber.toString();
    mainSvg.select(edgeId).style('marker-end', 'url(#end-arrow)');
    //mainSvg.select(edgeId).style('marker-end', '');
    edgeList[edgeId.toString()] = [vertexClassA, vertexClassB];
  }

  function addIndirectedEdge(vertexClassA, vertexClassB, edgeIdNumber, type, weight, show) {
    graphWidget.addEdge(vertexClassA, vertexClassB, edgeIdNumber, type, weight, show);
    var edgeId = "#e" + edgeIdNumber.toString();
    edgeList[edgeId.toString()] = [vertexClassA, vertexClassB];
  }

  function isShowOnGraph(vertex_id) {
    var a = mainSvg.selectAll(".v" + (vertex_id + 1).toString());
    if (a[0].length) return true;
    return false;
  }

  function collinear(x1, y1, x2, y2, x3, y3) {
    var x = Math.abs(cross(x1, y1, x2, y2, x3, y3));
    return (Math.abs(cross(x1, y1, x2, y2, x3, y3)) < 0.00000001);
  }

  function angleCmp(ax, ay, bx, by) {
    if (collinear(pivot_x, pivot_y, ax, ay, bx, by))
      return dist2P(pivot_x, pivot_y, ax, ay) < dist2P(pivot_x, pivot_y, bx, by);
    var d1x = ax - pivot_x, d1y = ay - pivot_y;
    var d2x = bx - pivot_x, d2y = by - pivot_y;
    return Math.atan2(d1y, d1x) < Math.atan2(d2y, d2x);
  }

  var pivot_x = 0, pivot_y = 0;

  this.initGrahamScan = function() {
    clearScreen();
    $('#current-action p').html("Graham Scan");
    popuatePseudocode(2);

    for (var i=0; i < 150; i++) {
      try {        
          graphWidget.removeVertex(i);
      } catch(err) {}
    }

    mainSvg.on("mousedown", function (d) { 
      mousedown_event = this;
      doMouseDownGraham();
    });

    var min = 20;
    var maxH = screenHeight - 20;
    var maxW = screenWidth - 20 ;
    // and the formula is:
    //var random = Math.floor(Math.random() * (max - min + 1)) + min;
    var rx, ry;
    var tmpArr = new Array(), rxAr = new Array(), ryAr = new Array();
    var tmpCoord = new Array();
    for (var i=0; i < 15; i++) {
      rx = Math.floor(Math.random() * (maxW - min + 1)) + min;
      ry = Math.floor(Math.random() * (maxH - min + 1)) + min;
      
      while ((isUsed(rx, ry) != -1) || ((rx < 166 && ry > 400)) || (rx > 897 && ry > 280)) {
        rx = Math.floor(Math.random() * (maxW - min + 1)) + min;
        ry = Math.floor(Math.random() * (maxH - min + 1)) + min;
      }
      
      rxAr.push(rx); ryAr.push(ry);

      /*
      A[amountVertex] = new ObjectPair("", amountVertex);
      graphWidget.addVertex(rx, ry, A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);
      */
      tmpCoord[i] = new Array();
      tmpCoord[i][0] = rx; tmpCoord[i][1] = ry; 
      tmpCoord[i][3] = i; // class id
      
    }
    var P0 = 0; var N = Object.size(tmpCoord);
    // find P0 with biggest Y and biggest X
    for (var i=1; i < N; i++) {
      if ((tmpCoord[i][1] > tmpCoord[P0][1]) || (tmpCoord[i][1] == tmpCoord[P0][1] && tmpCoord[i][0] > tmpCoord[P0][0])) {
        P0 = i;
      }
    }
    var tmp = tmpCoord[0]; tmpCoord[0] = tmpCoord[P0]; tmpCoord[P0] = tmp;
    //var tmp1 = A[0]; A[0] = A[P0]; A[P0] = tmp1;
    pivot_x = tmpCoord[0][0]; pivot_y = tmpCoord[0][1];
    // sort
    for (var i=1; i < N-1; i++) 
      for (var j=i+1; j < N; j++) {
        if (angleCmp(tmpCoord[i][0], tmpCoord[i][1], tmpCoord[j][0], tmpCoord[j][1])) {
          tmp = tmpCoord[i];
          tmpCoord[i] = tmpCoord[j];
          tmpCoord[j] = tmp;
          tmp = rxAr[i]; rxAr[i] = rxAr[j]; rxAr[j] = tmp;
          tmp = ryAr[i]; ryAr[i] = ryAr[j]; ryAr[j] = tmp;
        }
      }

    for (var i=0; i < N; i++) {
      A[amountVertex] = new ObjectPair("", amountVertex);
      graphWidget.addVertex(rxAr[i], ryAr[i], A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);
      coord[i] = new Array();
      coord[i][0] = tmpCoord[i][0]; coord[i][1] = tmpCoord[i][1];
      coord[i][3] = i;
    }
    var currentState = createState(A);
    var stateList = new Array();
    stateList.push(currentState);
    graphWidget.setAnimationDuration(0);
    graphWidget.startAnimation(stateList);
  }

  this.grahamScan = function() {
    previous_option = "grahamScan";
    popuatePseudocode(2);
    //graphWidget.transition().duration(0);
    graphWidget.setAnimationDuration(500);
    for (var i=0; i < 150; i++) {
      try {        
          graphWidget.removeEdge(i);
      } catch(err) {}
    }
    var N = Object.size(coord);
    if (N <= 3) {
      //TODO
      return true;
    }
    var P0 = 0;
    /*
    // find P0 with biggest Y and biggest X
    for (var i=1; i < N; i++) {
      if ((coord[i][1] > coord[P0][1]) || (coord[i][1] == coord[P0][1] && coord[i][0] > coord[P0][0])) {
        P0 = i;
      }
    }
    var tmp = coord[0]; coord[0] = coord[P0]; coord[P0] = tmp;
    var tmp1 = A[0]; A[0] = A[P0]; A[P0] = tmp1;
    pivot_x = coord[0][0]; pivot_y = coord[0][1];
    // sort
    for (var i=1; i < N-1; i++) 
      for (var j=i+1; j < N; j++) {
        if (angleCmp(coord[i][0], coord[i][1], coord[j][0], coord[j][1])) {
          tmp = coord[i];
          coord[i] = coord[j];
          coord[j] = tmp;
          tmp1 = A[i];
          A[i] = A[j];
          A[j] = tmp1;
        }
      }
    */
    var stateList = new Array();
    var currentState = createState(A);
    // TODO: highlight indexing process here.
    var k = 0;
    while (k < N) {
      var ed;
      if (k == 1) {
        addIndirectedEdge(0, k, amountEdge++, EDGE_TYPE_UDE, 1, true);
      } else if (k > 1) {
        var tmp = "#e" + (amountEdge-1).toString();
        edgeList[tmp][1] = k;
        //edgeList[1][tmp] = i;
      }
      currentState = createState(A);
      if (k) {
        currentState["el"][amountEdge-1]["state"] = EDGE_HIGHLIGHTED;
        //graphWidget.removeEdge(amountEdge-1);
        //delete edgeList["#e" + (amountEdge-1).toString()];
      }
      currentState["status"] = "Start indexing the vertices."
      currentState["lineNo"] = 1;
      currentState["vl"][k]["text"] = k;
      currentState["vl"][k]["state"] = VERTEX_HIGHLIGHTED;      
      for (var j=0; j < k; j++)
        currentState["vl"][j]["text"] = j;
      //currentState["vl"][coord[k][2]]["state"] = VERTEX_HIGHLIGHTED;
      stateList.push(currentState);
      k++;
    }
    delete edgeList["#e" + (amountEdge-1).toString()];
    currentState = createState(A);
    currentState["status"] = "Finish indexing the vertices."
    for (var j=0; j < N; j++)
      currentState["vl"][j]["text"] = j;
    stateList.push(currentState);

    //currentState = createState(A);
    var prev_x = 0, prev_y = 0, now_x = 0, now_y = 0;
    var S = new Array();
    for (var i=0; i < N; i++) coord[i][2] = i;

    S.push(coord[N-1]); S.push(coord[0]); S.push(coord[1]);
    amountEdge = 1;
    //addIndirectedEdge(coord[N-1][3], coord[0][3], amountEdge++, EDGE_TYPE_UDE, 1, true);
    addIndirectedEdge(N-1, 0, amountEdge++, EDGE_TYPE_UDE, 1, true);
    addIndirectedEdge(0, 1, amountEdge++, EDGE_TYPE_UDE, 1, true);
    currentState = createState(A);
    currentState["vl"][N-1]["state"] = VERTEX_HIGHLIGHTED;
    currentState["vl"][0]["state"] = VERTEX_HIGHLIGHTED;
    currentState["vl"][1]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = "Push these 3 points into stack."
    currentState["lineNo"] = 2;

    var e1 = getEdgeConnectTwoVertex(N-1, 0);
    currentState["el"][e1]["state"] = EDGE_HIGHLIGHTED;
    currentState["el"][e1]["animateHighlighted"] = true;
    //currentState["el"][1]["animateHighlighted"] = true;
    var e2 = getEdgeConnectTwoVertex(0, 1);
    currentState["el"][e2]["state"] = EDGE_HIGHLIGHTED;
    //currentState["el"][e2]["animateHighlighted"] = true;
    //currentState["el"][e2]["state"] = EDGE_HIGHLIGHTED;
    // highlight edges
    //(N-1, 0, EDGE_TYPE_UDE, 1, true);



    for (var k=0; k < N; k++)
      currentState["vl"][k]["text"] = k;
    stateList.push(currentState);


    
    //addIndirectedEdge(coord[0][3], coord[1][3], amountEdge++, EDGE_TYPE_UDE, 1, true);
    //graphWidget.removeEdge(1);
    //delete edgeList["#e1"];
    //currentState = createState(A);
    //stateList.push(currentState);

    var i = 2;
    while (i < N) {
      var j = Object.size(S) - 1;
      currentState = createState(A);
      currentState["status"] = "Checking ccw of these 3 points";
      currentState["lineNo"] = 4;
      for (var k=0; k < j+1; k++) {
        currentState["vl"][S[k][2]]["state"] = VERTEX_TRAVERSED;
      }
      for (var k=0; k < N; k++)
          currentState["vl"][k]["text"] = k;
      stateList.push(currentState);
      if (ccw(S[j-1][0], S[j-1][1], S[j][0], S[j][1], coord[i][0], coord[i][1])) {
        S.push(coord[i++]);
        addIndirectedEdge(S[Object.size(S)-2][2], S[Object.size(S)-1][2], amountEdge++, EDGE_TYPE_UDE, 1, true);
        currentState = createState(A);
        for (var k=0; k < j+1; k++) {
          currentState["vl"][S[k][2]]["state"] = VERTEX_TRAVERSED;
        }

        currentState["vl"][S[Object.size(S)-1][2]]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Push current vertex into stack";
        currentState["lineNo"] = 5;
        for (var k=0; k < N; k++)
          currentState["vl"][k]["text"] = k;
        currentState["el"][amountEdge-1]["state"] = EDGE_HIGHLIGHTED;
        stateList.push(currentState);
      }
      else {
        for (var t=1; t <= amountEdge; t++) {
          var e = edgeList["#e" + t.toString()];
          if (typeof(e) == "undefined") continue;
          if ((e[0] == S[Object.size(S)-1][2]) || (e[1] == S[Object.size(S)-1][2])) {
            //graphWidget.removeEdge(i);
            delete edgeList["#e" + t.toString()];
          }
        }   
        currentState = createState(A);
        currentState["status"] = "Pop from stack";
        currentState["lineNo"] = 6;
        for (var k=0; k < N; k++)
          currentState["vl"][k]["text"] = k;
        for (var k=0; k < Object.size(S)-2; k++) {
          currentState["vl"][S[k][2]]["state"] = VERTEX_TRAVERSED;
        }
        currentState["vl"][S[Object.size(S)-1][2]]["state"] = VERTEX_HIGHLIGHTED;
        
        
        S.pop();
        stateList.push(currentState);
        currentState = createState(A);
        currentState["status"] = "Pop from stack";
        currentState["lineNo"] = 6;
        for (var k=0; k < Object.size(S)-1; k++) {
          currentState["vl"][S[k][2]]["state"] = VERTEX_TRAVERSED;
        }
        currentState["vl"][S[Object.size(S)-1][2]]["state"] = VERTEX_HIGHLIGHTED;
        for (var k=0; k < N; k++)
          currentState["vl"][k]["text"] = k;
        stateList.push(currentState);
      }
    }
    currentState = createState(A);
    for (var k=0; k < Object.size(S); k++) {
      currentState["vl"][S[k][2]]["state"] = VERTEX_TRAVERSED;
    }
    for (var k=0; k < N; k++)
      currentState["vl"][k]["text"] = k;
    currentState["status"] = "Finish.";
    currentState["lineNo"] = 7;
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);
    // result is in S
    return true;
  }

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
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
      case 4: // cut polygon
        document.getElementById('code1').innerHTML = 'for (point i in polygon)'
        document.getElementById('code2').innerHTML = '&nbspif left1 > -EPS //left1 = cross(A,B,i)';
        document.getElementById('code3').innerHTML = '&nbsp&nbsp add i to result';
        document.getElementById('code4').innerHTML = '&nbspif left1*left2 < -EPS //left2=cross(A,B,i+1)';
        document.getElementById('code5').innerHTML = '&nbsp&nbsp  add intersection to result';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    } 
  }

  // line segment p-q intersect with line A-B
  function lineIntersectSeg(px, py, qx, qy, Ax, Ay, Bx, By) {
    var a = By - Ay;
    var b = Ax - Bx;
    var c = Bx*Ay - Ax*By;
    var u = Math.abs(a*px + b*py + c);
    var v = Math.abs(a*qx + b*qy + c);
    return [(px*v + qx*u)/(u+v), (py*v + qy*u)/(u+v)];
  }

  this.doCutPolygon = function() {
    if (previous_option == "goPointInside") {
      refresh(1);
      //this.doCutPolygon();
    } else if (previous_option == "goCutPolygon") {
      refresh(4);
      //this.doCutPolygon();
    } else if (previous_option == "grahamScan") {
      if (!isPolygon) {
        alert("Please clear screen and draw your polygon first.");
        return;
      }
    }    
    cutPolygonState = 1;    
    mainSvg.on("mousedown", function (d) { 
      mousedown_event = this;
      doMouseDown();
    });
    return true;
  }

  function goCutPolygon() {
    //return;
    mainSvg.on("mousedown", null);
    previous_option = "goCutPolygon";
    $('#current-action').show();
    $('#current-action p').html("Cut polygon");
    triggerRightPanels();
    isPlaying = true;
    popuatePseudocode(4);
    var stateList = new Array();
    var currentState = createState(A);
    var prev_edges = new Array();
    var pA = coord[amountVertex-3], pB = coord[amountVertex-4];

    var dis31 = dist2P(coord[amountVertex-1][0], coord[amountVertex-1][1],
                             coord[amountVertex-3][0], coord[amountVertex-3][1]);
    var dis32 = dist2P(coord[amountVertex-2][0], coord[amountVertex-2][1],
                     coord[amountVertex-3][0], coord[amountVertex-3][1]);
    var conA = amountVertex-1, conB = amountVertex-2; // A connects with conA
    if (dis31 > dis32) {
      conA = amountVertex-2; 
      conB = amountVertex-1;
    }
    currentState["status"] = "Start";
    stateList.push(currentState);

    var sz = Object.size(coord) - 4;
    var p = new Array();
    for (var i=0; i < sz; i++) {
      //currentState = createState(A);
      //stateList.push(currentState);

      var nxt = (i == sz - 1) ? 0 : i+1;
      currentState = createState(A);
      for (var j=0; j < Object.size(p); j++) {
        currentState["vl"][p[j]]["state"] = VERTEX_RESULT;
      }
      currentState["status"] = "Checking these points";
      currentState["lineNo"] = 1;
      currentState["vl"][amountVertex-3]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][amountVertex-4]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][i]["state"] = VERTEX_HIGHLIGHTED;
      stateList.push(currentState);
      currentState = createState(A);
      var left1 = cross(pA[0], pA[1], pB[0], pB[1], coord[i][0], coord[i][1]);
      var left2 = cross(pA[0], pA[1], pB[0], pB[1], coord[nxt][0], coord[nxt][1]);
      if (left1 > -0.000001) { // coord[i] is on the left, push back
        currentState["vl"][amountVertex-3]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][amountVertex-4]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][i]["state"] = VERTEX_HIGHLIGHTED;
        currentState["lineNo"] = 3;
        currentState["status"] = "This point is on the left, add to result."
        p.push(i);
        for (var j=0; j < Object.size(p); j++) {
          currentState["vl"][p[j]]["state"] = VERTEX_RESULT;
        }
        stateList.push(currentState);
      } else {
        currentState["status"] = "This point is on the right, skip.";
        currentState["lineNo"] = 2;
        for (var j=0; j < Object.size(p); j++) {
          currentState["vl"][p[j]]["state"] = VERTEX_RESULT;
        }
        stateList.push(currentState);
      }
      if (left1 * left2 < -0.000001) { // edge(Q[i], Q[i+1] crosses line AB)
        currentState["vl"][conA]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][conB]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][i]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "This edge crosses line AB";
        currentState["lineNo"] = 5;
        var conn = amountVertex-1;
        var tmp = amountVertex-2;
        if (dist2P(coord[tmp][0], coord[tmp][1], coord[i][0], coord[i][1]) +
            dist2P(coord[tmp][0], coord[tmp][1], coord[nxt][0], coord[nxt][1]) - 
            dist2P(coord[i][0], coord[i][1], coord[nxt][0], coord[nxt][1]) < 0.00001) {
          conn = tmp;
        }
        p.push(conn);
        for (var j=0; j < Object.size(p); j++) {
          currentState["vl"][p[j]]["state"] = VERTEX_RESULT;
        }
        stateList.push(currentState);
      }
    }
    currentState = createState(A);
    currentState["status"] = "Finish.";
    for (var j=0; j < Object.size(p); j++) {
      currentState["vl"][p[j]]["state"] = VERTEX_RESULT;
    }
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);

    cutPolygonState = 0;
    $('#progress-bar').slider( "option", "max", graphWidget.getTotalIteration()-1);
  }

  // no animation version, used for cut polygon
  function isInsidePolygon(px, py) {
    var sum = 0;
    for (var i=0; i < Object.size(coord) - 4; i++) {
      var nxt = (i == Object.size(coord) - 5) ? 0 : i + 1;
      if (ccw(px, py, coord[i][0], coord[i][1], coord[nxt][0], coord[nxt][1])) {
        sum += angle(coord[i][0], coord[i][1], px, py, coord[nxt][0], coord[nxt][1]);
      } else sum -= angle(coord[i][0], coord[i][1], px, py, coord[nxt][0], coord[nxt][1]);
    }
    var PI = Math.acos(-1.0);
    return Math.abs(Math.abs(sum) - 2*PI) < 0.000001;
  }

  this.checkPointInsidePolygon = function() {
    if (previous_option == "goPointInside") {
      refresh(1);
      //this.checkPointInsidePolygon();
    } else if (previous_option == "goCutPolygon") {
      refresh(4);
      //this.checkPointInsidePolygon();
    } else if (previous_option == "grahamScan") {
      if (!isPolygon) {
        alert("Please clear screen and draw your polygon first.");
        return;
      }
    }    
    isCheckingPointInside = true;
    mainSvg.on("mousedown", function (d) { 
      mousedown_event = this;
      doMouseDown();
    });

    return true;
  }

  // return angle aob in radz
  function angle(ax, ay, ox, oy, bx, by) {
    var ux = ax - ox, uy = ay - oy;
    var vx = bx - ox, vy = by - oy;
    return Math.acos((ux * vx + uy * vy)/ Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy)));
  }

  function goPointInside() {

    previous_option = "goPointInside";
    $('#current-action').show();
    $('#current-action p').html("Check point is inside polygon");
    triggerRightPanels();
    isPlaying = true;
    var stateList = new Array();
    var currentState = createState(A);
    var latest = amountVertex-1;
    var sum = 0;
    var prev_edges = new Array();
    popuatePseudocode(3);
    currentState["status"] = "Start";
    currentState["lineNo"] = 1;
    stateList.push(currentState);
    for (var i=0; i < Object.size(coord)-1; i++) {
      var vl = isUsed(coord[latest][0], coord[latest][1]);
      var v0 = isUsed(coord[i][0], coord[i][1]);
      var v1 = isUsed(coord[i+1][0], coord[i+1][1]);
      if (i == Object.size(coord)-2) v1 = isUsed(coord[0][0], coord[0][1]);

      for (var t=0; t < Object.size(prev_edges); t++) {
        var e = edgeList["#e" + prev_edges[t].toString()];
        if (typeof(e) == "undefined") continue;
        delete edgeList["#e" + prev_edges[t].toString()];        
      } 
      //addIndirectedEdge(vl, v0, amountEdge++, EDGE_TYPE_UDE, 1, true);
      //prev_edges.push(amountEdge-1);
      addIndirectedEdge(vl, v1, amountEdge++, EDGE_TYPE_UDE, 1, true);
      prev_edges.push(amountEdge-1);
      addIndirectedEdge(vl, v0, amountEdge++, EDGE_TYPE_UDE, 1, true);
      prev_edges.push(amountEdge-1);
      currentState = createState(A);

      currentState["vl"][vl]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][v0]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][v1]["state"] = VERTEX_HIGHLIGHTED;
        
      var e1 = getEdgeConnectTwoVertex(v0, vl);
      currentState["el"][e1]["state"] = EDGE_HIGHLIGHTED;
      e1 = getEdgeConnectTwoVertex(vl, v1);
      currentState["el"][e1]["state"] = EDGE_HIGHLIGHTED;
      //var e = getEdgeConnectTwoVertex(v0, v1);
      //currentState["el"][e]["state"] = EDGE_HIGHLIGHTED;
      currentState["status"] = "Checking these 3 points";
      currentState["lineNo"] = 2;
      stateList.push(currentState);
      currentState = createState(A);
      var e1 = getEdgeConnectTwoVertex(v0, vl);
      currentState["el"][e1]["state"] = EDGE_HIGHLIGHTED;
      e1 = getEdgeConnectTwoVertex(vl, v1);
      currentState["el"][e1]["state"] = EDGE_HIGHLIGHTED;
      var vl = isUsed(coord[latest][0], coord[latest][1]);
      var v0 = isUsed(coord[i][0], coord[i][1]);
      v1 = isUsed(coord[i+1][0], coord[i+1][1]);
      if (i == Object.size(coord)-2) v1 = isUsed(coord[0][0], coord[0][1]);
      currentState["vl"][vl]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][v0]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][v1]["state"] = VERTEX_HIGHLIGHTED;
      var k = i + 1;
      if (i == Object.size(coord)-2) k = 0;
      if (ccw(coord[latest][0], coord[latest][1], coord[i][0], coord[i][1], coord[k][0], coord[k][1])) {
        sum += angle(coord[i][0], coord[i][1], coord[latest][0], coord[latest][1], coord[k][0], coord[k][1]);
        currentState["status"] = "Left turn. Sum angle = " + sum.toFixed(2);
        currentState["lineNo"] = 3;
      }
      else {
        sum -= angle(coord[i][0], coord[i][1], coord[latest][0], coord[latest][1], coord[k][0], coord[k][1]);
        currentState["status"] = "Right turn. Sum angle = " + sum.toFixed(2);
        currentState["lineNo"] = 4;
      }
      stateList.push(currentState);
    }

    for (var t=0; t < Object.size(prev_edges); t++) {
      var e = edgeList["#e" + prev_edges[t].toString()];
      if (typeof(e) == "undefined") continue;
      delete edgeList["#e" + prev_edges[t].toString()];        
    } 
    currentState = createState(A);
    //currentState["lineNo"] = 2;
    var PI = Math.acos(-1.0);
    var res = Math.abs(Math.abs(sum) - 2*PI) < 0.000001;
    var isIn = res ? "inside " : "outside ";
    currentState["status"] = "Sum angle = " + sum.toFixed(2) + ". The point is " + isIn + "polygon.";
    currentState["lineNo"] = 5;
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);    
    isCheckingPointInside = false;
    isPreviousPointInsde = true;
    $('#progress-bar').slider( "option", "max", graphWidget.getTotalIteration()-1);
  }



}