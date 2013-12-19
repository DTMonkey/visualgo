<?php
class MstQuestionGenerator{
  protected $answerFunctionList = array(
      QUESTION_TYPE_PRIM_SEQUENCE => "checkAnswerPrimSequence",
      QUESTION_TYPE_KRUSKAL_SEQUENCE => "checkAnswerKruskalSequence",
      QUESTION_TYPE_MINIMAX_EDGE => "checkAnswerMinimaxEdge",
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

    protected function generateMinST(){

    }

    protected function generateMaxST(){

    }

    protected function generateQuestionPrimSequence(){
      $mst = $this->generateMinST();

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_MST;
      $qObj->qType = QUESTION_TYPE_PRIM_SEQUENCE;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_EDGE;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $mst->toGraphState();
      $qObj->internalDS = $mst;

      return $qObj;
    }

    protected function checkAnswerPrimSequence($qObj, $userAns){

    }

    protected function generateQuestionKruskalSequence(){
      $mst = $this->generateMinST();

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_MST;
      $qObj->qType = QUESTION_TYPE_KRUSKAL_SEQUENCE;
      $qObj->qParams = array("subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_EDGE;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $mst->toGraphState();
      $qObj->internalDS = $mst;

      return $qObj;
    }

    protected function checkAnswerKruskalSequence($qObj, $userAns){

    }

    protected function generateQuestionMinimaxEdge(){
      $mst = $this->generateMinST();
      $vertexA = NULL;
      $vertexB = NULL;

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_MST;
      $qObj->qType = QUESTION_TYPE_MINIMAX_EDGE;
      $qObj->qParams = array("vertexA" => $vertexA, "vertexB" => $vertexB,"subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_EDGE;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $mst->toGraphState();
      $qObj->internalDS = $mst;

      return $qObj;
    }

    protected function checkAnswerMinimaxEdge($qObj, $userAns){

    }
}

?>