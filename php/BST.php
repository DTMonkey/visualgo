<?php
  class BST{
    protected $root;
    protected $height;
    protected $elements;

    public function __construct(){
      $root = NULL;
      $height = 0;
      $elements = array();
    }

    public function getAllElements(){
      return array_keys($elements);
    }

    public function toGraphState(){
      $graphState = array("vl" => array(), "el" => array());

      foreach($elements as $key => $value){
        $vertexState = array(
          "cxPercentage" => $value->cxPercentage,
          "cyPercentage" => $value->cyPercentage,
          "text" => $value->value
          );
        $graphState["vl"] += array($key => $vertexState);
        if($root != $value->value){
          $edgeState = $array(
            "vertexA" => $value->parent->value;
            "vertexB" => $value->value;
            );
          $graphState["el"] += array($key => $edgeState);
        }
      }

      return $graphState;
    }

    public function insertRandomElements($amt){
      for($i = 0; $i < $amt; $i++){
        $newElement = mt_rand(0,100);
        if(!array_key_exists($newElement, $elements)){
          $this->insert($newElement);
        }
        else $i--;
      }
    }

    public function search($val){
      $searchSequence = array();

      $node = $root;

      while(!is_null($node) && $node->value != $val){
        $currentValue = $node->value;
        $searchSequence[] = $currentValue;

        if($val > $currentValue){
          $node = $node->rightChild;
        }
        else $node = $node->leftChild;
      }

      return $searchSequence;
    }

    public function insert($val){
      $newNode = new BSTNode($val);
      $cxPercent = 50;
      $cyPercent = 10;
      $xDifferencePercent = 50;

      $elements += array($val => $newNode);

      if(is_null($root)){
        $root = $val;
        $height = 1;
      }

      else{
        $parentNode = NULL;
        $node = $root;

        do{
          $xDifferencePercent/=2;
          $cyPercent += 10;
          $parentNode = $node;
          if($newNode->value > $parentNode->value){
            $node = $parentNode->rightChild;
            $cxPercent += $xDifferencePercent;
          }
          else{
            $node = $parentNode->leftChild;
            $cxPercent -= $xDifferencePercent;
          }
        }while(!is_null($node));

        if($newNode->value > $parentNode->value){
          $parent->rightChild = $newNode;
        }
        else $parent->leftChild = $newNode;

        $newNode->parent = $parentNode;
        $newNode->$height = 1 + $parentNode->height;
      }

      $newNode->cxPercentage = $cxPercent;
      $newNode->cyPercentage = $cyPercent;
    }

  }

  class BSTNode{
    protected $value;
    protected $height;
    protected $parent;
    protected $leftChild;
    protected $rightChild;
    protected $cxPercentage;
    protected $cyPercentage;

    function __construct($val){
      $value = $val;
      $height = 1;
      $parent = NULL;
      $leftChild = NULL;
      $rightChild = NULL;
    }

    public function __get($property) {
      if (property_exists($this, $property)) {
        return $this->$property;
      }
    }

    public function __set($property, $value) {
      if (property_exists($this, $property)) {
        $this->$property = $value;
      }

      return $this;
    }
  }
?>