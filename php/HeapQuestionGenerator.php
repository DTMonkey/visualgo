<?php
  class HeapQuestionGenerator implements QuestionGeneratorInterface{
    protected $rngSeed;

    public function __construct(){

    }

    public function seedRng($seed){
      $this->rngSeed = $seed;
      mt_srand($this->rngSeed);
    }

    public function removeSeed(){
      $this->rngSeed = NULL;
      mt_srand();
    }

    public function generateQuestion($amt){
      $questions = array();
      for($i = 0; $i < $amt; $i++){
        // $questions[] = $this->generateQuestionSearchSequence(5);
        // if($i < $amt/11) $questions[] = $this->generateQuestionSearchSequence(5);
        // else if($i < $amt*2/11) $questions[] = $this->generateQuestionTraversalSequence(5);
        // else if($i < $amt*3/11) $questions[] = $this->generateQuestionSuccessorSequence(5);
        // else if($i < $amt*4/11) $questions[] = $this->generateQuestionPredecessorSequence(5);
        // else if($i < $amt*5/11) $questions[] = $this->generateQuestionMinValue(5);
        // else if($i < $amt*6/11) $questions[] = $this->generateQuestionMaxValue(5);
        // else if($i < $amt*7/11) $questions[] = $this->generateQuestionSwapQuestion(5);
        // else if($i < $amt*8/11) $questions[] = $this->generateQuestionIsAvl(5);
        // else if($i < $amt*9/11) $questions[] = $this->generateQuestionAvlRotationInsert(5);
        // else if($i < $amt*10/11) $questions[] = $this->generateQuestionAvlRotationDelete(5);
        // else  $questions[] = $this->generateQuestionHeight(5);
        $questions[] = $this->generateQuestionInsertion(5);
      }

      return $questions;
    }

    public function checkAnswer($qObj, $userAns){
      if($qObj->qType == QUESTION_TYPE_INSERTION) return $this->checkAnswerInsertion($qObj, $userAns);
      else return false;
    }

    protected function generateHeap(){
      $heap = new Heap();
      $seed = mt_rand();
      $heap->seedRng($seed);
      return $heap;
    }

    protected function isNoAnswer($userAns){
      return $userAns[0] == NO_ANSWER;
    }

    protected function isUnanswered($userAns){
      return $userAns[0] == UNANSWERED;
    }

    public function generateQuestionInsertion($heapSize){
      $heap = $this->generateHeap();
      $heap->buildRandomHeap($heapSize);
      $heapContent = $heap->getAllElements();
      $varToBeInserted = $heapContent[0];
      while(in_array($varToBeInserted, $heapContent)){
        $varToBeInserted = mt_rand(HEAP_RANGE_LOWER_BOUND,HEAP_RANGE_UPPER_BOUND);
      }

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_HEAP;
      $qObj->qType = QUESTION_TYPE_INSERTION;
      $qObj->qParams = array("value" => $varToBeInserted,"subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $heap->toGraphState();
      $qObj->internalDS = $heap;

      return $qObj;
    }

    public function checkAnswerInsertion($qObj, $userAns){
      $heap = $qObj->internalDS;
      $varToBeInserted = $qObj->qParams["value"];
      $ans = $heap->insert($varToBeInserted);

      $correctness = false;
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
  }
?>