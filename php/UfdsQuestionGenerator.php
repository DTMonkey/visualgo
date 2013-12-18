<?php
  class UfdsQuestionGenerator implements QuestionGeneratorInterface{
    public function __construct(){

    }

    public function generateQuestion($amt){
      $questions = array();
      $potentialQuestions = $this->generatePotentialQuestions();

      for($i = 0; $i < $amt; $i++){
        $ufdsSize = rand(5,15);
        $setAmt = rand(1,$ufdsSize);

        if(count($potentialQuestions) == 0) $potentialQuestions = $this->generatePotentialQuestions();

        $questionIndex = rand(0, count($potentialQuestions) - 1);
        $questionFunc = $potentialQuestions[$questionIndex];

        $questions[] = $this->$potentialQuestions[$questionIndex]($ufdsSize, $setAmt);

        unset($potentialQuestions[$questionIndex]);
        $potentialQuestions = array_values($potentialQuestions);

      }

      return $questions;
    }

    protected function generatePotentialQuestions(){
      $potentialQuestions = array();

      $potentialQuestions[] = "generateQuestionFindSetSequence";
      $potentialQuestions[] = "generateQuestionFindSetCompression";
      $potentialQuestions[] = "generateQuestionIsSameSet";

      return $potentialQuestions;
    }

    public function checkAnswer($qObj, $userAns){
      if($qObj->qType == QUESTION_TYPE_FIND_SET_SEQUENCE) return $this->checkAnswerFindSetSequence($qObj, $userAns);
      else if ($qObj->qType == QUESTION_TYPE_FIND_SET_COMPRESSION) return $this->checkAnswerFindSetCompression($qObj, $userAns);
      else if ($qObj->qType == QUESTION_TYPE_IS_SAME_SET) return $this->checkAnswerIsSameSet($qObj, $userAns);
      else return false;
    }

    protected function generateUfds(){

    }

    protected function generateQuestionFindSetSequence($ufdsSize, $setAmt){
      $ufds = new UFDS();
      $ufds->insertElements($ufdsSize, $setAmt);
      $varWhichSetIsToBeFound = rand(0, $ufdsSize-1);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_UFDS;
      $qObj->qType = QUESTION_TYPE_FIND_SET_SEQUENCE;
      $qObj->qParams = array("value" => $varWhichSetIsToBeFound, "subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $ufds->toGraphState();
      $qObj->internalDS = $ufds;

      return $qObj;
    }

    protected function checkAnswerFindSetSequence($qObj, $userAns){
      $ufds = $qObj->internalDS;
      $varWhichSetIsToBeFound = $qObj->qParams["value"];
      $ans = $ufds->findSet($varWhichSetIsToBeFound);

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

    protected function generateQuestionFindSetCompression($ufdsSize, $setAmt){
      $ufds = new UFDS();
      $ufds->insertElements($ufdsSize, $setAmt);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_UFDS;
      $qObj->qType = QUESTION_TYPE_FIND_SET_COMPRESSION;
      $qObj->qParams = array("value" => $varWhichSetIsToBeFound, "subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $ufds->toGraphState();
      $qObj->internalDS = $ufds;

      return $qObj;
    }

    protected function checkAnswerFindSetCompression($qObj, $userAns){
      $ufds = $qObj->internalDS;
      $ufdsContent = $ufds->getAllElements();
      $ans = array();

      for($i = 0; $i < count($ufdsContent); $i++){
        if(count($ufds->findSetNoPathCompression()) <= 2) $ans[] = $i;
      }

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

    protected function generateQuestionIsSameSet($ufdsSize, $setAmt){
      $ufds = new UFDS();
      $ufds->insertElements($ufdsSize, $setAmt);
      $varToTestSameSet = rand(0, $ufdsSize-1);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_UFDS;
      $qObj->qType = QUESTION_TYPE_IS_SAME_SET;
      $qObj->qParams = array("value" => $varToTestSameSet, "subtype" => QUESTION_SUB_TYPE_MAX_HEAP);
      $qObj->aType = ANSWER_TYPE_VERTEX;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $ufds->toGraphState();
      $qObj->internalDS = $ufds;

      return $qObj;
    }

    protected function checkAnswerIsSameSet($qObj, $userAns){
      $ufds = $qObj->internalDS;
      $ufdsContent = $ufds->getAllElements();
      $varToTestSameSet = $qObj->qParams["value"];
      $ans = array();

      for($i = 0; $i < count($ufdsContent); $i++){
        if($ufds->isSameSet($i, $varToTestSameSet)) $ans[] = $i;
      }

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