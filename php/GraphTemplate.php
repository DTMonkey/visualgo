<?php
$GRAPH_TEMPLATE_EMPTY = array(
    "internalAdjList" => array(),
    "internalEdgeList" => array()
  );
$GRAPH_TEMPLATE_K5 = array(
    "internalAdjList" => array(
      0=>array(
          "cxPercentage" => 31.1,
          "cyPercentage" => 30,
          1 => 0,
          2 => 1,
          3 => 2,
          4 => 3
        ),
      1=>array(
          "cxPercentage" => 68.9,
          "cyPercentage" => 30,
          0 => 0,
          2 => 4,
          3 => 5,
          4 => 6
        ),
      2=>array(
          "cxPercentage" => 38.9,
          "cyPercentage" => 76,
          0 => 1,
          1 => 4,
          3 => 7,
          4 => 8
        ),
      3=>array(
          "cxPercentage" => 50,
          "cyPercentage" => 10,
          0 => 2,
          1 => 5,
          2 => 7,
          4 => 9
        ),
      4=>array(
          "cxPercentage" => 61.1,
          "cyPercentage" => 76,
          0 => 3,
          1 => 6,
          2 => 8,
          3 => 9
        ),
      ),
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
$GRAPH_TEMPLATE_TESSELLATION = array(
    "internalAdjList" => array(
      0 => array(
          "cxPercentage" => 22.2,
          "cyPercentage" => 10,
          1 => 0,
          2=>1
        ),
      1=>array(
          "cxPercentage" => 22.2,
          "cyPercentage" => 34,
          0 =>0,
          2=>2,
          3=>3,
          4=>4
        ),
      2=>array(
          "cxPercentage" => 38.9,
          "cyPercentage" => 22,
          0 =>1,
          1=>2,
          3=>5,
          6=>6
        ),
      3=>array(
          "cxPercentage" => 55.6,
          "cyPercentage" => 34,
          1 => 3,
          2 => 5,
          4 => 7,
          5 => 8,
          6 => 9,
          7 => 10,
          8 => 11
        ),
      4=>array(
          "cxPercentage" => 30.6,
          "cyPercentage" => 58,
          1 => 4,
          3 => 7,
          5 => 12
        ),
      5=>array(
          "cxPercentage" => 55.6,
          "cyPercentage" => 58,
          3 => 8,
          4 => 12,
          7 => 13
        ),
      6=>array(
          "cxPercentage" => 66.7,
          "cyPercentage" => 10,
          2 => 6,
          3 => 9,
          8 => 14
        ),
      7=>array(
          "cxPercentage" => 71.1,
          "cyPercentage" => 48,
          3 => 10,
          5 => 13,
          8 => 15
        ),
      8=>array(
          "cxPercentage" => 77.8,
          "cyPercentage" => 24,
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
$GRAPH_TEMPLATE_RAIL = array(
    "internalAdjList" => array(
      0 => array(
          "cx" =>  50,
          "cy" =>  100,
          1 => 0
        ),
      1 => array(
          "cx" =>  250,
          "cy" =>  100,
          0 => 0,
          2 => 1,
          6 => 2,
          7 => 3
        ),
      2 => array(
          "cx" =>  450,
          "cy" =>  100,
          1 => 1,
          3 => 4,
          7 => 5,
          8 => 6
        ),
      3 => array(
          "cx" =>  650,
          "cy" =>  100,
          2 => 4,
          4 => 7,
          8 => 8
        ),
      4 => array(
          "cx" =>  850,
          "cy" =>  100,
          3 => 7
        ),
      5 => array(
          "cx" =>  50,
          "cy" =>  250,
          6 => 9
        ),
      6 => array(
          "cx" =>  250,
          "cy" =>  250,
          1 => 2,
          5 => 9,
          7 => 10
        ),
      7 => array(
          "cx" =>  450,
          "cy" =>  250,
          1 => 3,
          2 => 5,
          6 => 10,
          8 => 11
        ),
      8 => array(
          "cx" =>  650,
          "cy" =>  250,
          2 => 6,
          3 => 8,
          7 => 11,
          9 => 12
        ),
      9 => array(
          "cx" =>  850,
          "cy" =>  250,
          8 => 12
        )
      ),
    "internalEdgeList" => array(
      0 => array(
          "vertexA" =>  0,
          "vertexB" =>  1,
          "weight" =>  10
        ),
      1 => array(
          "vertexA" =>  1,
          "vertexB" =>  2,
          "weight" =>  10
        ),
      2 => array(
          "vertexA" =>  1,
          "vertexB" =>  6,
          "weight" =>  8
        ),
      3 => array(
          "vertexA" =>  1,
          "vertexB" =>  7,
          "weight" =>  13
        ),
      4 => array(
          "vertexA" =>  2,
          "vertexB" =>  3,
          "weight" =>  10
        ),
      5 => array(
          "vertexA" =>  2,
          "vertexB" =>  7,
          "weight" =>  8
        ),
      6 => array(
          "vertexA" =>  2,
          "vertexB" =>  8,
          "weight" =>  13
        ),
      7 => array(
          "vertexA" =>  3,
          "vertexB" =>  4,
          "weight" =>  10
        ),
      8 => array(
          "vertexA" =>  3,
          "vertexB" =>  8,
          "weight" =>  8
        ),
      9 => array(
          "vertexA" =>  5,
          "vertexB" =>  6,
          "weight" =>  10
        ),
      10 => array(
          "vertexA" =>  6,
          "vertexB" =>  7,
          "weight" =>  10
        ),
      11 => array(
          "vertexA" =>  7,
          "vertexB" =>  8,
          "weight" =>  10
        ),
      12 => array(
          "vertexA" =>  8,
          "vertexB" =>  9,
          "weight" =>  10
        )
      )
  );


function createState($internalAdjListObject, $internalEdgeListObject){
  $state = array(
    "vl"=>array(),
    "el"=>array()
  );

  foreach ($internalAdjListObject as $key => $value){
    $state["vl"][$key] = array();

    $state["vl"][$key]["cxPercentage"] = $internalAdjListObject[$key]["cxPercentage"];
    $state["vl"][$key]["cyPercentage"] = $internalAdjListObject[$key]["cyPercentage"];
    $state["vl"][$key]["text"] = $key;
  }
  foreach ($internalEdgeListObject as $key => $value){
    $state["el"][$key] = arrray();

    $state["el"][$key]["vertexA"] = $internalEdgeListObject[$key]["vertexA"];
    $state["el"][$key]["vertexB"] = $internalEdgeListObject[$key]["vertexB"];
    $state["el"][$key]["weight"] = $internalEdgeListObject[$key]["weight"];
  }
}
?>