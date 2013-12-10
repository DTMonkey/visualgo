<?php
  class BstQuestionGenerator implements QuestionGeneratorInterface{
    public function __construct(){
    }

    public function generateQuestion($amt){
      $questions = array();
      for($i = 0; $i < $amt; $i++){
        $questions[] = $this->generateSearchSequenceQuestion(5);
        if($i < $amt/2) $questions[] = $this->generateSearchSequenceQuestion(5);
        else $questions[] = $this->generateTraversalSequenceQuestion(5);
      }

      return $questions;
    }

    public function checkAnswer($qObj, $userAns){
      if($qObj->qType == QUESTION_TYPE_SEARCH) return $this->checkSearchSequenceQuestion($qObj, $userAns);
      else if ($qObj->qType == QUESTION_TYPE_TRAVERSAL) return $this->checkTraversalSequenceQuestion($qObj, $userAns);
      else return false;
    }

    protected function generateSearchSequenceQuestion($bstSize){
      $bst = new BST();
      $bst->insertRandomElements($bstSize);
      $bstContent = $bst->getAllElements();
      $varToBeSearched = $bstContent[array_rand($bstContent)];

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_SEARCH;
      $qObj->qSubType = QUESTION_SUB_TYPE_NONE;
      $qObj->qParams = array("value" => $varToBeSearched);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkSearchSequenceQuestion($qObj, $userAns){
      $bst = $qObj->internalDS;
      $varToBeSearched = $qObj->qParams["value"];
      $ans = $bst->search($varToBeSearched);

      // echo implode(",",$ans);

      return $ans === $userAns;
    }

    protected function generateTraversalSequenceQuestion($bstSize){
      $bst = new BST();
      $bst->insertRandomElements($bstSize);
      $bstContent = $bst->getAllElements();
      $varToBeSearched = $bstContent[array_rand($bstContent)];

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_TRAVERSAL;
      $qObj->qSubType = QUESTION_SUB_TYPE_INORDER_TRAVERSAL;
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkTraversalSequenceQuestion($qObj, $userAns){
      $bst = $qObj->internalDS;
      $ans;
      if($qObj->qSubType == QUESTION_SUB_TYPE_INORDER_TRAVERSAL) $ans = $bst->inorderTraversal();
      else if($qObj->qSubType == QUESTION_SUB_TYPE_PREORDER_TRAVERSAL) $ans = $bst->preorderTraversal();
      else if($qObj->qSubType == QUESTION_SUB_TYPE_POSTORDER_TRAVERSAL) $ans = $bst->postorderTraversal();

      echo implode(",",$ans);

      return $ans === $userAns;
    }
  }
?>