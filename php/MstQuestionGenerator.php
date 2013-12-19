<?php
class MstQuestionGenerator{
  protected $answerFunctionList = array(
      QUESTION_TYPE_SEARCH => "checkAnswerPrimSequence",
      QUESTION_TYPE_TRAVERSAL => "checkAnswerKruskalSequence",
      QUESTION_TYPE_SUCCESSOR => "checkAnswerMinimaxEdge",
      );

    public function __construct(){
      // while (@ob_end_flush());
    }

    public function generateQuestion($amt){
      $questions = array();
      $potentialQuestions = $this->generatePotentialQuestions();

      for($i = 0; $i < $amt; $i++){
        if(count($potentialQuestions) == 0) $potentialQuestions = $this->generatePotentialQuestions();

        $questionIndex = rand(0, count($potentialQuestions) - 1);
        $questionFunc = $potentialQuestions[$questionIndex];

        else $questions[] = $this->$potentialQuestions[$questionIndex]();

        unset($potentialQuestions[$questionIndex]);
        $potentialQuestions = array_values($potentialQuestions);
      }

      return $questions;
    }

    protected function generatePotentialQuestions(){
      $potentialQuestions = array();

      $potentialQuestions[] = "generateQuestionPrimSequence";
      $potentialQuestions[] = "generateQuestionKruskalSequence";
      $potentialQuestions[] = "generateQuestionMinimaxEdge";

      return $potentialQuestions;
    }

    public function checkAnswer($qObj, $userAns){
      if(array_key_exists($qObj->qType, $this->answerFunctionList)){
        $verifierFunc = $this->answerFunctionList[$qObj->qType];
        return $this->$verifierFunc($qObj, $userAns);
      }
      else return false;
    }

    protected function generateQuestionPrimSequence(){

    }

    protected function checkAnswerPrimSequence($qObj, $userAns){

    }

    protected function generateQuestionKruskalSequence(){

    }

    protected function checkAnswerKruskalSequence($qObj, $userAns){

    }

    protected function generateQuestionMinimaxEdge(){

    }

    protected function checkAnswerMinimaxEdge($qObj, $userAns){

    }
}

?>