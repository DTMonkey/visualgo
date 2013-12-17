<?php
  class UfdsQuestionGenerator implements QuestionGeneratorInterface{
    public function __construct(){

    }

    public function seedRng($seed){
      mt_srand($seed);
    }

    public function generateQuestion($amt){
      $questions = array();
      for($i = 0; $i < $amt; $i++){
        $questions[] = $this->generateQuestionFindSetSequence(15, 4);
      }
      return $questions;
    }

    public function checkAnswer($qObj, $userAns){
      return false;
    }

    protected function generateQuestionFindSetSequence($ufdsSize, $setAmt){
      $ufds = new UFDS();
      $ufds->insertElements($ufdsSize, $setAmt);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_UFDS;
      $qObj->qType = QUESTION_TYPE_FIND_SET_SEQUENCE;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $ufds->toGraphState();
      $qObj->internalDS = $ufds;

      return $qObj;
    }

    protected function checkAnswerFindSetSequence($qObj, $userAns){

    }
  }
?>