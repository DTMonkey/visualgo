<?php
  class Heap{
    protected $heapArr;

    public function __construct(){
      $this->heapArr = array();
      $this->heapArr[] = INFINITY;
    }

    public function toGraphState(){
      $graphState = array("vl" => array(), "el" => array());

      for($i = 1; $i < count($this->heapArr); $i++){
        $level = (int)log($i,2);
        $nodeInLevel = (int)pow(2,$level);
        vertexState = array(
          "cxPercentage" => ($i/2)*(100/$nodeInLevel) + ($i - $i/2)*(100/($nodeInLevel*2)),
          "cyPercentage" => 10*($level + 1),
          "text" => $value
          );
        $graphState["vl"] += array($i => $vertexState);
        if($i != 1){
          $edgeState = array(
            "vertexA" => $this->parent($i),
            "vertexB" => $i
            );
          $graphState["el"] += array($i => $edgeState);
        }
      }

      foreach($this->heapArr as $value){
        $vertexState = array(
          "cxPercentage" => $value->cxPercentage,
          "cyPercentage" => $value->cyPercentage,
          "text" => $value
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

    public function getHeapArray(){
      return $this->heapArr();
    }

    public function insert($val){
      if(in_array($val, $this->heapArr)) return;
      $this->heapArr[] = $val;
      $this->shiftUp(count($this->heapArr) - 1);
    }

    public function extractMax(){
      $maxValue = $this->heapArr[1];
      $this->heapArr[1] = $this->heapArr[count($this->heapArr)-1];
      unset($this->heapArr[count($this->heapArr)-1];
      $this->shiftDown(1);
      return $maxValue;
    }

    public function heapSort(){
      while(count($this->heapArr) > 1){
        $this->extractMax();
      }
    }

    public function size(){
      return count($this->heapArr) - 1;
    }

    protected function shiftUp($i){
      if($this->heapArr[$i] > $this->heapArr[$this->parent($i)]){
        $temp = $this->heapArr[$i];
        $this->heapArr[$i] = $this->heapArr[$this->parent($i)];
        $this->heapArr[$this->parent($i)] = $temp;
        $this->shiftUp($this->parent($i));
      }
    }

    protected function shiftDown($i){
      $leftChild = $this->heapArr[$this->left($i)];
      $rightChild = $this->heapArr[$this->right($i)];
      if($this->heapArr[$i] < max($leftChild, $rightChild)){
        $temp = $this->heapArr[$i];
        if($leftChild > $rightChild){
          $this->heapArr[$i] = $this->heapArr[$this->left($i)];
          $this->heapArr[$this->left($i)] = $temp;
          $this->shiftDown($this->left($i));
        }
        else{
          $this->heapArr[$i] = $this->heapArr[$this->right($i)];
          $this->heapArr[$this->right($i)] = $temp;
          $this->shiftDown($this->right($i));
        }
        
      }
    }

    protected function parent($i){
      return floor($i/2);
    }

    protected function left($i){
      return $i*2;
    }

    protected function right($i){
      return $i*2+1;
    }
  }
?>