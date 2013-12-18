<?php
  class BST{
    protected $root;
    protected $height;
    protected $elements;
    protected $isValidBst;

    public function __construct(){
      $this->init();
      // while (@ob_end_flush());
    }

    public function clearAll(){
      $this->init();
    }

    public function getAllElements(){
      return array_keys($this->elements);
    }

    public function getHeight(){
      return $this->height;
    }

    public function isValid(){
      return $this->isValidBst;
    }

    public function toGraphState(){
      $graphState = array("vl" => array(), "el" => array());

      foreach($this->elements as $key => $value){
        $isRoot = is_null($value->parent);
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

    public function insertRandomElements($amt){
      $insertionSequence = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = rand(1,99);
        if(!array_key_exists($newElement, $this->elements)){
          $this->insert($newElement);
          $insertionSequence[] = $newElement;
        }
        else $i--;
      }

      return $insertionSequence;
    }

    public function generateRandomBst($amt, $heightLimit){
      $insertionSequence = array();
      $amt = min($amt, (int)pow(2,$heightLimit) - 1);

      for($i = 0; $i < $amt; $i++){
        $newElement = rand(1,99);
        if(!array_key_exists($newElement, $this->elements)){
          $this->insert($newElement);
          if($this->height > $heightLimit){
            $this->delete($newElement);
            $i--;
          }
          else $insertionSequence[] = $newElement;
        }
        else $i--;
      }
      return $insertionSequence;
    }

    public function generateRandomUniformBst($amt){
      $insertionSequence = array();
      $tempInsertionSequence = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = rand(1,99);
        if(!array_key_exists($newElement, $tempInsertionSequence)){
          $tempInsertionSequence[$newElement] = true;
        }
        else $i--;
      }

      $temp = array_keys($tempInsertionSequence);
      sort($temp);

      for($i = count($temp)/2; $i >= 0; $i--){
        $this->insert($temp[$i]);
        $insertionSequence[] = $temp[$i];
        if(($i != count($temp) - $i) && $i != 0){
          $this->insert($temp[count($temp) - $i]);
          $insertionSequence[] = $temp[count($temp) - $i];
        }
      }

      return $insertionSequence;
    }

    public function generateLinkedListBst($amt, $direction){
      $insertionSequence = array();
      $tempInsertionSequence = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = rand(1,99);
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

    public function getKthSmallestValue($k){
      $temp = array_keys($this->elements);
      sort($temp);
      return $temp[$k-1];
    }

    public function getAllLeaves(){
      $leaves = array();

      foreach($this->elements as $key => $value){
        $noLeftChild = is_null($value->leftChild);
        $noRightChild = is_null($value->rightChild);

        if($noLeftChild && $noRightChild){
          $leaves[] = $key;
        }
      }

      return $leaves;
    }

    public function getRoot(){
      return $this->root;
    }

    public function getAllInternal(){
      $internal = array();

      foreach($this->elements as $key => $value){
        $noLeftChild = is_null($value->leftChild);
        $noRightChild = is_null($value->rightChild);
        $isRoot = is_null($value->parent);

        if(!$isRoot && !($noLeftChild && $noRightChild)){
          $internal[] = $key;
        }
      }

      return $internal;
    }

    public function isAvl(){
      $isAvl = true;

      foreach($this->elements as $key => $node){
        $noLeftChild = is_null($node->leftChild);
        $noRightChild = is_null($node->rightChild);
        $isRoot = is_null($node->parent);

        $leftChildHeight = -1;
        $rightChildHeight = -1;

        if(!$noRightChild){
          $rightChildHeight = $node->rightChild->height;
        }
        if(!$noLeftChild){
          $leftChildHeight = $node->leftChild->height;
        }

        if(abs($leftChildHeight-$rightChildHeight) >= 2){
          $isAvl = false;
          break;
        }
      }

      return $isAvl;
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

      $this->updateHeightUp($newNode);
    }

    public function delete($val){
      $node = $this->elements[$val];
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);
      $isRoot = is_null($node->parent);

      if($noLeftChild && $noRightChild){
        if($isRoot) $this->clearAll();
        else{
          $parentNode = $node->parent;
          if($node->value > $parentNode->value){
            $parentNode->rightChild = NULL;
          }
          else $parentNode->leftChild = NULL;

          $this->updateHeightUp($parentNode);
        }
      }

      else if($noLeftChild){
        $rightChildNode = $node->rightChild;
        $parentNode = $node->parent;
        $rightChildNode->parent = $parentNode;
        if($node->value > $parentNode->value){
            $parentNode->rightChild = $rightChildNode;
        }
        else $parentNode->leftChild = $rightChildNode;

        $this->updateHeightUp($parentNode);
      }

      else if($noRightChild){
        $leftChildNode = $node->leftChild;
        $parentNode = $node->parent;
        $leftChildNode->parent = $parentNode;
        if($node->value > $parentNode->value){
            $parentNode->rightChild = $leftChildNode;
        }
        else $parentNode->leftChild = $leftChildNode;

        $this->updateHeightUp($parentNode);
      }

      else{
        $successorSequence = $this->successor();
        $successorNode = $this->elements($successorSequence[count($successorSequence) - 1]);
        $successorRightChildNode = $successorNode->rightChild;
        $successorParentNode = $successorNode->parent;
        $parentNode = $node->parent;
        $rightChildNode = $node->rightChild;
        $leftChildNode = $node->leftChild;

        $successorRightChildNode->parent = $successorParentNode;
        if($successorNode->value > $successorParentNode->value){
            $successorParentNode->rightChild = $successorRightChildNode;
        }
        else $successorParentNode->leftChild = $successorRightChildNode;

        $successorNode->parent = $parentNode;
        $successorNode->leftChild = $leftChildNode;
        $successorNode->rightChild = $rightChildNode;
        $successorNode->height = $node->height;

        $leftChildNode->parent = $successorNode;
        $rightChildNode->parent = $successorNode;
        if($successorNode->value > $parentNode->value){
            $parentNode->rightChild = $successorNode;
        }
        else $parentNode->leftChild = $successorNode;

        $this->updateHeightUp($successorParentNode);
      }

      unset($this->elements[$val]);
    }

    public function swap($val1, $val2){
      $allKeys = $this->getAllElements();
      if(!(in_array($val1, $allKeys) && in_array($val2, $allKeys))) return $this->isValidBst;

      $node1 = $this->elements[$val1];
      $node2 = $this->elements[$val2];
      
      $node1->value = $val2;
      $node2->value = $val1;

      $this->isValidBst = false;

      return $this->isValidBst;
    }

    protected function init(){
      $this->root = NULL;
      $this->height = 0;
      $this->elements = array();
      $this->isValidBst = true;
    }

    // Recursively updates height of itself and the nodes above it until root
    protected function updateHeightUp($node){
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);
      $isRoot = is_null($node->parent);

      if($noLeftChild && $noRightChild){
        $node->height = 0;
      }
      else if($noLeftChild) $node->height = $node->rightChild->height + 1;
      else if($noRightChild) $node->height = $node->leftChild->height + 1;
      else $node->height = max($node->rightChild->height, $node->leftChild->height) + 1;

      if(!$isRoot){
        $this->updateHeightUp($node->parent);
      }
      else $this->height = $node->height;
    }

    // Recursively updates height of itself and all the nodes below it
    protected function updateHeightDown($node){
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);
      $isRoot = is_null($node->parent);

      $leftChildHeight = -1;
      $rightChildHeight = -1;

      if(!$noRightChild){
        $this->updateHeightDown($node->rightChild);
        $rightChildHeight = $node->rightChild->height;
      }
      if(!$noLeftChild){
        $this->updateHeightDown($node->leftChild);
        $leftChildHeight = $node->leftChild->height;
      }

      $node->height = max($leftChildHeight,$rightChildHeight) + 1;
      if($isRoot) $this->height = $node->height;
    }

    protected function updateCoordinate(){
      $this->updateCoordinateRec($this->elements[$this->root], 50, 10, 25);
    }

    protected function updateCoordinateRec($node, $cxPercentage, $cyPercentage, $cxDifferencePercent){
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);

      // echo $node->value." ".$cxPercentage." ".$cyPercentage.",";

      $node->cxPercentage = $cxPercentage;
      $node->cyPercentage = $cyPercentage;

      if(!$noLeftChild) $this->updateCoordinateRec($node->leftChild, $cxPercentage - $cxDifferencePercent, $cyPercentage + 10, $cxDifferencePercent/2);
      if(!$noRightChild) $this->updateCoordinateRec($node->rightChild, $cxPercentage + $cxDifferencePercent, $cyPercentage + 10, $cxDifferencePercent/2);
    }
  }

  class BSTNode{
    protected $key;
    protected $value;
    protected $height;
    protected $parent;
    protected $leftChild;
    protected $rightChild;
    protected $cxPercentage;
    protected $cyPercentage;

    function __construct($val){
      $this->key = $val;
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