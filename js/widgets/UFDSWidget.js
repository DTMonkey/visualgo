// @author Steven Halim
// Defines a UFDS object; keeps implementation of UFDS internally and interact with GraphWidget to display UFDS visualizations

var UFDS = function() {
  var self = this;
  var graphWidget = new GraphWidget();

  /*
   * p: Internal representation of UFDS in this object
   * It stores the parent pointer of each vertex.
   * If p[i] = i, it means that i is the root of the tree
   *
   * The ID of the vertex SVG is equal to the vertex value
   */

  /*
   * Edge IDs are the index of the child element, so for example edge A[1]-A[2] will have ID "e2" (edge 2)
   * The edges will be set to not change when vertexes are interchanged
   * This eliminates the need to maintain an Adjacency Matrix / List
   */

  //var coord = new Array();
	var p = new Array();
	var rank = new Array();
	var coord = new Array();
	var drawn = new Array();

  //initArray();
  p = [1, 3, 3, 3, 3, 6, 6, 6, 8]; // Figure 2.7 (left) of CP3 plus vertex 5-6-7 and 8-9-10
  rank = [0, 1, 0, 2, 0, 0, 1, 0, 0];

  layoutUFDS();
  initUFDS();

  var stateList = [];

  this.getGraphWidget = function() { return graphWidget; }

	this.sampleArray = function(ver) {
		if (ver < 0 || ver > 5) {
			$('#sample-err').html('The valid range for ver is [0..5]');
			return false;
		}
		clearScreen();
		p = new Array();
		switch (ver) {
			case 0: // Figure 2.7 (left) of CP3 plus vertex 5-6-7 and 8
				p    = [1, 3, 3, 3, 3, 6, 6, 6, 8];
				rank = [0, 1, 0, 2, 0, 0, 1, 0, 0];
				break;
			case 1: // two disjoint sets
				p    = [1, 3, 3, 3, 3, 5, 5, 5, 5, 6];
				rank = [0, 1, 0, 2, 0, 2, 1, 0, 0, 0];
				break;
			case 2: // three disjoint sets
				p    = [1, 3, 3, 3, 3, 5, 6, 5, 5, 6, 4, 8];
				rank = [0, 1, 0, 2, 1, 2, 1, 0, 1, 0, 0, 0];
				break;
			case 3: // example with rank 1
				p    = [0, 1, 2, 0, 0, 0, 0, 1, 1, 1, 2, 2];
				rank = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				break;
			case 4: // example with rank 2
				p    = [0, 1, 0, 0, 0, 1, 1, 0, 5, 5, 5];
				rank = [1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0];
				break;
			case 5: // example with rank 3
				p    = [1, 3, 3, 7, 5, 7, 7, 7];
				rank = [0, 1, 0, 2, 0, 1, 0, 3];
				break;
		}
		layoutUFDS();
		initUFDS();
		return true;
	}
  
	this.initArray = function(N) {
		clearScreen();
		p = new Array();
		for (var i = 0; i < N; i++) {
			p[i] = i;
			rank[i] = 0;
		}
		layoutUFDS();
		initUFDS();
	}

	function initUFDS() {
		for (var i = 0; i < p.length; i++)
			graphWidget.addVertex(coord[i][0], coord[i][1], i, i, true);
		for (var i = 0; i < p.length; i++)
			if (p[i] != i)
				graphWidget.addEdge(p[i], i, i, EDGE_TYPE_UDE, 1, true);
	}
	
	function layoutUFDS() {
		// draw first level
		var firstLevel = 0;
		var roots = [];
		for (var i = 0; i < p.length; i++) {
			coord[i] = new Array();
			coord[i][0] = 0;
			coord[i][1] = 0;
			drawn[i] = 0; //.push(0);
			if (p[i] == i)
				firstLevel++;
		}

		var sectionWidth = 900 / firstLevel;
		var xCoord = sectionWidth / 2;
		var yCoord = 20;
		for (var i = 0; i < p.length; i++)
			if (p[i] == i) {
				roots.push(i);
				drawn[i] = 1;
				coord[i][0] = xCoord;
				coord[i][1] = yCoord;
				xCoord += sectionWidth;
			}

		function drawRest(root, subSectionWidth, currSubSection, level) {
			var totalChild = 0;
			var childs = [];
			for (var i = 0; i < p.length; i++)
				if (p[i] == root && !drawn[i])
					totalChild++;

			var vertexDistance = subSectionWidth / totalChild;
			var xCoord = (coord[root][0] - subSectionWidth/2) + (vertexDistance/2); //+ (currSubSection*subSectionWidth)
			var yCoord = 20 + 60 * level;
			for (var i = 0; i < p.length; i++)
				if (p[i] == root && !drawn[i]) { // && (!gW.vertices[i])){
/*					if (!drawn[i]) {
						graphWidget.addVertex(xCoord, yCoord, i, i, true); //new Point(xCoord,yCoord),i,i);
						//gW.addEdge(root,i);
						graphWidget.addEdge(p[i], i, i, EDGE_TYPE_UDE, 1, true);
					}*/
					childs.push(i);
					drawn[i] = 1;
					coord[i][0] = xCoord;
					coord[i][1] = yCoord;
					xCoord += vertexDistance;
				}

			var currSubSection1 = 0;
			for (var j = 0; j < childs.length; j++)
				drawRest(childs[j], vertexDistance, currSubSection1++, level+1);
		}

		var currSubSection = 0;
		for (var j = 0; j < roots.length; j++)
			drawRest(roots[j], sectionWidth, currSubSection++, 1);
	}

	function clearScreen() {
		var i;
		for (i = 0; i < p.length; i++)
			graphWidget.removeEdge(i);
		for (i = 0; i < p.length; i++)
			graphWidget.removeVertex(i);
	}

  this.findSet = function(vtxI, startAnimationDirectly, lineToBeHighlighted) {
    var i = parseInt(vtxI), currentState;
    if (i < 0 || i >= p.length) {
      $('#find-err').html('Sorry, the valid item number is [0..' + (p.length-1) + ']');
      return false;
    }
    
    if (startAnimationDirectly == true) {
      stateList = [];
      populatePseudocode(0);
    }

 	currentState = createState(p);
	currentState["vl"][i]["state"] = VERTEX_HIGHLIGHTED;
	currentState["status"] = 'Find the representative vertex for the set that contains item ' + i;
    currentState["lineNo"] = 1;
	if (startAnimationDirectly == false)
		currentState["lineNo"] = lineToBeHighlighted;
    stateList.push(currentState);

    var visited = new Array();

	while (p[i] != i) {
		currentState = createState(p);
		visited.push(i);

		for (var j=0; j<visited.length; j++) {
			var v=visited[j];
			currentState["vl"][v]["state"] = VERTEX_TRAVERSED;
			currentState["vl"][p[v]]["state"] = VERTEX_HIGHLIGHTED;
			currentState["el"][v]["state"] = EDGE_TRAVERSED;
		}
		currentState["status"] = 'Vertex ' + i + ' has a parent which is vertex ' + p[i];
        currentState["lineNo"] = 3;
		if (startAnimationDirectly == false)
			currentState["lineNo"] = lineToBeHighlighted;
		stateList.push(currentState);
		i = p[i];
	}
	
	currentState = createState(p);
	currentState["vl"][i]["state"] = VERTEX_HIGHLIGHTED;
	currentState["status"] = 'Vertex ' + i + ' is the representative vertex of this set';
    currentState["lineNo"] = 2;
	if (startAnimationDirectly == false)
		currentState["lineNo"] = lineToBeHighlighted;
    stateList.push(currentState);
	
	//if (p[parseInt(vtxI)] != i) { // need to do path compression
	for (var j=visited.length-1; j>=0; j--) { // path compress all vertices along the path
		var v=visited[j];
		p[v] = i;
		currentState = createState(p);
		currentState["el"][v]["state"] = EDGE_HIGHLIGHTED;
		currentState["status"] = 'Path compression, Vertex ' + v + ' points directly to Vertex ' + i;
		currentState["lineNo"] = 3;
		if (startAnimationDirectly == false)
			currentState["lineNo"] = lineToBeHighlighted;
		stateList.push(currentState);

/*		currentState = createState(p);
		currentState["status"] = 'The current UFDS structure';
		currentState["lineNo"] = 3;
		if (startAnimationDirectly == false)
			currentState["lineNo"] = lineToBeHighlighted;
		stateList.push(currentState);*/
	}

	currentState = createState(p); // final state
	currentState["status"] = 'The current UFDS structure';
	stateList.push(currentState);

    if (startAnimationDirectly)
      graphWidget.startAnimation(stateList);

    return true;
  }

  this.isSameSet = function(vtxI, vtxJ, startAnimationDirectly) {
    var i = parseInt(vtxI), j = parseInt(vtxJ), currentState;

    if (i < 0 || i >= p.length) {
      $('#isSameSet-err').html('Sorry, the valid value for i is [0..' + (p.length-1) + ']');
      return false;
    }
    
    if (j < 0 || j >= p.length) {
      $('#isSameSet-err').html('Sorry, the valid value for j is [0..' + (p.length-1) + ']');
      return false;
    }

    if (startAnimationDirectly == true) {
      stateList = [];
      populatePseudocode(1);
    }

	this.findSet(i, false, 1);
	this.findSet(j, false, 2);
	var x = p[i], y = p[j]; // path compression in action already
	
	currentState = createState(p);
	if (x != y)
		currentState["status"] = i + ' and ' + j + ' belong to different sets';
	else
		currentState["status"] = i + ' and ' + j + ' belong to the same set';
	currentState["lineNo"] = 3;
    stateList.push(currentState);

    if (startAnimationDirectly)
      graphWidget.startAnimation(stateList);

    return true;
  }

  this.unionSet = function(vtxI, vtxJ, startAnimationDirectly) {
    var i = parseInt(vtxI), j = parseInt(vtxJ), currentState;

    if (i < 0 || i >= p.length) {
      $('#union-err').html('Sorry, the valid value for i is [0..' + (p.length-1) + ']');
      return false;
    }
    
    if (j < 0 || j >= p.length) {
      $('#union-err').html('Sorry, the valid value for j is [0..' + (p.length-1) + ']');
      return false;
    }

     if (i == j) {
      $('#union-err').html('Sorry, i has to be different from j');
      return false;
    }

    if (startAnimationDirectly == true) {
      stateList = [];
      populatePseudocode(2);
    }

	this.findSet(i, false, 2);
	this.findSet(j, false, 3);
	var x = p[i], y = p[j]; // path compression in action already
	var finalStatus = '';
	var selected = x;
	
	if (x != y) {
		var linkingStatus = '';
		currentState = createState(p);
		currentState["vl"][x]["state"] = VERTEX_HIGHLIGHTED;
		currentState["vl"][y]["state"] = VERTEX_HIGHLIGHTED;
		if (rank[x] > rank[y]) {
			currentState["el"][y] = {};
			currentState["el"][y]["type"] = EDGE_TYPE_UDE;
			currentState["el"][y]["weight"] = 1;
			currentState["el"][y]["animateHighlighted"] = false;
			currentState["el"][y]["vertexA"] = x;
			currentState["el"][y]["vertexB"] = y;
			currentState["el"][y]["state"] = EDGE_TRAVERSED;
		}
		else {
			currentState["el"][x] = {};
			currentState["el"][x]["type"] = EDGE_TYPE_UDE;
			currentState["el"][x]["weight"] = 1;
			currentState["el"][x]["animateHighlighted"] = false;
			currentState["el"][x]["vertexA"] = y;
			currentState["el"][x]["vertexB"] = x;
			currentState["el"][x]["state"] = EDGE_TRAVERSED;
		}
		currentState["status"] = 'Now, linking Vertex ' + x + ' with Vertex ' + y;
		currentState["lineNo"] = 4;
		stateList.push(currentState);
		
		if (rank[x] > rank[y]) {
			p[y] = x;
			linkingStatus = 'Make Vertex ' + x + ' as the new parent of Vertex ' + y;
			selected = y;
		}
		else {
			p[x] = y;
			linkingStatus = 'Make Vertex ' + y + ' as the new parent of Vertex ' + x;
			selected = x;
			if (rank[x] == rank[y]) rank[y]++;
		}

		currentState = createState(p);
		currentState["vl"][x]["state"] = VERTEX_HIGHLIGHTED;
		currentState["vl"][y]["state"] = VERTEX_HIGHLIGHTED;
		currentState["el"][selected]["state"] = EDGE_HIGHLIGHTED;
		currentState["status"] = linkingStatus;
		currentState["lineNo"] = 4;
		stateList.push(currentState);
		
		finalStatus = 'The current UFDS structure; Done';
	}
	else {
		finalStatus = 'x = y = ' + x + ', thus there is no need to do union; Done';
	}

 	currentState = createState(p);
	currentState["status"] = finalStatus;
    currentState["lineNo"] = 4;
    stateList.push(currentState);

    if (startAnimationDirectly)
      graphWidget.startAnimation(stateList);

    return true;
  }

  function populatePseudocode(act) {
    switch (act) {
      case 0: // FindSet
        document.getElementById('code1').innerHTML = 'if p[i] == i';
        document.getElementById('code2').innerHTML = '&nbsp&nbspreturn i';
        document.getElementById('code3').innerHTML = 'else return p[i] = findSet(p[i])';
        document.getElementById('code4').innerHTML = '';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
      case 1: // IsSameSet
        document.getElementById('code1').innerHTML = 'x = findSet(i)';
        document.getElementById('code2').innerHTML = 'y = findSet(j)';
        document.getElementById('code3').innerHTML = 'return x == y';
        document.getElementById('code4').innerHTML = '';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
      case 2: // UnionSet
        document.getElementById('code1').innerHTML = 'if !isSameSet(i,j)';
        document.getElementById('code2').innerHTML = '&nbsp&nbspx = findSet(i)';
        document.getElementById('code3').innerHTML = '&nbsp&nbspy = findSet(j)';
        document.getElementById('code4').innerHTML = '&nbsp&nbsplink shorter tree to taller tree';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    }
  }

  function highlightPseudocode(idx) {
    return;
  }

  function createState(internalUFDSObject) {
    var state = {
      "vl":{},
      "el":{},
      "status":{}
    };

	layoutUFDS();
	
    for (var i = 0; i < internalUFDSObject.length; i++) {
      state["vl"][i] = {};

      state["vl"][i]["cx"] = coord[i][0];
      state["vl"][i]["cy"] = coord[i][1];
      state["vl"][i]["text"] = i;
      state["vl"][i]["state"] = VERTEX_DEFAULT;
    }

    for (var i = 0; i < internalUFDSObject.length; i++) {
		state["el"][i] = {};
	  
		state["el"][i]["vertexA"] = internalUFDSObject[i];
		state["el"][i]["vertexB"] = i;
		state["el"][i]["type"] = EDGE_TYPE_UDE;
		state["el"][i]["weight"] = 1;
		state["el"][i]["animateHighlighted"] = false;

		if (internalUFDSObject[i] == i)
			state["el"][i]["state"] = OBJ_HIDDEN;
		else
			state["el"][i]["state"] = EDGE_DEFAULT;
    }

    return state;
  }
}