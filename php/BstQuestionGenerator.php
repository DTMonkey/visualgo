<?php
  class BstQuestionGenerator implements QuestionGeneratorInterface{
    protected $rngSeed;

    public function __construct(){
    }

    public function seedRng($seed){
      $this->rngSeed = $seed;
      mt_srand($rngSeed);
    }

    public function removeSeed(){
      $this->rngSeed = NULL;
      mt_srand();
    }

    public function generateQuestion($amt){
      $questions = array();
      for($i = 0; $i < $amt; $i++){
        // $questions[] = $this->generateSearchSequenceQuestion(5);
        if($i < $amt/4) $questions[] = $this->generateSearchSequenceQuestion(5);
        else if($i < $amt*2/4) $questions[] = $this->generateTraversalSequenceQuestion(5);
        else if($i < $amt*3/4) $questions[] = $this->generateSuccessorSequenceQuestion(5);
        else $questions[] = $this->generatePredecessorSequenceQuestion(5);
      }

      return $questions;
    }

    public function checkAnswer($qObj, $userAns){
      if($qObj->qType == QUESTION_TYPE_SEARCH) return $this->checkSearchSequenceQuestion($qObj, $userAns);
      else if ($qObj->qType == QUESTION_TYPE_TRAVERSAL) return $this->checkTraversalSequenceQuestion($qObj, $userAns);
      else if ($qObj->qType == QUESTION_TYPE_SUCCESSOR) return $this->checkSuccessorSequenceQuestion($qObj, $userAns);
      else if ($qObj->qType == QUESTION_TYPE_PREDECESSOR) return $this->checkTraversalPredecessorQuestion($qObj, $userAns);
      else return false;
    }

    protected function generateBst(){
      $bst = new Bst();
      $seed = mt_rand();
      $bst->seedRng($seed);
      return $bst;
    }

    protected function generateSearchSequenceQuestion($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize);
      $bstContent = $bst->getAllElements();
      $varToBeSearched = $bstContent[mt_rand(0,count($bstContent)-1)];

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_SEARCH;
      $qObj->qParams = array("value" => $varToBeSearched,"subtype" => QUESTION_SUB_TYPE_NONE);
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

      echo implode(",",$ans);

      return $ans === $userAns;
    }

    protected function generateTraversalSequenceQuestion($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_TRAVERSAL;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_INORDER_TRAVERSAL);
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
      if($qObj->qParams->subtype == QUESTION_SUB_TYPE_INORDER_TRAVERSAL) $ans = $bst->inorderTraversal();
      else if($qObj->qParams->subtype == QUESTION_SUB_TYPE_PREORDER_TRAVERSAL) $ans = $bst->preorderTraversal();
      else if($qObj->qParams->subtype == QUESTION_SUB_TYPE_POSTORDER_TRAVERSAL) $ans = $bst->postorderTraversal();

      echo implode(",",$ans);

      return $ans === $userAns;
    }

    protected function generateSuccessorSequenceQuestion($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize);
      $bstContent = $bst->getAllElements();
      sort($bstContent);
      array_pop($bstContent);
      $varWhoseSuccessorIsToBeSearched = $bstContent[mt_rand(0,count($bstContent)-1)];

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_SUCCESSOR;
      $qObj->qParams = array("value" => $varWhoseSuccessorIsToBeSearched,"subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkSuccessorSequenceQuestion($qObj, $userAns){
      $bst = $qObj->internalDS;
      $varWhoseSuccessorIsToBeSearched = $qObj->qParams->value;
      $ans = $bst->successor($varWhoseSuccessorIsToBeSearched);

      echo implode(",",$ans);

      return $ans === $userAns;
    }

    protected function generatePredecessorSequenceQuestion($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize);
      $bstContent = $bst->getAllElements();
      sort($bstContent);
      array_shift($bstContent);
      $varWhosePredecessorIsToBeSearched = $bstContent[mt_rand(0,count($bstContent)-1)];

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_PREDECESSOR;
      $qObj->qParams = array("value" => $varWhosePredecessorIsToBeSearched,"subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkPredecessorSequenceQuestion($qObj, $userAns){
      $bst = $qObj->internalDS;
      $varWhosePredecessorIsToBeSearched = $qObj->qParams->value;
      $ans = $bst->successor($varWhoseSuccessorIsToBeSearched);

      echo implode(",",$ans);

      return $ans === $userAns;
    }
  }
?>