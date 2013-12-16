<?php
  class UFDS{
    protected $elements;
    protected $setAmt;

    public function __construct(){
      $this->init();
    }

    public function seedRng($seed){
      mt_srand($seed);
    }

    public function clearAll(){
      $this->init();
    }

    protected function init(){
      $this->elements = array();
      $this->setAmt = 0;
    }

    public function toGraphState(){
      $graphState = array("vl" => array(), "el" => array());

      foreach($this->elements as $key => $value){
        $vertexState = array(
          "cxPercentage" => $value->cxPercentage,
          "cyPercentage" => $value->cyPercentage,
          "text" => $value->value
          );
        $graphState["vl"] += array($key => $vertexState);
        if(!$isRoot){
          $edgeState = array(
            "vertexA" => $value->parent->key,
            "vertexB" => $value->key
            );
          $graphState["el"] += array($key => $edgeState);
        }
      }

      return $graphState;
    }

    public function insert($val){
      $this->elements[$val] = array("parent" => $val, "rank" => 0, "childrenAmt" => 0);
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
        $temp = mt_rand(0, count($singleMemberSets)-1);
        $sets[] = array($temp);
        unset($singleMemberSets[$temp]);
        $singleMemberSets = array_values($singleMemberSets);
      }

      while(count($singleMemberSets) > 0){
        $setToAssign = mt_rand(0, $setAmt - 1);
        $sets[$setToAssign][] = $singleMemberSets[0];
        array_shift($singleMemberSets);
      }

      foreach($sets as $set){
        foreach($set as $value){
          $this->unionSetNoPathCompression($set[0], $value);
        }
      }
    }

    public function isSameSet($val1, $val2){
      return $this->findSet($val1) == $this->findSet($val2);
    }

    public function findSet($val){
      $root = $val;
      $originalVal = $val;

      do{
        $val = $root;
        $root = $this->elements[$val]["parent"];
      } while($val != $root);

      $this->compressPath($originalVal, $root);

      return $root;
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
        if($rank1 == $rank2) $this->elements[$root2]++;
        $this->elements[$root2]["childrenAmt"]++;
      }
    }

    protected function unionSetNoPathCompression($val1, $val2){
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
        if($rank1 == $rank2) $this->elements[$root2]++;
      }

      $this->setAmt--;
    }

    protected function findSetNoPathCompression($val){
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