<?php
  // AVL doesn't implement generateLinkedListBst; change from inheritence to interface
  class AVL extends BST{
    public function __construct() {
      parent::__construct();
    }

    public function isAvl(){
      return true;
    }

    public function insert($val){
      parent::insert($val);
      $rotationAmt = $this->balance($this->elements[$val]);
      $this->updateCoordinate();
      return $rotationAmt;
    }

    public function delete($val){
      $rotationOccurred = 0;

      $node = $this->elements[$val];
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);
      $isRoot = is_null($node->parent);

      if($noLeftChild && $noRightChild){
        if($isRoot) $this->clearAll();
        else{
          $parentNode = $node->parent;
          if($node->val > $parentNode->val){
            $parentNode->rightChild = NULL;
          }
          else $parentNode->leftChild = NULL;

          $this->updateHeightUp($parentNode);
          $rotationOccurred = $this->balance($parentNode);
        }
      }

      else if($noLeftChild){
        $rightChildNode = $node->rightChild;
        $parentNode = $node->parent;
        $rightChildNode->parent = $parentNode;
        if($node->val > $parentNode->val){
            $parentNode->rightChild = $rightChildNode;
        }
        else $parentNode->leftChild = $rightChildNode;

        $this->updateHeightUp($parentNode);
        $rotationOccurred = $this->balance($parentNode);
      }

      else if($noRightChild){
        $leftChildNode = $node->leftChild;
        $parentNode = $node->parent;
        $leftChildNode->parent = $parentNode;
        if($node->val > $parentNode->val){
            $parentNode->rightChild = $leftChildNode;
        }
        else $parentNode->leftChild = $leftChildNode;

        $this->updateHeightUp($parentNode);
        $rotationOccurred = $this->balance($parentNode);
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
        if($successorNode->val > $successorParentNode->val){
            $successorParentNode->rightChild = $successorRightChildNode;
        }
        else $successorParentNode->leftChild = $successorRightChildNode;

        $successorNode->parent = $parentNode;
        $successorNode->leftChild = $leftChildNode;
        $successorNode->rightChild = $rightChildNode;
        $successorNode->height = $node->height;

        $leftChildNode->parent = $successorNode;
        $rightChildNode->parent = $successorNode;
        if($successorNode->val > $parentNode->val){
            $parentNode->rightChild = $successorNode;
        }
        else $parentNode->leftChild = $successorNode;

        $this->updateHeightUp($successorParentNode);
        $rotationOccurred = $this->balance($successorParentNode);
      }

      unset($this->elements[$val]);
      $this->updateCoordinate();
      return $rotationOccurred;
    }

    protected function balance($node){
      $rotationOccurred = 0;

      $isRoot = is_null($node->parent);
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);

      $balanceFactor = $this->checkBalanceFactor($node);
      $balanceFactorLeft = 0;
      $balanceFactorRight = 0;
      if(!$noLeftChild) $balanceFactorLeft = $this->checkBalanceFactor($node->leftChild);
      if(!$noRightChild) $balanceFactorRight = $this->checkBalanceFactor($node->rightChild);

      if($balanceFactor == 2){
        // echo("rotation2 ".$node->value." ".$balanceFactor." ".$balanceFactorLeft." ");
        $rotationOccurred++;
        if($balanceFactorLeft == 1 || $balanceFactorLeft == 0){
          $this->rotateRight($node);
        }

        else if($balanceFactorLeft == -1){
          $this->rotateLeft($node->leftChild);
          $this->rotateRight($node);
        }
      }

      else if($balanceFactor == -2){
        // echo("rotation-2 ".$node->value." ".$balanceFactor." ".$balanceFactorRight." ");
        $rotationOccurred++;
        if($balanceFactorRight == 1){
          $this->rotateRight($node->rightChild);
          $this->rotateLeft($node);
        }
        else if($balanceFactorRight == 0 || $balanceFactorRight == -1){
          $this->rotateLeft($node);
        }
      }

      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);

      if($noLeftChild && $noRightChild){
        $node->height = 0;
      }
      else if($noLeftChild) $node->height = $node->rightChild->height + 1;
      else if($noRightChild) $node->height = $node->leftChild->height + 1;
      else $node->height = max($node->rightChild->height, $node->leftChild->height) + 1;

      // if($rotationOccurred > 0) echo "rotationOccurred ";
      return $rotationOccurred + ($isRoot? 0:$this->balance($node->parent));
    }

    protected function checkBalanceFactor($node){
      $isRoot = is_null($node->parent);
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);

      $leftChildHeight = -1;
      $rightChildHeight = -1;

      if(!$noRightChild){
        $rightChildHeight = $node->rightChild->height;
        // echo $node->rightChild->value." ";
      }
      if(!$noLeftChild){
        $leftChildHeight = $node->leftChild->height;
      }
      // echo $node->value." ".$leftChildHeight." ".$rightChildHeight.",";
      // if($node->value == 46 && $node->rightChild->value == 85){
        // echo $node->rightChild->height." ".$node->rightChild->leftChild->height." ".$node->rightChild->rightChild->height;
      // }
      return $leftChildHeight-$rightChildHeight;
    }

    protected function rotateLeft($node){
      $isRoot = is_null($node->parent);

      $rightChildNode = $node->rightChild;
      $parentNode = $node->parent;
      $rightChildLeftNode = $rightChildNode->leftChild;

      $rightChildNode->parent = $parentNode;
      if(!$isRoot){
        if($rightChildNode->value > $parentNode->value){
          $parentNode->rightChild = $rightChildNode;
        }
        else $parentNode->leftChild = $rightChildNode;
      }
      $node->parent = $rightChildNode;
      $node->rightChild = $rightChildLeftNode;
      if(!is_null($rightChildLeftNode)) $rightChildLeftNode->parent = $node;
      $rightChildNode->leftChild = $node;
      if($isRoot) $this->root = $rightChildNode->value;
    }

    protected function rotateRight($node){
      $isRoot = is_null($node->parent);

      $leftChildNode = $node->leftChild;
      $parentNode = $node->parent;
      $leftChildRightNode = $leftChildNode->rightChild;

      $leftChildNode->parent = $parentNode;
      if(!$isRoot){
        if($leftChildNode->value > $parentNode->value){
          $parentNode->rightChild = $leftChildNode;
        }
        else $parentNode->leftChild = $leftChildNode;
      }
      $node->parent = $leftChildNode;
      $node->leftChild = $leftChildRightNode;
      if(!is_null($leftChildRightNode)) $leftChildRightNode->parent = $node;
      $leftChildNode->rightChild = $node;
      if($isRoot) $this->root = $leftChildNode->value;
    }
  }
?>