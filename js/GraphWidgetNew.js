// @author  Koh Zi Chun
// Graph Widget. currently in a mess
// add keyboard shortcut for animation

// Ivan: Most (if not all) functions will be changed to accomodate new library (D3.js)
//       Only the algorithm & high-level design will be retained

var vertexSvg = mainSvg.append("g")
                      .attr("id", "vertex");

var edgeSvg = mainSvg.append("g")
                    .attr("id", "edge");

var vertexTextSvg = mainSvg.append("g")
                          .attr("id", "vertexText");



var GraphWidget = function(){
  var self = this;

  var vertexList = {};
  var edgeList = {};

  var vertexUpdateList = {};
  var edgeUpdateList = {};

  var currentIteration = NO_ITERATION;
  var currentDirection = UPDATE_FORWARD;
  var animationStateList = NO_STATELIST;
  var animationStatus = ANIMATION_STOP;

  var animationDuration = 2000;
  
  this.getAnimationStatus = function() {
	return animationStatus;
  }

  this.getEdgeList = function() {
    return edgeList;
  }
  // Show: true means the element will immediately appear on the html page
  //       false means the element will remain hidden until told to appear
  // Duration: duration of the show animation, only used when show is true

  this.addVertex = function(cx, cy, vertexText, vertexClassNumber, show){
    if(show != false) show = true;

    var newVertex = new GraphVertexWidget(cx,cy,vertexText,vertexClassNumber);

    vertexList[vertexClassNumber] = newVertex;
    vertexUpdateList[vertexClassNumber] = false;

    if(show == true){
      vertexList[vertexClassNumber].showVertex();
      vertexList[vertexClassNumber].redraw();
    }
  }

  // Default for weight is 1 and for type is EDGE_TYPE_UDE
  this.addEdge = function(vertexClassA, vertexClassB, edgeIdNumber, type, weight, show){
    if(show != false) show = true;
    if(type == null || isNaN(type)) type = EDGE_TYPE_UDE;
    if(weight == null || isNaN(weight)) weight = 1;

    var vertexA = vertexList[vertexClassA];
    var vertexB = vertexList[vertexClassB];

    var newEdge = new GraphEdgeWidget(vertexA, vertexB, edgeIdNumber, type, weight);

    edgeList[edgeIdNumber] = newEdge;
    edgeUpdateList[edgeIdNumber] = false;

    vertexList[vertexClassA].addEdge(newEdge);
    vertexList[vertexClassB].addEdge(newEdge);

    if(show == true){
      edgeList[edgeIdNumber].showEdge();
      edgeList[edgeIdNumber].redraw();
    }
  }

  this.removeEdge = function(edgeIdNumber){
    if(edgeList[edgeIdNumber] == null || edgeList[edgeIdNumber] == undefined) return;

    edgeList[edgeIdNumber].removeEdge();
    delete edgeList[edgeIdNumber];
    delete edgeUpdateList[edgeIdNumber];
  }

  // Edges are assumed to have been removed
  this.removeVertex = function(vertexClassNumber){
    vertexList[vertexClassNumber].removeVertex();
    delete vertexList[vertexClassNumber];
    delete vertexUpdateList[vertexClassNumber];
  }

  /* 
   * stateList: List of JS object containing the states of the objects in the graph
   * Structure of stateList: List of JS object with the following keys and values:
   *                            - vl: JS object with vertex texts as key and corresponding state positions and constants as value
   *                            - el: JS object with edge IDs as keys and corresponding state connections constants as value
   *
   * Objects not present in the i-th iteration stateList will be hidden until the animation stops, where it will be removed
   * New objects present in the i-th iteration stateList will be automatically created
   *
   * State 0 should be the initial state, last state should be the end state
   */

  /*
   * Contents of "vl":
   * - cx
   * - cy
   * - text
   * - state
   */

  /*
   * Contents of "el":
   * - vertexA: id of vertex A
   * - vertexB: id of vertex B
   * - type
   * - weight
   * - state  : Display state
   * - animateHighlighted : Determines whether highlighted animation should be played. True or false
   */

  this.startAnimation = function(stateList){
    if(stateList != null) animationStateList = stateList;
    if(currentIteration == NO_ITERATION) currentIteration = 0;

    var key;

    // for(key in animationStateList[currentIteration]["vl"]){
    //   if(vertexSvg.select("#oc" + key)[0][0] == null){
    //     var newVertex = animationStateList[currentIteration]["vl"][key];
    //     self.addVertex(newVertex["cx"], newVertex["cy"], key, false);
    //   }
    // }

    // for(key in animationStateList[currentIteration]["el"]){
    //   if(edgeSvg.select("#" + key)[0][0] == null){
    //     var newEdge = animationStateList[currentIteration]["el"][key];

    //     if(newEdge["state"] != OBJ_NOT_CREATED && newEdge["state"] != OBJ_REMOVED)
    //       self.addEdge(newEdge["vertexTextA"], newEdge["vertexTextB"], newEdge["directed"], newEdge["weight"], false);
    //   }
    // }

    self.play();
  }

  this.animate = function(){
    if(currentIteration >= animationStateList.length && animationStatus != ANIMATION_STOP) animationStatus = ANIMATION_PAUSE;
    if(animationStatus == ANIMATION_PAUSE || animationStatus == ANIMATION_STOP) return;

    self.next(animationDuration);

    setTimeout(function(){
      self.animate();
    }, animationDuration);
  }

  this.play = function(){
    if(currentIteration < 0) currentIteration = 0;
    currentDirection = UPDATE_FORWARD;

    if(animationStatus == ANIMATION_STOP){
      animationStatus = ANIMATION_PLAY;
      updateDisplay(animationDuration, UPDATE_FORWARD);
      setTimeout(function(){
        self.animate();
      }, animationDuration);
    }

    else{
      animationStatus = ANIMATION_PLAY;
      self.animate();
    }
  }

  this.pause = function(){
    animationStatus = ANIMATION_PAUSE;
  }

  this.stop = function(){
    while(currentIteration < animationStateList.length - 1){
      self.forceNext(0);
    }

    currentIteration = animationStateList.length - 1;
    animationStatus = ANIMATION_STOP;

    var currentVertexState = animationStateList[currentIteration]["vl"];
    var currentEdgeState = animationStateList[currentIteration]["el"];

    var key;

    // for(key in currentEdgeState){
    //   var currentEdge = edgeList[key];

    //   if(currentEdge == undefined || currentEdge == null) continue;

    //   switch(currentEdgeState[key]["state"]){
    //     case OBJ_REMOVED:
    //       self.removeEdge(key);
    //       break;
    //   }
    // }

    // for(key in currentVertexState){
    //   switch(currentVertexState[key]["state"]){
    //       case OBJ_REMOVED:
    //       self.removeVertex(key);
    //       break;
    //       default:
    //       break;
    //   }
    // }

    for(key in currentEdgeState){
      edgeUpdateList[key] = true;
    }

    for(key in edgeUpdateList){
      if(edgeUpdateList[key] == false){
        self.removeEdge(key);
      }
    }

    for(key in currentVertexState){
      vertexUpdateList[key] = true;
    }

    for(key in vertexUpdateList){
      if(vertexUpdateList[key] == false){
        self.removeVertex(key);
      }
    }

    for(key in edgeUpdateList){
      edgeUpdateList[key] = false;
    }

    for(key in vertexUpdateList){
      vertexUpdateList[key] = false;
    }

    animationStateList = NO_STATELIST;
    currentIteration = NO_ITERATION;
  }

  this.next = function(duration){
    if(currentIteration < 0) currentIteration = 0;
    currentIteration++;
    currentDirection = UPDATE_FORWARD;
    if(currentIteration >= animationStateList.length) return;
    updateDisplay(duration, UPDATE_FORWARD);
  }

  this.previous = function(duration){
    if(currentIteration >= animationStateList.length) currentIteration = animationStateList.length - 1;
    currentIteration--;
    currentDirection = UPDATE_BACKWARD;
    if(currentIteration < 0) return;
    updateDisplay(duration, UPDATE_BACKWARD);
  }

  this.forceNext = function(duration){
    self.pause();
    self.next(duration);
  }

  this.forcePrevious = function(duration){
    self.pause();
    self.previous(duration);
  }

  this.getAnimationDuration = function(){
    return animationDuration;
  }
  
  this.setAnimationDuration = function(duration){
    animationDuration = duration;
  }

  function updateDisplay(duration){
    // Add boolean flag for vertexes and edges that exists in the current visualization
    // Check the boolean flags each time this function is called
    // If there are objects that are not updated, it means that the object is removed
    // If there are new objects that currently not in the flags, it means the object is created this turn

    $('#status p').html("iteration " + currentIteration + ": " + animationStateList[currentIteration]["status"]);
    var currentVertexState = animationStateList[currentIteration]["vl"];
    var currentEdgeState = animationStateList[currentIteration]["el"];

    var key;

    for(key in currentVertexState){
      if(vertexList[key] == null || vertexList[key] == undefined){
        self.addVertex(currentVertexState[key]["cx"],currentVertexState[key]["cy"],currentVertexState[key]["text"],key,false);
      }

      var currentVertex = vertexList[key];

      currentVertex.showVertex();

      switch(currentVertexState[key]["state"]){
        case VERTEX_DEFAULT:
          currentVertex.defaultVertex();
          break;
        case VERTEX_HIGHLIGHTED:
          currentVertex.highlightVertex();
          break;
        case VERTEX_TRANSVERSED:
          currentVertex.transversedVertex();
          break;
        default:
          break;
      }

      currentVertex.moveVertex(currentVertexState[key]["cx"], currentVertexState[key]["cy"]);
      currentVertex.changeText(currentVertexState[key]["text"]);
      currentVertex.redraw(duration);

      vertexUpdateList[key] = true;
    }

    for(key in vertexUpdateList){
      if(vertexUpdateList[key] == false){
        vertexList[key].hideVertex();
        vertexList[key].redraw(duration);
        vertexUpdateList[key] = true;
      }
    }

    for(key in currentEdgeState){
      if(edgeList[key] == null || edgeList[key] == undefined){
        self.addEdge(currentEdgeState[key]["vertexA"],currentEdgeState[key]["vertexB"],key,currentEdgeState[key]["type"],currentEdgeState[key]["weight"],false);
      }

      var currentEdge = edgeList[key];

      currentEdge.showEdge();

      switch(currentEdgeState[key]["state"]){
        case EDGE_DEFAULT:
          currentEdge.defaultEdge();
          break;
        case EDGE_HIGHLIGHTED:
          currentEdge.highlightEdge();
          break;
        case EDGE_TRANSVERSED:
          currentEdge.transversedEdge();
          break;
        default:
          break;
      }

      currentEdge.changeVertexA(vertexList[currentEdgeState[key]["vertexA"]]);
      currentEdge.changeVertexB(vertexList[currentEdgeState[key]["vertexB"]]);
      currentEdge.changeType(currentEdgeState[key]["type"]);
      currentEdge.changeWeight(currentEdgeState[key]["weight"]);

      currentEdge.refreshPath();
      if(!currentEdgeState[key]["animateHighlighted"]) currentEdge.redraw(duration);
      else{
        currentEdge.animateHighlighted(duration*0.9);
      }

      edgeUpdateList[key] = true;
    }

    for(key in edgeUpdateList){
      if(edgeUpdateList[key] == false){
        edgeList[key].hideEdge();
        edgeList[key].redraw(duration);
        edgeUpdateList[key] = true;
      }
    }

    // if(forwardOrBackward == UPDATE_FORWARD){
    //   for(key in currentEdgeState){
    //     if(currentEdgeState[key]["connectionState"] == EDGE_JUST_CREATED && (edgeList[key] == null || edgeList[key] == undefined)){
    //       self.addEdge(currentEdgeState[key]["vertexTextA"],currentEdgeState[key]["vertexTextB"],currentEdgeState[key]["directed"],currentEdgeState[key]["weight"], false);
    //     }
            
    //     var currentEdge = edgeList[key];

    //     if(currentEdge == undefined || currentEdge == null) continue;
    //     if(currentEdgeState[key]["connectionState"] == EDGE_CREATED_FROM_CHANGE) continue;

    //     currentEdge.showEdge();

    //     switch(currentEdgeState[key]["state"]){
    //       case OBJ_REMOVED:
    //       case OBJ_NOT_CREATED:
    //         currentEdge.hideEdge();
    //         break;
    //       case EDGE_DEFAULT:
    //         currentEdge.defaultEdge();
    //         break;
    //       case EDGE_HIGHLIGHTED:
    //         currentEdge.highlightEdge();
    //         break;
    //       case EDGE_TRANSVERSED:
    //         currentEdge.transversedEdge();
    //         break;
    //       default:
    //         break;
    //     }

    //     switch(currentEdgeState[key]["connectionState"]){
    //       case EDGE_CHANGE_A:
    //         currentEdge.changeVertexA(vertexList[currentEdgeState[key]["newVertexText"]]);
    //         edgeList[currentEdge.getAttributes()["id"]] = currentEdge;
    //         delete edgeList[key];
    //         break;
    //       case EDGE_CHANGE_B:
    //         currentEdge.changeVertexB(vertexList[currentEdgeState[key]["newVertexText"]]);
    //         edgeList[currentEdge.getAttributes()["id"]] = currentEdge;
    //         delete edgeList[key];
    //         break;
    //       default:
    //         break;
    //     }

    //     currentEdge.refreshPath();
    //     if(!currentEdgeState[key]["animateHighlighted"]) currentEdge.redraw(duration);
    //     else{
    //       currentEdge.animateHighlighted(duration*0.9);
    //     }
    //   }
    // }

    // else{
    //   var nextEdgeState = animationStateList[currentIteration+1]["el"];

    //   for(key in nextEdgeState){
    //     switch(nextEdgeState[key]["connectionState"]){
    //       case EDGE_CHANGE_A:
    //         var edgeFrontPart = "UDE"
    //         if(key.charAt(0) == "D") edgeFrontPart = "DE";
    //         var nextEdgeId = edgeFrontPart + "oc" + nextEdgeState[key]["newVertexText"] + "oc" + nextEdgeState[key]["vertexTextB"];
    //         var nextEdge = edgeList[nextEdgeId]; 
    //         nextEdge.changeVertexA(vertexList[nextEdgeState[key]["vertexTextA"]]);
    //         delete edgeList[nextEdgeId];
    //         edgeList[key] = nextEdge;
    //         break;
    //       case EDGE_CHANGE_B:
    //         var edgeFrontPart = "UDE"
    //         if(key.charAt(0) == "D") edgeFrontPart = "DE";
    //         var nextEdgeId = edgeFrontPart + "oc" + nextEdgeState[key]["vertexTextA"] + "oc" + nextEdgeState[key]["newVertexText"];
    //         var nextEdge = edgeList[nextEdgeId];  
    //         nextEdge.changeVertexB(vertexList[nextEdgeState[key]["vertexTextB"]]);
    //         delete edgeList[nextEdgeId];
    //         edgeList[key] = nextEdge;
    //         break;
    //       default:
    //         break;
    //     }
    //   }

    //   for(key in nextEdgeState){
    //     if(nextEdgeState[key]["previousId"] != EDGE_NO_PREVIOUS_ID){
    //       var currentEdge = edgeList[key];

    //       switch(currentEdgeState[nextEdgeState[key]["previousId"]]["state"]){
    //         case OBJ_REMOVED:
    //         case OBJ_NOT_CREATED:
    //           currentEdge.hideEdge();
    //           break;
    //         case EDGE_DEFAULT:
    //           currentEdge.defaultEdge();
    //           break;
    //         case EDGE_HIGHLIGHTED:
    //           currentEdge.highlightEdge();
    //           break;
    //         case EDGE_TRANSVERSED:
    //           currentEdge.transversedEdge();
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    //   }

    //   for(key in currentEdgeState){
    //     var currentEdge = edgeList[key];

    //     if(currentEdge == undefined || currentEdge == null) continue;
    //     if(currentEdgeState[key]["connectionState"] == EDGE_CREATED_FROM_CHANGE) continue;


    //     currentEdge.showEdge();

    //     switch(currentEdgeState[key]["state"]){
    //       case OBJ_REMOVED:
    //       case OBJ_NOT_CREATED:
    //         currentEdge.hideEdge();
    //         break;
    //       case EDGE_DEFAULT:
    //         currentEdge.defaultEdge();
    //         break;
    //       case EDGE_HIGHLIGHTED:
    //         currentEdge.highlightEdge();
    //         break;
    //       case EDGE_TRANSVERSED:
    //         currentEdge.transversedEdge();
    //         break;
    //       default:
    //         break;
    //     }
    //   }

    //   for(key in edgeList){
    //     var currentEdge = edgeList[key];

    //     currentEdge.refreshPath();
    //     currentEdge.redraw(duration);
    //   }
    // }

    for(key in vertexUpdateList){
      vertexUpdateList[key] = false;
    }

    for(key in edgeUpdateList){
      edgeUpdateList[key] = false;
    }
  }

  function updatePseudocode(duration, forwardOrBackward){

  }
}