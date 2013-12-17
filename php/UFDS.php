<?php
  class UFDS{
    protected $elements;
    protected $setAmt;

    public function __construct(){
      $this->init();
    }

    // public function seedRng($seed){
    //   srand($seed);
    // }

    public function clearAll(){
      $this->init();
    }

    protected function init(){
      $this->elements = array();
      $this->setAmt = 0;
    }

    public function toGraphState(){
      $graphState = array("vl" => array(), "el" => array());

      $this->layoutGraph();

      foreach($this->elements as $key => $value){
        $isRoot = $value["parent"] == $key;
        $vertexState = array(
          "cxPercentage" => $value["cxPercentage"],
          "cyPercentage" => $value["cyPercentage"],
          "text" => $key
          );
        $graphState["vl"] += array($key => $vertexState);
        if(!$isRoot){
          $edgeState = array(
            "vertexA" => $value["parent"],
            "vertexB" => $key
            );
          $graphState["el"] += array($key => $edgeState);
        }
      }

      return $graphState;
    }

    protected function layoutGraph(){
      // draw first level
      $firstLevel = 0;
      $roots = array();
      for ($i = 0; $i < count($this->elements); $i++) {
        $this->elements[$i]["cxPercentage"] = 0;
        $this->elements[$i]["cyPercentage"] = 0;
        $this->elements[$i]["drawn"] = 0;
        if ($this->elements[$i]["parent"] == $i)
          $firstLevel++;
      }

      $sectionWidth = 100 / $firstLevel;
      $xCoord = $sectionWidth / 2;
      $yCoord = 10;
      for ($i = 0; $i < count($this->elements); $i++)
        if ($this->elements[$i]["parent"] == $i) {
          $roots[] = $i;
          $this->elements[$i]["drawn"] = 1;
          $this->elements[$i]["cxPercentage"] = $xCoord;
          $this->elements[$i]["cyPercentage"] = $yCoord;
          $xCoord += $sectionWidth;
        }

      $currSubSection = 0;
      for ($j = 0; $j < count($roots); $j++)
        $this->drawRest($roots[$j], $sectionWidth, $currSubSection++, 1);
    }

    protected function drawRest($root, $subSectionWidth, $currSubSection, $level) {
      $totalChild = 0;
      $childs = array();
      for ($i = 0; $i < count($this->elements); $i++)
        if ($this->elements[$i]["parent"] == $root && $this->elements[$i]["drawn"] != 1)
          $totalChild++;

      if($totalChild <= 0) return;

      $vertexDistance = $subSectionWidth / $totalChild;
      $xCoord = ($this->elements[$root]["cxPercentage"] - $subSectionWidth/2) + ($vertexDistance/2);
      $yCoord = 10 + 10 * $level;
      for ($i = 0; $i < count($this->elements); $i++)
        if ($this->elements[$i]["parent"] == $root && $this->elements[$i]["drawn"] != 1){
          $childs[] = $i;
          $this->elements[$i]["drawn"] = 1;
          $this->elements[$i]["cxPercentage"] = $xCoord;
          $this->elements[$i]["cyPercentage"] = $yCoord;
          $xCoord += $vertexDistance;
        }

      $currSubSection1 = 0;
      for ($j = 0; $j < count($childs); $j++)
        $this->drawRest($childs[$j], $vertexDistance, $currSubSection1++, $level+1);
    }

    public function getAllElements(){
      return $this->elements;
    }

    public function insert($val){
      $this->elements[$val] = array("parent" => $val, "rank" => 0, "childrenAmt" => 0, "cxPercentage" => 0, "cyPercentage" => 0, "drawn" => 0);
      $this->setAmt++;
    }

    public function insertElements($amt, $setAmt){
      $sets = array();
      $singleMemberSets = array();

      for($i = 0; $i < $amt; $i++){
        $this->insert($i);
        $singleMemberSets[] = $i;
      }

      for($i = 0; $i < $setAmt; $i++){
        $temp = rand(0, count($singleMemberSets)-1);
        $sets[] = array($singleMemberSets[$temp]);
        unset($singleMemberSets[$temp]);
        $singleMemberSets = array_values($singleMemberSets);
      }

      while(count($singleMemberSets) > 0){
        $setToAssign = rand(0, $setAmt - 1);
        $sets[$setToAssign][] = $singleMemberSets[0];
        array_shift($singleMemberSets);
      }

      foreach($sets as $set){
        foreach($set as $value){
          $this->unionSetNoPathCompression($value, $set[0]);
        }
      }
    }

    public function isSameSetNoPathCompression($val1, $val2){
      return $this->findSetNoPathCompression($val1) == $this->findSetNoPathCompression($val2);
    }

    public function isSameSet($val1, $val2){
	  $arr1 = $this->findSet($val1);
	  $arr2 = $this->findSet($val2);
      return $arr1[count($arr1)-1] == $arr2[count($arr2)-1];
    }

    public function findSet($val){
      $root = $val;
      $originalVal = $val;

      $findSetSequence = array();

      do{
        $findSetSequence[] = $root;
        $val = $root;
        $root = $this->elements[$val]["parent"];
      } while($val != $root);

      $this->compressPath($originalVal, $root);
	  
      return $findSetSequence;
    }

    public function unionSet($val1, $val2){
      $root1 = $this->findSet($val1);
      $root2 = $this->findSet($val2);

      if($root1 == $root2) return;

      $rank1 = $this->elements[$root1]["rank"];
      $rank2 = $this->elements[$root2]["rank"];

      if($rank1 > $rank2){
        $this->elements[$root2]["parent"] = $root1;
        $this->elements[$root1]["childrenAmt"]++;
      }
      else{
        $this->elements[$root1]["parent"] = $root2;
        if($rank1 == $rank2) $this->elements[$root2]["rank"]++;
        $this->elements[$root2]["childrenAmt"]++;
      }
    }

    public function unionSetNoPathCompression($val1, $val2){
      $root1 = $this->findSetNoPathCompression($val1);
      $root2 = $this->findSetNoPathCompression($val2);

      if($root1 == $root2) return;

      $rank1 = $this->elements[$root1]["rank"];
      $rank2 = $this->elements[$root2]["rank"];

      if($rank1 > $rank2){
        $this->elements[$root2]["parent"] = $root1;
      }
      else{
        $this->elements[$root1]["parent"] = $root2;
        if($rank1 == $rank2) $this->elements[$root2]["rank"]++;
      }

      $this->setAmt--;
    }

    public function findSetNoPathCompression($val){
      $root = $val;
      $originalVal = $val;

      do{
        $val = $root;
        $root = $this->elements[$val]["parent"];
      } while($val != $root);

      return $root;
    }

    protected function compressPath($val, $root){
      $originalParent = $this->elements[$val]["parent"];
      $this->elements[$originalParent]["childrenAmt"]--;

      $this->elements[$val]["rank"] = $root;
      $this->elements[$root]["childrenAmt"]++;
    }
  }
?>