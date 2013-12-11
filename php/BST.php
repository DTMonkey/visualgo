<?php
  class BST{
    protected $root;
    protected $height;
    protected $elements;

    public function __construct(){
      $this->init();
    }

    public function seedRng($seed){
      mt_srand($seed);
    }

    public function clearAll(){
      $this->init();
    }

    public function getAllElements(){
      return array_keys($this->elements);
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
        if($this->root != $value->value){
          $edgeState = array(
            "vertexA" => $value->parent->value,
            "vertexB" => $value->value
            );
          $graphState["el"] += array($key => $edgeState);
        }
      }

      return $graphState;
    }

    public function insertRandomElements($amt){
      $insertionSequence = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = mt_rand(1,99);
        if(!array_key_exists($newElement, $this->elements)){
          $this->insert($newElement);
          $insertionSequence[] = $newElement;
        }
        else $i--;
      }

      return $insertionSequence;
    }

    public function generateRandomBst($amt){
      $insertionSequence = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = mt_rand(1,99);
        if(!array_key_exists($newElement, $this->elements)){
          $this->insert($newElement);
          $insertionSequence[] = $newElement;
        }
        else $i--;
      }

      return $insertionSequence;
    }

    public function generateRandomUniformBst($amt){

    }

    public function generateLinkedListBst($amt, $direction){
      $insertionSequence = array();
      $tempInsertionSequence = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = mt_rand(1,99);
        if(!array_key_exists($newElement, $tempInsertionSequence)){
          $tempInsertionSequence[$newElement] = true;
        }
        else $i--;
      }

      $insertionSequence = array_keys($tempInsertionSequence);

      if($direction == BST_LINKED_LIST_ASCENDING) sort($insertionSequence);
      else rsort($insertionSequence);

      foreach($insertionSequence as $value){
        $this->insert($value);
      }

      return $insertionSequence;
    }

    public function getMinValue(){
      $temp = array_keys($this->elements);
      sort($temp);
      return $temp[0];
    }

    public function getMaxValue(){
      $temp = array_keys($this->elements);
      rsort($temp);
      return $temp[0];
    }

    public function successor($val){
      $successorSequence = array();

      $node = $this->elements[$val];
      if(is_null($node)) return $successorSequence;

      $successorSequence[] = $val;

      if(!is_null($node->rightChild)){
        $node = $node->rightChild;
        while(!is_null($node->leftChild)){
          $successorSequence[] = $node->value;
          $node = $node->leftChild;
        }
        $successorSequence[] = $node->value;
      }
      else{
        while(!is_null($node->parent)){
          $node = $node->parent;
          $successorSequence[] = $node->value;
          if($node->value > $val) break;
        }
      }

      return $successorSequence;
    }

    public function predecessor($val){
      $predecessorSequence = array();

      $node = $this->elements[$val];
      if(is_null($node)) return $predecessorSequence;

      $predecessorSequence[] = $val;

      if(!is_null($node->leftChild)){
        $node = $node->leftChild;
        while(!is_null($node->rightChild)){
          $predecessorSequence[] = $node->value;
          $node = $node->rightChild;
        }
        $predecessorSequence[] = $node->value;
      }
      else{
        while(!is_null($node->parent)){
          $node = $node->parent;
          $predecessorSequence[] = $node->value;
          if($node->value < $val) break;
        }
      }

      return $predecessorSequence;
    }

    public function search($val){
      $searchSequence = array();

      $node = $this->elements[$this->root];

      while(!is_null($node) && $node->value != $val){
        array_push($searchSequence,$node->value);

        if($val > $node->value){
          $node = $node->rightChild;
        }
        else $node = $node->leftChild;
      }

      if($node->value == $val) array_push($searchSequence,$val);

      return $searchSequence;
    }

    public function inorderTraversal(){
      $traversalSequence = array();
      $this->inorderTraversalRec($this->elements[$this->root], $traversalSequence);
      return $traversalSequence;
    }

    protected function inorderTraversalRec($node, &$traversalSequence){
      if(is_null($node)) return;
      $this->inorderTraversalRec($node->leftChild, $traversalSequence);
      $traversalSequence[] = $node->value;
      $this->inorderTraversalRec($node->rightChild, $traversalSequence);
    }

    public function preorderTraversal(){
      $traversalSequence = array();
      $this->preorderTraversalRec($this->elements[$this->root], $traversalSequence);
      return $traversalSequence;
    }

    protected function preorderTraversalRec($node, &$traversalSequence){
      if(is_null($node)) return;
      $traversalSequence[] = $node->value;
      $this->preorderTraversalRec($node->leftChild, $traversalSequence);
      $this->preorderTraversalRec($node->rightChild, $traversalSequence);
    }

    public function postorderTraversal(){
      $traversalSequence = array();
      $this->postorderTraversalRec($this->elements[$this->root], $traversalSequence);
      return $traversalSequence;
    }

    protected function postorderTraversalRec($node, &$traversalSequence){
      if(is_null($node)) return;
      $this->postorderTraversalRec($node->leftChild, $traversalSequence);
      $this->postorderTraversalRec($node->rightChild, $traversalSequence);
      $traversalSequence[] = $node->value;
    }

    public function insert($val){
      $newNode = new BSTNode($val);
      $cxPercent = 50;
      $cyPercent = 10;
      $xDifferencePercent = 50;

      $this->elements[$val] = $newNode;

      if(is_null($this->root)){
        $this->root = $val;
        $height = 1;
      }

      else{
        $parentNode = NULL;
        $node = $this->elements[$this->root];

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
          $parentNode->rightChild = $newNode;
        }
        else $parentNode->leftChild = $newNode;

        $newNode->parent = $parentNode;
        $newNode->$height = 1 + $parentNode->height;
      }

      $newNode->cxPercentage = $cxPercent;
      $newNode->cyPercentage = $cyPercent;
    }

    protected function init(){
      $this->root = NULL;
      $this->height = 0;
      $this->elements = array();
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
      $this->value = $val;
      $this->height = 1;
      $this->parent = NULL;
      $this->leftChild = NULL;
      $this->rightChild = NULL;
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