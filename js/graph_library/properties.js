/*
 * Widget
 */

var MAIN_SVG_WIDTH = 900;
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
      "r": 14,
      "stroke": "#fff",
      "stroke-width": 0
    },
    "highlighted":{
      "fill": surpriseColour,
      "r": 14,
      "stroke": "#fff",
      "stroke-width": 0
    },
    "traversed":{
      "fill": "#eee",
      "r": 14,
      "stroke": "#fff",
      "stroke-width": 0
    }
  },
  "outerCircle":{
    "default":{
      "fill": "#333",
      "r": 16,
      "stroke": "#333",
      "stroke-width": 2
    },
    "highlighted":{
      "fill": surpriseColour,
      "r": 16,
      "stroke": surpriseColour,
      "stroke-width": 2
    },
    "traversed":{
      "fill": surpriseColour,
      "r": 16,
      "stroke": surpriseColour,
      "stroke-width": 2
    }
  },
  "text":{
    "default":{
      "fill": "#000",
      "font-family": "'PT Sans', sans-serif",
      "font-size": 16,
	  "font-weight": "bold",
      "text-anchor": "middle"
    },
    "highlighted":{
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-size": 16,
	  "font-weight": "bold",
      "text-anchor": "middle"
    },
    "traversed":{
      "fill": surpriseColour,
      "font-family": "'PT Sans', sans-serif",
      "font-size": 16,
	  "font-weight": "bold",
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
    "stroke": surpriseColour,
    "stroke-width": 10
  },
  "traversed":{
    "stroke": surpriseColour,
    "stroke-width": 3
  }
}

/*
 *
 */