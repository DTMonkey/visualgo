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

   mainSvg.style("class", "unselectable");
   mainSvg.append('svg:defs').append('svg:marker')
   .attr('id', 'end-arrow')
   .attr('viewBox', '0 -5 10 10')
   .attr('refX', 9)
   .attr('markerWidth', 5)
   .attr('markerHeight', 4)
   .attr('orient', 'auto')
   .append('svg:path')
   .attr('d', 'M0,-5L10,0L0,5')
   .attr('fill', '#000');
   mainSvg.style("cursor", "crosshair");

   function addExtraEdge() {
    addDirectedEdge(1, 2, ++amountEdge, EDGE_TYPE_UDE, 1, true);
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
      var b2 = b1 + 4 + slope*17;
      y_text = (y2 - y1)* 9/10 + y1;
      x_text = (y_text - b2) / slope;
    } else if ((x1 > x2) && (y1 < y2)) {
      var b2 = b1 - 4 + slope*17;
      y_text = (y2 - y1)* 1/1.8 + y1;
      x_text = (y_text - b2) / slope; 
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
    
 

    mainSvg
     .append("text")
     .attr("class", "edgelabel")
     .attr("x", x_text)
     .attr("y", y_text)
     .attr("dx", 1)
     .attr("dy", ".35em")
     .attr("text-anchor", "middle")
     .text(function(d) { return value.toString() });
  }

  function doclick(cur) {
    if (isUsed(cur[0],cur[1]) == -1) {
      coord[amountVertex] = new Array();
      coord[amountVertex][0] = cur[0];
      coord[amountVertex][1] = cur[1];
      A[amountVertex] = new ObjectPair(amountVertex-1, amountVertex);
      graphWidget.addVertex(cur[0], cur[1], A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);       

      circle = mainSvg.selectAll(".v" + (amountVertex-1).toString());
      circle.style("cursor", "pointer");

      var text = mainSvg.selectAll("text").selectAll(".v" + (amountVertex-1).toString());
      text.style("pointer-events", "none");

      console.log("v"+(amountVertex-1).toString());      
      circle[0] = circle[0].splice(1,1);
      //console.log(circle[0]);
      //console.log(circle);
      circle.on("mouseover", function () { 
        d3.select(this).style("fill", "blue");
        console.log(graphWidget.getEdgeList());
      })
      .on("mouseout", function () { 
        d3.select(this).style("fill", "#333333");
      })
      .on("mousedown", function() {
        mousedown_node = d3.mouse(this);              
      })
      .on("click", function() {
              // hold ctrl to delete node
              if (d3.event.ctrlKey) {
                //alert("click + ctrl");
                // TODO: delete node and associated edges
                console.log(d3.select(this).attr("class"));
                console.log(d3.selectAll(d3.select(this).attr("class")));
                mainSvg.selectAll("." + d3.select(this).attr("class")).style("visibility", "hidden");
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
                  if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                    mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                  }
                }                
                return;
              }                 
            });
  }
    //}); 
  }

  function getNextVertexId() {
    var circles = mainSvg.selectAll("text");
    var max = 0;
    var x =  Object.size(circles[0]);
    for (var i=0; i < Object.size(circles[0]) - 1; i++) {
      var y = circles[0][i].attributes.class;
      console.log(y.nodeValue.toString());
      if ((y.nodeValue.toString()!="edgelabel")) {
        var cur = parseInt(circles[0][i].textContent);
        if (cur > max) max = cur;
      }
    }
    return (max + 2);
  }

  function doclick2(cur) {
    //document.getElementById("adj_matrix_table").rows[1].cells[0].innerHTML = "changed";
    //row = document.getElementById('myTable').rows[row_no+1];
    if (isUsed(cur[0],cur[1]) == -1) {
      var new_vertex_id = getNextVertexId();
      if (deleted_vertex_list.length > 0) {
        new_vertex_id = deleted_vertex_list[0];
        deleted_vertex_list.splice(0, 1);
      }

      coord[amountVertex] = new Array();
      coord[amountVertex][0] = cur[0];
      coord[amountVertex][1] = cur[1];
      A[amountVertex] = new ObjectPair(new_vertex_id -1, amountVertex);
      graphWidget.addVertex(cur[0], cur[1], A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);       

      circle = mainSvg.selectAll(".v" + (amountVertex-1).toString());
      circle.style("cursor", "pointer");
      console.log(circle[0][2].textContent);
        //circle[0][2].textContent = new_vertex_id.toString();
        console.log(circle[0][2].textContent);
        var text = mainSvg.selectAll("text").selectAll(".v" + (amountVertex-1).toString());
        text.style("pointer-events", "none");

        console.log("v"+(amountVertex-1).toString());      
        circle[0] = circle[0].splice(1,1);
        //console.log(circle[0]);
        //console.log(circle);
        circle.on("mouseover", function () { 
          d3.select(this).style("fill", "blue");
          console.log(graphWidget.getEdgeList());
        })
        .on("mouseout", function () { 
          d3.select(this).style("fill", "#333333");
        })
        .on("mousedown", function() {
          mousedown_node = d3.mouse(this);              
        })
        .on("click", function() {
                // hold ctrl to delete node
                if (d3.event.ctrlKey) {
                  //alert("click + ctrl");
                  // TODO: delete node and associated edges
                  console.log(d3.select(this).attr("class"));
                  console.log(d3.selectAll(d3.select(this).attr("class")));
                  mainSvg.selectAll("." + d3.select(this).attr("class")).style("visibility", "hidden");
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
                    if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                      mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                    }
                  }                
                  return;
                }                 
              });
  }
    //}); 
  }


  function doMouseDown() {
    if (mousedown_node) return;
    if (d3.event.ctrlKey) return;
    mousedown_in_progress = true;
    var prev = d3.mouse(mousedown_event);
    var is_used = isUsed(prev[0], prev[1]);
    mousedown_node = prev;
    if (is_used == -1) {
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

  var move1 = true;
  function doMouseMove() {
    if (mousedown_in_progress) {
      //mousemove_in_progress = true;
      doMouseDown();
      return;
    }

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
      if (dist2P(mousedown_node[0], mousedown_node[1], cur[0],cur[1]) <= 50) { mousemove_coor = null; return;}//do nothing
      else {
        var used = isUsed(cur[0], cur[1]);
        if (used == -1) {
          //doclick(cur);
          /*
          used = amountVertex-1;
          var cur_circle = mainSvg.selectAll(".v" + used.toString());
          addDirectedEdge(parseInt(prev_circle[0][2].textContent)+1,
                              parseInt(cur_circle[0][2].textContent)+1,
                              ++amountEdge, EDGE_TYPE_UDE, 1, true);
          mainSvg.select("#e" + amountEdge.toString()).style("visibility", "hidden");
          */
        } else {
          /*
          var cur_circle = mainSvg.selectAll(".v" + used.toString());
          addDirectedEdge(parseInt(prev_circle[0][2].textContent)+1,
                              parseInt(cur_circle[0][2].textContent)+1,
                              ++amountEdge, EDGE_TYPE_UDE, 1, true);
          mainSvg.select("#e" + amountEdge.toString()).style("visibility", "hidden");
          */
        }
      }
    } else {
      // press shift key to straighten line
      if (d3.event.shiftKey) {
        var straight_coor = getStraightLineCoordinate(mousedown_node[0], mousedown_node[1], cur[0], cur[1]);
        moveCircle(straight_coor[0], straight_coor[1], (amountVertex-1).toString());
        var prev_circle1 = mainSvg.selectAll(".v" + (is_used).toString());
        var lineCommand = edgeGenerator(calculateEdge(parseInt(prev_circle1.attr("cx")), parseInt(prev_circle1.attr("cy")), straight_coor[0], straight_coor[1]));
        mainSvg.select("#e" + amountEdge.toString())
        .attr("d",lineCommand);
        mainSvg.select("#e" + amountEdge.toString()).style("visibility", "visible");

        return;
      }

      // press alt to move current circle and assoc edge
      var current_coor_is_used = isUsed(cur[0], cur[1]);
      if (d3.event.altKey) {
        //if (current_coor_is_used == -1) {
          used_alt = is_used;
          moveCircle(cur[0], cur[1], (is_used).toString());
          // update coord[][]
          coord[is_used][0] = cur[0];
          coord[is_used][1] = cur[1];
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
       // }
        return;
      }

      
      var prev_circle1 = mainSvg.selectAll(".v" + (is_used).toString());
      if (current_coor_is_used != -1 && current_coor_is_used != amountVertex-1 &&
        current_coor_is_used != is_used) {
        if (!move1) {
          //if ()
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

          move1 = true;
          var x = 0;
        }
        return;
      }

      if (move1) {
        doclick2(cur);  
        move1 = false;
        //return;
      }
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
    var is_used = isUsed(mousedown_node[0], mousedown_node[1]);
    var prev_circle1 = mainSvg.selectAll(".v" + (is_used).toString());
    var cur = d3.mouse(mouseup_event);
    if ((cur[0] == mousedown_node[0]) && (cur[1] == mousedown_node[1])) {
      mousedown_node = null;
      mousemove_coor = null;
      mouseup_in_progress = false;
      mousemove_in_progress = false;
      mousedown_in_progress = false;
      move1 = true;
      used_alt = -1;
      return;
    }
    var used = amountVertex-1;
    var cur_circle = mainSvg.selectAll(".v" + used.toString());
    //addDirectedEdge(parseInt(prev_circle1[0][2].textContent)+1,
      //              parseInt(cur_circle[0][2].textContent)+1,
        //            ++amountEdge, EDGE_TYPE_UDE, 1, true);
    //mainSvg.select("#e" + amountEdge.toString()).style("visibility", "hidden");

    //var lineCommand = edgeGenerator(calculateEdge(parseInt(prev_circle1.attr("cx")), parseInt(prev_circle1.attr("cy")), cur[0], cur[1]));
   // mainSvg.select("#e" + amountEdge.toString())
    //       .attr("d",lineCommand);
    //mainSvg.select("#e" + amountEdge.toString()).style("visibility", "visible");
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
    /*
    addDirectedEdge(parseInt(prev_circle1[0][2].textContent)+1,
      parseInt(cur_circle[0][2].textContent)+1,
      ++amountEdge, EDGE_TYPE_UDE, 1, true);
    mainSvg.select("#e" + amountEdge.toString()).style("visibility", "hidden");      
    */
  }

  mainSvg.on("mouseup", function () {
    if (d3.event.ctrlKey) return;
    mouseup_event = this;
    doMouseUp();
    mouseup_in_progress = false;
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
    .attr("cy", y)
    .attr("x", x)
    .attr("y", y+3);
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
  
  function parent(i) { return Math.floor(i/2); }
  
  function left(i) { return i*2; }
  
  function right(i) { return i*2+1; }

  function dummyInitArrayOne(){
    var i;
    var initValue = [99999,0,1,2,3,4,5,6,7,8,9];

    A = [];
    for (i = 0; i <= initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }
  }

  function dummyInitArrayTwo(){

  }

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
    //text.style("pointer-events", "none");
    text.on("mouseover", function () { 
      circle.style("fill", "blue");
      var circle2 = mainSvg.selectAll(".v" + (class_id).toString());
      circle2[0][2].value = circle2[0][2].value;
    })
    .on("mouseout", function () { 
      circle.style("fill", "#333333");
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
                coord[current_id_num][0] = -1;
                coord[current_id_num][1] = -1;
                var tmp_e = "#e";
                for (var i=1; i <= Object.size(edgeList); i++) {
                  var tmp_edge_id = tmp_e + i.toString();
                  console.log(edgeList[tmp_edge_id]);
                  if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                    mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                  }
                }                
                return;
              }      
            });

circle[0] = circle[0].splice(1,1);
circle.on("mouseover", function () { 
  d3.select(this).style("fill", "blue");
  var circle2 = mainSvg.selectAll(".v" + (class_id).toString());
  circle2[0][2].value = circle2[0][2].value;
})
.on("mouseout", function () { 
  d3.select(this).style("fill", "#333333");
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

                if (deleted_vertex_list.length == 0) {
                  deleted_vertex_list.push(current_id_num);
                }

                //d3.select(this).remove();
                mainSvg.selectAll(".v" + (class_id).toString()).remove();
                var tmp_e = "#e";
                for (var i=1; i <= Object.size(edgeList); i++) {
                  var tmp_edge_id = tmp_e + i.toString();
                  console.log(edgeList[tmp_edge_id]);
                  if (edgeList[tmp_edge_id][0] == current_id_num || edgeList[tmp_edge_id][1] == current_id_num) {
                    mainSvg.select(tmp_edge_id).style("visibility", "hidden");
                  }
                }                
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
    addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(1, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(4, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(2, 7, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(8, 9, ++edgeId, EDGE_TYPE_UDE, 1, true);
    addDirectedEdge(8, 10, ++edgeId, EDGE_TYPE_UDE, 1, true);
    amountEdge = edgeId;
    addExtraEdge();
    addWeightText("#e3", 99);
    addWeightText("#e9", 99);
    addWeightText("#e6", 99);
    addWeightText("#e7", 99);
    addWeightText("#e1", 10);
    addWeightText("#e2", 10);
    addWeightText("#e5", 10);
    addWeightText("#e8", 10);
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
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(1, 5, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(3, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      amountEdge = edgeId;
      addExtraEdge();
      addWeightText("#e3", 99);
      addWeightText("#e1", 10);
      addWeightText("#e2", 10);
      addWeightText("#e5", 10);
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
          addDirectedEdge(i, j, ++edgeId, EDGE_TYPE_UDE, 1, true);
      amountEdge = edgeId;
      addExtraEdge();
      addWeightText("#e3", 99);
      addWeightText("#e9", 99);
      addWeightText("#e6", 99);
      addWeightText("#e7", 99);
      addWeightText("#e1", 10);
      addWeightText("#e2", 10);
      addWeightText("#e5", 10);
      addWeightText("#e8", 10);
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
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(1, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(3, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(6, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      amountEdge = edgeId;
      addExtraEdge();
      addWeightText("#e3", 99);
      addWeightText("#e6", 99);
      addWeightText("#e7", 99);
      addWeightText("#e1", 10);
      addWeightText("#e2", 10);
      addWeightText("#e5", 10);
      addWeightText("#e8", 10);
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
      amountEdge = edgeId;
      addExtraEdge();
      addWeightText("#e3", 99);
      addWeightText("#e9", 99);
      addWeightText("#e6", 99);
      addWeightText("#e7", 99);
      addWeightText("#e1", 10);
      addWeightText("#e2", 10);
      addWeightText("#e5", 10);
      addWeightText("#e8", 10);
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
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(2, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      amountEdge = edgeId;
      addExtraEdge();
      addWeightText("#e3", 99);
      addWeightText("#e6", 99);
      addWeightText("#e1", 10);
      addWeightText("#e2", 10);
      addWeightText("#e5", 10);
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
      addDirectedEdge(1, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(2, 4, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 3, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(3, 2, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(4, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(5, 6, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(6, 8, ++edgeId, EDGE_TYPE_UDE, 1, true);
      addDirectedEdge(8, 7, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      addDirectedEdge(7, 5, ++edgeId, EDGE_TYPE_UDE, 1, true); 
      amountEdge = edgeId;
      addExtraEdge();
      addWeightText("#e3", 99);
      addWeightText("#e9", 99);
      addWeightText("#e6", 99);
      addWeightText("#e7", 99);
      addWeightText("#e1", 10);
      addWeightText("#e2", 10);
      addWeightText("#e5", 10);
      addWeightText("#e8", 10);
    }

    function clearScreen() {
      var i;

    // remove edges first
    for (i = 1; i <= amountEdge; i++){
      graphWidget.removeEdge(i);
    }

    // remove vertices after removing edges
    for (i = 1; i < amountVertex; i++){
      graphWidget.removeVertex(A[i].getSecond());
    }

    mainSvg.selectAll(".edgelabel").remove();
    amountVertex = 0;
  }

  this.insert = function(vertexText, startAnimationDirectly) {
    if (A.length > 31) {
      alert('Sorry, max limit of 31 has been reached');
      return false;
    }
    
    if (A.indexOf(vertexText) != -1) {
      alert('Sorry, that value is already inside the heap, this visualization can only handle unique elements');
      return false;
    }

    if (startAnimationDirectly == true) {
      stateList = [];
      populatePseudocode(0);
    }

    var i, key, currentState;
    if (A.length > 1) {
      currentState = createState(A);
      currentState["status"] = 'The current Max Heap';
      stateList.push(currentState); // zero-th frame, the starting point
    }

    A[A.length] = new ObjectPair(parseInt(vertexText), amountVertex);
    amountVertex++;
    i = A.length-1;
    // graphWidget.addVertex(coord[i][0], coord[i][1], A[i], V[i], false); // do not immediately show the vertex

    currentState = createState(A);
    currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = 'Insert ' + vertexText + ' as the bottom-most right-most new leaf';
    stateList.push(currentState); // first frame, highlight the newly inserted vertex

    while (i > 1 && A[parent(i)].getFirst() < A[i].getFirst()) {
      currentState = createState(A);
      currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][A[parent(i)].getSecond()]["state"] = VERTEX_TRANSVERSED;
      currentState["status"] = 'Swap ' + A[i].getFirst() + ' with ' + A[parent(i)].getFirst();
      stateList.push(currentState); // before swap

      var temp = A[i];
      A[i] = A[parent(i)];
      A[parent(i)] = temp;
      currentState = createState(A);
      currentState["vl"][A[i].getSecond()]["state"] = VERTEX_TRANSVERSED;
      currentState["vl"][A[parent(i)].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = A[i].getFirst() + ' and ' + A[parent(i)].getFirst() + ' has been swapped';
      stateList.push(currentState); // record the successive vertex swap animation
      i = parent(i);
    }

    currentState = createState(A); // record the final state of the heap after insertion to stop the highlights
    currentState["status"] = 'Insertion of ' + vertexText + ' has been done successfully';
    stateList.push(currentState);

    if (startAnimationDirectly)
      graphWidget.startAnimation(stateList);

    return true;
  }

  this.shiftDown = function(i) {
    while (i < A.length) {
      var maxV = A[i].getFirst(), max_id = i;
      if (left(i) < A.length && maxV < A[left(i)].getFirst()) {
        maxV = A[left(i)].getFirst();
        max_id = left(i);
      }
      if (right(i) < A.length && maxV < A[right(i)].getFirst()) {
        maxV = A[right(i)].getFirst();
        max_id = right(i);
      }

      if (max_id != i) {
        var currentState = createState(A);
        currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][A[max_id].getSecond()]["state"] = VERTEX_TRANSVERSED;
        currentState["status"] = 'Swap ' + A[i].getFirst() + ' with ' + A[max_id].getFirst();
        stateList.push(currentState); // deal with affected edges first

        var temp = A[i];
        A[i] = A[max_id];
        A[max_id] = temp;
        currentState = createState(A);
        currentState["status"] = A[i].getFirst() + ' and ' + A[max_id].getFirst() + ' has been swapped';
        stateList.push(currentState);

        i = max_id;   
      }
      else
        break;
    }
  }

  this.extractMax = function(startAnimationDirectly) {
    if (A.length == 2) {
      alert('Sorry, the Max Heap contains only one item. This is the maximum element. We cannot delete any more item.');
      return false;
    }

    if (startAnimationDirectly == true) {
      stateList = [];
      populatePseudocode(1);
    }

    var currentState = createState(A);
    currentState["vl"][A[1].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = 'Root stores the max element';
    stateList.push(currentState); // highlight the root (max element)

    currentState = createState(A);
    // currentState["vl"][A[1].getSecond()]["cy"] -= 40;
    // currentState["vl"][A[1].getSecond()]["state"] = OBJ_REMOVED;
    delete currentState["vl"][A[1].getSecond()];
    currentState["status"] = 'Take out the root';
    stateList.push(currentState); // move the root (max element) a bit upwards (to simulate 'extract max')

    if (A.length > 2) {
      currentState = createState(A);
      // currentState["vl"][A[1].getSecond()]["state"] = OBJ_REMOVED;
      // currentState["vl"][A[A.length-1].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      delete currentState["vl"][A[1].getSecond()];
      currentState["status"] = 'Replace root with the last leaf';
      stateList.push(currentState); // delete bottom-most right-most leaf (later, also remove its associated edge)
    }

    if (A.length > 2) {
      A[1] = A[A.length-1];
      A.splice(A.length-1, 1);
      currentState = createState(A);
      currentState["vl"][A[1].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = 'The new root';
      stateList.push(currentState); // highlight the new root
    }

    this.shiftDown(1);

    currentState = createState(A);
    currentState["status"] = 'ExtractMax() has been completed';
    stateList.push(currentState);

    if (startAnimationDirectly)
      graphWidget.startAnimation(stateList);

    return true;
  }

  this.heapSort = function() {
    if (A.length == 2) {
      alert('Sorry, the Max Heap contains only one item. This is the maximum element. We cannot delete any more item.');
      return false;
    }

    populatePseudocode(2);
    res = []; // copy first
    for (var i = 1; i < A.length; i++)
      res[i-1] = A[i];
    res.sort(function(a,b){return a-b});

    stateList = [];
    var len = A.length-1;
    for (var i = 0; i < len-1; i++) // except the last item (minor bug if not stopped here)
      this.extractMax(false);

    currentState = createState(A);
    currentState["status"] = 'The final sorted order is ' + res;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    return true;
  }

  this.buildV1 = function(arr) {
    if (arr.length > 31) {
      alert('Sorry, you cannot build Max Heap with more than 31 elements in this visualization.');
      return false;
    }

    var i;

    populatePseudocode(3);

    clearScreen(); 

    var initValue = [999999, parseInt(arr[0])];

    A = []; // destroy old A, create new one

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex);
      amountVertex++;
    }
    init();

    stateList = [];
    var currentState = createState(A);
    currentState["status"] = 'Start by putting ' + arr[0] + ' as the new root';
    stateList.push(currentState);

    for (i = 1; i < arr.length; i++) // insert one by one
      this.insert(parseInt(arr[i]), false);

    currentState = createState(A);
    currentState["status"] = 'The Max Heap has been successfully built from input array: ' + arr;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    return true;
  }

  this.buildV2 = function(arr) {
    if (arr.length > 31) {
      alert('Sorry, you cannot build Max Heap with more than 31 elements in this visualization.');
      return false;
    }

    var i;

    populatePseudocode(4);

    clearScreen();

    var initValue = [999999];

    A = []; // destroy old A, create new one

    for (i = 0; i < arr.length; i++)
      initValue[i+1] = parseInt(arr[i]);

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex);
      amountVertex++;
    }
    init();

    stateList = [];
    var currentState = createState(A);
    currentState["status"] = 'First, copy the entire content of arr: {' + arr + '} into a Complete Binary Tree structure';
    stateList.push(currentState);

    for (i = arr.length/2; i >= 1; i--) { // check heap property one by one
      currentState = createState(A);
      currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = 'Calling ShiftDown(' + i + ') to fix Max Heap property of subtree rooted at ' + A[i].getFirst() + ', if necessary';
      stateList.push(currentState);

      this.shiftDown(i);
    }

    currentState = createState(A);
    currentState["status"] = 'The Max Heap has been successfully built from input array: ' + arr;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    return true;
  }

  function populatePseudocode(act) {
    switch (act) {
      case 0: // Insert
      document.getElementById('code1').innerHTML = 'A[A.length] = new key;';
      document.getElementById('code2').innerHTML = 'i=A.length-1;';
      document.getElementById('code3').innerHTML = 'while (i>1 and A[i]&lt;A[parent(i)])';
      document.getElementById('code4').innerHTML = '&nbsp&nbspswap A[i] and A[parent(i)]';
      document.getElementById('code5').innerHTML = '';
      document.getElementById('code6').innerHTML = '';
      document.getElementById('code7').innerHTML = '';
      break;
      case 1: // ExtractMax
      document.getElementById('code1').innerHTML = 'take out A[1];'
      document.getElementById('code2').innerHTML = 'A[1] = A[A.length-1];'
      document.getElementById('code3').innerHTML = 'i=1 and A.length--;';
      document.getElementById('code4').innerHTML = 'while (i&lt;A.length)';
      document.getElementById('code5').innerHTML = '&nbsp&nbspif A[i] smaller than any of its children';
      document.getElementById('code6').innerHTML = '&nbsp&nbsp&nbsp&nbspswap A[i] with that children';
      document.getElementById('code7').innerHTML = '';
      break;
      case 2: // HeapSort
      document.getElementById('code1').innerHTML = 'for (i=0; i&lt;A.length; i++)'
      document.getElementById('code2').innerHTML = '&nbsp&nbspExtractMax()';
      document.getElementById('code3').innerHTML = '';
      document.getElementById('code4').innerHTML = '';
      document.getElementById('code5').innerHTML = '';
      document.getElementById('code6').innerHTML = '';
      document.getElementById('code7').innerHTML = '';
      break;
      case 3: // BuildV1
      document.getElementById('code1').innerHTML = 'Start from an empty Max Heap'
      document.getElementById('code2').innerHTML = 'for (i=0; i&lt;inputArr.length; i++)';
      document.getElementById('code3').innerHTML = '&nbsp&nbspInsert(inputArr[i])';
      document.getElementById('code4').innerHTML = '';
      document.getElementById('code5').innerHTML = '';
      document.getElementById('code6').innerHTML = '';
      document.getElementById('code7').innerHTML = '';
      break;
      case 4: // BuildV2
      document.getElementById('code1').innerHTML = 'Copy inputArr to A';
      document.getElementById('code2').innerHTML = 'for (i=inputArr.length/2; i>=1; i--)';
      document.getElementById('code3').innerHTML = '&nbsp&nbspShiftDown(i)';
      document.getElementById('code4').innerHTML = '';
      document.getElementById('code5').innerHTML = '';
      document.getElementById('code6').innerHTML = '';
      document.getElementById('code7').innerHTML = '';
      break;
    }
  }

  function highlightPseudocode(idx) {
    return;
/*    for (var i=1; i<=7; i++)
      document.getElementById('code'+i).font.color='black';

      document.getElementById('code'+idx).font.color='red';*/
    }

    function createState(internalHeapObject) {
      var state = {
        "vl":{},
        "el":{},
        "status":{}
      };

      for (var i = 1; i < internalHeapObject.length; i++) {
        var key = internalHeapObject[i].getSecond();
        state["vl"][key] = {};

        state["vl"][key]["cx"] = coord[i][0];
        state["vl"][key]["cy"] = coord[i][1];
        state["vl"][key]["text"] = internalHeapObject[i].getFirst();
        state["vl"][key]["state"] = VERTEX_DEFAULT;
      }

      for (var i = 2; i < internalHeapObject.length; i++){
        var edgeId = i;

        state["el"][edgeId] = {};

        state["el"][edgeId]["vertexA"] = internalHeapObject[parent(i)].getSecond();
        state["el"][edgeId]["vertexB"] = internalHeapObject[i].getSecond();
        state["el"][edgeId]["type"] = EDGE_TYPE_UDE;
        state["el"][edgeId]["weight"] = 1;
        state["el"][edgeId]["state"] = EDGE_DEFAULT;
        state["el"][edgeId]["animateHighlighted"] = false;
      }

      return state;
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
    console.log(edgeIdNumber);
    var edgeId = "#e" + edgeIdNumber.toString();
    mainSvg.select(edgeId).style('marker-end', 'url(#end-arrow)');

    edgeList[edgeId.toString()] = [vertexClassA, vertexClassB];
    console.log(vertexClassA + " " + vertexClassB);
  }


}