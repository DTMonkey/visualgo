<?php
const GRAPH_TEMPLATE_EMPTY = array(
    "internalAdjList" => array(),
    "internalEdgeList" => array()
  );
const GRAPH_TEMPLATE_K5 = array(
    "internalAdjList" => array(
      0=>array(
          "cx" => 280,
          "cy" => 150,
          1 => 0,
          2 => 1,
          3 => 2,
          4 => 3
        ),
      1=>array(
          "cx" => 620,
          "cy" => 150,
          0 => 0,
          2 => 4,
          3 => 5,
          4 => 6
        ),
      2=>array(
          "cx" => 350,
          "cy" => 340,
          0 => 1,
          1 => 4,
          3 => 7,
          4 => 8
        ),
      3=>array(
          "cx" => 450,
          "cy" => 50,
          0 => 2,
          1 => 5,
          2 => 7,
          4 => 9
        ),
      4=>array(
          "cx" => 550,
          "cy" => 340,
          0 => 3,
          1 => 6,
          2 => 8,
          3 => 9
        ),
      )
    "internalEdgeList" => array(
      0=>array(
          "vertexA" => 0,
          "vertexB" => 1,
          "weight" => 24
        ),
      1=>array(
          "vertexA" => 0,
          "vertexB" => 2,
          "weight" => 13
        ),
      2=>array(
          "vertexA" => 0,
          "vertexB" => 3,
          "weight" => 13
        ),
      3=>array(
          "vertexA" => 0,
          "vertexB" => 4,
          "weight" => 22
        ),
      4=>array(
          "vertexA" => 1,
          "vertexB" => 2,
          "weight" => 22
        ),
      5=>array(
          "vertexA" => 1,
          "vertexB" => 3,
          "weight" => 13
        ),
      6=>array(
          "vertexA" => 1,
          "vertexB" => 4,
          "weight" => 13
        ),
      7=>array(
          "vertexA" => 2,
          "vertexB" => 3,
          "weight" => 19
        ),
      8=>array(
          "vertexA" => 2,
          "vertexB" => 4,
          "weight" => 14
        ),
      9=>array(
          "vertexA" => 3,
          "vertexB" => 4,
          "weight" => 19
        )
      )
  );
const GRAPH_TEMPLATE_TESSELATION = array(
    "internalAdjList" => array(
      0 => array(
          "cx" => 200,
          "cy" => 50,
          1 => 0,
          2=>1
        ),
      1=>array(
          "cx" => 200,
          "cy" => 170,
          0 =>0,
          2=>2,
          3=>3,
          4=>4
        ),
      2=>array(
          "cx" => 350,
          "cy" => 110,
          0 =>1,
          1=>2,
          3=>5,
          6=>6
        ),
      3=>array(
          "cx" => 500,
          "cy" => 170,
          1 => 3,
          2 => 5,
          4 => 7,
          5 => 8,
          6 => 9,
          7 => 10,
          8 => 11
        ),
      4=>array(
          "cx" => 275,
          "cy" => 290,
          1 => 4,
          3 => 7,
          5 => 12
        ),
      5=>array(
          "cx" => 500,
          "cy" => 290,
          3 => 8,
          4 => 12,
          7 => 13
        ),
      6=>array(
          "cx" => 600,
          "cy" => 50,
          2 => 6,
          3 => 9,
          8 => 14
        ),
      7=>array(
          "cx" => 640,
          "cy" => 240,
          3 => 10,
          5 => 13,
          8 => 15
        ),
      8=>array(
          "cx" => 700,
          "cy" => 120,
          3 => 11,
          6 => 14,
          7 => 15
        )
      ),
    "internalEdgeList" => array(
      0=>array(
          "vertexA" => 0,
          "vertexB" => 1,
          "weight" => 8
        ),
      1=>array(
          "vertexA" => 0,
          "vertexB" => 2,
          "weight" => 12
        ),
      2=>array(
          "vertexA" => 1,
          "vertexB" => 2,
          "weight" => 13
        ),
      3=>array(
          "vertexA" => 1,
          "vertexB" => 3,
          "weight" => 25
        ),
      4=>array(
          "vertexA" => 1,
          "vertexB" => 4,
          "weight" => 9
        ),
      5=>array(
          "vertexA" => 2,
          "vertexB" => 3,
          "weight" => 14
        ),
      6=>array(
          "vertexA" => 2,
          "vertexB" => 6,
          "weight" => 21
        ),
      7=>array(
          "vertexA" => 3,
          "vertexB" => 4,
          "weight" => 20
        ),
      8=>array(
          "vertexA" => 3,
          "vertexB" => 5,
          "weight" => 8
        ),
      9=>array(
          "vertexA" => 3,
          "vertexB" => 6,
          "weight" => 12
        ),
      10=>array(
          "vertexA" => 3,
          "vertexB" => 7,
          "weight" => 12
        ),
      11=>array(
          "vertexA" => 3,
          "vertexB" => 8,
          "weight" => 16
        ),
      12=>array(
          "vertexA" => 4,
          "vertexB" => 5,
          "weight" => 19
        ),
      13=>array(
          "vertexA" => 5,
          "vertexB" => 7,
          "weight" => 11
        ),
      14=>array(
          "vertexA" => 6,
          "vertexB" => 8,
          "weight" => 11
        ),
      15=>array(
          "vertexA" => 7,
          "vertexB" => 8,
          "weight" => 9
        )
      )
  );

function createState($internalAdjListObject, $internalEdgeListObject){
  $state = array(
    "vl"=>array(),
    "el"=>array()
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