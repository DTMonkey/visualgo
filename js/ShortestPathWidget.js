// @author  Ivan Reinaldo
// Defines a ShortestPath object; keeps implementation of graph internally and interact with GraphWidget to display SSSP and ASSP visualizations

var ShortestPath = function(){
  var self = this;
  var graphWidget = new GraphWidget();

  var valueRange = [1, 100]; // Range of valid values of BST vertexes allowed

  var internalAdjList = {};
  var amountVertex = 0;

  this.getGraphWidget = function(){
    return graphWidget;
  }
}