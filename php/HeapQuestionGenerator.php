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
        $heapSize = mt_rand(HEAP_SIZE_LOWER_BOUND,HEAP_SIZE_UPPER_BOUND);

        $potentialQuestions = array();

        $potentialQuestions[] = $this->generateQuestionExtract($heapSize);
        $potentialQuestions[] = $this->generateQuestionInsertion($heapSize);
        $potentialQuestions[] = $this->generateQuestionHeapify($heapSize);
        $potentialQuestions[] = $this->generateQuestionHeapSort($heapSize);

        $questions[] = $potentialQuestions[mt_rand(0, count($potentialQuestions) - 1)];
      }

      return $questions;
    }

    public function checkAnswer($qObj, $userAns){
      if($qObj->qType == QUESTION_TYPE_EXTRACT) return $this->checkAnswerExtract($qObj, $userAns);
      else if($qObj->qType == QUESTION_TYPE_INSERTION) return $this->checkAnswerInsertion($qObj, $userAns);
      else if($qObj->qType == QUESTION_TYPE_HEAPIFY) return $this->checkAnswerHeapify($qObj, $userAns);
      else if($qObj->qType == QUESTION_TYPE_HEAP_SORT) return $this->checkAnswerHeapSort($qObj, $userAns);
      else return false;
    }

    protected function generateMinHeap(){
      $heap = new Heap(true);
      $seed = mt_rand();
      $heap->seedRng($seed);
      return $heap;
    }

    protected function generateMaxHeap(){
      $heap = new Heap(false);
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
      $heap = $this->generateMaxHeap();
      $heap->buildRandomHeap($heapSize);
      $heapContent = $heap->getAllElements();
      $varToBeInserted = $heapContent[0];
      while(in_array($varToBeInserted, $heapContent)){
        $varToBeInserted = mt_rand(HEAP_RANGE_LOWER_BOUND,HEAP_RANGE_UPPER_BOUND);
      }

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_HEAP;
      $qObj->qType = QUESTION_TYPE_INSERTION;
      $qObj->qParams = array("value" => $varToBeInserted,"subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = true;
      $qObj->graphState = $heap->toGraphState();
      $qObj->internalDS = $heap;

      return $qObj;
    }

    public function checkAnswerInsertion($qObj, $userAns){
      $heap = $qObj->internalDS;
      $varToBeInserted = $qObj->qParams["value"];
      $ans = $heap->insert($varToBeInserted);

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

    public function generateQuestionExtract($heapSize){
      $heap = $this->generateMaxHeap();
      $heap->buildRandomHeap($heapSize);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_HEAP;
      $qObj->qType = QUESTION_TYPE_EXTRACT;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = true;
      $qObj->graphState = $heap->toGraphState();
      $qObj->internalDS = $heap;

      return $qObj;
    }

    public function checkAnswerExtract($qObj, $userAns){
      $heap = $qObj->internalDS;
      $ans = $heap->extractMax();

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

    public function generateQuestionHeapSort($heapSize){
      $heap = $this->generateMaxHeap();
      $heap->buildRandomHeap($heapSize);
      $heapContent = $heap->getAllElements();
      $amt = mt_rand(1, count($heapContent)-2);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_HEAP;
      $qObj->qType = QUESTION_TYPE_HEAP_SORT;
      $qObj->qParams = array("amt" => $amt, "subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $heap->toGraphState();
      $qObj->internalDS = $heap;

      return $qObj;
    }

    public function checkAnswerHeapSort($qObj, $userAns){
      $heap = $qObj->internalDS;
      $heap->partialHeapSort($qObj->qParams["amt"]);
      $ans = $heap->getAllElements();
      array_shift($ans);
      sort($ans);
      sort($userAns);

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

    public function generateQuestionHeapify($heapSize){
      $heap = $this->generateMaxHeap();
      $heap->buildUnshiftedHeap($heapSize);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_HEAP;
      $qObj->qType = QUESTION_TYPE_HEAPIFY;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = true;
      $qObj->graphState = $heap->toGraphState();
      $qObj->internalDS = $heap;

      return $qObj;
    }

    public function checkAnswerHeapify($qObj, $userAns){
      $heap = $qObj->internalDS;
      $heapContent = $heap->getAllElements();
      array_shift($heapContent);
      $heap->clearAll();
      $ans = $heap->heapify($heapContent);
      sort($ans);
      sort($userAns);

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
  }
?>