<?php
const GRAPH_TEMPLATE_EMPTY = array(
    "internalAdjList" => array(),
    "internalEdgeList" => array()
  );
const GRAPH_TEMPLATE_K5 = array(
    "internalAdjList" => array(
      0:array(
          "cx" => 280,
          "cy" => 150,
          1 => 0,
          2 => 1,
          3 => 2,
          4 => 3
        ),
      1:array(
          "cx" => 620,
          "cy" => 150,
          0 => 0,
          2 => 4,
          3 => 5,
          4 => 6
        ),
      2:array(
          "cx" => 350,
          "cy" => 340,
          0 => 1,
          1 => 4,
          3 => 7,
          4 => 8
        ),
      3:array(
          "cx" => 450,
          "cy" => 50,
          0 => 2,
          1 => 5,
          2 => 7,
          4 => 9
        ),
      4:array(
          "cx" => 550,
          "cy" => 340,
          0 => 3,
          1 => 6,
          2 => 8,
          3 => 9
        ),
      )
    "internalEdgeList" => array(
      0:array(
          "vertexA" => 0,
          "vertexB" => 1,
          "weight" => 24
        ),
      1:array(
          "vertexA" => 0,
          "vertexB" => 2,
          "weight" => 13
        ),
      2:array(
          "vertexA" => 0,
          "vertexB" => 3,
          "weight" => 13
        ),
      3:array(
          "vertexA" => 0,
          "vertexB" => 4,
          "weight" => 22
        ),
      4:array(
          "vertexA" => 1,
          "vertexB" => 2,
          "weight" => 22
        ),
      5:array(
          "vertexA" => 1,
          "vertexB" => 3,
          "weight" => 13
        ),
      6:array(
          "vertexA" => 1,
          "vertexB" => 4,
          "weight" => 13
        ),
      7:array(
          "vertexA" => 2,
          "vertexB" => 3,
          "weight" => 19
        ),
      8:array(
          "vertexA" => 2,
          "vertexB" => 4,
          "weight" => 14
        ),
      9:array(
          "vertexA" => 3,
          "vertexB" => 4,
          "weight" => 19
        )
      )
  );
const GRAPH_TEMPLATE_TESSELATION = array(
    "internalAdjList" => array(),
    "internalEdgeList" => array()
  );

function createState($internalAdjListObject, $internalEdgeListObject){
  $state = array(
    "vl":array(),
    "el":array()
  );

  for($internalAdjListObject as $key => $value){
    $state["vl"][$key] = array();

    $state["vl"][$key]["cx"] = $internalAdjListObject[$key]["cx"];
    $state["vl"][$key]["cy"] = $internalAdjListObject[$key]["cy"];
    $state["vl"][$key]["text"] = $key;
  }
  for($internalEdgeListObject as $key => $value){
    $state["el"][$key] = arrray();

    $state["el"][$key]["vertexA"] = $internalEdgeListObject[$key]["vertexA"];
    $state["el"][$key]["vertexB"] = $internalEdgeListObject[$key]["vertexB"];
    $state["el"][$key]["weight"] = $internalEdgeListObject[$key]["weight"];
  }
}
?>