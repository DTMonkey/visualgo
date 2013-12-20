<?php
class GraphTemplate{
  protected static $graphTemplate = array(
    GRAPH_TEMPLATE_EMPTY => array(
        "internalAdjList" => array(),
        "internalEdgeList" => array()
      ),
    GRAPH_TEMPLATE_K5 => array(
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
              
            ),
          1=>array(
              "vertexA" => 0,
              "vertexB" => 2,
              
            ),
          2=>array(
              "vertexA" => 0,
              "vertexB" => 3,
              
            ),
          3=>array(
              "vertexA" => 0,
              "vertexB" => 4,
              
            ),
          4=>array(
              "vertexA" => 1,
              "vertexB" => 2,
              
            ),
          5=>array(
              "vertexA" => 1,
              "vertexB" => 3,
              
            ),
          6=>array(
              "vertexA" => 1,
              "vertexB" => 4,
              
            ),
          7=>array(
              "vertexA" => 2,
              "vertexB" => 3,
              
            ),
          8=>array(
              "vertexA" => 2,
              "vertexB" => 4,
              
            ),
          9=>array(
              "vertexA" => 3,
              "vertexB" => 4,
            )
          )
      ),
    GRAPH_TEMPLATE_TESSELLATION => array(
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
            ),
          1=>array(
              "vertexA" => 0,
              "vertexB" => 2,
            ),
          2=>array(
              "vertexA" => 1,
              "vertexB" => 2,
              
            ),
          3=>array(
              "vertexA" => 1,
              "vertexB" => 3,
              
            ),
          4=>array(
              "vertexA" => 1,
              "vertexB" => 4,
            ),
          5=>array(
              "vertexA" => 2,
              "vertexB" => 3,
            ),
          6=>array(
              "vertexA" => 2,
              "vertexB" => 6,
              
            ),
          7=>array(
              "vertexA" => 3,
              "vertexB" => 4,
              
            ),
          8=>array(
              "vertexA" => 3,
              "vertexB" => 5,
            ),
          9=>array(
              "vertexA" => 3,
              "vertexB" => 6,
              
            ),
          10=>array(
              "vertexA" => 3,
              "vertexB" => 7,
            ),
          11=>array(
              "vertexA" => 3,
              "vertexB" => 8,
            ),
          12=>array(
              "vertexA" => 4,
              "vertexB" => 5,
              
            ),
          13=>array(
              "vertexA" => 5,
              "vertexB" => 7,
              
            ),
          14=>array(
              "vertexA" => 6,
              "vertexB" => 8,
              
            ),
          15=>array(
              "vertexA" => 7,
              "vertexB" => 8,
            )
          )
      ),
    GRAPH_TEMPLATE_RAIL => array(
        "internalAdjList" => array(
          0 => array(
              "cxPercentage" =>  5.6,
              "cyPercentage" =>  20,
              1 => 0
            ),
          1 => array(
              "cxPercentage" =>  27.8,
              "cyPercentage" =>  20,
              0 => 0,
              2 => 1,
              6 => 2,
              7 => 3
            ),
          2 => array(
              "cxPercentage" =>  50,
              "cyPercentage" =>  20,
              1 => 1,
              3 => 4,
              7 => 5,
              8 => 6
            ),
          3 => array(
              "cxPercentage" =>  72.2,
              "cyPercentage" =>  20,
              2 => 4,
              4 => 7,
              8 => 8
            ),
          4 => array(
              "cxPercentage" =>  94.4,
              "cyPercentage" =>  20,
              3 => 7
            ),
          5 => array(
              "cxPercentage" =>  5.6,
              "cyPercentage" =>  50,
              6 => 9
            ),
          6 => array(
              "cxPercentage" =>  27.8,
              "cyPercentage" =>  50,
              1 => 2,
              5 => 9,
              7 => 10
            ),
          7 => array(
              "cxPercentage" =>  50,
              "cyPercentage" =>  50,
              1 => 3,
              2 => 5,
              6 => 10,
              8 => 11
            ),
          8 => array(
              "cxPercentage" =>  72.2,
              "cyPercentage" =>  50,
              2 => 6,
              3 => 8,
              7 => 11,
              9 => 12
            ),
          9 => array(
              "cxPercentage" =>  94.4,
              "cyPercentage" =>  50,
              8 => 12
            )
          ),
        "internalEdgeList" => array(
          0 => array(
              "vertexA" =>  0,
              "vertexB" =>  1,
            ),
          1 => array(
              "vertexA" =>  1,
              "vertexB" =>  2,
            ),
          2 => array(
              "vertexA" =>  1,
              "vertexB" =>  6,
              
            ),
          3 => array(
              "vertexA" =>  1,
              "vertexB" =>  7
            ),
          4 => array(
              "vertexA" =>  2,
              "vertexB" =>  3
            ),
          5 => array(
              "vertexA" =>  2,
              "vertexB" =>  7
            ),
          6 => array(
              "vertexA" =>  2,
              "vertexB" =>  8
            ),
          7 => array(
              "vertexA" =>  3,
              "vertexB" =>  4
            ),
          8 => array(
              "vertexA" =>  3,
              "vertexB" =>  8
            ),
          9 => array(
              "vertexA" =>  5,
              "vertexB" =>  6
            ),
          10 => array(
              "vertexA" =>  6,
              "vertexB" =>  7
            ),
          11 => array(
              "vertexA" =>  7,
              "vertexB" =>  8
            ),
          12 => array(
              "vertexA" =>  8,
              "vertexB" =>  9
            )
          )
      ),
    GRAPH_TEMPLATE_CP4P10 => array(
        "internalAdjList" => array(
          0 => array(
              "cxPercentage" =>  38.9,
              "cyPercentage" =>  30,
              1 => 0,
              2 => 1,
              3 => 2,
              4 => 3
            ),
          1 => array(
              "cxPercentage" =>  50,
              "cyPercentage" =>  10,
              0 => 0,
              2 => 4
            ),
          2 => array(
              "cxPercentage" =>  61.1,
              "cyPercentage" =>  30,
              0 => 1,
              1 => 4,
              3 => 5
            ),
          3 => array(
              "cxPercentage" =>  50,
              "cyPercentage" =>  50,
              0 => 2,
              2 => 5,
              4 => 6
            ),
          4 => array(
              "cxPercentage" =>  38.9,
              "cyPercentage" =>  70,
              0 => 3,
              3 => 6
            )
          ),
        "internalEdgeList" => array(
          0 => array(
              "vertexA" =>  0,
              "vertexB" =>  1
            ),
          1 => array(
              "vertexA" =>  0,
              "vertexB" =>  2
            ),
          2 => array(
              "vertexA" =>  0,
              "vertexB" =>  3
            ),
          3 => array(
              "vertexA" =>  0,
              "vertexB" =>  4
            ),
          4 => array(
              "vertexA" =>  1,
              "vertexB" =>  2
            ),
          5 => array(
              "vertexA" =>  2,
              "vertexB" =>  3
            ),
          6 => array(
              "vertexA" =>  3,
              "vertexB" =>  4
            )
          )
      ),
    GRAPH_TEMPLATE_CP3_4_17 => array(
        "internalAdjList" => array(
          0 => array(
              "cx" => 210,
              "cy" => 190,
              "text" => 0,
              4 =>3
            ),
          1 => array(
              "cx" => 50,
              "cy" => 50,
              "text" => 1,
              3 =>1,
              4 =>0
            ),
          2 => array(
              "cx" => 170,
              "cy" => 120,
              "text" => 2,
              0 =>4,
              1 =>2,
              3 =>6
            ),
          3 => array(
              "cx" => 330,
              "cy" => 50,
              "text" => 3,
              4 =>5
            ),
          4 => array(
              "cx" => 240,
              "cy" => 280,
              "text" => 4,
            )
          ),
        "internalEdgeList" => array(
          0 => array(
              "vertexA" => 1,
              "vertexB" => 4
            ),
          1 => array(
              "vertexA" => 1,
              "vertexB" => 3
            ),
          2 => array(
              "vertexA" => 2,
              "vertexB" => 1
            ),
          3 => array(
              "vertexA" => 0,
              "vertexB" => 4
            ),
          4 => array(
              "vertexA" => 2,
              "vertexB" => 0
            ),
          5 => array(
              "vertexA" => 3,
              "vertexB" => 4
            ),
          6 => array(
              "vertexA" => 2,
              "vertexB" => 3
            )
          )
      ),
    GRAPH_TEMPLATE_CP3_4_18 => array(
        "internalAdjList" => array(
          0 => array(
              "cx" => 50,
              "cy" => 125,
              "text" => 0,
              1 =>0,
              2 =>3
            ),
          1 => array(
              "cx" => 150,
              "cy" => 50,
              "text" => 1,
              3 =>2
            ),
          2 => array(
              "cx" => 150,
              "cy" => 200,
              "text" => 2,
              3 =>4
            ),
          3 => array(
              "cx" => 250,
              "cy" => 125,
              "text" => 3,
              4 =>2
            ),
          4 => array(
              "cx" => 350,
              "cy" => 125,
              "text" => 4,
            )
          ),
        "internalEdgeList" => array(
          0 => array(
              "vertexA" => 0,
              "vertexB" => 1
            ),
          1 => array(
              "vertexA" => 1,
              "vertexB" => 3
            ),
          2 => array(
              "vertexA" => 3,
              "vertexB" => 4
            ),
          3 => array(
              "vertexA" => 0,
              "vertexB" => 2
            ),
          4 => array(
              "vertexA" => 2,
              "vertexB" => 3
            )
          )
      ),
    GRAPH_TEMPLATE_CP3_4_19 => array(
        "internalAdjList" => array(
          0 => array(
            "cx" => 50,
            "cy" => 50,
            "text" => 0,
            1 =>0,
            4 =>4
            ),
          1 => array(
            "cx" => 150,
            "cy" => 50,
            "text" => 1,
            2 =>1
            ),
          2 => array(
            "cx" => 250,
            "cy" => 50,
            "text" => 2,
            1 =>2,
            3 =>3
            ),
          3 => array(
            "cx" => 350,
            "cy" => 50,
            "text" => 3
            ),
          4 => array(
            "cx" => 150,
            "cy" => 125,
            "text" => 4
            )
          ),
        "internalEdgeList" => array(
          0 => array(
              "vertexA" => 0,
              "vertexB" => 1
            ),
          1 => array(
              "vertexA" => 1,
              "vertexB" => 2
            ),
          2 => array(
              "vertexA" => 2,
              "vertexB" => 1
            ),
          3 => array(
              "vertexA" => 2,
              "vertexB" => 3
            ),
          4 => array(
              "vertexA" => 0,
              "vertexB" => 4
            )
          )
      )
    );
  protected static $graphTemplateIndex = array(
    GRAPH_TEMPLATE_TYPE_DIRECTED => array(
      GRAPH_TEMPLATE_CP3_4_17, GRAPH_TEMPLATE_CP3_4_18, GRAPH_TEMPLATE_CP3_4_19
      ),
    GRAPH_TEMPLATE_TYPE_UNDIRECTED => array(
      GRAPH_TEMPLATE_K5, GRAPH_TEMPLATE_TESSELLATION, GRAPH_TEMPLATE_RAIL, GRAPH_TEMPLATE_CP4P10
      )
    );

  public function __construct(){

  }

  /*
   * Pass in a variable called $params to getGraph, containing these informations =>
   * - "numVertex" => number of vertex desired
   * - "directed" => boolean, directed or undirected
   * - Optionals =>
   *   - "connected" => boolean, connected or disconnected
   *   - "negativeEdge" => boolean, contains negative edges or not
   *   - "negativeCycle" => boolean, contains negative cycles or not
   * - Optionals for directed graphs =>
   *   - "isDag" => boolean, is DAG or not
   */

  public static function getGraph($params){
    $template = array_copy(self::$graphTemplate[GRAPH_TEMPLATE_EMPTY]);
    $templateBank;

    if($params["directed"]) $templateBank = self::$graphTemplateIndex[GRAPH_TEMPLATE_TYPE_DIRECTED];
    else $templateBank = self::$graphTemplateIndex[GRAPH_TEMPLATE_TYPE_UNDIRECTED];

    while(count($template["internalAdjList"]) < $params["numVertex"]){
      $templateName = $templateBank[rand(0, count($templateBank)-1)];
      $template = array_copy(self::$graphTemplate[$templateName]);
    }

    $weightList = array(0);
    $connected = false;
    if($params["connected"]) $connected = true;

    self::reduceVertexUndirected($template, $params["numVertex"], $connected);
    if(!$connected && !self::isConnected($template, $params["directed"])) self::disconnect($template);
    self::randomizeWeight($template);

    return $template;
  }

  /*
   * Pass in a variable called $params to createState, containing these informations =>
   * - "displayWeight" => boolean, display or hide weight
   * - "directed" => boolean, directed or undirected
   */

  public static function createState($graphTemplate, $params){
    $internalAdjListObject = $graphTemplate["internalAdjList"];
    $internalEdgeListObject = $graphTemplate["internalEdgeList"];

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
      $state["el"][$key] = array();

      $state["el"][$key]["vertexA"] = $internalEdgeListObject[$key]["vertexA"];
      $state["el"][$key]["vertexB"] = $internalEdgeListObject[$key]["vertexB"];
      $state["el"][$key]["weight"] = $internalEdgeListObject[$key]["weight"];
      if($params["displayWeight"]) $state["el"][$key]["displayWeight"] = true;
      if($params["directed"]) $state["el"][$key]["type"] = EDGE_TYPE_DE;
    }

    return $state;
  }

  protected static function reduceVertexUndirected(&$template, $numVertex, $connected){
    $tempTemplate = array_copy($template);
    $indexList = array_keys($template["internalAdjList"]);
    while(count($indexList) > 0){
      if(count($tempTemplate["internalAdjList"]) <= $numVertex) break;
      $indexChosen = rand(0, count($indexList)-1);
      $index = $indexList[$indexChosen];
      $templateCopy = array_copy($tempTemplate);
      $adjacent = $tempTemplate["internalAdjList"][$index];
      unset($adjacent["cxPercentage"]);
      unset($adjacent["cyPercentage"]);

      foreach($adjacent as $key => $value){
        unset($templateCopy["internalAdjList"][$key][$index]);
        unset($templateCopy["internalEdgeList"][$value]);
      }
      unset($templateCopy["internalAdjList"][$index]);
      if(!$connected || self::isConnected($templateCopy, FALSE)){
        $tempTemplate = $templateCopy;
      }
      unset($indexList[$indexChosen]);
      $indexList = array_values($indexList);
    }
    $template = $tempTemplate;
  }

  protected static function randomizeWeight(&$template){
    $weightList = array(0);

    foreach($template["internalEdgeList"] as $key => $value){
      $weight = 0;

      while(in_array($weight, $weightList)){
        $weight = rand(1, 99);
      }
      $weightList[] = $weight;

      $template["internalEdgeList"][$key]["weight"] = $weight;
    }
  }

  protected static function disconnect(&$template, $directed){

  }

  protected static function isConnected($template, $directed){
    $visited = array();

    if(!$directed){
      $arr = array_keys($template["internalAdjList"]);
      $initVertex = $arr[0];
      $queue = array();
      $visited[] = $initVertex;
      $adjacent = $template["internalAdjList"][$initVertex];
      unset($adjacent["cxPercentage"]);
      unset($adjacent["cyPercentage"]);

      foreach($adjacent as $key => $value){
        $queue[] = $key;
      }

      while(count($queue) > 0){
        $currVertex = $queue[0];
        array_shift($queue);
        if(!in_array($currVertex, $visited)){
          $visited[] = $currVertex;
          $adjacent = $template["internalAdjList"][$currVertex];
          unset($adjacent["cxPercentage"]);
          unset($adjacent["cyPercentage"]);
          foreach($adjacent as $key => $value){
            $queue[] = $key;
          }
        }
      }

      return count($visited) == count($template["internalAdjList"]);
    }
    else{
      // $vertexList = array_keys($template["internalAdjList"]);
      // $ufds = new UFDS();

      // foreach($vertexList as $key){
      //   $ufds->insert($key);
      // }

      // while(count($visited) != count($template["internalAdjList"])){
      //   $vertex = array_shift($vertexList);
      //   if(in_array($vertex, $visited)) continue;
      //   $queue = array($vertex);

      //   while(count($queue) > 0){
      //     $currVertex = array_shift($queue);
      //     if(in_array($currVertex, $visited)) continue;
      //     $visited[] = $currVertex;
      //     $ufds->unionSet($currVertex, $vertex);
      //     $adjacent = $template["internalAdjList"][$currVertex];
      //     unset($adjacent["cxPercentage"]);
      //     unset($adjacent["cyPercentage"]);
      //     foreach($adjacent as $key){
      //       $queue[] = $key;
      //     }
      //   }
      // }

      // return $ufds->getSetAmt() == 1;
    }
  }

  protected static function toposort($template){

  }
}
?>