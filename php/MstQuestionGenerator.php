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

        $questions[] = $this->$potentialQuestions[$questionIndex]();

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
      $mst = new MST(true);
      return $mst;
    }

    protected function generateMaxST(){
      $mst = new MST(false);
      return $mst;
    }

    protected function generateQuestionPrimSequence(){
      $mst = $this->generateMinST();
      $startValue = 0;

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_MST;
      $qObj->qType = QUESTION_TYPE_PRIM_SEQUENCE;
      $qObj->qParams = array("value" => $startValue, "subtype" => QUESTION_SUB_TYPE_NONE);
      $qObj->aType = ANSWER_TYPE_EDGE;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $mst->toGraphState();
      $qObj->internalDS = $mst;

      return $qObj;
    }

    protected function checkAnswerPrimSequence($qObj, $userAns){
      $mst = $qObj->internalDS;
      $startValue = $qObj->qParams["value"];
      $ans = $mst->prim($startValue);

      $correctness = true;
      if(count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          if($ans[$i][0] != $userAns[$i][0] || $ans[$i][1] != $userAns[$i][1]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
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
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $mst->toGraphState();
      $qObj->internalDS = $mst;

      return $qObj;
    }

    protected function checkAnswerMinimaxEdge($qObj, $userAns){

    }
}

?>