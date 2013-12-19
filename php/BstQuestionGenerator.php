<?php
  class BstQuestionGenerator implements QuestionGeneratorInterface{
    protected $answerFunctionList = array(
      QUESTION_TYPE_SEARCH => "checkAnswerSearchSequence",
      QUESTION_TYPE_TRAVERSAL => "checkAnswerTraversalSequence",
      QUESTION_TYPE_SUCCESSOR => "checkAnswerSuccessorSequence",
      QUESTION_TYPE_PREDECESSOR => "checkAnswerPredecessorSequence",
      QUESTION_TYPE_MIN_VALUE => "checkAnswerMinValue",
      QUESTION_TYPE_MAX_VALUE => "checkAnswerMaxValue",
      QUESTION_TYPE_K_SMALLEST_VALUE => "checkAnswerKthSmallestValue",
      QUESTION_TYPE_SWAP => "checkAnswerSwapQuestion",
      QUESTION_TYPE_IS_AVL => "checkAnswerIsAvl",
      QUESTION_TYPE_HEIGHT => "checkAnswerHeight",
      QUESTION_TYPE_ROOT => "checkAnswerRoot",
      QUESTION_TYPE_LEAVES => "checkAnswerLeaves",
      QUESTION_TYPE_INTERNAL => "checkAnswerInternal",
      QUESTION_TYPE_AVL_ROTATION_INSERT => "checkAnswerAvlRotationInsert",
      QUESTION_TYPE_AVL_ROTATION_DELETE => "checkAnswerAvlRotationDelete"
      );

    public function __construct(){
      // while (@ob_end_flush());
    }

    public function generateQuestion($amt){
      $questions = array();
      $potentialQuestions = $this->generatePotentialQuestions();

      for($i = 0; $i < $amt; $i++){
        $bstSize = rand(BST_SIZE_LOWER_BOUND,BST_SIZE_UPPER_BOUND);
        $linkedListBstSize = rand(BST_SIZE_LOWER_BOUND,BST_SIZE_LINKED_LIST_UPPER_BOUND);

        if(count($potentialQuestions) == 0) $potentialQuestions = $this->generatePotentialQuestions();

        $questionIndex = rand(0, count($potentialQuestions) - 1);
        $questionFunc = $potentialQuestions[$questionIndex];

        if($questionFunc == "generateQuestionMinValue" || $questionFunc == "generateQuestionMaxValue")
          $questions[] = $this->$potentialQuestions[$questionIndex]($linkedListBstSize);
        else $questions[] = $this->$potentialQuestions[$questionIndex]($bstSize);

        unset($potentialQuestions[$questionIndex]);
        $potentialQuestions = array_values($potentialQuestions);
      }

      return $questions;
    }

    protected function generatePotentialQuestions(){
      $potentialQuestions = array();

      $potentialQuestions[] = "generateQuestionSearchSequence";
      $potentialQuestions[] = "generateQuestionTraversalSequence";
      $potentialQuestions[] = "generateQuestionSuccessorSequence";
      $potentialQuestions[] = "generateQuestionPredecessorSequence";
      $potentialQuestions[] = "generateQuestionMinValue";
      $potentialQuestions[] = "generateQuestionMaxValue";
      $potentialQuestions[] = "generateQuestionSwapQuestion";
      $potentialQuestions[] = "generateQuestionIsAvl";
      $potentialQuestions[] = "generateQuestionAvlRotationInsert";
      $potentialQuestions[] = "generateQuestionAvlRotationDelete";
      $potentialQuestions[] = "generateQuestionHeight";
      $potentialQuestions[] = "generateQuestionKthSmallestValue";
      $potentialQuestions[] = "generateQuestionRoot";
      $potentialQuestions[] = "generateQuestionLeaves";
      $potentialQuestions[] = "generateQuestionInternal";

      return $potentialQuestions;
    }

    public function checkAnswer($qObj, $userAns){
      if(array_key_exists($qObj->qType, $this->answerFunctionList)){
        $verifierFunc = $this->answerFunctionList[$qObj->qType];
        return $this->$verifierFunc($qObj, $userAns);
      }
      else return false;
    }

    protected function generateBst(){
      $bst = new BST();
      return $bst;
    }

    protected function generateAvl(){
      $avl = new AVL();
      return $avl;
    }

    protected function isNoAnswer($userAns){
      return $userAns[0] == NO_ANSWER;
    }

    protected function isUnanswered($userAns){
      return $userAns[0] == UNANSWERED;
    }

    protected function generateQuestionSearchSequence($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);
      $bstContent = $bst->getAllElements();
      $varToBeSearched = $bstContent[rand(0,count($bstContent)-1)];

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

    protected function checkAnswerSearchSequence($qObj, $userAns){
      $bst = $qObj->internalDS;
      $varToBeSearched = $qObj->qParams["value"];
      $ans = $bst->search($varToBeSearched);

      $correctness = true;
      if(count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          if($ans[$i] != $userAns[$i]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionTraversalSequence($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);
      $subtype;

      switch(rand(0,2)){
        case 0:
          $subtype = QUESTION_SUB_TYPE_INORDER_TRAVERSAL;
          break;
        case 1:
          $subtype = QUESTION_SUB_TYPE_POSTORDER_TRAVERSAL;
          break;
        case 2:
          $subtype = QUESTION_SUB_TYPE_PREORDER_TRAVERSAL;
          break;
        default:
          $subtype = QUESTION_SUB_TYPE_INORDER_TRAVERSAL;
          break;
      }

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_TRAVERSAL;
      $qObj->qParams = array("subtype" => $subtype);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerTraversalSequence($qObj, $userAns){
      $bst = $qObj->internalDS;
      $ans;
      if($qObj->qParams["subtype"] == QUESTION_SUB_TYPE_INORDER_TRAVERSAL) $ans = $bst->inorderTraversal();
      else if($qObj->qParams["subtype"] == QUESTION_SUB_TYPE_PREORDER_TRAVERSAL) $ans = $bst->preorderTraversal();
      else if($qObj->qParams["subtype"] == QUESTION_SUB_TYPE_POSTORDER_TRAVERSAL) $ans = $bst->postorderTraversal();

      $correctness = true;
      if(count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          if($ans[$i] != $userAns[$i]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionSuccessorSequence($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);
      $bstContent = $bst->getAllElements();
      sort($bstContent);
      array_pop($bstContent);
      $varWhoseSuccessorIsToBeSearched = $bstContent[rand(0,count($bstContent)-2)];

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

    protected function checkAnswerSuccessorSequence($qObj, $userAns){
      $bst = $qObj->internalDS;
      $varWhoseSuccessorIsToBeSearched = $qObj->qParams["value"];
      $ans = $bst->successor($varWhoseSuccessorIsToBeSearched);

      $correctness = true;
      if(count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          if($ans[$i] != $userAns[$i]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionPredecessorSequence($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);
      $bstContent = $bst->getAllElements();
      sort($bstContent);
      array_shift($bstContent);
      $varWhosePredecessorIsToBeSearched = $bstContent[rand(1,count($bstContent)-1)];

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

    protected function checkAnswerPredecessorSequence($qObj, $userAns){
      $bst = $qObj->internalDS;
      $varWhosePredecessorIsToBeSearched = $qObj->qParams["value"];
      $ans = $bst->predecessor($varWhosePredecessorIsToBeSearched);

      $correctness = true;
      if(count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          if($ans[$i] != $userAns[$i]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionMinValue($bstSize){
      $bst = $this->generateBst();
      if(rand(0,4)){
        if(rand(0,1)) $bst->generateLinkedListBst($bstSize, BST_LINKED_LIST_DESCENDING);
        else $bst->generateLinkedListBst($bstSize, BST_LINKED_LIST_ASCENDING);
      }
      else $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_MIN_VALUE;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerMinValue($qObj, $userAns){
      $bst = $qObj->internalDS;
      $minVal = $bst->getMinValue();

      $correctness = true;
      if(count($userAns) > 1) $correctness = false;
      else if($userAns[0] != $minVal) $correctness = false;

      return $correctness;
    }

    protected function generateQuestionMaxValue($bstSize){
      $bst = $this->generateBst();
      if(rand(0,4)){
        if(rand(0,1)) $bst->generateLinkedListBst($bstSize, BST_LINKED_LIST_DESCENDING);
        else $bst->generateLinkedListBst($bstSize, BST_LINKED_LIST_ASCENDING);
      }
      else $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_MAX_VALUE;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerMaxValue($qObj, $userAns){
      $bst = $qObj->internalDS;
      $maxVal = $bst->getMaxValue();

      $correctness = true;
      if(count($userAns) > 1) $correctness = false;
      else if($userAns[0] != $maxVal) $correctness = false;

      return $correctness;
    }

    protected function generateQuestionKthSmallestValue($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);
      $bstContent = $bst->getAllElements();
      $kthSmallestElementToBeSearched = rand(1,count($bstContent));

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_K_SMALLEST_VALUE;
      $qObj->qParams = array("value" => $kthSmallestElementToBeSearched,"subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerKthSmallestValue($qObj, $userAns){
      $bst = $qObj->internalDS;
      $kthSmallestVal = $bst->getKthSmallestValue($qObj->qParams["value"]);

      $correctness = true;
      if(count($userAns) > 1) $correctness = false;
      else if($userAns[0] != $kthSmallestVal) $correctness = false;

      return $correctness;
    }

    protected function generateQuestionRoot($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_ROOT;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerRoot($qObj, $userAns){
      $bst = $qObj->internalDS;
      $root = $bst->getRoot();

      $correctness = true;
      if($userAns[0] != $root) $correctness = false;

      return $correctness;
    }

    protected function generateQuestionLeaves($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_LEAVES;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerLeaves($qObj, $userAns){
      $bst = $qObj->internalDS;
      $ans = $bst->getAllLeaves();

      sort($userAns);
      sort($ans);

      $correctness = true;
      if(count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          if($ans[$i] != $userAns[$i]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionInternal($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_INTERNAL;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = true;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerInternal($qObj, $userAns){
      $bst = $qObj->internalDS;
      $ans = $bst->getAllInternal();

      sort($userAns);
      sort($ans);

      $correctness = true;
      if(count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          if($ans[$i] != $userAns[$i]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionDeletionQuestion($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_DELETION;
      $qObj->qParams = array("maxAmt" => 3, "subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = true;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerDeletionQuestion($qObj, $userAns){
      $bst = $qObj->internalDS;
      $originalHeight = $bst->getHeight();
      $maxAmt = $qObj->qParams["maxAmt"];

      $correctness = true;
      if(count($userAns) > $maxAmt) $correctness = false;
      else{
        foreach($userAns as $value){
          $bst->delete($value);
        }
        if($bst->height() != $originalHeight - 1) $correctness = false;
      }

      return $correctness;
    }

    protected function generateQuestionHeight($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_HEIGHT;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_FILL_BLANKS;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerHeight($qObj, $userAns){
      $bst = $qObj->internalDS;

      return $bst->getHeight() == $userAns[0];
    }

    protected function generateQuestionSwapQuestion($bstSize){
      $bst = $this->generateBst();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);
      $bstContent = $bst->getAllElements();
      $bstElement1 = rand(0, count($bstContent)-1);
      $bstElement2 = $bstElement1;
      while($bstElement2 == $bstElement1){
        $bstElement2 = rand(0, count($bstContent)-1);
      }
      $bst->swap($bstContent[$bstElement1], $bstContent[$bstElement2]);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_SWAP;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_MCQ;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->aParams = array("Valid" => BST_SWAP_ANS_VALID, "Invalid" => BST_SWAP_ANS_INVALID);
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerSwapQuestion($qObj, $userAns){
      $bst = $qObj->internalDS;

      $correctness = false;
      if($bst->isValid() && $userAns[0] == BST_SWAP_ANS_VALID) $correctness = true;
      else if(!($bst->isValid()) && $userAns[0] == BST_SWAP_ANS_INVALID) $correctness = true;

      return $correctness;
    }

    protected function generateQuestionIsAvl($bstSize){
      $bst;
      if(rand(0,1)) $bst = $this->generateBst();
      else $bst = $this->generateAvl();
      $bst->generateRandomBst($bstSize, BST_HEIGHT_LIMIT);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_IS_AVL;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_MCQ;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->aParams = array("Valid" => BST_IS_AVL_ANS_VALID, "Invalid" => BST_IS_AVL_ANS_INVALID);
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $bst->toGraphState();
      $qObj->internalDS = $bst;

      return $qObj;
    }

    protected function checkAnswerIsAvl($qObj, $userAns){
      $bst = $qObj->internalDS;

      $correctness = false;
      if($bst->isAvl() && $userAns[0] == BST_IS_AVL_ANS_VALID) $correctness = true;
      else if(!($bst->isAvl()) && $userAns[0] == BST_IS_AVL_ANS_INVALID) $correctness = true;

      return $correctness;
    }

    protected function generateQuestionAvlRotationInsert($avlSize){
      $avl = $this->generateAvl();
      $avl->generateRandomBst($avlSize, BST_HEIGHT_LIMIT);
      $avlContent = $avl->getAllElements();
      $choice = array();

      while(count($choice) < 5){
        $elementsToBeInserted = rand(1,99);
        if(!in_array($elementsToBeInserted, $avlContent)) $choice[$elementsToBeInserted] = $elementsToBeInserted;
      }

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_AVL_ROTATION_INSERT;
      $qObj->qParams = array("limitBtm" => 1, "limitTop" => 3,"rotationAmt" => rand(0,2),"subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX_MCQ;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->aParams = $choice;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = true;
      $qObj->graphState = $avl->toGraphState();
      $qObj->internalDS = $avl;

      return $qObj;
    }

    protected function checkAnswerAvlRotationInsert($qObj, $userAns){
      $avl = $qObj->internalDS;

      $correctness = false;
      $rotations = 0;
      if(count($userAns) >= $qObj->qParams["limitBtm"] && count($userAns) <= $qObj->qParams["limitTop"]){
        foreach($userAns as $val){
          $rotations += $avl->insert($val);
        }
        if($rotations == $qObj->qParams["rotationAmt"]) $correctness = true;
      }

      return $correctness;
    }

    protected function generateQuestionAvlRotationDelete($avlSize){
      $avl = $this->generateAvl();
      $avl->generateRandomBst($avlSize, BST_HEIGHT_LIMIT);
      $avlContent = $avl->getAllElements();
      $choice = array();

      while(count($choice) < 5){
        $elementsToBeInserted = rand(1,99);
        if(!in_array($elementsToBeInserted, $avlContent)) $choice[$elementsToBeInserted] = $elementsToBeInserted;
      }

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_BST;
      $qObj->qType = QUESTION_TYPE_AVL_ROTATION_DELETE;
      $qObj->qParams = array("limitBtm" => 1, "limitTop" => 3,"rotationAmt" => rand(0,2),"subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->aParams = $choice;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = true;
      $qObj->graphState = $avl->toGraphState();
      $qObj->internalDS = $avl;

      return $qObj;
    }

    protected function checkAnswerAvlRotationDelete($qObj, $userAns){
      $avl = $qObj->internalDS;
      $correctness = false;
      $rotations = 0;
      if(count($userAns) >= $qObj->qParams["limitBtm"] && count($userAns) <= $qObj->qParams["limitTop"]){
        foreach($userAns as $val){
          $rotations += $avl->delete($val);
        }
        if($rotations == $qObj->qParams["rotationAmt"]) $correctness = true;
      }

      return $correctness;
    }

    protected function generateQuestionAvlHeight($avlSize){

    }

    protected function checkAnswerAvlHeight($qObj, $userAns){

    }
  }
?>