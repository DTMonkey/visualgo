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
    "r": 14,
    "stroke-width": 0,
    "default":{
      "fill": "#eee",
      "stroke": "#fff"
    },
    "highlighted":{
      "fill": surpriseColour,
      "stroke": "#fff"
    },
    "traversed":{
      "fill": "#eee",
      "stroke": "#fff"
    },    
    "result":{
      "fill": "#f7e81e",
      "stroke": "#fff"
    }
  },
  "outerCircle":{
    "r": 16,
    "stroke-width": 2,
    "default":{
      "fill": "#333",
      "stroke": "#333"
    },
    "highlighted":{
      "fill": surpriseColour,
      "stroke": surpriseColour
    },
    "traversed":{
      "fill": surpriseColour,
      "stroke": surpriseColour
    },
    "result":{
      "fill": "#f7e81e",
      "stroke": "#f7e81e"
    }
  },
  "text":{
    "font-size": 16,
    "default":{
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "highlighted":{
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "traversed":{
      "fill": surpriseColour,
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "result":{
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    }
  }
};

/*
 * GraphEdgeWidget
 */

var graphEdgeProperties = {
  "path":{
    "stroke-width": 3,
    "default":{
      "stroke": "#333"
    },
    "highlighted":{
      "stroke": surpriseColour
    },
    "traversed":{
      "stroke": surpriseColour
    }
  },
  "weight":{
    "font-size": 16,
    "default":{
      "startOffset": "50%",
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "highlighted":{
      "startOffset": "50%",
      "fill": surpriseColour,
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "traversed":{
      "startOffset": "50%",
      "fill": surpriseColour,
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    }
  }
}

/*
 *
 */