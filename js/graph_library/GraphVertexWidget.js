// Defines ONE node object
// Set styles in properties.js and the CSS files!!!

var GraphVertexWidget = function(cx, cy, vertexText, vertexClassNumber){
  var self = this;
  var defaultAnimationDuration = 250; // millisecond

  var innerCircle;
  var outerCircle;
  var text;

  var textYaxisOffset = graphVertexProperties["text"]["font-size"]/3;

  var attributeList = {
    "innerCircle": {
      "class": null,
      "cx": null,
      "cy": null,
      "fill": null,
      "r": null,
      "stroke": null,
      "stroke-width": null
    },

    "outerCircle":{
      "class": null,
      "cx": null,
      "cy": null,
      "fill": null,
      "r": null,
      "stroke": null,
      "stroke-width": null
    },

    "text":{
      "class": null,
      "x": null,
      "y": null,
      "fill": null,
      "font-family": null,
      "font-weight": null,
      "font-size": null,
      "text-anchor": null,
      "text": null
    }
  }

  // JS object with IDs of all edges connected to this vertex as the key and boolean as the value
  // Everytime an edge is added, the value is set to true
  // Everytime an edge is deleted, the value is set to null
  var edgeList = {};

  init();

  this.redraw = function(duration){
    draw(duration);
  }

  // Specifies the duration of the animation in milliseconds
  // If unspecified or illegal value, default duration applies. 
  this.showVertex = function(){
    attributeList["outerCircle"]["r"] = graphVertexProperties["outerCircle"]["r"];
    attributeList["outerCircle"]["stroke-width"] = graphVertexProperties["outerCircle"]["stroke-width"];

    attributeList["innerCircle"]["r"] = graphVertexProperties["innerCircle"]["r"];
    attributeList["innerCircle"]["stroke-width"] = graphVertexProperties["innerCircle"]["stroke-width"];

    attributeList["text"]["font-size"] = graphVertexProperties["text"]["font-size"];
  }

  this.hideVertex = function(){
    attributeList["outerCircle"]["r"] = 0;
    attributeList["outerCircle"]["stroke-width"] = 0;

    attributeList["innerCircle"]["r"] = 0;
    attributeList["innerCircle"]["stroke-width"] = 0;

    attributeList["text"]["font-size"] = 0;
  }

  this.moveVertex = function(cx, cy){
    attributeList["outerCircle"]["cx"] = cx;
    attributeList["outerCircle"]["cy"] = cy;

    attributeList["innerCircle"]["cx"] = cx;
    attributeList["innerCircle"]["cy"] = cy;

    attributeList["text"]["x"] = cx;
    attributeList["text"]["y"] = cy + textYaxisOffset;

    var key;

    for(key in edgeList){
      edgeList[key].refreshPath();
    }
  }

  this.changeText = function(newVertexText){
    vertexText = newVertexText;
    attributeList["text"]["text"] = newVertexText;
  }

  this.changeTextFontSize = function(newFontSize){
    if(newTextSize == null || isNaN(newTextSize)) return;
    attributeList["text"]["font-size"] = newTextSize;
  }

  this.changeRadius = function(newRadiusInner, newRadiusOuter){
    if(newRadiusInner == null || isNaN(newRadiusInner)) return;
    attributeList["innerCircle"]["r"] = newRadiusInner;
    if(newRadiusOuter == null || isNaN(newRadiusOuter)) return;
    attributeList["outerCircle"]["r"] = newRadiusOuter;
  }

  this.changeStrokeWidth = function(newStrokeWidthInner, newStrokeWidthOuter){
    if(newStrokeWidthInner == null || isNaN(newStrokeWidthInner)) return;
    attributeList["innerCircle"]["stroke-width"] = newStrokeWidthInner;
    if(newStrokeWidthOuter == null || isNaN(newStrokeWidthOuter)) return;
    attributeList["outerCircle"]["stroke-width"] = newStrokeWidthOuter;
  }

  // Removes the vertex (no animation)
  // If you want animation, hide & redraw the vertex first, then call this function
  this.removeVertex = function(){
    outerCircle.remove();
    innerCircle.remove();
    text.remove();
  }

  this.highlightVertex = function(){
    var key;

    for(key in graphVertexProperties["innerCircle"]["highlighted"]){
      attributeList["innerCircle"][key] = graphVertexProperties["innerCircle"]["highlighted"][key];
    }

    for(key in graphVertexProperties["outerCircle"]["highlighted"]){
      attributeList["outerCircle"][key] = graphVertexProperties["outerCircle"]["highlighted"][key];
    }

    for(key in graphVertexProperties["text"]["highlighted"]){
      attributeList["text"][key] = graphVertexProperties["text"]["highlighted"][key];
    }
  }

  this.traversedVertex = function(){
    var key;

    for(key in graphVertexProperties["innerCircle"]["traversed"]){
      attributeList["innerCircle"][key] = graphVertexProperties["innerCircle"]["traversed"][key];
    }

    for(key in graphVertexProperties["outerCircle"]["traversed"]){
      attributeList["outerCircle"][key] = graphVertexProperties["outerCircle"]["traversed"][key];
    }

    for(key in graphVertexProperties["text"]["traversed"]){
      attributeList["text"][key] = graphVertexProperties["text"]["traversed"][key];
    }
  }

  this.defaultVertex = function(){
    var key;

    for(key in graphVertexProperties["innerCircle"]["default"]){
      attributeList["innerCircle"][key] = graphVertexProperties["innerCircle"]["default"][key];
    }

    for(key in graphVertexProperties["outerCircle"]["default"]){
      attributeList["outerCircle"][key] = graphVertexProperties["outerCircle"]["default"][key];
    }

    for(key in graphVertexProperties["text"]["default"]){
      attributeList["text"][key] = graphVertexProperties["text"]["default"][key];
    }
  }

  this.getAttributes = function(){
    return deepCopy(attributeList);
  }

  this.getClassNumber = function(){
    return vertexClassNumber;
  }

  this.addEdge = function(graphEdge){
    edgeList[graphEdge.getAttributes()["id"]] = graphEdge;
  }

  this.removeEdge = function(graphEdge){
    if(edgeList[graphEdge.getAttributes()["id"]] == null || edgeList[graphEdge.getAttributes()["id"]] == undefined) return;

    delete edgeList[graphEdge.getAttributes()["id"]];
  }

  this.getEdge = function(){
    var reply = [];
    var key;

    for(key in edgeList){
      reply.push(edgeList[key]);
    }

    return reply;
  }

  // this.connectVertex = function(secondVertex, directed, weight){
  //   self.addEdge(new GraphEdgeWidget(self,secondVertex,directed,weight));
  // }

  // Initialize vertex and draw them, but the object will not be visible due to the radius of the vertex circle set to 0
  function init(){
    outerCircle = vertexSvg.append("circle");
    innerCircle = vertexSvg.append("circle");
    text = vertexTextSvg.append("text");

    attributeList["innerCircle"]["class"] = "v" + vertexClassNumber
    attributeList["innerCircle"]["cx"] = cx;
    attributeList["innerCircle"]["cy"] = cy;
    attributeList["innerCircle"]["fill"] = graphVertexProperties["innerCircle"]["default"]["fill"];
    attributeList["innerCircle"]["r"] = 0;
    attributeList["innerCircle"]["stroke"] = graphVertexProperties["innerCircle"]["default"]["stroke"];
    attributeList["innerCircle"]["stroke-width"] = 0;

    attributeList["outerCircle"]["class"] = "v" + vertexClassNumber
    attributeList["outerCircle"]["cx"] = cx;
    attributeList["outerCircle"]["cy"] = cy;
    attributeList["outerCircle"]["fill"] = graphVertexProperties["outerCircle"]["default"]["fill"];
    attributeList["outerCircle"]["r"] = 0;
    attributeList["outerCircle"]["stroke"] = graphVertexProperties["outerCircle"]["default"]["stroke"];
    attributeList["outerCircle"]["stroke-width"] = 0;

    attributeList["text"]["class"] = "v" + vertexClassNumber
    attributeList["text"]["x"] = cx;
    attributeList["text"]["y"] = cy + textYaxisOffset;
    attributeList["text"]["fill"] = graphVertexProperties["text"]["default"]["fill"];
    attributeList["text"]["font-family"] = graphVertexProperties["text"]["default"]["font-family"];
    attributeList["text"]["font-size"] = 0;
    attributeList["text"]["font-weight"] = graphVertexProperties["text"]["default"]["font-weight"];
    attributeList["text"]["text-anchor"] = graphVertexProperties["text"]["default"]["text-anchor"];
    attributeList["text"]["text"] = vertexText;

    innerCircle.attr("class", attributeList["innerCircle"]["class"]);
    outerCircle.attr("class", attributeList["outerCircle"]["class"]);
    text.attr("class", attributeList["text"]["class"]);

    innerCircle.attr("cx", attributeList["innerCircle"]["cx"])
              .attr("cy", attributeList["innerCircle"]["cy"])
              .attr("fill", attributeList["innerCircle"]["fill"])
              .attr("r", attributeList["innerCircle"]["r"])
              .attr("stroke", attributeList["innerCircle"]["stroke"])
              .attr("stroke-width", attributeList["innerCircle"]["stroke-width"]);

    outerCircle.attr("cx", attributeList["outerCircle"]["cx"])
              .attr("cy", attributeList["outerCircle"]["cy"])
              .attr("fill", attributeList["outerCircle"]["fill"])
              .attr("r", attributeList["outerCircle"]["r"])
              .attr("stroke", attributeList["outerCircle"]["stroke"])
              .attr("stroke-width", attributeList["outerCircle"]["stroke-width"]);

    text.attr("x", attributeList["text"]["x"])
        .attr("y", attributeList["text"]["y"])
        .attr("fill", attributeList["text"]["fill"])
        .attr("font-family", attributeList["text"]["font-family"])
        .attr("font-size", attributeList["text"]["font-size"])
        .attr("font-weight", attributeList["text"]["font-weight"])
        .attr("text-anchor", attributeList["text"]["text-anchor"])
        .text(function(){
          return attributeList["text"]["text"];
        });
  }

  // Refreshes the vertex image
  // "dur" specifies the duration of the animation in milliseconds
  // If unspecified or illegal value, default duration applies. 
  function draw(dur){
    if(dur == null || isNaN(dur)) dur = defaultAnimationDuration;
    if(dur <= 0) dur = 1;

    innerCircle.transition()
              .duration(dur)
              .attr("cx", attributeList["innerCircle"]["cx"])
              .attr("cy", attributeList["innerCircle"]["cy"])
              .attr("fill", attributeList["innerCircle"]["fill"])
              .attr("r", attributeList["innerCircle"]["r"])
              .attr("stroke", attributeList["innerCircle"]["stroke"])
              .attr("stroke-width", attributeList["innerCircle"]["stroke-width"]);

    outerCircle.transition()
              .duration(dur)
              .attr("cx", attributeList["outerCircle"]["cx"])
              .attr("cy", attributeList["outerCircle"]["cy"])
              .attr("fill", attributeList["outerCircle"]["fill"])
              .attr("r", attributeList["outerCircle"]["r"])
              .attr("stroke", attributeList["outerCircle"]["stroke"])
              .attr("stroke-width", attributeList["outerCircle"]["stroke-width"]);

    text.transition()
        .duration(dur)
        .attr("x", attributeList["text"]["x"])
        .attr("y", attributeList["text"]["y"])
        .attr("fill", attributeList["text"]["fill"])
        .attr("font-family", attributeList["text"]["font-family"])
        .attr("font-size", attributeList["text"]["font-size"])
        .attr("font-weight", attributeList["text"]["font-weight"])
        .attr("text-anchor", attributeList["text"]["text-anchor"])
        .text(function(){
          return attributeList["text"]["text"];
      });
  }
}