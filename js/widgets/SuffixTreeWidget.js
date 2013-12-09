// @author Nguyen Hoang Duy, based on Steven Halim's base file
// Defines a Heap object; keeps implementation of Heap internally and interact with GraphWidget to display Heap visualizations

var SuffixTreeWidget = function() {
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
  var edgeId = 0;


  var Txt='',    // the input text string
    root=null, // root of the suffix tree
    infinity;  // quite a big number
    nForks=0;  // number of branching nodes in the suffix tree
    width = 50;
    height = 30;
    height_offset = 18;
  var suffix_table = new Array(), reverse_suffix_table = new Array();
  var height_level = new Array();
  var draw_data = new Array();
  var processQueue = new Array();
  var fromResultNode = null, toResultNode = null;
  var foundResult = false;
  var cur_LRS_max = '', old_LRS_max ='';
  var LRSMax;
  var LRSMaxEqual = new Array();
  var currentColorNode = -1, currentColorElem = -1;
  var saveEdge = 0;
  var isCanvasClear = true;
  var maxX = 0, maxY = 0;

  mainSvg.style("class", "unselectable");
  mainSvg.attr("height", window.innerHeight-80);
  mainSvg.attr("width", window.innerWidth);
  
  $( window ).resize(function() {
	mainSvg.attr("height", window.innerHeight-80);
	mainSvg.attr("width", window.innerWidth);
  });
  
  var projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([MAIN_SVG_WIDTH / 2, MAIN_SVG_HEIGHT / 2]);

  var path = d3.geo.path()
      .projection(projection);

  mainSvg.append("rect")
    .attr("class", "background")
    .attr("width", MAIN_SVG_WIDTH)
    .attr("height", MAIN_SVG_HEIGHT)
    .on("click", clicked);

  var g = mainSvg.append("g");

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
    adjMatrix = [], adjList = [];
    edgeId = 0;

    Txt='',    // the input text string
    root=null, // root of the suffix tree
    infinity;  // quite a big number
    nForks=0;  // number of branching nodes in the suffix tree
    width = 50;
    height = 30;
    height_offset = 18;
    suffix_table = new Array(), reverse_suffix_table = new Array();
    height_level = new Array();
    draw_data = new Array();
    processQueue = new Array();
    fromResultNode = null, toResultNode = null;
    foundResult = false;
    cur_LRS_max = '', old_LRS_max ='';
    LRSMax;
    LRSMaxEqual = new Array();
    currentColorNode = -1, currentColorElem = -1;
    saveEdge = 0;
    isCanvasClear = true;
    maxX = 0, maxY = 0;
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

  function pair(a, b) { this.fst = a; this.snd = b; } // i.e. <fst, snd>
// NB. most of Ukkonen's functions return a pair (s,w)


  function isEmptyStrng() { return this.right < this.left; }

  function Strng(left, right) // represents Txt[left..right]
  { this.left=left; this.right=right;
   this.isEmpty = isEmptyStrng;
  }//constructor


  function addTrnstn(left, right, s) // this['a'] >---(left..right)---> s
  // add a transition to `this' state
  { this[Txt.charAt(left)] = new pair(new Strng(left,right), s);
   this.isLeaf = false;
  }

  function State() // i.e. a new leaf node in the suffix tree
  { this.addTransition = addTrnstn; this.isLeaf = true; }

  function Node(word, x, y) {
    this.word = word;
    this.x = x;
    this.y = y;
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

  function Node2(word, index) {
    this.word = word;
    this.index = index;
  }

  function Node3(word, suffix_index, parent_index, x, y, path_label, class_id, color)  {
    this.word = word;
    this.suffix_index = suffix_index;
    this.parent_index = parent_index;
    this.x = x;
    this.y = y;
    this.path_label = path_label;
    this.class_id = class_id;
    if (typeof(color)=='undefined') this.color = 'black';
    else this.color = color;
  }

  function Node4(path_label, node_label,  x, y, match_flag) {
    this.path_label = path_label;
    this.node_label = node_label;
    this.x = x;
    this.y = y;
    this.match_flag = match_flag;
  }

  function NodeLRS(path_label, x, y, is_leaf) {
    this.path_label = path_label;
    this.x = x;
    this.y = y;
    this.is_leaf = is_leaf;
  }

  function NodeG(prev_x, isString1, isString2) {
    this.prev_x = prev_x;
    this.isString1 = isString1;
    this.isString2 = isString2;
  }
 
  function upDate(s, k, i)                                                   
  // (s, (k, i-1)) is the canonical reference pair for the active point         
  { 
    var oldr = root;                                                        
    var endAndr = test_and_split(s, k, i-1, Txt.charAt(i))                  
    var endPoint = endAndr.fst; var r = endAndr.snd                         
                                                                           
    while (!endPoint)                                                       
    { r.addTransition(i, infinity, new State());                           
      if (oldr != root) oldr.sLink = r;                                    
                                                                           
      oldr = r;
      var sAndk = canonize(s.sLink, k, i-1)                                
      s = sAndk.fst; k = sAndk.snd;                                        
      endAndr = test_and_split(s, k, i-1, Txt.charAt(i))                   
      endPoint = endAndr.fst; r = endAndr.snd;                             
    }                                                                      
                                                                           
    if(oldr != root) oldr.sLink = s;                                       

    return new pair(s, k);
  }//upDate


  function test_and_split(s, k, p, t) { 
    if(k<=p)                                                                
    { // find the t_k transition g'(s,(k',p'))=s' from s                  
      // k1 is k'  p1 is p'                                                
      var w1ands1 = s[Txt.charAt(k)];          // s --(w1)--> s1            
      var s1 = w1ands1.snd;                                               
      var k1 = w1ands1.fst.left;  var p1 = w1ands1.fst.right;

      if (t == Txt.charAt(k1 + p - k + 1))
         return new pair(true, s);
      else
       { var r = new State()
         s.addTransition(k1, k1+p-k,   r);     // s ----> r ----> s1
         r.addTransition(    k1+p-k+1, p1, s1);
         return new pair(false, r)
       }
    }
    else // k > p;  ? is there a t-transition from s ?
    return new pair(s[t] != null, s);
  }//test_and_split


  function canonize(s, k, p) { 
    if(p < k) return new pair (s, k);

     // find the t_k transition g'(s,(k',p'))=s' from s
     // k1 is k',  p1 is p'
     var w1ands1 = s[Txt.charAt(k)];                            // s --(w1)--> s1
     var s1 = w1ands1.snd;
     var k1 = w1ands1.fst.left;  var p1 = w1ands1.fst.right;

     while(p1-k1 <= p-k)                               // s --(w1)--> s1 ---> ...
      { k += p1 - k1 + 1;                    // remove |w1| chars from front of w
        s = s1;
        if(k <= p)
         { w1ands1 = s[Txt.charAt(k)];                          // s --(w1)--> s1
           s1 = w1ands1.snd;
           k1 = w1ands1.fst.left; p1 = w1ands1.fst.right;
         }
       }
      return new pair(s, k);
  }//canonize


  function insertionSort(Txt, second) // NB. O(n**2) or worse; unacceptable for long input strings!
  { //if(Txt.length > 11) return;//too long for sorting
    //var suffixW = document.getElementById('suffixW');
    //suffixW.value = '';
    var table = document.getElementById('myTable');
    var A = new Array(), len = Txt.length;
    //cleanup();
    var i;
    for(i = 0; i < Txt.length; i++) A[i] = i;
    for(i = 0; i < Txt.length-1; i++)
    { var j,  small = i;
      for(j = i+1; j < Txt.length; j++)
         if(Txt.substring(A[j],len) < Txt.substring(A[small], len))
            small = j;
      var temp = A[i]; A[i] = A[small]; A[small] = temp;
    }
    for(i = 0; i < len; i++)
    { var numbr = '    '+(A[i])+': ';
      numbr = numbr.substring(numbr.length-4, numbr.length);
      //document.theForm.opt.value += numbr+Txt.substring(A[i], len)+'\n';
      suffix_table[A[i]] = Txt.substring(A[i], len);
      reverse_suffix_table[Txt.substring(A[i], len)] = A[i];
    }   
    for (i=0; i < suffix_table.length-1; i++) {
      for (var j=i+1; j< suffix_table.length; j++) {
        if (suffix_table[i] > suffix_table[j]) {
          var tmp = suffix_table[i];
          suffix_table[i] = suffix_table[j];
          suffix_table[j] = tmp;
        }
      }   
    }
    /*
    for (i=0; i < suffix_table.length; ++i) {
      var $input = $('<tr><td height=20px>' + i + '</td>' +  ' <td>' + reverse_suffix_table[suffix_table[i]] + '</td> ' + '<td>' + suffix_table[i] + '</td> ' + ' </tr>').appendTo(suffixW.getWidget().find('.tb1'));
      //row_draw_data[suffix_table[i]] = i;
    } */
    //document.theForm.opt.value += '\n';
    /*
    var canvas = document.getElementById('canvas');  
    if (typeof(second)!== "undefined") {
    canvas.addEventListener('click', function(evt) {
          var mousePos = getMousePos(canvas, evt);
          //alert(mousePos.x + " " + mousePos.y);
          var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
          insertionSort(Txt);
          highlightFromTreeToArray(mousePos);
        }, false);

    $('.vertices').css('pointer-events','none');  
    $('.edges').css('pointer-events','none');
    $('.overlays').css('pointer-events','none');

    }*/
 }//insertionSort

  function algorithm2() { 
    var s, k, i;
    var bt;

    root = new State();
    bt = new State();                                      // bt (bottom or _|_)

    // Want to create transitions for all possible chars
    // from bt to root
    for (i=0; i<Txt.length; i++)
      bt.addTransition(i,i, root);

    root.sLink = bt;
    s=root; k=0;  // NB. Start k=0, unlike Ukkonen paper our strings are 0 based

    for(i=0; i < Txt.length; i++)
    { var sAndk = upDate(s, k, i);   // (s,k) < - upDate(...)
      s = sAndk.fst; k = sAndk.snd;
      sAndk = canonize(s, k, i);     // (s,k) < - canonize(...)
      s = sAndk.fst; k = sAndk.snd;
    }
  }//algorithm2 

  this.showGATAGACA = function() {
    clearScreen();
    stDriver();
  }

  this.buildSuffixTree = function(txt) {
    clearScreen();
    Txt = txt;
    stDriver(txt);
  }

  this.buildGeneralSuffixTree = function() {
    clearScreen();
    stGeneralDriver();
  }

  // return values:
  // .index of input that will be used to match later (>0)
  // .-1 when not match from the beginning
  // .-2 when match
  // .1  when partial match
  /*
  function isPrefix(input, input_idx, node_label) {
    if (node_label=='') return 0;
    var j = 0, i;
    for (i= input_idx; i < input.length; i++) {
      if (input[i] != node_label[j]) return -1; // not match
      j++;
      if (j == node_label.length) break;
    } 
    //if (input.length - input_idx > node_label.length) return i;
    //if (input.length - input_idx <= node_label.length) return -2;
    if ()
  }
*/

  function isPrefix(input, input_idx, node_label) {
    if (node_label=='') return 0;
    if (input[input_idx] != node_label[0]) return -1; // no match
    var j=1, i;
    for (i=input_idx+1; i < input.length; i++) {      
      if (j == node_label.length) return i-1;
      if (input[i] == node_label[j]) j++;  
    }
    return -2;
  }

  function prepareStDriver() {
    if (Txt.length == 0) {
      alert("Please enter a non-empty string");
      return
    }
    if (Txt[Txt.length-1] != '$') {
      alert("$ has been appended to your string");
      Txt += '$';
      document.getElementById("arrv1").value = Txt;
    }
    infinity = Txt.length + 1000; // well it's quite big :-)
    nForks = 0;
    draw_data = new Array();
    //document.theForm.opt.value = '';
    suffix_table = new Array();
    reverse_suffix_table = new Array();
    currentColorNode = -1;
    currentColorElem = -1;
    insertionSort(Txt);

    algorithm2();  // ------------ the business
    height_level = new Array();
    for (var i=0; i < Txt.length; i++) height_level[i] = 0;
    //show(root, '', 'tree:|', 0, '');
    //document.theForm.opt.value += nForks + ' branching nodes';
    height = Txt.length*32;

    /*
    var ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, 3000, 3000);

    ctx.save();
    */
    height_level[0] = height_offset ;
    for (var i=1; i < Txt.length; i++) {
        height_level[i] = height_level[0]*i*5.5;
    }   
    maxY = 0; maxX = 0;
    // TODO:
    var startX = 70;
  }

  function stDriver(txt)
  { 
    Txt = txt;
    if (Txt.length == 0) {
      alert("Please enter a non-empty string");
      return
    }
    if (Txt[Txt.length-1] != '$') {
      alert("$ has been appended to your string");
      Txt += '$';
      document.getElementById("arrv1").value = Txt;
    }
    infinity = Txt.length + 1000; // well it's quite big :-)
    nForks = 0;
    draw_data = new Array();
    //document.theForm.opt.value = '';
    suffix_table = new Array();
    reverse_suffix_table = new Array();
    currentColorNode = -1;
    currentColorElem = -1;
    insertionSort(Txt);

    algorithm2();  // ------------ the business
    height_level = new Array();
    for (var i=0; i < Txt.length; i++) height_level[i] = 0;
    //show(root, '', 'tree:|', 0, '');
    //document.theForm.opt.value += nForks + ' branching nodes';
    height = Txt.length*32;

    /*
    var ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, 3000, 3000);

    ctx.save();
    */
    height_level[0] = height_offset ;
    for (var i=1; i < Txt.length; i++) {
        height_level[i] = height_level[0]*i*5.5;
    }   
    maxY = 0; maxX = 0;
    // TODO:
    var startX = 70;
    drawSuffixTree(root, 0, startX, '');
    startX = (window.innerWidth - (maxX - startX))/2.5;
    clearScreen();
    Txt = txt;
    prepareStDriver();
    drawSuffixTree(root, 0, startX, '');
    // TODO:
    drawAllLabel();
    

    // update coord
    var count = 1;
    for (var i in draw_data) {
      //var st = Txt.substring(i);
      var node = draw_data[i];
      var idx = parseInt(node.class_id) + 1;
      coord[idx] = new Array();
      coord[idx][0] = node.x;
      coord[idx][1] = node.y;
      //draw_data[i].class_id = count++;
    }
   // coord[1] = new Array();
    //coord[1][0] = draw_data[""].x;
    //coord[1][1] = draw_data[""].y;


  }//stDriver

  function drawSuffixTree(T, level, prev_x, text) {
    var count = 0, iter=0;
    for (attr in T) {
      if (attr.length == 1) count++;
    }   

    var used = new Array(), min = '';
    for (attr in T) 
      if (attr.length == 1) {
        var wAndT2 = T[attr];
        var w = wAndT2.fst;
        var myStr = Txt.substring(w.left, w.right+1);
        used.push(new Node2(myStr, attr));
      }
    for (var i=0; i<used.length-1; i++)
      for (var j=i+1; j<used.length; j++) {
        if (stringCmp(used[i].index, used[j].index) == -1 ) {
          var tmp = used[i];
          used[i] = used[j];
          used[j] = tmp;
        }       
        else if (stringCmp(used[i].index, used[j].index) == 0) {
          if (stringCmp(used[i].word, used[j].word) == -1) {
            var tmp = used[i];
            used[i] = used[j];
            used[j] = tmp;
          }         
        }
      }

    var update_prev_x = prev_x;
    var tmp_store = text.split(":");
    var T_idx = text, T_string = text;
    //for(attr in T)//each subtree
      //if(attr.length == 1)//a char attribute selects a suffix-tree branch
    for (var i=0; i < used.length; i++) {
      iter++;
      var attr = used[i];
      if (iter>count/2) break; 
      var wAndT2 = T[attr.index];
      var w = wAndT2.fst, T2 = wAndT2.snd;
      var Str_idx = Txt.substring(w.left, w.right+1);
      var myStr = T_string+ Str_idx ;
      //height = height_level[level];
      var y = (level+1)*height + height_offset;
      //drawVertex(update_prev_x,y,myStr,'black');
      var suffix_idx = -1;
      if (reverse_suffix_table[T_string + Str_idx]) {
        suffix_idx = reverse_suffix_table[T_string + Str_idx];
      }
      draw_data[T_string + Str_idx] = new Node3(T_string + Str_idx, suffix_idx, T_idx, 0, 0, T_string + Str_idx);
      update_prev_x = Math.max(update_prev_x, drawSuffixTree(T2, level+1, update_prev_x, myStr));
    }    
    update_prev_x += width;
    var vertex_name = "";
    if (reverse_suffix_table[text] || reverse_suffix_table[text] === 0) vertex_name = reverse_suffix_table[text];
    height = height_level[level];
    if (maxX < update_prev_x) maxX = update_prev_x;
    if (maxY < height) maxY = height;

    //drawVertex(update_prev_x, height, vertex_name, 'black'); TODO:
    A[amountVertex] = new ObjectPair(vertex_name, amountVertex);
    graphWidget.addVertex(update_prev_x, height, A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);
    if (T_idx == "") {
      draw_data[""] = new Node3(T_string, -1, -2, update_prev_x, level*height + height_offset, "", amountVertex -1);
    } else {
      draw_data[T_idx].x = update_prev_x;
      draw_data[T_idx].y = height;
      draw_data[T_idx].class_id = amountVertex - 1;
    }
    iter = 0;
    for (var i=0; i < used.length; i++) 
     { iter++;
       if (iter>count/2) {
         var attr = used[i];
         var wAndT2 = T[attr.index];
         var w = wAndT2.fst, T2 = wAndT2.snd;
         var Str_idx = Txt.substring(w.left, w.right+1);
         //if (Str_idx.indexOf("#") > -1) 
         //Str_idx = Str_idx.substring(0, Str_idx.indexOf("#")+1);
         var myStr = T_string + Str_idx;
         //show(T2, str2, myStr);
         var y = (level+1)*height + height_offset;
         //drawVertex(update_prev_x,y,myStr,'black');
         var suffix_idx = -1;
         if (reverse_suffix_table[T_string + Str_idx]) {
            suffix_idx = reverse_suffix_table[T_string + Str_idx];
         }
         draw_data[T_string + Str_idx] = new Node3(T_string + Str_idx, suffix_idx, T_idx, 0, 0, T_string + Str_idx);
         update_prev_x = Math.max(update_prev_x, drawSuffixTree(T2, level+1, update_prev_x, myStr));
       }
     }   
    return update_prev_x;
  }

  function drawAllLabel() {
    var node;
    for (attr in draw_data) {
      if (attr == "") continue;
      node = draw_data[attr];
      if (typeof(node.parent_index) != 'undefined') {
        var tmp = draw_data[node.parent_index];
        var a = node.path_label, b = tmp.path_label, c="", i;
        if (b) {
          for (i = 0; i < a.length; i++) {
            if (a[i] != b[i]) break;
          }
          for (; i < a.length; i++) {
            c += a[i];
          }
        } else c = a;
        var pts = getCircleLineIntersectionPoint(tmp.x, tmp.y, node.x, node.y, 14, tmp.x, tmp.y);
        var pts2 = getCircleLineIntersectionPoint(tmp.x, tmp.y, node.x, node.y, 14, node.x, node.y);
        var min = 5000;
        var save1 = 0, save2 = 0;
        for (var i=1; i<=3; i+=2) 
          for (var j=1; j<=3; j+=2) 
        {
          if (Math.abs(pts[i] - pts2[j]) < min) {
            min = Math.abs(pts[i] - pts2[j]);
            save1 = i; save2 = j;
          }
        }

        drawLabel(tmp.class_id, node.class_id, pts[save1-1], pts[save1], pts2[save2-1], pts2[save2], c, node.color);
        //drawLabel(tmp.x, tmp.y, node.x, node.y, c, node.color);   
        //drawLabel(pts[save1-1], pts[save1], pts2[save2-1],pts2[save2],c, node.color);
      }
    }
  }

  function drawLabel(from_class_id, to_class_id, xA, yA, xB, yB, text, color) {
    graphWidget.addEdge(from_class_id, to_class_id, ++amountEdge, EDGE_TYPE_UDE, 1, true);
    edgeList["#e" + amountEdge.toString()] = new Array();
    edgeList["#e" + amountEdge.toString()][0] = from_class_id;
    edgeList["#e" + amountEdge.toString()][1] = to_class_id;
    mainSvg.select("#e" + (amountEdge).toString()).attr("style", "stroke-width:0.5");
    var slope = (yA - yB)/(xA - xB);
    var x0 = xA, y0 = 0;
    var b = (yA - slope*xA);
    var deltaX = xA - xB;
    var delta = deltaX/(text.length+1);
    for (var i=0; i<text.length; i++) {
      x0-=delta;
      y0=slope*x0 + b;
      //ctx.fillText(text[i],x0,y0);
      mainSvg
     .append("text")
     .attr("class", "edgelabel")
     .attr("x", x0)
     .attr("y", y0)
     .attr("dx", 1)
     .attr("dy", ".35em")
     .attr("text-anchor", "middle")     
     .text(function(d) { return text[i] });
    }

  }


  function clicked(d) {
    return;
    var cur = d3.mouse(this);
    mainSvg.selectAll(".edgelabel")
      .style("pointer-events", "none")
    .transition()
      .duration(750)
      .attr("transform", "translate(80,80)");

    if (!d || centered === d) {
    projection.translate([MAIN_SVG_WIDTH / 2, MAIN_SVG_HEIGHT / 2]);
    centered = null;
  } else {
    var centroid = path.centroid(d),
        translate = projection.translate();
    projection.translate([
      translate[0] - centroid[0] + MAIN_SVG_WIDTH / 2,
      translate[1] - centroid[1] + MAIN_SVG_HEIGHT / 2
    ]);
    centered = d;
  }

  // Transition to the new projection.
  g.selectAll("path").transition()
      .duration(750)
      .attr("d", path);
  }


  function createState(internalHeapObject) {
    var state = {
      "vl":{},
      "el":{},
      "status":{}
    };

    for (var i = 0; i < internalHeapObject.length; i++) {
      var key = internalHeapObject[i].getSecond();
      //var key = i;
      state["vl"][key] = {};

      state["vl"][key]["cx"] = coord[key+1][0];
      state["vl"][key]["cy"] = coord[key+1][1];
      state["vl"][key]["text"] = internalHeapObject[i].getFirst();
      state["vl"][key]["state"] = VERTEX_DEFAULT;
    }

    //for (var i = 1; i < internalHeapObject.length; i++){
    for (var i = 1; i <= Object.size(edgeList); i++){
      var edgeId = i;

      state["el"][edgeId] = {};

      state["el"][edgeId]["vertexA"] = edgeList["#e" + i.toString()][0]; //internalHeapObject[parent(i)].getSecond();
      state["el"][edgeId]["vertexB"] = edgeList["#e" + i.toString()][1];//internalHeapObject[i].getSecond();
      state["el"][edgeId]["type"] = EDGE_TYPE_UDE;
      state["el"][edgeId]["weight"] = 1;
      state["el"][edgeId]["state"] = EDGE_DEFAULT;
      state["el"][edgeId]["animateHighlighted"] = false;
    }

    return state;
  }

  this.testAnimation = function() {
    var currentState = createState(A);
    currentState["vl"][A[4].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = 'animate1 animate';
    currentState["lineNo"] = 0;
    stateList.push(currentState);
    //graphWidget.startAnimation(stateList);
    
    currentState = createState(A);
    currentState["vl"][A[4].getSecond()]["state"] = VERTEX_TRAVERSED;
    currentState["vl"][A[1].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = 'animate123';
    //currentState["lineNo"] = 1;
    //currentState["status"] = 'animate_2';
    stateList.push(currentState);
    //graphWidget.startAnimation(stateList);
    for (var i=0; i < 10; i++) {
      currentState = createState(A);
      currentState["vl"][A[i+1].getSecond()]["state"] = VERTEX_TRAVERSED;
      currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = 'animate' + i.toString();
      currentState["lineNo"] = 2;
      stateList.push(currentState);
     //graphWidget.startAnimation(stateList);
    }

    var s2 = createState(A);
    currentState["vl"][A[4].getSecond()]["state"] = VERTEX_TRAVERSED;
    stateList.push(currentState);
    
    graphWidget.startAnimation(stateList);
    return true;
  }

  this.goSearch = function() {
    var input = document.getElementById("search_inp").value;
    var input2 = document.getElementById("arrv1").value;
    populatePseudocode(0);
    this.buildSuffixTree(input2);
    //(path_label, node_label, x, y, match_flag)
    var stateList = new Array();
    foundResult = false;
    processQueue = new Array();
    processQueue.push(new Node4('', '', draw_data[''].x, draw_data[''].y, -1));
    processTreeForSearch(root, '', '', '', input, 0);
    if (!foundResult) {
      processQueue.push(-1);
    }
    var stack = new Array(), prev = new Array();
    var tmpProcessQ = new Array();
    var isGoingUp = new Array();
    tmpProcessQ[0] = processQueue[0];
    stack.push(processQueue[0]);
    var is_popping = false;
    for (var i=1; i < processQueue.length; i++) {
      var top = stack[stack.length-1];
      var next_node = processQueue[i];
      if ((draw_data[next_node.path_label].parent_index == top.path_label) && !is_popping) {
        stack.push(next_node);
        is_popping = false;
        tmpProcessQ.push(next_node);
      } else {
        while (true) {
          stack.pop();
          is_popping = true;
          top = stack[stack.length-1];
          if (draw_data[next_node.path_label].parent_index == top.path_label) {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
            tmpProcessQ.push(next_node);
            stack.push(next_node);
            is_popping = false;
            break;
          } else {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
          }
        }
      }
    }
    processQueue = tmpProcessQ;




    var prev = new Array();
    var prev_edge = new Array();
    var curState = createState(A);
    var populateResult = false;
    var isResultPartial = true;
    var results = new Array();
    var noMatch = false;
    curState["status"] = "Current result will be yellow colored.";
    stateList.push(curState);
    for (var i in processQueue) {
      var currentState = createState(A);
      if (populateResult) {
        if (!isResultPartial) {
          isResultPartial = true;
          results = new Array();
        }
        var pl = processQueue[i].path_label;
        var tmp_q = new Array();
        tmp_q.push(pl);
        while (Object.size(tmp_q)) {
          pl = tmp_q.pop();
          if (pl[pl.length-1] != "$") {
            for (var j in draw_data) {
              var tpp = draw_data[j];
              if (tpp.parent_index == pl) tmp_q.push(tpp.path_label);
            }
          } else {
            results.push(pl);
          }
        }
        
        //results.push(processQueue[i].path_label);
        continue;
      }

      if (processQueue[i]==-1) {
        currentState["status"] = "No match found."
        currentState["lineNo"] = 7;
        noMatch = true;
        for (var j=0; j < prev.length; j++) {
          currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
        }
        stateList.push(currentState);
        break;
      }
      var node = processQueue[i];      
      var node_idx = null;
      node_idx = parseInt(draw_data[node.path_label].class_id);
      if (isGoingUp[i]) {
        currentState = createState(A);
        currentState["status"] = "Going back.";
        for (var j=0; j < prev.length; j++) {
          currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
        }
        for (var w=0; w < Object.size(prev_edge); w++) {
          currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
        }
        currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;      
        stateList.push(currentState);
        continue;
      }


      currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;      
      for (var w=0; w < Object.size(prev_edge); w++) {
        currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
      }
      for (var w=1; w <= Object.size(edgeList); w++) {
        var e = edgeList["#e" + w.toString()];
        if (typeof(e) == "undefined") continue;
        if (e[1] == node_idx) {
          currentState["el"][w]["state"]= EDGE_HIGHLIGHTED;  
          prev_edge.push(w);
          break;
        }
      }
      
      for (var j=0; j < prev.length; j++) {
        currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
      }
      prev.push(node_idx);
      if (node.match_flag == -2) {
        currentState["status"] = "Path label: " + node.path_label + ". Match found";
        currentState["lineNo"] = 5;
        isResultPartial = false;
        results.push(node.path_label);
        stateList.push(currentState);
        populateResult = true;
      } else if (node.match_flag == -1) {
        if (i=="0") {
          currentState["status"] = "Start from root";
          currentState["lineNo"] = 1;
        }
        else {
          currentState["status"] = "Path label: " + node.path_label + ". No match, going back";
          currentState["lineNo"] = 4;
        }
      } else {
        currentState["status"] = "Path label: " + node.path_label + ". Partial match found, going deeper";;
        currentState["lineNo"] = 6;
      }
      stateList.push(currentState);
    }
    if (!noMatch) {
      currentState = createState(A);
      currentState["status"] = "The results are yellow colored."
      currentState["lineNo"] = 5;
      for (var j=0; j<results.length; j++) {
        var tmp_idx = parseInt(draw_data[results[j]].class_id);
        currentState["vl"][tmp_idx]["state"] = VERTEX_RESULT;
      }
      stateList.push(currentState);
    }

    graphWidget.startAnimation(stateList);  
    return true;  
  }

  function processTreeForSearch(T, str, arc, node_label, input, input_idx ) {
    if(T.isLeaf)
    { 
      return;
    }
    var attr, iter = 0, i;
    //spaces += '|';   // |spaces|==|arc|
    //var str2 = str+spaces;//nosilla l

    var used = new Array(); 
    var min = '';
    
    for (attr in T) 
      if (attr.length == 1) {
        var wAndT2 = T[attr];
        var w = wAndT2.fst;
        var myStr = Txt.substring(w.left, w.right+1);
        used.push(new Node2(myStr, attr));
      }
    for (var i=0; i<used.length-1; i++)
      for (var j=i+1; j<used.length; j++) {
        if (stringCmp(used[i].index, used[j].index) == -1 ) {
          var tmp = used[i];
          used[i] = used[j];
          used[j] = tmp;
        }       
        else if (stringCmp(used[i].index, used[j].index) == 0) {
          if (stringCmp(used[i].word, used[j].word) == -1) {
            var tmp = used[i];
            used[i] = used[j];
            used[j] = tmp;
          }         
        }
      }
    for (var i=0; i < used.length; i++) {
      attr = used[i];
      var wAndT2 = T[attr.index];
      var w = wAndT2.fst, T2 = wAndT2.snd;
      var node_label_cur = Txt.substring(w.left, w.right+1);
      var myStr = '('+(w.left)+':'+ node_label_cur +')|';
      var is_prefix = isPrefix(input, input_idx, node_label_cur);
      //(path_label, node_label, x, y, match_flag)
      processQueue.push(new Node4(node_label + node_label_cur, node_label_cur, draw_data[node_label + node_label_cur].x, draw_data[node_label + node_label_cur].y, is_prefix));
      if (is_prefix >= 0) {
        //processTreeForSearch(T2, "", myStr, Txt.substring(w.left, w.right+1), input, is_prefix+1);
        processTreeForSearch(T2, "", myStr, node_label + node_label_cur, input, is_prefix+1);
        return;
      }
      else if (is_prefix == -2) {
        fromResultNode = T;
        toResultNode = T2;
        var tmpQ = new Array();
        for (aattr in T2) {
            if (aattr.length == 1) {
            var wAndT2 = T2[aattr];
            var w = wAndT2.fst;
            var myStr = Txt.substring(w.left, w.right+1);
            tmpQ.push(new Node4(input + myStr, myStr, draw_data[input + myStr].x, draw_data[input + myStr].y, 0));
          }
        }
        for (var k=0; k<tmpQ.length-1; k++)
          for (var j=k+1; j<tmpQ.length; j++) {
            if (stringCmp(tmpQ[k].path_label, tmpQ[j].path_label) == -1 ) {
              var tmp = tmpQ[k];
              tmpQ[k] = tmpQ[j];
              tmpQ[j] = tmp;
            }       
          }
        for (var k=0; k < tmpQ.length; k++) {
          processQueue.push(tmpQ[k]);
        }
        foundResult = true;
        return;
      }
    }
  }

  function addTraversedNode(state_list, prevs, current_state) {
    var stateList = state_list;
    for (var j=0; j < prevs.length; j++) {
          current_state["vl"][prevs[j]]["state"]= VERTEX_TRAVERSED;
    } 
    stateList.push(currentState);
    return stateList;
  }

  this.goLRS = function(isitLCS) {
    var input = document.getElementById("search_inp").value;
    var input2 = document.getElementById("arrv1").value;
    populatePseudocode(1);
    this.buildSuffixTree(input2);    

    var is_LCS = false;
    if (typeof(isitLCS)!='undefined') {
      if (isitLCS === true)
        is_LCS = true;
    }
    processQueueLRS = new Array();
    processQueueLRS.push(new NodeLRS('', draw_data[''].x, draw_data[''].y, false));
    processTreeForLRS(root, '', is_LCS);

    var stateList = new Array();
    var currentState = createState(A);
    if (is_LCS) {
      currentState["status"] = "Purple vertices belong to string 1. Green vertices belong to string 2. Current result will be yellow colored.";
      stateList.push(currentState);
    }
    currentState = createState(A);
    currentState["status"] = "Start from root.";
    currentState["lineNo"] = 1;
    //currentState["vl"][6]["state"] = VERTEX_HIGHLIGHTED;
    stateList.push(currentState);

    var stack = new Array(), prev = new Array();
    var tmpProcessQ = new Array();
    var isGoingUp = new Array();
    tmpProcessQ[0] = processQueueLRS[0];
    stack.push(processQueueLRS[0]);
    var is_popping = false;
    for (var i=1; i < processQueueLRS.length; i++) {
      var top = stack[stack.length-1];
      var next_node = processQueueLRS[i];
      if ((draw_data[next_node.path_label].parent_index == top.path_label) && !is_popping) {
        stack.push(next_node);
        is_popping = false;
        tmpProcessQ.push(next_node);
      } else {
        while (true) {
          stack.pop();
          is_popping = true;
          top = stack[stack.length-1];
          if (draw_data[next_node.path_label].parent_index == top.path_label) {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
            tmpProcessQ.push(next_node);
            stack.push(next_node);
            is_popping = false;
            break;
          } else {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
          }
        }
      }
    }

    processQueueLRS = tmpProcessQ;
    var results = new Array();
    var max = "";
    // the animation starts here
    var prev = new Array();
    var prev_edge = new Array();
    for (var i in processQueueLRS) {
      var currentState = createState(A);
      var node = processQueueLRS[i];      
      var node_idx = null;
      node_idx = parseInt(draw_data[node.path_label].class_id);
      currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;
      var edgeId = 0;
      for (var w=0; w < Object.size(prev_edge); w++) {
        currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
      }
      for (var w=1; w <= Object.size(edgeList); w++) {
        var e = edgeList["#e" + w.toString()];
        if (typeof(e) == "undefined") continue;
        if (e[1] == node_idx) {
          currentState["el"][w]["state"]= EDGE_HIGHLIGHTED;  
          prev_edge.push(w);
          break;
        }
      }

      for (var j=0; j < prev.length; j++) {
        currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
      }
      prev.push(node_idx);

      if (isGoingUp[i]) {
        currentState["status"] = "Going back."
        currentState["lineNo"] = 3;
      } else if (node.is_leaf) {
        currentState["status"] = "This is a leaf node, going back.";
        currentState["lineNo"] = 4;
      } else {
        currentState["status"] = "Path label: " + node.path_label + ". ";
        if (node.path_label.length > max.length) {
          max = node.path_label;
          results = [];
          results.push(node.path_label);
          currentState["lineNo"] = 6;
          currentState["status"]+= "Longer than current max. Updating max";
        } else if (node.path_label.length == max.length) {
          results.push(node.path_label);
          currentState["lineNo"] = 6;
          currentState["status"]+= "Equal to current max. Updating max";
        } else {
          currentState["lineNo"] = 5;
          currentState["status"]+= "Smaller than current max.";
        }
      }
      for (var j=0; j<results.length; j++) {
        var tmp_idx = parseInt(draw_data[results[j]].class_id);
        currentState["vl"][tmp_idx]["state"] = VERTEX_RESULT;
      }
      if (isGoingUp[i]) currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;
      stateList.push(currentState);
    }
    currentState = createState(A);
    currentState["lineNo"] = 7;
    currentState["status"] = "LRS ";
    if (results.length > 1) currentState["status"]+= "are ";
    else currentState["status"]+= "is ";
    if (results.length == 1 && results[0].length == 0) currentState["status"] += "empty string.";
    for (var i=0; i < results.length; i++) {
      if (i>0) currentState["status"]+= ", ";
      currentState["status"]+= results[i] + " ";
    }
    for (var j=0; j < prev.length; j++) {
      currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
    }
    for (var j=0; j<results.length; j++) {
      var tmp_idx = parseInt(draw_data[results[j]].class_id);
      currentState["vl"][tmp_idx]["state"] = VERTEX_RESULT;
    }
    for (var w=0; w < Object.size(prev_edge); w++) {
      currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
    }
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);
    return true;
  }

  function processTreeForLRS(T, path_label, isLCS) {
    if(T.isLeaf)
    { 
      return;
    }
    var attr, iter = 0;
    var spaces = '';  var i;

    var used = new Array(); 
    var min = '';
    if (isLCS && draw_data[path_label].color!='black') return;
    for (attr in T) 
      if (attr.length == 1) {
        var wAndT2 = T[attr];
        var w = wAndT2.fst;
        var myStr = Txt.substring(w.left, w.right+1);
        used.push(new Node2(myStr, attr));
      }
    for (var i=0; i<used.length-1; i++)
      for (var j=i+1; j<used.length; j++) {
        if (stringCmp(used[i].index, used[j].index) == -1 ) {
          var tmp = used[i];
          used[i] = used[j];
          used[j] = tmp;
        }       
        else if (stringCmp(used[i].index, used[j].index) == 0) {
          if (stringCmp(used[i].word, used[j].word) == -1) {
            var tmp = used[i];
            used[i] = used[j];
            used[j] = tmp;
          }         
        }
      }
    for (var i=0; i < used.length; i++) {
      attr = used[i];
      var wAndT2 = T[attr.index];
      var w = wAndT2.fst, T2 = wAndT2.snd;
      var node_label_cur = Txt.substring(w.left, w.right+1);
      var path_lb = path_label + node_label_cur;
      processQueueLRS.push(new NodeLRS(path_lb, draw_data[path_lb].x, draw_data[path_lb].y, T2.isLeaf));
      processTreeForLRS(T2, path_lb, isLCS);       
    }
  }


  this.coloring = function() {
    for (var j=0; j < 100; j++)
    for (var i in draw_data) {
      var tmp_vertex = mainSvg.selectAll(".v" + draw_data[i].class_id.toString());
      tmp_vertex[0] = tmp_vertex[0].splice(0,2);
      tmp_vertex.attr("fill", "yellow !important");
      tmp_vertex.attr("class", "comeon");
    }
  }

  this.goLCS = function() {
    clearScreen();
    var stateList = new Array();
    // Determine whether an inside vertex contains both strings
    processQueueLRS = new Array();
    var internals = stGeneralDriver(true);
    populatePseudocode(2);
    // TODO: remove color of inside vertex that belongs to 1 string here
    /*
    for (var i in draw_data) {
      // check if i is internal vetex
      var tmp = draw_data[i];
      var isInternal = false;
      for (var j in draw_data) {
        if (j == i) continue;
        if (draw_data[j].parent_index == tmp.path_label) {
          isInternal = true;
          break;
        }
      }
      if (isInternal) {
        var tmp_vertex = mainSvg.selectAll(".v" + tmp.class_id.toString());
        if (tmp.color == "orchid")
          tmp_vertex.classed("lcs_first", false);
        else if (tmp.color != "black")
          tmp_vertex.classed("lcs_second", false);
      }
    } */

    processQueueLRS.push(new NodeLRS('', draw_data[''].x, draw_data[''].y, false));
    processTreeForLRS(root, '', false);
    var currentState = createState(A);
    currentState["status"] = "Start from root.";
    currentState["lineNo"] = 1;
    //currentState["vl"][6]["state"] = VERTEX_HIGHLIGHTED;
    stateList.push(currentState);

    var stack = new Array(), prev = new Array();
    var tmpProcessQ = new Array();
    var isGoingUp = new Array();
    tmpProcessQ[0] = processQueueLRS[0];
    stack.push(processQueueLRS[0]);
    var is_popping = false;
    for (var i=1; i < processQueueLRS.length; i++) {
      var top = stack[stack.length-1];
      var next_node = processQueueLRS[i];
      if ((draw_data[next_node.path_label].parent_index == top.path_label) && !is_popping) {
        stack.push(next_node);
        is_popping = false;
        tmpProcessQ.push(next_node);
      } else {
        while (true) {
          stack.pop();
          is_popping = true;
          top = stack[stack.length-1];
          if (draw_data[next_node.path_label].parent_index == top.path_label) {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
            tmpProcessQ.push(next_node);
            stack.push(next_node);
            is_popping = false;
            break;
          } else {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
          }
        }
      }
    }

    processQueueLRS = tmpProcessQ;
    var results = new Array();
    var max = "";
    // the animation starts here
    var prev = new Array();
    var prev_edge = new Array();
    var string1s = new Array();
    var string2s = new Array();
    for (var i in processQueueLRS) {
      var currentState = createState(A);
      var node = processQueueLRS[i];      
      var node_idx = null;
      node_idx = parseInt(draw_data[node.path_label].class_id);
      
      var edgeId = 0;
      
      for (var w=1; w <= Object.size(edgeList); w++) {
        var e = edgeList["#e" + w.toString()];
        if (typeof(e) == "undefined") continue;
        if (e[1] == node_idx) {
          currentState["el"][w]["state"]= EDGE_HIGHLIGHTED;  
          prev_edge.push(w);
          break;
        }
      }

      for (var w=0; w < Object.size(prev_edge); w++) {
        currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
      }
      for (var j=0; j < prev.length; j++) {
        currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
      }
      prev.push(node_idx);
      currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;

      if (isGoingUp[i]) {
        currentState["status"] = "Going back.";
        currentState["lineNo"] = 1;
        for (var k=0; k < Object.size(string1s); k++) {
          currentState["vl"][string1s[k]]["state"] = VERTEX_BLUE_FILL; 
        }
        for (var k=0; k < Object.size(string2s); k++) {
          currentState["vl"][string2s[k]]["state"] = VERTEX_GREEN_FILL; 
        }
        stateList.push(currentState);
        currentState = createState(A);
        currentState["status"] = "Going back.";
        currentState["lineNo"] = 1;
        for (var w=0; w < Object.size(prev_edge); w++) {
          currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
        }
        for (var j=0; j < prev.length; j++) {
          currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
        }
        var tmp_vertex = mainSvg.selectAll(".v" + draw_data[node.path_label].class_id.toString());
        if (draw_data[node.path_label].color == "orchid") {
          currentState["status"] = "This only contains string 1.";
          currentState["lineNo"] = 1;
          string1s.push(node_idx);
        } else if (draw_data[node.path_label].color != 'black' ) {
          currentState["status"] = "This only contains string 2.";
          currentState["lineNo"] = 1;
          string2s.push(node_idx);
        }
        for (var k=0; k < Object.size(string1s); k++) {
          currentState["vl"][string1s[k]]["state"] = VERTEX_BLUE_FILL; 
        }
        for (var k=0; k < Object.size(string2s); k++) {
          currentState["vl"][string2s[k]]["state"] = VERTEX_GREEN_FILL; 
        }
        stateList.push(currentState);
        continue;
      } else if (node.is_leaf) {
        currentState["status"] = "This is a leaf node, going back.";
        currentState["lineNo"] = 1;
        currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;
        //currentState["lineNo"] = 4;
        for (var k=0; k < Object.size(string1s); k++) {
          currentState["vl"][string1s[k]]["state"] = VERTEX_BLUE_FILL; 
        }
        for (var k=0; k < Object.size(string2s); k++) {
          currentState["vl"][string2s[k]]["state"] = VERTEX_GREEN_FILL; 
        }
      } else {
        // TODO: do the check here and color node that belongs to 1 string
        //if (draw_data[i].color == "orchid")
        //tmp_vertex.attr("class", "lcs_first");
        //else tmp_vertex.attr("class", "lcs_second");        
        for (var k=0; k < Object.size(string1s); k++) {
          currentState["vl"][string1s[k]]["state"] = VERTEX_BLUE_FILL; 
        }
        for (var k=0; k < Object.size(string2s); k++) {
          currentState["vl"][string2s[k]]["state"] = VERTEX_GREEN_FILL; 
        }
      }
      if (isGoingUp[i]) currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;
      currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;
      stateList.push(currentState);
    }
    currentState = createState(A);
    currentState["status"] = "The internal nodes that belongs to 1 string are colored";
    for (var w=0; w < Object.size(prev_edge); w++) {
      currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
    }
    for (var j=0; j < prev.length; j++) {
        currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
      }
    for (var k=0; k < Object.size(string1s); k++) {
      currentState["vl"][string1s[k]]["state"] = VERTEX_BLUE_FILL; 
    }
    for (var k=0; k < Object.size(string2s); k++) {
      currentState["vl"][string2s[k]]["state"] = VERTEX_GREEN_FILL; 
    }
    stateList.push(currentState);


    // ends
    stGeneralDriver(true);
    populatePseudocode(3);
    processQueueLRS = new Array();
    processQueueLRS.push(new NodeLRS('', draw_data[''].x, draw_data[''].y, false));
    processTreeForLRS(root, '', true);
    prev_edge = new Array();


    var currentState = createState(A);
    currentState["status"] = "Current max vertex will be yellow colored.";
    for (var i=0; i < Object.size(internals); i++) {
      var node_idx = null;
      var node = internals[i];
      node_idx = parseInt(draw_data[node].class_id);
      if (draw_data[node].color == "orchid")
        currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_BLUE;
      else 
        currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_GREEN;
    }
    stateList.push(currentState);    
    currentState = createState(A);
    currentState["status"] = "Start from root.";
    //currentState["vl"][6]["state"] = VERTEX_HIGHLIGHTED;
    currentState["lineNo"] = 2;
    for (var i=0; i < Object.size(internals); i++) {
      var node_idx = null;
      var node = internals[i];
      node_idx = parseInt(draw_data[node].class_id);
      if (draw_data[node].color == "orchid")
        currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_BLUE;
      else 
        currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_GREEN;
    }
    stateList.push(currentState);

    var stack = new Array(), prev = new Array();
    var tmpProcessQ = new Array();
    var isGoingUp = new Array();
    tmpProcessQ[0] = processQueueLRS[0];
    stack.push(processQueueLRS[0]);
    var is_popping = false;
    for (var i=1; i < processQueueLRS.length; i++) {
      var top = stack[stack.length-1];
      var next_node = processQueueLRS[i];
      if ((draw_data[next_node.path_label].parent_index == top.path_label) && !is_popping) {
        stack.push(next_node);
        is_popping = false;
        tmpProcessQ.push(next_node);
      } else {
        while (true) {
          stack.pop();
          is_popping = true;
          top = stack[stack.length-1];
          if (draw_data[next_node.path_label].parent_index == top.path_label) {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
            tmpProcessQ.push(next_node);
            stack.push(next_node);
            is_popping = false;
            break;
          } else {
            tmpProcessQ.push(top);
            isGoingUp[tmpProcessQ.length-1] = true;
          }
        }
      }
    }

    processQueueLRS = tmpProcessQ;
    var results = new Array();
    var max = "";
    // the animation starts here
    var prev = new Array();
    for (var i in processQueueLRS) {
      var currentState = createState(A);
      var node = processQueueLRS[i];      
      var node_idx = null;
      for (var j0=0; j0 < Object.size(internals); j0++) {
        var node_idx = null;
        var node1 = internals[j0];
        node_idx = parseInt(draw_data[node1].class_id);
        if (draw_data[node1].color == "orchid")
          currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_BLUE;
        else 
          currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_GREEN;
      }
      node_idx = parseInt(draw_data[node.path_label].class_id);
      currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;
      for (var w=0; w < Object.size(prev_edge); w++) {
        currentState["el"][prev_edge[w]]["state"]= EDGE_TRAVERSED;
      }
      for (var j=0; j < prev.length; j++) {
        currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
      }
      for (var w=1; w <= Object.size(edgeList); w++) {
        var e = edgeList["#e" + w.toString()];
        if (typeof(e) == "undefined") continue;
        if (e[1] == node_idx) {
          currentState["el"][w]["state"]= EDGE_HIGHLIGHTED;  
          prev_edge.push(w);
          break;
        }
      }
      prev.push(node_idx);

      if (isGoingUp[i]) {
        currentState["status"] = "Going back."
      } else if (node.is_leaf) {
        currentState["status"] = "This is a leaf node, going back.";
        currentState["lineNo"] = 4;
      } else if (draw_data[node.path_label].color != 'black') {
        currentState["status"] = "This is not a common node, going back.";
        currentState["lineNo"] = 5;
      } else {
        currentState["status"] = "Path label: " + node.path_label + ". ";
        currentState["lineNo"] = 6;        
        if (node.path_label.length > max.length) {
          max = node.path_label;
          results = [];
          results.push(node.path_label);
          currentState["status"]+= "Longer than current max. Updating max";
        } else if (node.path_label.length == max.length && node.path_label != max) {
          results.push(node.path_label);
          currentState["status"]+= "Equal to current max. Updating max";
        } else if (node.path_label != max) {
          currentState["status"]+= "Smaller than current max.";
        }
      
      }
      for (var j=0; j<results.length; j++) {
        var tmp_idx = parseInt(draw_data[results[j]].class_id);
        currentState["vl"][tmp_idx]["state"] = VERTEX_RESULT;
      }
      if (isGoingUp[i]) currentState["vl"][node_idx]["state"]= VERTEX_HIGHLIGHTED;
      stateList.push(currentState);
    }
    currentState = createState(A);
    currentState["status"] = "LCS ";
    if (results.length > 1) currentState["status"]+= "are ";
    else currentState["status"]+= "is ";
    for (var i=0; i < results.length; i++) {
      if (i>0) currentState["status"]+= ", ";
      currentState["status"]+= results[i] + " ";
    }
    for (var i=0; i < Object.size(internals); i++) {
      var node_idx = null;
      var node = internals[i];
      node_idx = parseInt(draw_data[node].class_id);
      if (draw_data[node].color == "orchid")
        currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_BLUE;
      else 
        currentState["vl"][node_idx]["state"]= VERTEX_NORMAL_GREEN;
    }
    for (var j=0; j < prev.length; j++) {
      currentState["vl"][prev[j]]["state"]= VERTEX_TRAVERSED;
    }
    for (var j=0; j<results.length; j++) {
      var tmp_idx = parseInt(draw_data[results[j]].class_id);
      currentState["vl"][tmp_idx]["state"] = VERTEX_RESULT;
    }    
    stateList.push(currentState);
    graphWidget.startAnimation(stateList);
    return true;
  }

  var lcs_txt = "";
  function stGeneralDriver(notColorInternal) { 
   //Txt = document.getElementById("s1").value;
    var s1 = document.getElementById("s1").value, s2 = document.getElementById("s2").value;
    //var s1 = "GATAGACA$", s2 = "CATA#";
    if (s1.length == 0 || s2.length == 0) {
      alert("Please enter non-empty strings");
      return;
    }
    if (s1[s1.length-1] != '$') {
      alert("$ has been appended to your first string");
      s1 += '$';
      document.getElementById("s1").value = s1;
    }
    if (s2[s2.length-1] != '#') {
      alert("# has been appended to your second string");
      s2 += '#';
      document.getElementById("s2").value = s2;
    }
    Txt =  s1 + s2;

    infinity = Txt.length + 1000; 
    nForks = 0;
    draw_data = new Array();
    suffix_table = new Array();
    reverse_suffix_table = new Array();
    insertionSort(s1);
    insertionSort(s2);

    algorithm2();  // ------------ the business
    height_level = new Array();
    for (var i=0; i < Txt.length; i++) height_level[i] = 0;
    show2(root, '', 'tree:|', 0, '');
    height = Txt.length*32;
    height_level[0] = height_offset;
    for (var i=1; i < Txt.length; i++) {
      height_level[i] = height_level[0]*i*5.5;
    }   
    maxY = 0; maxX = 0;
    var startX = 70;
    drawGeneralSuffixTree(root, 0, startX, '');  
    startX = (window.innerWidth - (maxX - startX))/2.5;
    lcs_txt = Txt;
    clearScreen();
    Txt = lcs_txt;
    infinity = Txt.length + 1000; 
    nForks = 0;
    draw_data = new Array();
    suffix_table = new Array();
    reverse_suffix_table = new Array();
    insertionSort(s1);
    insertionSort(s2);

    algorithm2();  // ------------ the business
    height_level = new Array();
    for (var i=0; i < Txt.length; i++) height_level[i] = 0;
    show2(root, '', 'tree:|', 0, '');
    height = Txt.length*32;
    height_level[0] = height_offset;
    for (var i=1; i < Txt.length; i++) {
      height_level[i] = height_level[0]*i*5.5;
    }   
    drawGeneralSuffixTree(root, 0, startX, '');
    drawAllLabel();
    // update coord
    var count = 1;
    for (var i in draw_data) {
      //var st = Txt.substring(i);
      var node = draw_data[i];
      var idx = parseInt(node.class_id) + 1;
      coord[idx] = new Array();
      coord[idx][0] = node.x;
      coord[idx][1] = node.y;
      //draw_data[i].class_id = count++;
    }

    // coloring

    if (typeof(notColorInternal) == "undefined") {
      for (var i in draw_data) {
        var tmp_vertex = mainSvg.selectAll(".v" + draw_data[i].class_id.toString());
        tmp_vertex[0] = tmp_vertex[0].splice(0,2);
        if (draw_data[i].color == "black") continue;
        if (draw_data[i].color == "orchid")
          tmp_vertex.attr("class", "lcs_first");
        else tmp_vertex.attr("class", "lcs_second");
      }
    } else {
      var internals = new Array();
      for (var i in draw_data) {
        var tmp_vertex = mainSvg.selectAll(".v" + draw_data[i].class_id.toString());
        tmp_vertex[0] = tmp_vertex[0].splice(0,2);
        var tmp = draw_data[i];
        var isInternal = false;
        for (var j in draw_data) {
          if (j == i) continue;
          if (draw_data[j].parent_index == tmp.path_label) {
            isInternal = true;
            break;
          }
        }
        if (isInternal) {
          //tmp_vertex.attr("class", "lcs_internal");
          if (draw_data[i].color != "black")
            internals.push(i);
          continue;
        }
        if (draw_data[i].color == "black") continue;
        if (draw_data[i].color == "orchid")
          tmp_vertex.attr("class", "lcs_first");
        else tmp_vertex.attr("class", "lcs_second");
      }
      return internals;
    }

  }//stGeneralDriver

  function drawGeneralSuffixTree(T, level, prev_x, text) {
    var count = 0, iter=0;
    for (attr in T) {
      if (attr.length == 1) count++;
    }   
    
    var used = new Array(), min = '';
    for (attr in T) 
      if (attr.length == 1) {
        var wAndT2 = T[attr];
        var w = wAndT2.fst;
        var myStr = Txt.substring(w.left, w.right+1);
        used.push(new Node2(myStr, attr));
      }
    for (var i=0; i<used.length-1; i++)
      for (var j=i+1; j<used.length; j++) {
        if (stringCmp(used[i].index, used[j].index) == -1 ) {
          var tmp = used[i];
          used[i] = used[j];
          used[j] = tmp;
        }       
        else if (stringCmp(used[i].index, used[j].index) == 0) {
          if (stringCmp(used[i].word, used[j].word) == -1) {
            var tmp = used[i];
            used[i] = used[j];
            used[j] = tmp;
          }         
        }
      }
    
    var update_prev_x = prev_x;
    var tmp_store = text.split(":");
    var T_idx = text, T_string = text;
    var currentIs1 = false, currentIs2 = false;
    //for(attr in T)//each subtree
      //if(attr.length == 1)//a char attribute selects a suffix-tree branch
    for (var i=0; i < used.length; i++) {
      iter++;
      var attr = used[i];
      if (iter>count/2) break; 
      var wAndT2 = T[attr.index];
      var w = wAndT2.fst, T2 = wAndT2.snd;
      var Str_idx = Txt.substring(w.left, w.right+1);
      var myStr = T_string+ Str_idx ;
      //height = height_level[level];
      var y = (level+1)*height + height_offset;
      //drawVertex(update_prev_x,y,myStr,'black');
      var suffix_idx = -1;
      if (reverse_suffix_table[T_string + Str_idx]) {
        suffix_idx = reverse_suffix_table[T_string + Str_idx];
      }
      draw_data[T_string + Str_idx] = new Node3(T_string + Str_idx, suffix_idx, T_idx, 0, 0, T_string + Str_idx);
      //update_prev_x = Math.max(update_prev_x, drawSuffixTree(T2, level+1, update_prev_x, myStr));
      var tmpNode = drawGeneralSuffixTree(T2, level+1, update_prev_x, myStr);
      currentIs1 = currentIs1 || tmpNode.isString1; currentIs2 = currentIs2 || tmpNode.isString2;
      update_prev_x = Math.max(update_prev_x, tmpNode.prev_x);
    }    
    update_prev_x += width;
    var vertex_name = "";
    var current_x = update_prev_x;
    if (reverse_suffix_table[text] || reverse_suffix_table[text] === 0) vertex_name = reverse_suffix_table[text];
    height = height_level[level];
    if (maxX < update_prev_x) maxX = update_prev_x;
    if (maxY < height) maxY = height;

    var current_height = height;
    A[amountVertex] = new ObjectPair(vertex_name, amountVertex);
    graphWidget.addVertex(update_prev_x, height, A[amountVertex].getFirst(), A[amountVertex++].getSecond(), true);
    if (maxX < update_prev_x) maxX = update_prev_x;
    //drawVertex(update_prev_x, height, vertex_name, 'black');
    if (T_idx == "") {
      draw_data[""] = new Node3(T_string, -1, -2, update_prev_x, level*height + height_offset, "");
      draw_data[T_idx].class_id = amountVertex - 1;
    } else {
      draw_data[T_idx].x = update_prev_x;
      draw_data[T_idx].y = height;
      draw_data[T_idx].class_id = amountVertex - 1;
    }
    iter = 0;
    for (var i=0; i < used.length; i++) 
     { iter++;
       if (iter>count/2) {
         var attr = used[i];
         var wAndT2 = T[attr.index];
         var w = wAndT2.fst, T2 = wAndT2.snd;
         var Str_idx = Txt.substring(w.left, w.right+1);

         var myStr = T_string + Str_idx;
         //show(T2, str2, myStr);
         var y = (level+1)*height + height_offset;
         //drawVertex(update_prev_x,y,myStr,'black');
         var suffix_idx = -1;
         if (reverse_suffix_table[T_string + Str_idx]) {
            suffix_idx = reverse_suffix_table[T_string + Str_idx];
         }
         draw_data[T_string + Str_idx] = new Node3(T_string + Str_idx, suffix_idx, T_idx, 0, 0, T_string + Str_idx);
         //update_prev_x = Math.max(update_prev_x, drawSuffixTree(T2, level+1, update_prev_x, myStr));
         var tmpNode = drawGeneralSuffixTree(T2, level+1, update_prev_x, myStr);
         if (!currentIs1) currentIs1 = tmpNode.isString1; 
         if (!currentIs2) currentIs2 = tmpNode.isString2;
         update_prev_x = Math.max(update_prev_x, tmpNode.prev_x);
       }
     }   
 
    if (T.isLeaf) {
        if (text[text.length-1] == '$') currentIs1 = true;
        else currentIs2 = true;       
    }
    
    if (currentIs1 && currentIs2) {
      draw_data[T_idx].color = 'black';    
      //drawVertex(current_x, current_height, vertex_name, 'darkorchid');
    } else if (currentIs1) {
      draw_data[T_idx].color = 'orchid';
      //drawVertex(current_x, current_height, vertex_name, 'black');
    } else {
      draw_data[T_idx].color = 'chartreuse';
      //drawVertex(current_x, current_height, vertex_name, 'chartreuse');
    }
    return new NodeG(update_prev_x, currentIs1, currentIs2);
  }
  
  function show2(T, str, arc, level, node_label) // print the suffix tree
 { 
    if(T == null)//should not happen!
    { 
      return;//should not be here
    }
    //else
    if(T.isLeaf)
    { 
      if (node_label.length > height_level[level]) height_level[level] = node_label.length;
      return;//llewop d
    }
    //else
    nForks++;
    var attr, iter = 0;
    var spaces = '';  var i;
    for(i=1; i < arc.length; i++) spaces += ' ';
    spaces += '|';   // |spaces|==|arc|
    var str2 = str+spaces;//nosilla l

    var used = new Array(); 
    var min = '';
    
    for (attr in T) 
      if (attr.length == 1) {
        var wAndT2 = T[attr];
        var w = wAndT2.fst;
        var myStr = Txt.substring(w.left, w.right+1);
        used.push(new Node2(myStr, attr));
      }
    for (var i=0; i<used.length-1; i++)
      for (var j=i+1; j<used.length; j++) {
        if (stringCmp(used[i].index, used[j].index) == -1 ) {
          var tmp = used[i];
          used[i] = used[j];
          used[j] = tmp;
        }       
        else if (stringCmp(used[i].index, used[j].index) == 0) {
          if (stringCmp(used[i].word, used[j].word) == -1) {
            var tmp = used[i];
            used[i] = used[j];
            used[j] = tmp;
          }         
        }
    }
    if (node_label.length > height_level[level]) height_level[level] = node_label.length;
    for (var i=0; i < used.length; i++) {
      iter++;
      attr = used[i];
      var wAndT2 = T[attr.index];
      var w = wAndT2.fst, T2 = wAndT2.snd;
      var myStr = '('+(w.left)+':'+Txt.substring(w.left, w.right+1)+')|';
      var label = node_label + Txt.substring(w.left, w.right + 1);
      
      if (label.indexOf('$') > -1) {
        T[attr.index].fst.right = Txt.indexOf('$');
        wAndT2 = T[attr.index];
        w = wAndT2.fst;
      }
      
          
      show2(T2, str2, myStr, level+1, Txt.substring(w.left, w.right+1))

    }

  }//show

  function populatePseudocode(act) {
    switch (act) {
      case 0: // Search
        document.getElementById('code1').innerHTML = 'consider current node';
        document.getElementById('code2').innerHTML = 'for (i in current node child)';
        document.getElementById('code3').innerHTML = '&nbsp&nbsp if (i not match)';
        document.getElementById('code4').innerHTML = '&nbsp&nbsp&nbsp&nbsp continue';
        document.getElementById('code5').innerHTML = '&nbsp&nbsp if (i is full match) return all results';
        document.getElementById('code6').innerHTML = '&nbsp&nbsp else if (i is partial match) go deeper';
        document.getElementById('code7').innerHTML = 'return no match';
        break;
      case 1: // LRS
        document.getElementById('code1').innerHTML = 'result = \'\'';
        document.getElementById('code2').innerHTML = 'consider current node';
        document.getElementById('code3').innerHTML = 'for (i in current node child)';
        document.getElementById('code4').innerHTML = '&nbsp&nbspif i is leave continue';
        document.getElementById('code5').innerHTML = '&nbsp&nbspelse if (path label length >= result.length)';
        document.getElementById('code6').innerHTML = '&nbsp&nbsp&nbsp&nbsp update result';
        document.getElementById('code7').innerHTML = 'return result';
        break;
      case 2: // LCS step 1, color internal node
        document.getElementById('code1').innerHTML = 'if curent node is a leaf, return';
        document.getElementById('code2').innerHTML = 'if current node belongs to string 1 only';
        document.getElementById('code3').innerHTML = '&nbsp&nbspcolor current node as string 1';
        document.getElementById('code4').innerHTML = 'if current node belongs to string 2 only';
        document.getElementById('code5').innerHTML = '&nbsp&nbspcolor current node as string 2';    
        break;
      case 3: // LCS main
        document.getElementById('code1').innerHTML = 'indexing the nodes';
        document.getElementById('code2').innerHTML = 'max = root';
        document.getElementById('code3').innerHTML = 'findLCS(current node):';
        document.getElementById('code4').innerHTML = '&nbsp&nbspif current node is a leaf, return';
        document.getElementById('code5').innerHTML = '&nbsp&nbspif current node is not common, return';
        document.getElementById('code6').innerHTML = '&nbsp&nbspif current node length >= max, update max';
        document.getElementById('code7').innerHTML = '&nbsp&nbspfindLCS(current node\'s children)';      
        break;

      }
  }

}