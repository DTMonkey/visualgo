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

    }

    public function checkAnswer($qObj, $userAns){

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

    public function generateQuestionHeapInsert($heapSize){
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

    public function checkAnswerHeapInsert($qObj, $userAns){
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

<!-- mode=2&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=unanswered&ans[]=12,17,32&ans[]=unanswered&ans[]=unanswered&ans[]=21&ans[]=unanswered&seed=1280733249&qAmt=20 -->