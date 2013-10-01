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
    },
	"greenFill":{
      "fill": "#52bc69",
      "stroke": "#fff"
    },
	"greenOutline":{
      "fill": "#eee",
      "stroke": "#fff"
    },
	"pinkFill":{
      "fill": "#ed5a7d",
      "stroke": "#fff"
    },
	"pinkOutline":{
      "fill": "#eee",
      "stroke": "#fff"
    },
	"blueFill":{
      "fill": "#2ebbd1",
      "stroke": "#fff"
    },
	"blueOutline":{
      "fill": "#eee",
      "stroke": "#fff"
    },
	"redFill":{
      "fill": "#d9513c",
      "stroke": "#fff"
    },
	"redOutline":{
      "fill": "#eee",
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
    },
	"greenFill":{
      "fill": "#52bc69",
      "stroke": "#52bc69"
    },
	"greenOutline":{
      "fill": "#52bc69",
      "stroke": "#52bc69"
    },
	"pinkFill":{
      "fill": "#ed5a7d",
      "stroke": "#ed5a7d"
    },
	"pinkOutline":{
      "fill": "#ed5a7d",
      "stroke": "#ed5a7d"
    },
	"blueFill":{
      "fill": "#2ebbd1",
      "stroke": "#2ebbd1"
    },
	"blueOutline":{
      "fill": "#2ebbd1",
      "stroke": "#2ebbd1"
    },
	"redFill":{
      "fill": "#d9513c",
      "stroke": "#d9513c"
    },
	"redOutline":{
      "fill": "#d9513c",
      "stroke": "#d9513c"
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
    },
	"greenFill":{
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"greenOutline":{
      "fill": "#52bc69",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"pinkFill":{
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"pinkOutline":{
      "fill": "#ed5a7d",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"blueFill":{
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"blueOutline":{
      "fill": "#2ebbd1",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"redFill":{
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"redOutline":{
      "fill": "#d9513c",
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
  "animateHighlightedPath":{
      "stroke": surpriseColour,
      "stroke-width": 10
  },
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
    },
	"green":{
      "stroke": "#52bc69"
    },
	"pink":{
      "stroke": "#ed5a7d"
    },
	"blue":{
      "stroke": "#2ebbd1"
    },
	"red":{
      "stroke": "#d9513c"
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
    },
	"green":{
      "startOffset": "50%",
      "fill": "#52bc69",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"pink":{
      "startOffset": "50%",
      "fill": "#ed5a7d",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"blue":{
      "startOffset": "50%",
      "fill": "#2ebbd1",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
	"red":{
      "startOffset": "50%",
      "fill": "#d9513c",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    }
  }
}

/*
 *
 */