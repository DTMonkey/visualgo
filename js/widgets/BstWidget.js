// @author  Ivan Reinaldo
// Defines a BST object; keeps implementation of BST internally and interact with GraphWidget to display BST visualizations
// Also includes AVL tree

var BST = function(){
  var self = this;
  var graphWidget = new GraphWidget();
  var isAVL = true;

  var valueRange = [1, 100]; // Range of valid values of BST vertexes allowed
  var maxHeightAllowed = 10;

  var initialArray = [15, 6, 23, 4, 7, 71, 5, 50];
  var initialAvlArray = [15, 6, 50, 4, 7, 23, 71, 5];

  /*
   * internalBst: Internal representation of BST in this object
   * The keys are the text of the nodes, and the value is the attributes of the corresponding node encapsulated in a JS object, which are:
   * - "parent": text of the parent node. If the node is root node, the value is null.
   * - "leftChild": text of the left child. No child -> null
   * - "rightChild": text of the right child. No child -> null
   * - "cx": X-coordinate of center of the node
   * - "cy": Y-coordinate of center of the node
   * - "height": height of the node. Height of root is 0
   * - "vertexClassNumber": Vertex class number of the corresponding node
   *
   * In addition, there is a key called "root" in internalBst, containing the text of the root node.
   * If BST is empty, root is null.
   */

  var internalBst = {};
  var amountVertex = 0;
  internalBst["root"] = null;

  if(isAVL) init(initialAvlArray);
  else init(initialArray);

  this.getGraphWidget = function(){
    return graphWidget;
  }

  /*
   * @deprecated Use init(initArr)
   */
  function dummyInit(){
    internalBst["root"] = 15;
	internalBst[15] = {
      "parent": null,
      "leftChild": 6,
      "rightChild": 23,
      "vertexClassNumber": 0
    };
	internalBst[6] = {
      "parent": 15,
      "leftChild": 4,
      "rightChild": 7,
      "vertexClassNumber": 1
    };
	internalBst[23] = {
      "parent": 15,
      "leftChild": null,
      "rightChild": 71,
      "vertexClassNumber": 2
    };
	internalBst[4] = {
      "parent": 6,
      "leftChild": null,
      "rightChild": 5,
      "vertexClassNumber": 3
    };
	internalBst[7] = {
      "parent": 6,
      "leftChild": null,
      "rightChild": null,
      "vertexClassNumber": 4
    };
	internalBst[71] = {
      "parent": 23,
      "leftChild": 50,
      "rightChild": null,
      "vertexClassNumber": 5
    };
	internalBst[5] = {
      "parent": 4,
      "leftChild": null,
      "rightChild": null,
      "vertexClassNumber": 6
    };
	internalBst[50] = {
      "parent": 71,
      "leftChild": null,
      "rightChild": null,
      "vertexClassNumber": 7
    };

    recalculatePosition();

    var key;

    for(key in internalBst){
      if(key == "root") continue;

      var currentVertex = internalBst[key];
      graphWidget.addVertex(currentVertex["cx"], currentVertex["cy"], key, currentVertex["vertexClassNumber"], true);
    }

    for(key in internalBst){
      if(key == "root") continue;

      var currentVertex = internalBst[key];
      var parentVertex = internalBst[currentVertex["parent"]];
      if(currentVertex["parent"] == null) continue;

      graphWidget.addEdge(parentVertex["vertexClassNumber"], currentVertex["vertexClassNumber"], currentVertex["vertexClassNumber"], EDGE_TYPE_UDE, 1, true);
    }

    amountVertex = 8;

  }

  this.generateRandom = function(){
    
  }

  this.isAVL = function(bool){
    if(typeof bool != 'boolean') return;

    if(bool != isAVL){
      clearScreen();
      if(bool) init(initialAvlArray);
      else init(initialArray);
      isAVL = bool;
    }
  }

  this.getIsAVL = function(){
    return isAVL;
  }

  this.search = function(vertexText){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    while(currentVertex != vertexText && currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;

      currentState["status"] = "Comparing "+currentVertex+ " with "+vertexText;
      currentState["lineNo"] = 3;
      stateList.push(currentState);

      if(parseInt(vertexText) > parseInt(currentVertex)) {
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = currentVertex+" is smaller than "+vertexText;
        currentState["lineNo"] = 5;
        stateList.push(currentState);
        
        currentVertex = internalBst[currentVertex]["rightChild"];
        if(currentVertex == null) {
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
            currentState["status"] = "Node "+vertexText+" is not in the BST";
          currentState["lineNo"] = 2;
          stateList.push(currentState);
          break;
        }

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;

        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

        currentState["status"] = "So search on right";
        currentState["lineNo"] = 6;
        stateList.push(currentState);
      } else {
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = currentVertex+" is greater than "+vertexText;
        currentState["lineNo"] = 7;
        stateList.push(currentState);
        
        currentVertex = internalBst[currentVertex]["leftChild"];
        if(currentVertex == null) {
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["status"] = "Node "+vertexText+" is not in the BST";
          currentState["lineNo"] = 2;
          stateList.push(currentState);
          break;
        }

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
          edgeTraversed[edgeHighlighted] = true;

          currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
          currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

          currentState["status"] = "So search on left";
          currentState["lineNo"] = 7;
          stateList.push(currentState);
      }
    }

    if(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      currentState["status"] = "Found node " + vertexText;
      currentState["lineNo"] = 4;
      stateList.push(currentState);
    }
    // End state

    currentState = createState(internalBst);
    currentState["status"] = "Search is complete";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(4);
    return true;
  }

  this.findMin = function(){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
	  var ans;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;

    stateList.push(currentState);

    if(currentVertex == null){
      currentState = createState(internalBst);
      currentState["status"] = "Tree is empty, there is no minimum value.";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
      graphWidget.startAnimation(stateList);
      return true;
    }

    while(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;

      if(internalBst[currentVertex]["leftChild"] != null){
        currentState["status"] = currentVertex+" is not the minimum value as it has a left child."
        currentState["lineNo"] = 2;
      }
      else{
		    ans = currentVertex;
        currentState["status"] = "Minimum value found!"
        currentState["lineNo"] = 4;
      }

      currentVertex = internalBst[currentVertex]["leftChild"];

      stateList.push(currentState);

      if(currentVertex == null) break;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
      edgeTraversed[edgeHighlighted] = true;

      currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
      currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

      currentState["status"] = "Go left to check for smaller value..."
      currentState["lineNo"] = 3;

      stateList.push(currentState);
    }

    // End state

    currentState = createState(internalBst);
    currentState["status"] = "Find Min has ended. The minimum value is "+ans+".";
	currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(2);
    return true;
  }

  this.findMax = function(){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
	  var ans;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;

    stateList.push(currentState);

    if(currentVertex == null){
      currentState = createState(internalBst);
      currentState["status"] = "Tree is empty, there is no maximum value.";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
	    graphWidget.startAnimation(stateList);
	    return true;
    }

    while(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;

      if(internalBst[currentVertex]["rightChild"] != null){
        currentState["status"] = currentVertex+" is not the maximum value as it has a right child."
        currentState["lineNo"] = 2;
      }
      else{
		    ans = currentVertex;
        currentState["status"] = "Maximum value found!"
        currentState["lineNo"] = 4;
      }

      currentVertex = internalBst[currentVertex]["rightChild"];

      stateList.push(currentState);

      if(currentVertex == null) break;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
      edgeTraversed[edgeHighlighted] = true;

      currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
      currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

      currentState["status"] = "Go right to check for larger value..."
      currentState["lineNo"] = 3;

      stateList.push(currentState);
    }

    // End state

    currentState = createState(internalBst);
    currentState["status"] = "Find Max has ended. The maximum value is "+ans+".";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(1);
    return true;
  }

  this.findSuccessor = function(vertexText){
    vertexText = parseInt(vertexText);

    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = vertexText;
    var currentState = createState(internalBst);
    var currentVertexClass;
    var vertexTextClass;
    var key;
    var ans;

    if(vertexText == null || vertexText == undefined || isNaN(vertexText)){
      $('#successor-err').html("Please fill in a valid value!");
      return false;
    }

    if(internalBst[vertexText] == null){
      $('#successor-err').html("Please fill in a value present inside the BST!");
      return false;
    }

    vertexTextClass = internalBst[vertexText]["vertexClassNumber"];

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;

    stateList.push(currentState);

    if(internalBst[vertexText]["rightChild"] != null){
      var rightChildVertex = internalBst[vertexText]["rightChild"];
      var rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];

      edgeTraversed[rightChildVertexClass] = true;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["el"][rightChildVertexClass]["animateHighlighted"] = true;
      currentState["status"] = "Vertex has right child, so go right.";
      currentState["lineNo"] = 0;
      stateList.push(currentState);

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = "Check whether right child has left child..";
      currentState["lineNo"] = 0;
      stateList.push(currentState);

      if(internalBst[rightChildVertex]["leftChild"] != null){
        currentVertex = rightChildVertex;
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Left child found! Go to the left..";
        currentState["lineNo"] = 0;
        stateList.push(currentState);

        while(internalBst[currentVertex]["leftChild"] != null){
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

          vertexTraversed[currentVertex] = true;

          currentState["status"] = currentVertex + " is not the successor vertex as it has a left child."
          currentState["lineNo"] = 0;

          stateList.push(currentState);

          currentVertex = internalBst[currentVertex]["leftChild"];
          currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

          currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          var edgeHighlighted = currentVertexClass;
          edgeTraversed[edgeHighlighted] = true;

          currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
          currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

          currentState["status"] = "Go left to check for smaller value..."
          currentState["lineNo"] = 0;

          stateList.push(currentState);
        }

        ans = currentVertex;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "Successor found!";
        currentState["lineNo"] = 0;
        stateList.push(currentState);
      }

      else{
        ans = rightChildVertex;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = "No left child found, so this vertex is the successor.";
        currentState["lineNo"] = 0;
        stateList.push(currentState);
      }
    }

    else{
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      edgeTraversed[currentVertexClass] = true;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["el"][currentVertexClass]["state"] = EDGE_HIGHLIGHTED;
      currentState["status"] = "No right child found, so check the parent..";
      currentState["lineNo"] = 0;
      stateList.push(currentState);

      currentVertex = internalBst[currentVertex]["parent"];
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      while(true){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        vertexTraversed[currentVertex] = true;

        if(currentVertex < vertexText){
          currentState["status"] = currentVertex + " is not the successor vertex as " + vertexText + " is part of the right sub-tree";
          currentState["lineNo"] = 0;
          stateList.push(currentState);
        }

        else{
          ans = currentVertex;

          currentState["status"] = "Successor found!";
          currentState["lineNo"] = 0;
          stateList.push(currentState);
          break;
        }

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var edgeHighlighted = currentVertexClass;
        if(currentVertex != internalBst["root"]) edgeTraversed[edgeHighlighted] = true;

        currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
        if(currentVertex != internalBst["root"]) currentState["el"][edgeHighlighted]["state"] = EDGE_HIGHLIGHTED;

        currentState["status"] = "Go up to check for smaller value..."
        currentState["lineNo"] = 0;

        stateList.push(currentState);

        currentVertex = internalBst[currentVertex]["parent"];

        if(currentVertex == null) break;

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      }

      if(currentVertex == null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][vertexTextClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["status"] = currentVertex + " has no parent, so " + vertexText + " has no successor.";
        currentState["lineNo"] = 0;
        stateList.push(currentState);

        ans = null;
      }
    }

    // End state
    currentState = createState(internalBst);
    if(ans != null) currentState["status"] = "Find successor has ended. The successor of " + vertexText + " is " + ans + ".";
    else currentState["status"] = "Find successor has ended. " + vertexText + " has no successor.";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(1);
    return true;
  }

  this.inorderTraversal = function(){
    var stateList = [];
    var vertexTraversed = {};
    var vertexHighlighted = {};
    var edgeTraversed = {};
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;

    stateList.push(currentState);

    if(internalBst["root"] == null){
      currentState = createState(internalBst);
      currentState["status"] = "Tree is empty.";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
	  
	  currentState = createState(internalBst);
      currentState["status"] = "Return empty.";
      currentState["lineNo"] = 2;
      stateList.push(currentState);
	  return true;
    }

    else {
      currentVertexClass = internalBst[internalBst["root"]]["vertexClassNumber"];

      currentState = createState(internalBst);
      currentState["vl"][currentVertexClass]["state"] = VERTEX_TRAVERSED;
      currentState["status"] = "The root "+internalBst["root"]+ " is not null";
      currentState["lineNo"] = 1;

      stateList.push(currentState);
	  
      currentState = createState(internalBst);
      currentState["vl"][currentVertexClass]["state"] = VERTEX_TRAVERSED;
      currentState["status"] = "So recurse and check left child of "+internalBst["root"];
      currentState["lineNo"] = 3;
      stateList.push(currentState);
	  
	  inorderTraversalRecursion(internalBst["root"]);
	}

    currentState = createState(internalBst);
    currentState["status"] = "In-order traversal of the whole BST is complete.";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);

    function inorderTraversalRecursion(currentVertex){
      var currentVertexLeftChild = internalBst[currentVertex]["leftChild"];
      var currentVertexRightChild = internalBst[currentVertex]["rightChild"];
      var currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      if(currentVertexLeftChild == null) {
		  vertexTraversed[currentVertex] = true;
		  currentState = createState(internalBst, vertexTraversed, edgeTraversed);
		  inorderHighlightVertex();
      	  currentState["status"] = "Left child of "+currentVertex+" is empty";
		  currentState["lineNo"] = 1;
		  stateList.push(currentState);
		  
		  currentState = createState(internalBst, vertexTraversed, edgeTraversed);
		  inorderHighlightVertex();
      	  currentState["status"] = "Return empty";
		  currentState["lineNo"] = 2;
		  stateList.push(currentState);
	  } else {
        var currentVertexLeftChildClass = internalBst[currentVertexLeftChild]["vertexClassNumber"];

        vertexTraversed[currentVertex] = true;
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        inorderHighlightVertex();
        currentState["status"] = "Left child of "+currentVertex+" is "+currentVertexLeftChild+" (not null)";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
        edgeTraversed[currentVertexLeftChildClass] = true;
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["el"][currentVertexLeftChildClass]["animateHighlighted"] = true;
        inorderHighlightVertex();
        currentState["status"] = "So recurse and check left child of "+currentVertexLeftChild;
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        inorderTraversalRecursion(currentVertexLeftChild);
      }

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      vertexHighlighted[currentVertexClass] = true;
      inorderHighlightVertex();
      currentState["status"] = "Visit node "+currentVertex+".";
      currentState["lineNo"] = 4;
      stateList.push(currentState);

      if(currentVertexRightChild == null) {
		  vertexTraversed[currentVertex] = true;
		  currentState = createState(internalBst, vertexTraversed, edgeTraversed);
		  inorderHighlightVertex();
      	  currentState["status"] = "Right child of "+currentVertex+" is empty";
		  currentState["lineNo"] = 1;
		  stateList.push(currentState);
		  
		  currentState = createState(internalBst, vertexTraversed, edgeTraversed);
		  inorderHighlightVertex();
      	  currentState["status"] = "Return empty";
		  currentState["lineNo"] = 2;
		  stateList.push(currentState);
	  } else {
        var currentVertexRightChildClass = internalBst[currentVertexRightChild]["vertexClassNumber"];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        inorderHighlightVertex();
        currentState["status"] = "Right child of "+currentVertex+" is "+currentVertexRightChild+" (not null)";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
        edgeTraversed[currentVertexRightChildClass] = true;
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["el"][currentVertexRightChildClass]["animateHighlighted"] = true;
        inorderHighlightVertex();
        currentState["status"] = "So recurse and check left child of "+currentVertexRightChild;
        currentState["lineNo"] = 3;
        stateList.push(currentState);
        inorderTraversalRecursion(currentVertexRightChild);
      }

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      if(currentVertex != internalBst["root"]) currentState["el"][currentVertexClass]["state"] = EDGE_HIGHLIGHTED;
      inorderHighlightVertex();
    
      currentState["status"] = "In-order traversal of "+currentVertex+" is complete";
      currentState["lineNo"] = 0;
      stateList.push(currentState);
    }

    function inorderHighlightVertex(){
      var key;

      for(key in vertexHighlighted){
        currentState["vl"][key]["state"] = VERTEX_HIGHLIGHTED; 
      }
    }
    populatePseudocode(3);
    return true;
  }

  this.insertArr = function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    // Check whether input is array
    if(Object.prototype.toString.call(vertexTextArr) != '[object Array]'){
      $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
      return false;
    }

    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion
    
    for(i = 0; i < vertexTextArr.length; i++){
      var vt = parseInt(vertexTextArr[i]);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }

      // 4. Insert the node into temporary internal structure and check for height
      var parentVertex = tempInternalBst["root"];
      var heightCounter = 0;

      if(parentVertex == null){
        tempInternalBst["root"] = parseInt(vt);
        tempInternalBst[vt] = {
          "parent": null,
          "leftChild": null,
          "rightChild": null
        };
      }

      else{
        while(true){
          heightCounter++;
          if(parentVertex < vt){
            if(tempInternalBst[parentVertex]["rightChild"] == null) break;
            parentVertex = tempInternalBst[parentVertex]["rightChild"];
          }
          else{
            if(tempInternalBst[parentVertex]["leftChild"] == null) break;
            parentVertex = tempInternalBst[parentVertex]["leftChild"];
          }
        }

        if(parentVertex < vt) tempInternalBst[parentVertex]["rightChild"] = vt;
        else tempInternalBst[parentVertex]["leftChild"] = vt;

        tempInternalBst[vt] = {
          "parent": parentVertex,
          "leftChild":null,
          "rightChild": null
        }
      }

      heightCounter++; // New vertex added will add new height

      if(heightCounter > maxHeightAllowed){
        $('#insert-err').html("Sorry, this visualization can only support tree of maximum height " + maxHeightAllowed);
        return false;
      }
    }

    function checkNewHeight(){
      var parentVertex = tempInternalBst["root"];
      var heightCounter = 0;

      while(parentVertex != null){
        if(parentVertex < parseInt(vertexText)) parentVertex = tempInternalBst[parentVertex]["rightChild"];
        else parentVertex = tempInternalBst[parentVertex]["leftChild"];
        heightCounter++;
      }

      heightCounter++; // New vertex added will add new height

      if(heightCounter > maxHeightAllowed) return false;
      return true;
    }

    for(i = 0; i < vertexTextArr.length; i++){
      var vertexText = parseInt(vertexTextArr[i]);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Find parent
      while(currentVertex != vertexText && currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        vertexTraversed[currentVertex] = true;

        currentState["status"] = "Comparing " + vertexText + " with "+currentVertex;
		if(!isAVL) {
        	currentState["lineNo"] = 3;
		} else {
			currentState["lineNo"] = 1;
		}

        stateList.push(currentState);

        var nextVertex;
        if(parseInt(vertexText) > parseInt(currentVertex)) nextVertex = internalBst[currentVertex]["rightChild"];
        else nextVertex = internalBst[currentVertex]["leftChild"];

        if(nextVertex == null) break;
        else currentVertex = nextVertex;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;

        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

        if(parseInt(vertexText) > parseInt(internalBst[currentVertex]["parent"])){
          currentState["status"] = vertexText + " is larger than " + internalBst[currentVertex]["parent"] + ", so go right.";
			if(!isAVL) {
			  currentState["lineNo"] = 5;
			} else {
			  currentState["lineNo"] = 1;
			}
        }
        else{
          currentState["status"] = vertexText + " is smaller than " + internalBst[currentVertex]["parent"] + ", so go left.";
          if(!isAVL) {
		  	currentState["lineNo"] = 4;
		  } else {
			 currentState["lineNo"] = 1;
		  }
        }
        

        stateList.push(currentState);
      }

      // Begin insertion

      // First, update internal representation

      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": amountVertex
      };

      if(currentVertex != null){
        internalBst[parseInt(vertexText)]["parent"] = currentVertex;
        if(currentVertex < parseInt(vertexText)) internalBst[currentVertex]["rightChild"] = parseInt(vertexText);
        else internalBst[currentVertex]["leftChild"] = parseInt(vertexText);
      }

      else{
        internalBst[parseInt(vertexText)]["parent"] = null;
        internalBst["root"] = parseInt(vertexText);
      }

      amountVertex++;

      recalculatePosition();

      // Then, draw edge
      var newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];

      if(currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][newNodeVertexClass]["state"] = OBJ_HIDDEN;

        currentState["el"][newNodeVertexClass]["state"] = EDGE_TRAVERSED;
        currentState["el"][newNodeVertexClass]["animateHighlighted"] = true;

        currentState["status"] = "Location found! Inserting " + vertexText + " ...";
        currentState["lineNo"] = 1;

        stateList.push(currentState);

        edgeTraversed[newNodeVertexClass] = true;
      }

      // Lastly, draw vertex

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = EDGE_HIGHLIGHTED;

      currentState["status"] = vertexText + " has been inserted!"
	  if (!isAVL) {
		  currentState["lineNo"] = 2;
	  } else {
		  currentState["lineNo"] = 1;
	  }

      stateList.push(currentState);

      // End State
      currentState = createState(internalBst);
      currentState["status"] = "Insert " + vertexText + " has been completed."
	  if(isAVL) {
	  	currentState["lineNo"] = 1;
	  }
      stateList.push(currentState);

      if(isAVL){
        recalculateBalanceFactor();

        var vertexCheckBf = internalBst[vertexText]["parent"];

        while(vertexCheckBf != null){
          var vertexCheckBfClass = internalBst[vertexCheckBf]["vertexClassNumber"];

		   var bf = internalBst[vertexCheckBf]["balanceFactor"];
		
          currentState = createState(internalBst);
          currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["status"] = "Balance factor of " + vertexCheckBf + " is "+bf+".";
		  currentState["lineNo"] = 2;
          stateList.push(currentState);

          if(bf == 2){
            var vertexCheckBfLeft = internalBst[vertexCheckBf]["leftChild"];
            var vertexCheckBfLeftClass = internalBst[vertexCheckBfLeft]["vertexClassNumber"];
            var bfLeft = internalBst[vertexCheckBfLeft]["balanceFactor"];
			
			currentState = createState(internalBst);
          	currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
			currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
          	currentState["status"] = "And balance factor of " + vertexCheckBfLeft + " is "+bfLeft+".";
		  	currentState["lineNo"] = 2;
          	stateList.push(currentState);

            if(bfLeft == 1 || bfLeft == 0){				
              rotateRight(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeft) currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate right " + vertexCheckBf + ".";
			  currentState["lineNo"] = 3;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeft) currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 3;
              stateList.push(currentState);
            }

            else if(bfLeft == -1){
              var vertexCheckBfLeftRight = internalBst[vertexCheckBfLeft]["rightChild"];
              var vertexCheckBfLeftRightClass = internalBst[vertexCheckBfLeftRight]["vertexClassNumber"];

              rotateLeft(vertexCheckBfLeft);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate left " + vertexCheckBfLeft + ".";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);

              rotateRight(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeftRight) currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate right " + vertexCheckBf + ".";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeftRight) currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);
            }
          }

          else if(bf == -2){
            var vertexCheckBfRight = internalBst[vertexCheckBf]["rightChild"];
            var vertexCheckBfRightClass = internalBst[vertexCheckBfRight]["vertexClassNumber"];
            var bfRight = internalBst[vertexCheckBfRight]["balanceFactor"];
			
			currentState = createState(internalBst);
          	currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
			currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
          	currentState["status"] = "And balance factor of " + vertexCheckBfRight + " is "+bfRight+".";
		  	currentState["lineNo"] = 2;
          	stateList.push(currentState);

            if(bfRight == 1){
              var vertexCheckBfRightLeft = internalBst[vertexCheckBfRight]["leftChild"];
              var vertexCheckBfRightLeftClass = internalBst[vertexCheckBfRightLeft]["vertexClassNumber"];

              rotateRight(vertexCheckBfRight);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate right " + vertexCheckBfRight + ".";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);

              rotateLeft(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRightLeft) currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate left " + vertexCheckBf + ".";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRightLeft) currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);
            }

            else if(bfRight == -1 || bfRight == 0){
              rotateLeft(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRight) currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate left " + vertexCheckBf + ".";
			  currentState["lineNo"] = 5;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);

              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRight) currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 5;
              stateList.push(currentState);
            }
          }

          if(vertexCheckBf != internalBst["root"]){
            currentState = createState(internalBst);
            currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
            currentState["status"] = "Check the parent vertex...";
			currentState["lineNo"] = 2;
            stateList.push(currentState);
          }

          vertexCheckBf = internalBst[vertexCheckBf]["parent"];
        }

        currentState = createState(internalBst);
        currentState["status"] = "The tree is now balanced.";
		currentState["lineNo"] = 7;
        stateList.push(currentState);
      }
    }

    graphWidget.startAnimation(stateList);
	if(isAVL) {
    	populatePseudocode(6);
	} else {
		populatePseudocode(0);
	}
    return true;
  }

  this.removeArr = function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    if(Object.prototype.toString.call(vertexTextArr) != '[object Array]'){
      $('#remove-err').html("Please fill in a number or comma-separated array of numbers!");
      return false;
    }

    // Loop through all array values and...
    
    for(i = 0; i < vertexTextArr.length; i++){
      var vt = parseInt(vertexTextArr[i]);

      // Check whether value is number
      if(isNaN(vt)){
        $('#remove-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // Other checks not required
    }

    for(i = 0; i < vertexTextArr.length; i++){
      var vertexText = parseInt(vertexTextArr[i]);
      var vertexCheckBf;

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Find vertex
      while(currentVertex != vertexText && currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        vertexTraversed[currentVertex] = true;
        
        currentState["status"] = "Searching for node "+vertexText+" to remove";
        currentState["lineNo"] = 1;
        stateList.push(currentState);

        if(parseInt(vertexText) > parseInt(currentVertex)) currentVertex = internalBst[currentVertex]["rightChild"];
        else currentVertex = internalBst[currentVertex]["leftChild"];

        if(currentVertex == null) break;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;

        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

        currentState["status"] = "Searching for node "+vertexText+" to remove";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
      }

      if(currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["status"] = "Searching for node "+vertexText+" to remove";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
      }

      // Vertex is not inside the tree
      else{
        currentState = createState(internalBst);
        currentState["status"] = "Node " + vertexText + " is not in the BST";
        currentState["lineNo"] = 0;
        stateList.push(currentState);
        continue;
      }

      // Vertex found; begin deletion

      // Case 1: no child

      if(internalBst[currentVertex]["leftChild"] == null && internalBst[currentVertex]["rightChild"] == null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = "Node "+vertexText+" has no children. It is a leaf.";
		if(!isAVL) {
        	currentState["lineNo"] = 2;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);
      
        var parentVertex = internalBst[currentVertex]["parent"];

        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = null;
          else internalBst[parentVertex]["leftChild"] = null;
        }

        else internalBst["root"] = null;

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["status"] = "Remove leaf "+vertexText;
		if(!isAVL) {
        	currentState["lineNo"] = 3;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        vertexCheckBf = parentVertex;
      }

      // Case 2: One child

      // Only right child

      else if(internalBst[currentVertex]["leftChild"] == null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = "Node "+vertexText+" has a right child only";
		if(!isAVL) {
        	currentState["lineNo"] = 4;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);
      
        var parentVertex = internalBst[currentVertex]["parent"];
        var rightChildVertex = internalBst[currentVertex]["rightChild"];

        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = rightChildVertex;
          else internalBst[parentVertex]["leftChild"] = rightChildVertex;
        }

        else internalBst["root"] = rightChildVertex;

        internalBst[rightChildVertex]["parent"] = parentVertex;

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        if(parentVertex != null){
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Delete node "+vertexText+" and connect its parent to its right child";
		if(!isAVL) {
        	currentState["lineNo"] = 5;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        if(parentVertex != null){
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Re-layout the tree";
		if(!isAVL) {
        	currentState["lineNo"] = 5;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        vertexCheckBf = rightChildVertex;
      }

      // Only left child

      else if(internalBst[currentVertex]["rightChild"] == null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["status"] = "Node "+vertexText+" has a left child only";
	  if(!isAVL) {
      	currentState["lineNo"] = 4;
	  } else {
		  currentState["lineNo"] = 1;
	  }
      stateList.push(currentState);
      
        var parentVertex = internalBst[currentVertex]["parent"];
        var leftChildVertex = internalBst[currentVertex]["leftChild"];

        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = leftChildVertex;
          else internalBst[parentVertex]["leftChild"] = leftChildVertex;
        }

        else internalBst["root"] = leftChildVertex;

        internalBst[leftChildVertex]["parent"] = parentVertex;

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        if(parentVertex != null){
          currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Delete node "+vertexText+" and connect its parent to its left child";
		if(!isAVL) {
        	currentState["lineNo"] = 5;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        
        if(parentVertex != null){
          currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Re-layout the tree";
		if(!isAVL) {
        	currentState["lineNo"] = 5;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        vertexCheckBf = leftChildVertex;
      }
      
      // Case 3: two children

      else{
        var parentVertex = internalBst[currentVertex]["parent"];
        var leftChildVertex = internalBst[currentVertex]["leftChild"];
        var rightChildVertex = internalBst[currentVertex]["rightChild"];
        var successorVertex = internalBst[currentVertex]["rightChild"];
        var successorVertexClass = internalBst[successorVertex]["vertexClassNumber"];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
        currentState["el"][successorVertexClass]["animateHighlighted"] = true;

        currentState["status"] = "Finding successor of "+vertexText;
		if(!isAVL) {
        	currentState["lineNo"] = 6;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        edgeTraversed[successorVertexClass] = true;
        vertexTraversed[successorVertex] = true;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["status"] = "Finding successor of "+vertexText;
		if(!isAVL) {
        	currentState["lineNo"] = 6;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        while(internalBst[successorVertex]["leftChild"] != null){
          successorVertex = internalBst[successorVertex]["leftChild"];
          successorVertexClass = internalBst[successorVertex]["vertexClassNumber"];

          currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

          currentState["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
          currentState["el"][successorVertexClass]["animateHighlighted"] = true;

          currentState["status"] = "Finding successor of "+vertexText;
		  if(!isAVL) {
          	  currentState["lineNo"] = 6;
		  } else {
			  currentState["lineNo"] = 1;
		  }
          stateList.push(currentState);

          edgeTraversed[successorVertexClass] = true;
          vertexTraversed[successorVertex] = true;

          currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

          currentState["status"] = "Finding successor of "+vertexText;
		   if(!isAVL) {
          	  currentState["lineNo"] = 6;
		  } else {
			  currentState["lineNo"] = 1;
		  }
          stateList.push(currentState);
        }

        var successorParentVertex = internalBst[successorVertex]["parent"]
        var successorRightChildVertex = internalBst[successorVertex]["rightChild"];

        // Update internal representation
        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = successorVertex;
          else internalBst[parentVertex]["leftChild"] = successorVertex;
        }

        else internalBst["root"] = successorVertex;

        internalBst[successorVertex]["parent"] = parentVertex;
        internalBst[successorVertex]["leftChild"] = leftChildVertex;

        internalBst[leftChildVertex]["parent"] = successorVertex;

        if(successorVertex != rightChildVertex){
          internalBst[successorVertex]["rightChild"] = rightChildVertex;
          internalBst[rightChildVertex]["parent"] = successorVertex;

          if(successorRightChildVertex != null){
            if(parseInt(successorParentVertex) < parseInt(successorVertex)) internalBst[successorParentVertex]["rightChild"] = successorRightChildVertex;
            else internalBst[successorParentVertex]["leftChild"] = successorRightChildVertex;

            internalBst[successorRightChildVertex]["parent"] = successorParentVertex;
          }

          else{
            if(parseInt(successorParentVertex) < parseInt(successorVertex)) internalBst[successorParentVertex]["rightChild"] = null;
            else internalBst[successorParentVertex]["leftChild"] = null;
          }
        }

        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        if(parentVertex == null){
          delete edgeTraversed[successorVertexClass];
        }

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];

        currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

        if(parentVertex != null){
          var parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
          currentState["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        if(successorVertex != rightChildVertex){
          var rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

          if(successorRightChildVertex != null){
            var successorRightChildVertexClass = internalBst[successorRightChildVertex]["vertexClassNumber"];
            currentState["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          }
        }

        currentState["status"] = "Replace node "+vertexText+" with its successor";
         if(!isAVL) {
          	  currentState["lineNo"] = 6;
		  } else {
			  currentState["lineNo"] = 1;
		  }
        stateList.push(currentState);

        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];

        currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

        if(parentVertex != null){
          var parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
          currentState["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        if(successorVertex != rightChildVertex){
          var rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

          if(successorRightChildVertex != null){
            var successorRightChildVertexClass = internalBst[successorRightChildVertex]["vertexClassNumber"];
            currentState["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          }
        }

        currentState["status"] = "Re-layout the tree";
		if(!isAVL) {
			currentState["lineNo"] = 6;
		} else {
			currentState["lineNo"] = 1;
		}
        stateList.push(currentState);

        vertexCheckBf = successorVertex;
        if(successorVertex != rightChildVertex) vertexCheckBf = successorParentVertex;
      }

      currentState = createState(internalBst);
      currentState["status"] = "Removal of "+vertexText+" completed";
	  if(!isAVL) {
		currentState["lineNo"] = 0;
	  } else {
		currentState["lineNo"] = 1;
	  }
      stateList.push(currentState);

      if(isAVL){
        recalculateBalanceFactor();
        console.log(internalBst);

        while(vertexCheckBf != null){
          var vertexCheckBfClass = internalBst[vertexCheckBf]["vertexClassNumber"];

		  var bf = internalBst[vertexCheckBf]["balanceFactor"];

          currentState = createState(internalBst);
          currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["status"] = "Balance factor of " + vertexCheckBf + " is "+bf+".";
		  currentState["lineNo"] = 2;
          stateList.push(currentState);

          if(bf == 2){
            var vertexCheckBfLeft = internalBst[vertexCheckBf]["leftChild"];
            var vertexCheckBfLeftClass = internalBst[vertexCheckBfLeft]["vertexClassNumber"];
            var bfLeft = internalBst[vertexCheckBfLeft]["balanceFactor"];
			
			currentState = createState(internalBst);
          	currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
			currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
          	currentState["status"] = "And balance factor of " + vertexCheckBfLeft + " is "+bfLeft+".";
		  	currentState["lineNo"] = 2;
          	stateList.push(currentState);

            if(bfLeft == 1 || bfLeft == 0){
              rotateRight(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeft) currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate right " + vertexCheckBf + ".";
			  currentState["lineNo"] = 3;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeft) currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 3;
              stateList.push(currentState);
            }

            else if(bfLeft == -1){
              var vertexCheckBfLeftRight = internalBst[vertexCheckBfLeft]["rightChild"];
              var vertexCheckBfLeftRightClass = internalBst[vertexCheckBfLeftRight]["vertexClassNumber"];

              rotateLeft(vertexCheckBfLeft);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate left " + vertexCheckBfLeft + ".";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);

              rotateRight(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeftRight) currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate right " + vertexCheckBf + ".";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfLeftRight) currentState["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 4;
              stateList.push(currentState);
            }
          }

          else if(bf == -2){
            var vertexCheckBfRight = internalBst[vertexCheckBf]["rightChild"];
            var vertexCheckBfRightClass = internalBst[vertexCheckBfRight]["vertexClassNumber"];
            var bfRight = internalBst[vertexCheckBfRight]["balanceFactor"];
			
			currentState = createState(internalBst);
          	currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
			currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
          	currentState["status"] = "And balance factor of " + vertexCheckBfRight + " is "+bfRight+".";
		  	currentState["lineNo"] = 2;
          	stateList.push(currentState);

            if(bfRight == 1){
              var vertexCheckBfRightLeft = internalBst[vertexCheckBfRight]["leftChild"];
              var vertexCheckBfRightLeftClass = internalBst[vertexCheckBfRightLeft]["vertexClassNumber"];

              rotateRight(vertexCheckBfRight);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate right " + vertexCheckBfRight + ".";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);

              rotateLeft(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRightLeft) currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate left " + vertexCheckBf + ".";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRightLeft) currentState["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 6;
              stateList.push(currentState);
            }

            else if(bfRight == -1 || bfRight == 0){
              rotateLeft(vertexCheckBf);

              currentState = createState(internalBst);
              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRight) currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Rotate left " + vertexCheckBf + ".";
			  currentState["lineNo"] = 5;
              stateList.push(currentState);

              recalculatePosition();

              currentState = createState(internalBst);

              currentState["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              if(internalBst["root"] != vertexCheckBfRight) currentState["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
              currentState["status"] = "Relayout the tree.";
			  currentState["lineNo"] = 5;
              stateList.push(currentState);
            }
          }

          if(vertexCheckBf != internalBst["root"]){
            currentState = createState(internalBst);
            currentState["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
            currentState["status"] = "Check the parent vertex...";
			currentState["lineNo"] = 2;
            stateList.push(currentState);
          }

          vertexCheckBf = internalBst[vertexCheckBf]["parent"];
        }

        currentState = createState(internalBst);
        currentState["status"] = "The tree is now balanced.";
		currentState["lineNo"] = 7;
        stateList.push(currentState);
      }
    }

    graphWidget.startAnimation(stateList);
	if(isAVL) {
    	populatePseudocode(7);
	} else {
		populatePseudocode(5);
	}
    return true;
  }

  function init(initArr){
    var i;

    for(i = 0; i < initArr.length; i++){
      var parentVertex = internalBst["root"];
      var newVertex = parseInt(initArr[i]);

      if(parentVertex == null){
        internalBst["root"] = parseInt(newVertex);
        internalBst[newVertex] = {
          "parent": null,
          "leftChild": null,
          "rightChild": null,
          "vertexClassNumber": amountVertex
        };
      }

      else{
        while(true){
          if(parentVertex < newVertex){
            if(internalBst[parentVertex]["rightChild"] == null) break;
            parentVertex = internalBst[parentVertex]["rightChild"];
          }
          else{
            if(internalBst[parentVertex]["leftChild"] == null) break;
            parentVertex = internalBst[parentVertex]["leftChild"];
          }
        }

        if(parentVertex < newVertex) internalBst[parentVertex]["rightChild"] = newVertex;
        else internalBst[parentVertex]["leftChild"] = newVertex;

        internalBst[newVertex] = {
          "parent": parentVertex,
          "leftChild":null,
          "rightChild": null,
          "vertexClassNumber": amountVertex
        }
      }

      amountVertex++;
    }

    recalculatePosition();

    for(key in internalBst){
      if(key == "root") continue;
      graphWidget.addVertex(internalBst[key]["cx"], internalBst[key]["cy"], key, internalBst[key]["vertexClassNumber"], true);
    }

    for(key in internalBst){
      if(key == "root") continue;
      if(key == internalBst["root"]) continue;
      var parentVertex = internalBst[key]["parent"];
      graphWidget.addEdge(internalBst[parentVertex]["vertexClassNumber"], internalBst[key]["vertexClassNumber"], internalBst[key]["vertexClassNumber"], EDGE_TYPE_UDE, 1, true);
    }
  }

  function clearScreen(){
    var key;

    for(key in internalBst){
      if(key == "root") continue;
      graphWidget.removeEdge(internalBst[key]["vertexClassNumber"]);
    }

    for(key in internalBst){
      if(key == "root") continue;
      graphWidget.removeVertex(internalBst[key]["vertexClassNumber"]);
    }

    internalBst = {};
    internalBst["root"] = null;
    amountVertex = 0;
  }

  // Pseudocode for rotateLeft:
  /*
   * BSTVertex rotateLeft(BSTVertex T) // pre-req: T.right != null
   * BSTVertex w = T.right
   * w.parent = T.parent
   * T.parent = w
   * T.right = w.left
   * if (w.left != null) w.left.parent = T
   * w.left = T
   * // Update the height of T and then w
   * return w
   */

  function rotateLeft(vertexText){
    // Refer to pseudocode

    var t = parseInt(vertexText);
    var w = internalBst[t]["rightChild"];

    internalBst[w]["parent"] = internalBst[t]["parent"];
    if(internalBst[t]["parent"] != null){
      if(internalBst[t]["parent"] < t){
        var tParent = internalBst[t]["parent"];
        internalBst[tParent]["rightChild"] = w;
      }

      else{
        var tParent = internalBst[t]["parent"];
        internalBst[tParent]["leftChild"] = w;
      }
    }

    internalBst[t]["parent"] = w;
    internalBst[t]["rightChild"] = internalBst[w]["leftChild"];
    if (internalBst[w]["leftChild"] != null) internalBst[internalBst[w]["leftChild"]]["parent"] = t;
    internalBst[w]["leftChild"] = t;

    if(t == internalBst["root"]) internalBst["root"] = w;

    recalculateBalanceFactor();
  }

  function rotateRight(vertexText){
    // Refer to pseudocode

    var t = parseInt(vertexText);
    var w = internalBst[t]["leftChild"];

    internalBst[w]["parent"] = internalBst[t]["parent"];
    if(internalBst[t]["parent"] != null){
      if(internalBst[t]["parent"] < t){
        var tParent = internalBst[t]["parent"];
        internalBst[tParent]["rightChild"] = w;
      }

      else{
        var tParent = internalBst[t]["parent"];
        internalBst[tParent]["leftChild"] = w;
      }
    }

    internalBst[t]["parent"] = w;
    internalBst[t]["leftChild"] = internalBst[w]["rightChild"];
    if (internalBst[w]["rightChild"] != null) internalBst[internalBst[w]["rightChild"]]["parent"] = t;
    internalBst[w]["rightChild"] = t;

    if(t == internalBst["root"]) internalBst["root"] = w;

    recalculateBalanceFactor();
  }

  /*
   * internalBstObject: a JS object with the same structure of internalBst. This means the BST doen't have to be the BST stored in this class
   * vertexTraversed: JS object with the vertexes of the BST which are to be marked as traversed as the key
   * edgeTraversed: JS object with the edges of the BST which are to be marked as traversed as the key
   */

  function createState(internalBstObject, vertexTraversed, edgeTraversed){
    if(vertexTraversed == null || vertexTraversed == undefined || !(vertexTraversed instanceof Object))
      vertexTraversed = {};
    if(edgeTraversed == null || edgeTraversed == undefined || !(edgeTraversed instanceof Object))
      edgeTraversed = {};

    var state = {
      "vl":{},
      "el":{}
    };

    var key;
    var vertexClass;

    for(key in internalBstObject){
      if(key == "root") continue;

      vertexClass = internalBstObject[key]["vertexClassNumber"]

      state["vl"][vertexClass] = {};

      state["vl"][vertexClass]["cx"] = internalBstObject[key]["cx"];
      state["vl"][vertexClass]["cy"] = internalBstObject[key]["cy"];
      state["vl"][vertexClass]["text"] = key;
      state["vl"][vertexClass]["state"] = VERTEX_DEFAULT;

      if(internalBstObject[key]["parent"] == null) continue;

      parentChildEdgeId = internalBstObject[key]["vertexClassNumber"];

      state["el"][parentChildEdgeId] = {};

      state["el"][parentChildEdgeId]["vertexA"] = internalBstObject[internalBstObject[key]["parent"]]["vertexClassNumber"];
      state["el"][parentChildEdgeId]["vertexB"] = internalBstObject[key]["vertexClassNumber"];
      state["el"][parentChildEdgeId]["type"] = EDGE_TYPE_UDE;
      state["el"][parentChildEdgeId]["weight"] = 1;
      state["el"][parentChildEdgeId]["state"] = EDGE_DEFAULT;
      state["el"][parentChildEdgeId]["animateHighlighted"] = false;
    }

    for(key in vertexTraversed){
      vertexClass = internalBstObject[key]["vertexClassNumber"];
      state["vl"][vertexClass]["state"] = VERTEX_TRAVERSED;
    }

    for(key in edgeTraversed){
      state["el"][key]["state"] = EDGE_TRAVERSED;
    }

    return state;
  }

  function recalculatePosition(){
    calcHeight(internalBst["root"], 0);
    updatePosition(internalBst["root"]);

    function calcHeight(currentVertex, currentHeight){
      if(currentVertex == null) return;
      internalBst[currentVertex]["height"] = currentHeight;
      calcHeight(internalBst[currentVertex]["leftChild"], currentHeight + 1);
      calcHeight(internalBst[currentVertex]["rightChild"], currentHeight + 1);
    }

    function updatePosition(currentVertex){
      if(currentVertex == null) return;

      if(currentVertex == internalBst["root"]) internalBst[currentVertex]["cx"] = MAIN_SVG_WIDTH/2;
      else{
        var i;
        var xAxisOffset = MAIN_SVG_WIDTH/2;
        var parentVertex = internalBst[currentVertex]["parent"]
        for(i = 0; i < internalBst[currentVertex]["height"]; i++){
          xAxisOffset /= 2;
        }

        if(parseInt(currentVertex) > parseInt(parentVertex))
          internalBst[currentVertex]["cx"] = internalBst[parentVertex]["cx"] + xAxisOffset;
        else internalBst[currentVertex]["cx"] = internalBst[parentVertex]["cx"] - xAxisOffset;
      }

      internalBst[currentVertex]["cy"] = 50 + 50*internalBst[currentVertex]["height"];

      updatePosition(internalBst[currentVertex]["leftChild"]);
      updatePosition(internalBst[currentVertex]["rightChild"]);
    }
  }

  function recalculateBalanceFactor(){
    balanceFactorRecursion(internalBst["root"]);

    function balanceFactorRecursion(vertexText){
      if(vertexText == null) return -1;

      var balanceFactorHeightLeft = balanceFactorRecursion(internalBst[vertexText]["leftChild"]);
      var balanceFactorHeightRight = balanceFactorRecursion(internalBst[vertexText]["rightChild"]);

      internalBst[vertexText]["balanceFactorHeight"] = Math.max(balanceFactorHeightLeft, balanceFactorHeightRight) + 1;
      internalBst[vertexText]["balanceFactor"] = balanceFactorHeightLeft - balanceFactorHeightRight;

      return internalBst[vertexText]["balanceFactorHeight"];
    }
  }
  
  function populatePseudocode(act) {
    switch (act) {
      case 0: // Insert
        document.getElementById('code1').innerHTML = 'if found insertion point';
        document.getElementById('code2').innerHTML = '&nbsp&nbspcreate new node';
        document.getElementById('code3').innerHTML = 'if value to be inserted < this key';
        document.getElementById('code4').innerHTML = '&nbsp&nbspgo left';
        document.getElementById('code5').innerHTML = 'else go right';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 1: // findMax
        document.getElementById('code1').innerHTML = 'if this is null return empty';
        document.getElementById('code2').innerHTML = 'if right != null';
        document.getElementById('code3').innerHTML = '&nbsp&nbspgo right';
        document.getElementById('code4').innerHTML = 'else return this key';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 2: // findMin
        document.getElementById('code1').innerHTML = 'if this is null return empty';
        document.getElementById('code2').innerHTML = 'else if left != null';
        document.getElementById('code3').innerHTML = '&nbsp&nbspgo left';
        document.getElementById('code4').innerHTML = 'else return this key';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 3: // in-order traversal
        document.getElementById('code1').innerHTML = 'if this is null';
        document.getElementById('code2').innerHTML = '&nbsp;&nbsp;return';
        document.getElementById('code3').innerHTML = 'inOrder(left)';
        document.getElementById('code4').innerHTML = 'visit this, then inOrder(right)';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 4: // search
        document.getElementById('code1').innerHTML = 'if this == null';
        document.getElementById('code2').innerHTML = '&nbsp;&nbsp;return null';
        document.getElementById('code3').innerHTML = 'else if this key == search value';
        document.getElementById('code4').innerHTML = '&nbsp;&nbsp;return this';
        document.getElementById('code5').innerHTML = 'else if this key < search value';
        document.getElementById('code6').innerHTML = '&nbsp;&nbsp;search right';
        document.getElementById('code7').innerHTML = 'else search left';
        break;
    case 5: // remove
        document.getElementById('code1').innerHTML = 'search for v';
        document.getElementById('code2').innerHTML = 'if v is a leaf';
        document.getElementById('code3').innerHTML = '&nbsp;&nbsp;delete leaf v';
        document.getElementById('code4').innerHTML = 'else if v has 1 child';
        document.getElementById('code5').innerHTML = '&nbsp;&nbsp;bypass v';
        document.getElementById('code6').innerHTML = 'else replace v with successor';
        document.getElementById('code7').innerHTML = '';
        break;
	case 6: // insert with rotations
        document.getElementById('code1').innerHTML = 'insert v';
        document.getElementById('code2').innerHTML = 'check balance factor of this and its children';
        document.getElementById('code3').innerHTML = '&nbsp;&nbsp;case1: this.rotateRight';
        document.getElementById('code4').innerHTML = '&nbsp;&nbsp;case2: this.left.rotateLeft, this.rotateRight';
        document.getElementById('code5').innerHTML = '&nbsp;&nbsp;case3: this.rotateLeft';
        document.getElementById('code6').innerHTML = '&nbsp;&nbsp;case4: this.right.rotateRight, this.rotateLeft';
        document.getElementById('code7').innerHTML = '&nbsp;&nbsp;this is balanced';
        break;
	case 7: // remove with rotations
        document.getElementById('code1').innerHTML = 'remove v';
        document.getElementById('code2').innerHTML = 'check balance factor of this and its children';
        document.getElementById('code3').innerHTML = '&nbsp;&nbsp;case1: this.rotateRight';
        document.getElementById('code4').innerHTML = '&nbsp;&nbsp;case2: this.left.rotateLeft, this.rotateRight';
        document.getElementById('code5').innerHTML = '&nbsp;&nbsp;case3: this.rotateLeft';
        document.getElementById('code6').innerHTML = '&nbsp;&nbsp;case4: this.right.rotateRight, this.rotateLeft';
        document.getElementById('code7').innerHTML = '&nbsp;&nbsp;this is balanced';
        break;
	}
  }
}