/*
 * Widget
 */

var MAIN_SVG_WIDTH = 900;
var MAIN_SVG_HEIGHT = 300;
var PSEUDOCODE_SVG_WIDTH = 300;
var PSEUDOCODE_SVG_HEIGHT = 400;

var defaultVertexColor = "#333333";
var highlightVertexColor = "#52bc69";
var traversedVertexColor = "#a7d41e";

/*
 * GraphVertexWidget
 */

var graphVertexProperties = {
  "innerCircle":{
    "default":{
      "fill": defaultVertexColor,
      "r": 12,
      "stroke": "#fff",
      "stroke-width": 0
    },
    "highlighted":{
      "fill": highlightVertexColor,
      "r": 12,
      "stroke": "#fff",
      "stroke-width": 0
    },
    "traversed":{
      "fill": traversedVertexColor,
      "r": 12,
      "stroke": "#fff",
      "stroke-width": 0
    }
  },
  "outerCircle":{
    "default":{
      "fill": "#fff",
      "r": 16,
      "stroke": defaultVertexColor,
      "stroke-width": 2
    },
    "highlighted":{
      "fill": "#fff",
      "r": 16,
      "stroke": highlightVertexColor,
      "stroke-width": 2
    },
    "traversed":{
      "fill": "#fff",
      "r": 16,
      "stroke": traversedVertexColor,
      "stroke-width": 2
    }
  },
  "text":{
    "default":{
      "fill": "#fff",
      "font-family": "sans-serif",
      "font-size": 12,
      "text-anchor": "middle"
    },
    "highlighted":{
      "fill": "#fff",
      "font-family": "sans-serif",
      "font-size": 12,
      "text-anchor": "middle"
    },
    "traversed":{
      "fill": "#fff",
      "font-family": "sans-serif",
      "font-size": 12,
      "text-anchor": "middle"
    }
  },
};

/*
 * GraphEdgeWidget
 */

var graphEdgeProperties = {
  "default":{
    "stroke": "#333",
    "stroke-width": 2
  },
  "highlighted":{
    "stroke": highlightVertexColor,
    "stroke-width": 2
  },
  "traversed":{
    "stroke": traversedVertexColor,
    "stroke-width": 2
  }
}

/*
 *
 */