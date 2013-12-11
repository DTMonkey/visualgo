<?php
  class AVL extends BST{
    public function __construct() {
      parent::__construct();
    }

    public function isAvl(){
      return true;
    }

    public function insert($val){
      parent::insert($val);
      $this->balance($this->elements[$val]);
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
          if($node->val > $parentNode->val){
            $parentNode->rightChild = NULL;
          }
          else $parentNode->leftChild = NULL;

          $this->updateHeightUp($parentNode);
          $this->balance($parentNode);
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
        $this->balance($parentNode);
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
        $this->balance($parentNode);
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
        $this->balance($successorParentNode);
      }

      unset($this->elements[$val]);
    }

    protected function balance($node){
      $isRoot = is_null($node->parent);
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);

      $balanceFactor = $this->checkBalanceFactor($node);
      $balanceFactorLeft = 0;
      $balanceFactorRight = 0;
      if(!$noLeftChild) $balanceFactorLeft = $this->checkBalanceFactor($node->left);
      if(!$noRightChild) $balanceFactorRight = $this->checkBalanceFactor($node->right);

      if($balanceFactor == 2){
        if($balanceFactorLeft == 1 || $balanceFactorLeft == 0){
          $this->rotateRight($node);
        }

        else if($balanceFactorLeft == -1){
          $this->rotateLeft($node->left);
          $this->rotateRight($node);
        }
      }

      else if($balanceFactor == -2){
        if($balanceFactorRight == 1){
          $this->rotateRight($node->right);
          $this->rotateLeft($node);
        }
        else if($balanceFactorRight == 0 || $balanceFactorRight == -1){
          $this->rotateLeft($node);
        }
      }

      if(!$isRoot) $this->balance($node->parent);
    }

    protected function checkBalanceFactor($node){
      $isRoot = is_null($node->parent);
      $noLeftChild = is_null($node->leftChild);
      $noRightChild = is_null($node->rightChild);

      $leftCildHeight = -1;
      $rightChildHeight = -1;

      if(!$noRightChild){
        $rightChildHeight = $node->rightChild->height;
      }
      if(!$noLeftChild){
        $leftChildHeight = $node->leftChild->height;
      }

      return $leftChildHeight-$rightChildHeight;
    }

    protected function rotateLeft($node){
      $rightChildNode = $node->rightChild;
      $parentNode = $node->parent;
      $rightChildLeftNode = $rightChildNode->leftChild;

      $rightChildNode->parent = $parentNode;
      if($rightChildNode->value > $parentNode->value){
        $parentNode->rightChild = $rightChildNode;
      }
      else $parentNode->leftChild = $rightChildNode;
      $node->parent = $rightChildNode;
      $node->rightChild = $rightChildLeftNode;
      if(!is_null($rightChildLeftNode)) $rightChildLeftNode->parent = $node;
      $rightChildNode->leftChild = $node;
    }

    protected function rotateRight($node){
      $leftChildNode = $node->leftChild;
      $parentNode = $node->parent;
      $leftChildRightNode = $leftChildNode->rightChild;

      $leftChildNode->parent = $parentNode;
      if($leftChildNode->value > $parentNode->value){
        $parentNode->rightChild = $leftChildNode;
      }
      else $parentNode->leftChild = $leftChildNode;
      $node->parent = $leftChildNode;
      $node->leftChild = $leftChildRightNode;
      if(!is_null($leftChildRightNode)) $leftChildRightNode->parent = $node;
      $leftChildNode->rightChild = $node;
    }
  }
?>