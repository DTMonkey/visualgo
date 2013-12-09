// @author Nguyen Hoang Duy, based on Steven Halim's base file
// Defines a Heap object; keeps implementation of Heap internally and interact with GraphWidget to display Heap visualizations

var Graph = function() {
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

   mainSvg.attr("style", "height:290px");

  function resetEverything() {
    coord = new Array();
    A = new Array();
    amountVertex = 0;
    amountEdge = 0;

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
  }

  function addExtraEdge() {
    if (document.getElementById("direct_checkbox").checked)
      addDirectedEdge(1, 2, ++amountEdge, EDGE_TYPE_UDE, 1, true);
    else addIndirectedEdge(1, 1, ++amountEdge, EDGE_TYPE_UDE, 1, true);
    mainSvg.select("#e" + amountEdge.toString()).style("visibility", "hidden");      
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
    A[amountVertex] = new ObjectPair(new_vertex_id -1, amountVertex);
    graphWidget.addVertex(cur[0], cur[1], A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);

    var text = mainSvg.selectAll(".v" + ((amountVertex-1)).toString());

    text[0] = text[0].splice(2,1);
    var ii = isUsed(cur[0], cur[1]);
      //text.style("pointer-events", "none");
    text.on("mouseover", function () { 
      //circle.style("fill", "blue");
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
                  if (typeof(edgeList[tmp_edge_id]) != "undefined")
                  if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                    mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                    mainSvg.select("#w_e" + i.toString()).remove();
                    delete edgeList["#e" + i.toString()];
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
                createAdjMatrix();    
                return;
              }      
            });
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
          var cc = d3.mouse(this);
      
          var circle2 = mainSvg.selectAll(".v" + ii.toString());
          circle2[0][2].value = circle2[0][2].value;
          circle2[0] = circle2[0].splice(0,2);
          circle2.style("fill", surpriseColour);
        })
        .on("mouseout", function () { 
          var circle2 = mainSvg.selectAll(".v" + ii.toString());
          circle2[0] = circle2[0].splice(0,2);
          circle2.style("fill", "#eeeeee");
        })
        .on("mousedown", function() {
          //mousedown_node = d3.mouse(this);              
        })
        .on("click", function() {
                // hold ctrl to delete node
                if (d3.event.ctrlKey) {
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
                  var tmp_e = "#e";
                  for (var i=1; i <= Object.size(edgeList); i++) {
                    var tmp_edge_id = tmp_e + i.toString();
                    console.log(edgeList[tmp_edge_id]);
                    if (typeof(edgeList[tmp_edge_id]) != "undefined")
                    if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                      mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                      mainSvg.select("#w_e" + i.toString()).remove();
                      delete edgeList["#e" + i.toString()];        
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
                  createAdjMatrix();              
                  return;
                }                 
              });
    }
  }


  function doMouseDown() {
    if (mousedown_node) return;
    if (d3.event.ctrlKey) return;
    mousedown_in_progress = true;
    var prev = d3.mouse(mousedown_event);
    var is_used = isUsed(prev[0], prev[1]);
    mousedown_node = prev;
    if (is_used == -1) {
      if (amountVertex - deleted_vertex_list.length > 20) {
        //alert("Amount vertex exceeded");
        //aborted_mousedown = true;
        //return;
      }
      doclick2(prev);
      is_used = amountVertex-1;
    } else {
      var prev_circle1 = mainSvg.selectAll(".v" + (is_used).toString());
      mousedown_node = [parseInt(prev_circle1.attr("cx")), parseInt(prev_circle1.attr("cy"))];
    }
    var prev_circle = mainSvg.selectAll(".v" + is_used.toString());
    mousedown_in_progress = false;
    if (mousemove_in_progress) {
      doMouseMove();
    }
  }

  function doMouseMove() {
    if (mousedown_in_progress) {
      doMouseDown();
      return;
    }
    if (aborted_mousedown) return;

    if (mousedown_node == null) return;
    mousemove_in_progress = true;

    var cur = d3.mouse(mousemove_event);
    console.log("End " + cur);
    var is_used = isUsed(mousedown_node[0], mousedown_node[1]);
    if (used_alt != -1) is_used = used_alt;
    var prev_circle = mainSvg.selectAll(".v" + is_used.toString());

    if (mousemove_coor == null) {
      mousemove_coor = cur;
      console.log("0");
      if (dist2P(mousedown_node[0], mousedown_node[1], cur[0],cur[1]) <= 40) { mousemove_coor = null; return;}
    } else {
      // press shift key to straighten line
      /*
      if (d3.event.shiftKey) {
        var used = isUsed(cur[0], cur[1]);
        var straight_coor = getStraightLineCoordinate(mousedown_node[0], mousedown_node[1], cur[0], cur[1]);
        if (move1 && used==-1) {
          doclick2(cur);  
          move1 = false;
          return;
        }

        moveCircle(straight_coor[0], straight_coor[1], (amountVertex-1).toString());
        var prev_circle1 = mainSvg.selectAll(".v" + (is_used).toString());
        var lineCommand = edgeGenerator(calculateEdge(parseInt(prev_circle1.attr("cx")), parseInt(prev_circle1.attr("cy")), straight_coor[0], straight_coor[1]));
        mainSvg.select("#e" + amountEdge.toString())
        .attr("d",lineCommand);
        mainSvg.select("#e" + amountEdge.toString()).style("visibility", "visible");

        return;
      }
      */
      // press alt to move current circle and assoc edge
      var current_coor_is_used = isUsed(cur[0], cur[1]);
      if (d3.event.altKey) {
        used_alt = is_used;
        coord[is_used][0] = cur[0];
        coord[is_used][1] = cur[1];
        moveCircle(cur[0], cur[1], (is_used).toString());
        // update coord[][]
        mousedown_node = cur;
        var tmp_e = "#e";
        for (var i=1; i <= Object.size(edgeList); i++) {
          var tmp_edge_id = tmp_e + i.toString();
          if (edgeList[tmp_edge_id][0] == is_used) {
            var lineCommand = edgeGenerator(calculateEdge(cur[0], cur[1], coord[edgeList[tmp_edge_id][1]][0], coord[edgeList[tmp_edge_id][1]][1]));
            mainSvg.select(tmp_edge_id)
            .attr("d",lineCommand);
          } else if (edgeList[tmp_edge_id][1] == is_used) {
            var lineCommand = edgeGenerator(calculateEdge(coord[edgeList[tmp_edge_id][0]][0], coord[edgeList[tmp_edge_id][0]][1], cur[0], cur[1]));
            mainSvg.select(tmp_edge_id)
            .attr("d",lineCommand);

          }
        }    
        return;
      }

      
      var prev_circle1 = mainSvg.selectAll(".v" + (is_used).toString());
      if (current_coor_is_used != -1 && current_coor_is_used != amountVertex-1 &&
        current_coor_is_used != is_used) {
        if (!move1) {
          // remove newest created vertex
          var newest_circle = mainSvg.selectAll(".v" + (amountVertex-1).toString());
          newest_circle.remove();
          coord[amountVertex-1][0] = -1; coord[amountVertex-1][1] = -1;
          insertToDeletedList(parseInt(newest_circle[0][2].textContent)+1);
          
          // connect edge between original vertex to existed vertex
          var lineCommand = edgeGenerator(calculateEdge(parseInt(prev_circle1.attr("cx")), parseInt(prev_circle1.attr("cy")), 
            coord[current_coor_is_used][0], coord[current_coor_is_used][1]));
          mainSvg.select("#e" + amountEdge.toString())
          .attr("d",lineCommand);

          edgeList["#e" + amountEdge.toString()][0] = is_used;
          edgeList["#e" + amountEdge.toString()][1] = current_coor_is_used;
          move1 = true;
          var x = 0;
        }
        return;
      } 
      if (current_coor_is_used == is_used) {
        /*
        if (!move1) {
          mainSvg.selectAll(".v" + (amountVertex-1).toString()).remove();
          mainSvg.selectAll("#e" + amountEdge.toString()).attr("style" ,"visibility:hidden");
          move1 = true;
        }
        */
        return;
      }


      if (move1) {
        doclick2(cur);  
        move1 = false;
        //return;
      }
      coord[amountVertex-1][0] = cur[0];
      coord[amountVertex-1][1] = cur[1];
      moveCircle(cur[0], cur[1], (amountVertex-1).toString());
      

      var lineCommand = edgeGenerator(calculateEdge(parseInt(prev_circle1.attr("cx")), parseInt(prev_circle1.attr("cy")), cur[0], cur[1]));
      mainSvg.select("#e" + amountEdge.toString())
      .attr("d",lineCommand);
      mainSvg.select("#e" + amountEdge.toString()).style("visibility", "visible");

      var tmp_edge_id = "#e" + amountEdge.toString();
      edgeList[tmp_edge_id][0] = is_used;
      edgeList[tmp_edge_id][1] = current_coor_is_used;

      mousemove_in_progress = false;
      console.log("move");
      if (mouseup_in_progress) {
        mouseup_in_progress = false;
        doMouseUp();
      }
    }

  }

  mainSvg.on("mousedown", function (d) { 
    mousedown_event = this;
    doMouseDown();
  });

  mainSvg.on("mousemove", function (d) {
    mousemove_event = this;
    doMouseMove();

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

  function doMouseUp() {    
    //alert("up");
    //if (aborted_mousedown) {
     // mousedown_node = null;
      //return;
    //  }
    var is_used = isUsed(mousedown_node[0], mousedown_node[1]);
    var prev_circle1 = mainSvg.selectAll(".v" + (is_used).toString());
    var cur = d3.mouse(mouseup_event);
    var iu = isUsed(cur[0], cur[1]);
    if (iu == is_used) {
      mousedown_node = null;
      mousemove_coor = null;
      mouseup_in_progress = false;
      mousemove_in_progress = false;
      mousedown_in_progress = false;
      move1 = true;
      used_alt = -1;
      return;
    }
    if (!move1) {
      // move1 == false, new vertex is created
      //alert(cur[0] + " " + cur[1]);
      //cur = d3.mouse

      var b0 = mainSvg.selectAll(".v" + iu.toString());
      b0.remove();
      amountVertex--;
      coord[amountVertex] = new Array();
      var tt = new Array();
      //t.push(cx); t.push(cy);
      doclick2(cur);
/*
      var b = mainSvg.selectAll(".v" + iu.toString());
      var text_content = b[0][2].textContent;
      b[0] = b[0].splice(2,1);
      b.attr("y", coord[iu][1] + 3);
      var cx = b.attr("x"), cy = b.attr("y");

      b.remove();
      var text2 = mainSvg.append("text");
      text2.attr("x", cx)
      .attr("y", cy)
      .attr("fill", "#333")
      .attr("font-family", "'PT Sans', sans-serif")
      .attr("font-size", "16")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("class", "v" + iu.toString())
      .text(function(){
        return text_content;
      });

      var text = mainSvg.selectAll(".v" + ((amountVertex-1)).toString());
      text.style("cursor", "pointer");
      text[0] = text[0].splice(2,1);
      var ii = isUsed(cur[0], cur[1]);
        //text.style("pointer-events", "none");
      text.on("mouseover", function () { 
        //circle.style("fill", "blue");
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
                  createAdjMatrix();    
                  return;
                }      
              });
*/

    }

    var used = amountVertex-1;
    var cur_circle = mainSvg.selectAll(".v" + used.toString());
    mousedown_node = null;
    mousemove_coor = null;
    mouseup_in_progress = false;
    mousemove_in_progress = false;
    mousedown_in_progress = false;
    move1 = true;
    used_alt = -1;
    var used = amountVertex-1;
    var cur_circle = mainSvg.selectAll(".v" + used.toString());
    addExtraEdge();
    if (document.getElementById("weighted_checkbox").checked) {
      /*
      var w = window.prompt("Please enter edge weight:");
      while (w>=100) {
        w = window.prompt("Please enter edge weight from [-9;99] again:");
      }
      if (w)
        addWeightText("#e" + (amountEdge-1).toString(), w);
      else {
        addWeightText("#e" + (amountEdge-1).toString(), 1);
        //document.getElementById("#e" +(amountEdge-1).toString()).
        //mainSvg.selectAll("#e" + (amountEdge-1).toString()).style("visibility", "hidden");
      }
      */
      var edgeId = "#e" + (amountEdge-1).toString();
      console.log(edgeList[edgeId]);
      // fix d3.js bug
      if (edgeList[edgeId][1] == -1) {
        edgeList[edgeId][1] = iu;
      }
      // end fix
      var w = dist2P(
            coord[edgeList[edgeId][0]][0], 
            coord[edgeList[edgeId][0]][1],
            coord[edgeList[edgeId][1]][0],
            coord[edgeList[edgeId][1]][1]);
          if (w > 100) w-=100*(parseInt(w/100));
          if (w == 0) w = 12;
          addWeightText(edgeId, parseInt(w));

    }
  }

  mainSvg.on("mouseup", function () {
    if (d3.event.ctrlKey) {
      var is_used = isUsed(mousedown_node[0], mousedown_node[1]);
      if (is_used != -1) {
        coord[is_used][0] = -1;
        coord[is_used][1] = -1;
      }
    };
    mouseup_event = this;
    doMouseUp();
    mouseup_in_progress = false;
    createAdjMatrix();
  }); 


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
    for (i=1; i<amountVertex; i++) {
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
                createAdjMatrix();    
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
                    createAdjMatrix();  
                    return;
                  }      
                });
    }

  this.showTree = function(){
    clearScreen();
    var i;

    var initValue = [99999,0,1,2,3,4,5,6,7,8,9]; // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < 11; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }

    var i, j;

    // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i=0; i<=10; i++) coord[i] = new Array();
    coord[1][0] = 300; coord[1][1] = 20;
    coord[2][0] = 100; coord[2][1] = 60;
    coord[3][0] = 0 ; coord[3][1] = 100;
    coord[4][0] = 100; coord[4][1] = 100;
    coord[5][0] = 60; coord[5][1] = 150;
    coord[6][0] = 140; coord[6][1] = 150;
    coord[7][0] = 200; coord[7][1] = 100;
    coord[8][0] = 500; coord[8][1] = 60;
    coord[9][0] = 400; coord[9][1] = 100;
    coord[10][0] = 600; coord[10][1] = 100;
    // add vertices first
    for (i=1; i<11;i++) {
      coord[i][0] += 80;
    }
    for (i = 1; i < A.length; i++)
    {
      addVertexWithHover(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true, i);       
    }

    var edgeId = 0;
    //addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
    if (document.getElementById("direct_checkbox").checked) {
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(1, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 7, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(8, 9, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(8, 10, ++edgeId, EDGE_TYPE_UDE, 1, true);
    } else {
      addIndirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(1, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(4, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 7, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(8, 9, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(8, 10, ++edgeId, EDGE_TYPE_UDE, 1, true);
    }

    amountEdge = edgeId;
    addExtraEdge();
    if (document.getElementById("weighted_checkbox").checked)
        for (i=1; i < Object.size(edgeList); i++) {
          var edgeId = "#e" + i.toString();
          var w = dist2P(
            coord[edgeList[edgeId][0]][0], 
            coord[edgeList[edgeId][0]][1],
            coord[edgeList[edgeId][1]][0],
            coord[edgeList[edgeId][1]][1])
          if (w > 100) w-=100*(parseInt(w/100));
          if (w == 0) w = 12;
          addWeightText(edgeId, parseInt(w));
        }
    createAdjMatrix();
  }
  
  
  this.showStar = function() {
  	clearScreen();
  	var i;

    var initValue = [999999,0,1,2,3,4] // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < 6; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }

    var i, j;

      // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i=0; i<=5; i++) coord[i] = new Array();
    coord[1][0] = 180; coord[1][1] = 80;
    coord[2][0] = 420; coord[2][1] = 80;
    coord[3][0] = 230 ; coord[3][1] = 200;
    coord[4][0] = 300; coord[4][1] = 20;
    coord[5][0] = 370; coord[5][1] = 200;
    // add vertices first
    for (i=1; i<6;i++) {
      coord[i][0] += 80;
    }
    for (i = 1; i < A.length  ; i++)
      addVertexWithHover(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true, i);

    var edgeId = 0;
    if (document.getElementById("direct_checkbox").checked) {
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(1, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(3, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);         
    } else {
      addIndirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(1, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(3, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
    }
    amountEdge = edgeId;
    addExtraEdge();
    if (document.getElementById("weighted_checkbox").checked)
      for (i=1; i < Object.size(edgeList); i++) {
        var edgeId = "#e" + i.toString();
        var w = dist2P(
          coord[edgeList[edgeId][0]][0], 
          coord[edgeList[edgeId][0]][1],
          coord[edgeList[edgeId][1]][0],
          coord[edgeList[edgeId][1]][1])
        if (w > 100) w-=100*(parseInt(w/100));
        if (w == 0) w = 12;
        addWeightText(edgeId, parseInt(w));
      }
    createAdjMatrix();
  }

  this.showK5 = function() {
    clearScreen();
    var i;

    var initValue = [999999,0,1,2,3,4] // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < 6; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }

    var i, j;

    // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i=0; i<=5; i++) coord[i] = new Array();
      coord[1][0] = 180; coord[1][1] = 80;
    coord[2][0] = 420; coord[2][1] = 80;
    coord[3][0] = 230; coord[3][1] = 200;
    coord[4][0] = 300; coord[4][1] = 20;
    coord[5][0] = 370; coord[5][1] = 200;
      // add vertices first
    for (i=1; i<6;i++) {
      coord[i][0] += 80;
    }
    for (i = 1; i < A.length  ; i++)
      addVertexWithHover(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true, i);

    var edgeId = 0;
    for (i=1; i<6; i++)
      for (j=i+1; j<6; j++)
        if (document.getElementById("direct_checkbox").checked)
        {
          addDirectedEdge(i, j, ++edgeId, EDGE_TYPE_UDE, 1, true);
        } else {
          addIndirectedEdge(i, j, ++edgeId, EDGE_TYPE_UDE, 1, true);
        }
    amountEdge = edgeId;
    addExtraEdge();
    if (document.getElementById("weighted_checkbox").checked)
      for (i=1; i < Object.size(edgeList); i++) {
        var edgeId = "#e" + i.toString();
        var w = dist2P(
          coord[edgeList[edgeId][0]][0], 
          coord[edgeList[edgeId][0]][1],
          coord[edgeList[edgeId][1]][0],
          coord[edgeList[edgeId][1]][1])
        if (w > 100) w-=100*(parseInt(w/100));
        if (w == 0) w = 12;
        addWeightText(edgeId, parseInt(w));
      }
    createAdjMatrix();
  }

  this.showCP22 = function() {
    clearScreen();
    var i;

    var initValue = [999999,0,1,2,3,4,5,6] // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < 8; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }

    var i, j;

    // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i=0; i<=7; i++) coord[i] = new Array();
    coord[1][0] = 220; coord[1][1] = 180;
    coord[2][0] = 170; coord[2][1] = 120;
    coord[3][0] = 270; coord[3][1] = 120;
    coord[4][0] = 170; coord[4][1] = 60;
    coord[5][0] = 270; coord[5][1] = 60;
    coord[6][0] = 370; coord[6][1] = 60;
    coord[7][0] = 370; coord[7][1] = 120;
    // add vertices first
    for (i=1; i<8;i++) {
      coord[i][0] += 80;
    }
    for (i = 1; i < A.length  ; i++)
      addVertexWithHover(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true, i);

    var edgeId = 0;
    if (document.getElementById("direct_checkbox").checked) {
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(1, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(3, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(6, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
    } else {
      addIndirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(1, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addIndirectedEdge(3, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addIndirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addIndirectedEdge(6, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
    }
    amountEdge = edgeId;
    addExtraEdge();
    if (document.getElementById("weighted_checkbox").checked)
      for (i=1; i < Object.size(edgeList); i++) {
        var edgeId = "#e" + i.toString();
        var w = dist2P(
          coord[edgeList[edgeId][0]][0], 
          coord[edgeList[edgeId][0]][1],
          coord[edgeList[edgeId][1]][0],
          coord[edgeList[edgeId][1]][1])
        if (w > 100) w-=100*(parseInt(w/100));
        if (w == 0) w = 12;
        addWeightText(edgeId, parseInt(w));
      }
    createAdjMatrix();
  }

  this.showCP42 = function() {
    clearScreen();
    var i;

    var initValue = [999999,0,1,2,3,4,5,6,7,8,9,10,11,12] // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }

    var i, j;

      // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i=0; i<initValue.length; i++) coord[i] = new Array();
    coord[1][0] = 150; coord[1][1] = 40;
    coord[2][0] = 150; coord[2][1] = 90;
    coord[3][0] = 150; coord[3][1] = 140;
    coord[4][0] = 150; coord[4][1] = 190;
    coord[5][0] = 250; coord[5][1] = 40;
    coord[6][0] = 250; coord[6][1] = 90;
    coord[7][0] = 250; coord[7][1] = 190;
    coord[8][0] = 350; coord[8][1] = 40;
    coord[9][0] = 350; coord[9][1] = 90;
    coord[10][0] = 350; coord[10][1] = 190;
    coord[11][0] = 450; coord[11][1] = 40;
    coord[12][0] = 450; coord[12][1] = 90;
    coord[13][0] = 450; coord[13][1] = 190;
      // add vertices first
      for (i=1; i<initValue.length;i++) {
        coord[i][0] += 80;
      }
      for (i = 1; i < A.length  ; i++)
        addVertexWithHover(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true, i);

      var edgeId = 0;
      if (document.getElementById("direct_checkbox").checked) {
        addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(3, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(6, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addDirectedEdge(8, 9, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addDirectedEdge(9, 10, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addDirectedEdge(11, 12, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addDirectedEdge(12, 13, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(1, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(5, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(8, 11, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addDirectedEdge(4, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addDirectedEdge(7, 10, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(10, 13, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addDirectedEdge(6, 9, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      } else {
        addIndirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(3, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(6, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addIndirectedEdge(8, 9, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addIndirectedEdge(9, 10, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addIndirectedEdge(11, 12, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addIndirectedEdge(12, 13, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(1, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(5, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(8, 11, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addIndirectedEdge(4, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
        addIndirectedEdge(7, 10, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(10, 13, ++edgeId, EDGE_TYPE_UDE, 1, true);
        addIndirectedEdge(6, 9, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      }
      amountEdge = edgeId;
      addExtraEdge();
      if (document.getElementById("weighted_checkbox").checked)
        for (i=1; i < Object.size(edgeList); i++) {
          var edgeId = "#e" + i.toString();
          var w = dist2P(
            coord[edgeList[edgeId][0]][0], 
            coord[edgeList[edgeId][0]][1],
            coord[edgeList[edgeId][1]][0],
            coord[edgeList[edgeId][1]][1])
          if (w > 100) w-=100*(parseInt(w/100));
          if (w == 0) w = 12;
          addWeightText(edgeId, parseInt(w));
        }
      createAdjMatrix();
  }

  this.showCP45 = function() {
    clearScreen();
    var i;

    var initValue = [999999,0,1,2,3,4,5] // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }

    var i, j;

    // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i=0; i<initValue.length; i++) coord[i] = new Array();
      coord[1][0] = 170; coord[1][1] = 80;
    coord[2][0] = 270; coord[2][1] = 80;
    coord[3][0] = 370; coord[3][1] = 80;
    coord[4][0] = 170; coord[4][1] = 160;
    coord[5][0] = 270; coord[5][1] = 160;
    coord[6][0] = 370; coord[6][1] = 160;

    // add vertices first
    for (i=1; i<initValue.length;i++) {
      coord[i][0] += 80;
    }
    for (i = 1; i < A.length  ; i++)
      addVertexWithHover(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true, i);

    var edgeId = 0;
    if (document.getElementById("direct_checkbox").checked) {
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(2, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
    } else {
      addIndirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addIndirectedEdge(2, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
    }
    amountEdge = edgeId;
    addExtraEdge();
    if (document.getElementById("weighted_checkbox").checked)
      for (i=1; i < Object.size(edgeList); i++) {
        var edgeId = "#e" + i.toString();
        var w = dist2P(
          coord[edgeList[edgeId][0]][0], 
          coord[edgeList[edgeId][0]][1],
          coord[edgeList[edgeId][1]][0],
          coord[edgeList[edgeId][1]][1])
        if (w > 100) w-=100*(parseInt(w/100));
        if (w == 0) w = 12;
        addWeightText(edgeId, parseInt(w));
      }
    createAdjMatrix();
  }

  this.showCP48 = function() {
    clearScreen();
    var i;

    var initValue = [999999,0,1,2,3,4,5,6,7] // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }

    var i, j;

    // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i=0; i<initValue.length; i++) coord[i] = new Array();
    coord[1][0] = 90; coord[1][1] = 80;
    coord[2][0] = 190; coord[2][1] = 80;
    coord[3][0] = 190, coord[3][1] = 160;
    coord[4][0] = 290; coord[4][1] = 80;
    coord[5][0] = 390; coord[5][1] = 80;
    coord[6][0] = 490; coord[6][1] = 80;
    coord[7][0] = 390; coord[7][1] = 160;
    coord[8][0] = 490; coord[8][1] = 160;


    // add vertices first
    for (i=1; i<initValue.length;i++) {
      coord[i][0] += 80;
    }
    for (i = 1; i < A.length  ; i++)
      addVertexWithHover(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true, i);

    var edgeId = 0;
    if (document.getElementById("direct_checkbox").checked) {
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(3, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(6, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(8, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(7, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
    } else {
      addIndirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(4, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(3, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addIndirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addIndirectedEdge(6, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addIndirectedEdge(8, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addIndirectedEdge(7, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
    }
    amountEdge = edgeId;
    addExtraEdge();
    if (document.getElementById("weighted_checkbox").checked)
      for (i=1; i < Object.size(edgeList); i++) {
        var edgeId = "#e" + i.toString();
        var w = dist2P(
          coord[edgeList[edgeId][0]][0], 
          coord[edgeList[edgeId][0]][1],
          coord[edgeList[edgeId][1]][0],
          coord[edgeList[edgeId][1]][1])
        if (w > 100) w-=100*(parseInt(w/100));
        if (w == 0) w = 12;
        addWeightText(edgeId, parseInt(w));
      }
    createAdjMatrix();
  }

  this.clrscr = function() {
    clearScreen();
    createAdjMatrix();
  }
  
  function clearScreen() {
    var i;

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

  function createAdjMatrix() {
    var vertex_count = getNextVertexId() - 1;
    adjMatrix = new Array(vertex_count);
    for (var i = 0; i < vertex_count; i++) {
      adjMatrix[i] = new Array(vertex_count);
      for (var j=0; j < vertex_count; j++)
        adjMatrix[i][j] = 0;
    }

    var tmp = "#e";
    for (var i=1; i <= Object.size(edgeList); i++) {
      var edge_id = tmp + i.toString();
      if (mainSvg.select(edge_id).attr("style"))
        if (mainSvg.select(edge_id).attr("style").indexOf("hidden") != -1) continue;
      var from_vertex_id = edgeList[edge_id][0];
      var target = mainSvg.selectAll(".v" + from_vertex_id.toString());
      var from_vertex_content = target[0][2].textContent;

      var to_vertex_id = edgeList[edge_id][1];
      if (from_vertex_id == to_vertex_id) continue;

      target = mainSvg.selectAll(".v" + to_vertex_id.toString());
      var to_vertex_content = target[0][2].textContent;       

      if (document.getElementById("weighted_checkbox").checked) {
        var weight = document.getElementById("w_e"+ i.toString());
        adjMatrix[parseInt(from_vertex_content)][parseInt(to_vertex_content)] = (weight == null) ? 1 : weight.textContent;
        if (!document.getElementById("direct_checkbox").checked) 
          adjMatrix[parseInt(to_vertex_content)][parseInt(from_vertex_content)] = (weight == null) ? 1 : weight.textContent;       
      } else {
        adjMatrix[parseInt(from_vertex_content)][parseInt(to_vertex_content)] = 1;        
        if (!document.getElementById("direct_checkbox").checked) 
          adjMatrix[parseInt(to_vertex_content)][parseInt(from_vertex_content)] = 1;           
      }
    }
    var xv = 1;
    drawAdjMatrix();
  }

  function drawAdjMatrix() {
    var table = document.getElementById("adj_matrix_table");
    table.innerHTML = "";

    for (var i=0; i < adjMatrix.length; i++) {
      var row = table.insertRow(-1);
      for (var j=0; j < adjMatrix.length; j++) {
        var cell = row.insertCell(-1);
        cell.innerHTML = adjMatrix[i][j];
      }
    }
    var row = table.insertRow(0);
    var c = row.insertCell(-1);
    c.innerHTML = " ";
    for (var i=0; i < adjMatrix.length; i++) {
      var cell = row.insertCell(-1);;
      cell.innerHTML = i;
      if (i>0) {
        cell = table.rows[i].insertCell(0);
        cell.innerHTML = i-1;
      }
    }
    c = table.rows[adjMatrix.length].insertCell(0);
    c.innerHTML = adjMatrix.length-1;

    createAdjList();
    if (document.getElementById("weighted_checkbox").checked) {
      drawAdjList_directed();
    } else drawAdjList();
  }

  function createAdjList() {
    var vertex_count = adjMatrix.length;
    for (var i = 0; i < vertex_count; i++) {
      adjList[i] = new Array();
    }

    for (var i=0; i < adjMatrix.length; i++) 
      for (j = 0; j < adjMatrix.length; j++) {
        if (adjMatrix[i][j] != 0) {
          if (document.getElementById("weighted_checkbox").checked)
            adjList[i].push(adjMatrix[i][j]);
          adjList[i].push(j);
        }
      }
  }

  function drawAdjList() {
    var table = document.getElementById("adj_list_table");
    table.innerHTML = "";

    for (var i=0; i < adjList.length; i++) {
      var row = table.insertRow(-1);
      var cell = row.insertCell(-1);
      cell.innerHTML = i.toString() + ":";
    }

    for (var i=0; i < adjList.length; i++) {
      var row = table.rows[i];
      for (var j=0; j < adjList[i].length; j++) {
        var cell = row.insertCell(-1);
        cell.innerHTML = adjList[i][j];
      }
    }
    drawEdgeList();
  }

  function drawAdjList_directed() {
    var table = document.getElementById("adj_list_table");
    table.innerHTML = "";

    for (var i=0; i < adjList.length; i++) {
      var row = table.insertRow(-1);
      var cell = row.insertCell(-1);
      cell.innerHTML = i.toString() + ":";
    }

    for (var i=0; i < adjList.length; i++) {
      var row = table.rows[i];
      for (var j=0; j < adjList[i].length; j+=2) {
        var cell = row.insertCell(-1);
        cell.innerHTML = "(" + adjList[i][j] + "," + adjList[i][j+1] + ")";
      }
    }
    drawEdgeList_directed();
  }

  function drawEdgeList() {
    var table = document.getElementById("edge_list_table");
    table.innerHTML = "";

    for (var i=1; i <= Object.size(edgeList); i++) {
      var row = table.insertRow(-1);
      var cell = row.insertCell(-1);
      cell.innerHTML = (i-1).toString() + ":";
    }

    var tmp = "#e";
    for (var i=1; i <= Object.size(edgeList); i++) {
      var edge_id = tmp + i.toString();
      if (typeof(edgeList[edge_id]) == "undefined") continue;
      var from_vertex_id = edgeList[edge_id][0];
      var target = mainSvg.selectAll(".v" + from_vertex_id.toString());
      var from_vertex_content = target[0][2].textContent;

      var to_vertex_id = edgeList[edge_id][1];
      var row = table.rows[i-1];
      if (!(from_vertex_content == 0 && to_vertex_id == 1)) {
        var cell = row.insertCell(-1);
        cell.innerHTML = from_vertex_content;
        cell = row.insertCell(-1);
        cell.innerHTML = to_vertex_id-1;
      }

    }
    
    graphTest();
  }

  function drawEdgeList_directed() {
    var table = document.getElementById("edge_list_table");
    table.innerHTML = "";

     for (var i=0; i <=  Object.size(edgeList); i++) {
      var row = table.insertRow(-1);
      var cell = row.insertCell(0);
      cell.innerHTML = (i).toString() + ":";
    }

    var tmp = "#e", count = 0;
    for (var i=1; i <= Object.size(edgeList); i++) {
      var edge_id = tmp + i.toString();
      if (typeof(edgeList[edge_id]) == "undefined") continue;
      var from_vertex_id = edgeList[edge_id][0];
      var target = mainSvg.selectAll(".v" + from_vertex_id.toString());
      if (typeof(target[0][2]) == "undefined") continue;
      var from_vertex_content = target[0][2].textContent;
      var to_vertex_id = edgeList[edge_id][1];
      if (from_vertex_content == to_vertex_id-1) continue;
      count++;
      var row = table.rows[i-1];
      var cell = row.insertCell(-1);
      cell.innerHTML = adjMatrix[from_vertex_content][to_vertex_id-1];
      cell = row.insertCell(-1);
      cell.innerHTML = from_vertex_content;
      cell = row.insertCell(-1);
      cell.innerHTML = to_vertex_id-1;
    }
   
    graphTest();
  }

  function isShowOnGraph(vertex_id) {
    var a = mainSvg.selectAll(".v" + (vertex_id + 1).toString());
    if (a[0].length) return true;
    return false;
  }

  function graphTest() {
    var adj = [];
    var N, M, vertices = [];

    N = M = 0; // set vertices and edges to 0
    for (var i=0;i<adjMatrix.length;++i) {
      if (!isShowOnGraph(i)) continue;
      adj[i] = [];
      var exist = false;
      for (var j=0;j<adjMatrix[i].length;++j) {
        if (!isShowOnGraph(j)) continue;
        if (adjMatrix[i][j]) {
          adj[i].push(j);
          M++;
        }
        if (adjMatrix[i][j] !== null) {
          exist = true;
        }
      }
      if (exist) {
        N++;
        vertices.push(i);
      }
    }
    function set(c, yesno) {
      document.getElementById(c).innerHTML = yesno ? ": Yes": ": No";
    }

    if (N === 0) {
      set('isTree', true);
      set('isBipartite', true);
      set('isComplete', true);
      //set('euler', true);
    } else {
      (function checkTree(v) {
        var vis = {};
        for (var i=0;i<vertices.length;++i) {
          vis[vertices[i]] = false;
        }
        function dfs(v, p) {
          if (vis[v]) return true;
          vis[v] = true;
          for (var i=0;i<adj[v].length;++i) {
            if (adj[v][i] === p) continue;
            if (dfs(adj[v][i],v)) return true;
          }
          return false;
        }
        var istree = !dfs(v);
        for (var i=0;i<vertices.length;++i) {
          istree = istree && vis[vertices[i]];
        }
        set('isTree', istree);
      })(vertices[0]);

      (function checkBipartite(v) {
        var vis = {};
        for (var i=0;i<vertices.length;++i) {
          vis[vertices[i]] = false;
        }
        function dfs(v, p, c) {
          if (vis[v] !== false) {
            return vis[v] !== c;
          }
          vis[v] = c;
          for (var i=0;i<adj[v].length;++i) {
            if (adj[v][i] === p) continue;
            if (dfs(adj[v][i], v, 1-c)) return true;
          }
          return false;
        }
        set('isBipartite', !dfs(v, false, 0));      
      })(vertices[0]);

      var KM;
      if ($('#directed-cb').is(':checked')) {
        KM = (N * (N-1));
      } else {
        KM = N * (N-1);
      }
      set('isComplete', M===KM);
    }
  }

  this.switchDirectIndirect = function () {
    //showTree();
    convertDirectIndirectGraph();
    //alert(document.getElementById("direct_checkbox").checked);
  }

  function convertDirectIndirectGraph() {
    if (!document.getElementById("direct_checkbox").checked) {
      // convert from direct to indirect
      // 1. remove marker
      for (var i=1; i <= Object.size(edgeList); i++) {
        var edgeId = "#e" + i.toString();
        mainSvg.select(edgeId).style('marker-end', '');
        // 2. remove/hide weight
        /*
        var weight = document.getElementById("w_e" + i.toString());
        if (weight) {
          weight.style.visibility = "hidden";
        }*/
      }
      // 3. update tables
      createAdjMatrix();
    } else {
      // convert from indirect to direct
      // 1. add marker
      for (var i=1; i <= Object.size(edgeList); i++) {
        var edgeId = "#e" + i.toString();
        mainSvg.select(edgeId).style('marker-end', 'url(#end-arrow)');
        // 2. add/show weight
        /*
        var weight = document.getElementById("w_e" + i.toString());
        if (weight) {
          weight.style.visibility = "visible";
        }
        */
      }
      // 3. update tables
      createAdjMatrix();
    }

  }

  this.convertDirectIndirectGraph = function() {
    if (!document.getElementById("weighted_checkbox").checked) {
      // convert from weight to unweight
      // 1. remove marker
      for (var i=1; i <= Object.size(edgeList); i++) {
       
        // 2. remove/hide weight
        
        var weight = document.getElementById("w_e" + i.toString());
        if (weight) {
          weight.style.visibility = "hidden";
        }
      }
      // 3. update tables
      createAdjMatrix();
    } else {
      // convert from indirect to direct
      for (var i=1; i <= Object.size(edgeList); i++) {
          // 2. add/show weight
        
        var weight = document.getElementById("w_e" + i.toString());
        if (weight) {
          weight.style.visibility = "visible";
        } else {
          // add random weight
          var edgeId = "#e" + i.toString();
          var w = dist2P(
            coord[edgeList[edgeId][0]][0], 
            coord[edgeList[edgeId][0]][1],
            coord[edgeList[edgeId][1]][0],
            coord[edgeList[edgeId][1]][1]);
          if (w > 100) w-=100*(parseInt(w/100));
          if (w == 0) w = 12;
          addWeightText(edgeId, parseInt(w));
        }
      }
      // 3. update tables
      createAdjMatrix();
    }
  }

}