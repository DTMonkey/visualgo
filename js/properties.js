/*
 * Widget
 */

var MAIN_SVG_WIDTH = 1000;
var MAIN_SVG_HEIGHT = 300;
var PSEUDOCODE_SVG_WIDTH = 300;
var PSEUDOCODE_SVG_HEIGHT = 400;
/*
 * GraphVertexWidget
 */

var graphVertexProperties = {
  "innerCircle":{
    "default":{
      "fill": "#eee",
      "r": 12,
      "stroke": "#fff",
      "stroke-width": 0
    },
    "highlighted":{
      "fill": "#00f",
      "r": 12,
      "stroke": "#fff",
      "stroke-width": 0
    },
    "transversed":{
      "fill": "#0f0",
      "r": 12,
      "stroke": "#fff",
      "stroke-width": 0
    }
  },
  "outerCircle":{
    "default":{
      "fill": "#fff",
      "r": 16,
      "stroke": "#333",
      "stroke-width": 2
    },
    "highlighted":{
      "fill": "#fff",
      "r": 16,
      "stroke": "#00f",
      "stroke-width": 2
    },
    "transversed":{
      "fill": "#fff",
      "r": 16,
      "stroke": "#0f0",
      "stroke-width": 2
    }
  },
  "text":{
    "default":{
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-size": 12,
      "text-anchor": "middle"
    },
    "highlighted":{
      "fill": "#0f0",
      "font-family": "sans-serif",
      "font-size": 12,
      "text-anchor": "middle"
    },
    "transversed":{
      "fill": "#00f",
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
    "stroke-width": 3
  },
  "highlighted":{
    "stroke": "#f00",
    "stroke-width": 2
  },
  "transversed":{
    "stroke": "#f0f",
    "stroke-width": 2
  }
}

/*
 *
 */