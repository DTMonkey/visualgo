<?php
  class Heap{
    protected $heapArr;
    protected $min; // true means the heap is minimum heap

    public function __construct($isMin){
      $this->init();
      $this->min = $isMin;
    }

    public function clearAll(){
      $this->init();
    }

    protected function init(){
      $this->heapArr = array();
      $this->heapArr[] = INFINITY;
    }

    // public function seedRng($seed){
    //   srand($seed);
    // }

    public function buildRandomHeap($amt){
      $values = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = rand(1,99);
        if(!in_array($newElement, $values)){
          $values[] = $newElement;
        }
        else $i--;
      }
      
      $this->heapify($values);
    }

    public function buildUnshiftedHeap($amt){
      $values = array();

      for($i = 0; $i < $amt; $i++){
        $newElement = rand(1,99);
        if(!in_array($newElement, $values)){
          $values[] = $newElement;
        }
        else $i--;
      }

      $this->heapArr = array_merge($this->heapArr, $values);
    }

    public function heapify($arr){
      $this->heapArr = array_merge($this->heapArr, $arr);

      $shiftedDown = array();

      for($i = count($this->heapArr)-1; $i >= 1; $i--){
        $value = $this->heapArr[$i];
        $shiftDownSequence = array();
        $this->shiftDown($i,$shiftDownSequence);
        if(count($shiftDownSequence)>0) $shiftedDown[] = $value;
      }

      return $shiftedDown;
    }

    public function toGraphState(){
      $graphState = array("vl" => array(), "el" => array());

      for($i = 1; $i < count($this->heapArr); $i++){
        $level = (int)log($i,2);
        $nodeInLevel = (int)pow(2,$level);

        // echo $i." ".$level." ".$nodeInLevel."|";
        // echo $i." ".log($i, 2)."|";

        $vertexState = array(
          "cxPercentage" => (($i-$nodeInLevel)*2 + 1)*(100/($nodeInLevel*2)),
          "cyPercentage" => 10*($level + 1),
          "text" => $this->heapArr[$i]
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

      return $graphState;
    }

    public function getAllElements(){
      return $this->heapArr;
    }

    public function insert($val){
      $shiftUpSequence = array();
      if(in_array($val, $this->heapArr)) return;
      $this->heapArr[] = $val;
      $this->shiftUp(count($this->heapArr) - 1, $shiftUpSequence);
      return $shiftUpSequence;
    }

    public function extractMax(){
      $shiftDownSequence = array();
      $maxValue = $this->heapArr[1];
      $this->heapArr[1] = $this->heapArr[count($this->heapArr)-1];
      unset($this->heapArr[count($this->heapArr)-1]);
      $this->shiftDown(1, $shiftDownSequence);
      return $shiftDownSequence;
    }

    public function partialHeapSort($amt){
      while(count($this->heapArr) > 1 && $amt > 0){
        $this->extractMax();
        $amt--;
      }
    }

    public function size(){
      return count($this->heapArr) - 1;
    }

    protected function shiftUp($i, &$shiftUpSequence){
      if($this->min){
        if($this->heapArr[$i] < $this->heapArr[$this->parent($i)]){
          $shiftUpSequence[] = $$this->heapArr[$this->parent($i)];
          $temp = $this->heapArr[$i];
          $this->heapArr[$i] = $this->heapArr[$this->parent($i)];
          $this->heapArr[$this->parent($i)] = $temp;
          $this->shiftUp($this->parent($i), $shiftUpSequence);
        }
      }

      else{
        if($this->heapArr[$i] > $this->heapArr[$this->parent($i)]){
          $shiftUpSequence[] = $this->heapArr[$this->parent($i)];
          $temp = $this->heapArr[$i];
          $this->heapArr[$i] = $this->heapArr[$this->parent($i)];
          $this->heapArr[$this->parent($i)] = $temp;
          $this->shiftUp($this->parent($i), $shiftUpSequence);
        }
      }
    }

    protected function shiftDown($i, &$shiftDownSequence){
      $leftChild = -1;
      $rightChild = -1;

      if($this->min){
        $leftChild = INFINITY;
        $rightChild = INFINITY;
      }

      // echo "aa".$this->left($i)."aa";

      if($this->left($i) > count($this->heapArr)-1) return;

      $leftChild = $this->heapArr[$this->left($i)];
      if($this->right($i) <= count($this->heapArr)-1) $rightChild = $this->heapArr[$this->right($i)];
      if($this->min){
        if($this->heapArr[$i] > min($leftChild, $rightChild)){
          $temp = $this->heapArr[$i];
          if($leftChild < $rightChild){
            $shiftDownSequence[] = $this->heapArr[$this->left($i)];
            $this->heapArr[$i] = $this->heapArr[$this->left($i)];
            $this->heapArr[$this->left($i)] = $temp;
            $this->shiftDown($this->left($i), $shiftDownSequence);
          }
          else if($rightChild != -1){
            $shiftDownSequence[] = $this->heapArr[$this->right($i)];
            $this->heapArr[$i] = $this->heapArr[$this->right($i)];
            $this->heapArr[$this->right($i)] = $temp;
            $this->shiftDown($this->right($i), $shiftDownSequence);
          }
        }
      }
      else{
        if($this->heapArr[$i] < max($leftChild, $rightChild)){
          $temp = $this->heapArr[$i];
          if($leftChild > $rightChild){
            $shiftDownSequence[] = $this->heapArr[$this->left($i)];
            $this->heapArr[$i] = $this->heapArr[$this->left($i)];
            $this->heapArr[$this->left($i)] = $temp;
            $this->shiftDown($this->left($i), $shiftDownSequence);
          }
          else if($rightChild != -1){
            $shiftDownSequence[] = $this->heapArr[$this->right($i)];
            $this->heapArr[$i] = $this->heapArr[$this->right($i)];
            $this->heapArr[$this->right($i)] = $temp;
            $this->shiftDown($this->right($i), $shiftDownSequence);
          }
        }
      }
    }
	
	public function getRoot() {
	  return $this->heapArr[1];
	}
	
	public function getLeaves() {
	  $lowerBound = ceil(count($this->heapArr)/2); //inclusive
	  $ans = array();
	  for($i=$lowerBound; $i<count($this->heapArr); $i++) {
		$ans[] = $this->heapArr[$i]; 
	  }
	  return $ans;
	}
	
	public function getInternal() {
	  $ans = array();
	  $lowerBound = ceil(count($this->heapArr)/2);
	  for($i=2; $i<$lowerBound; $i++) {
		$ans[] = $this->heapArr[$i];
	  }
	  return $ans;
	}
	
	public function swap() {
	  $parenti = rand(1,floor((count($this->heapArr)-1)/2));
	  $childi = $this->left($parenti);
	  $temp = $this->heapArr[$parenti];
	  $this->heapArr[$parenti] = $this->heapArr[$childi];
	  $this->heapArr[$childi] = $temp;
	}
	
	public function isHeap() {
	  $upperParentBound = floor((count($this->heapArr)-1)/2);
	  for($i = 1; $i<= $upperParentBound; $i++) { //for all parents
	    $parentVal = $this->heapArr[$i];
		$leftVal = $this->heapArr[$this->left($i)]; //there is at least a left child
		$rightVal = 0;
		if($this->right($i) < count($this->heapArr)) { //if there is a right child
		  $rightVal = $this->heapArr[$this->right($i)];
		}
		if($parentVal < $leftVal || $parentVal < $rightVal) {
			return HEAP_SWAP_ANS_INVALID;
		}
	  }
	  return HEAP_SWAP_ANS_VALID;
	}
	
	public function getElementAtIndex($i) {
		return $this->heapArr[$i];
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