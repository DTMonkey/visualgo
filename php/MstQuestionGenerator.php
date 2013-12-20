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
      $mstContent = $mst->getAllElements();
      $startValue = $mstContent[rand(0, count($mstContent)-1)];
      $amtEdge = rand((int)(count($mstContent)/2), count($mstContent)-1);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_MST;
      $qObj->qType = QUESTION_TYPE_PRIM_SEQUENCE;
      $qObj->qParams = array("value" => $startValue, "amt" => $amtEdge,"subtype" => QUESTION_SUB_TYPE_NONE, "directed" => false);
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
      $amtEdge = $qObj->qParams["amt"];
      $ans = $mst->prim($startValue);
      $ans = array_slice($ans, 0, $amtEdge);

      $correctness = true;
      if(2*count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          $currEdge = array($ans[$i]->from(), $ans[$i]->to());
          if(!($qObj->qParams["directed"])) sort($currEdge);
          if($currEdge[0] != $userAns[$i*2] || $currEdge[1] != $userAns[$i*2 + 1]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionKruskalSequence(){
      $mst = $this->generateMinST();
      $mstContent = $mst->getAllElements();
      $amtEdge = rand((int)(count($mstContent)/2), count($mstContent)-1);

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_MST;
      $qObj->qType = QUESTION_TYPE_KRUSKAL_SEQUENCE;
      $qObj->qParams = array("amt" => $amtEdge, "subtype" => QUESTION_SUB_TYPE_NONE, "directed" => false);
      $qObj->aType = ANSWER_TYPE_EDGE;
      $qObj->aAmt = ANSWER_AMT_MULTIPLE;
      $qObj->ordered = true;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $mst->toGraphState();
      $qObj->internalDS = $mst;

      return $qObj;
    }

    protected function checkAnswerKruskalSequence($qObj, $userAns){
      $mst = $qObj->internalDS;
      $ans = $mst->kruskal();
      $amtEdge = $qObj->qParams["amt"];
      $ans = array_slice($ans, 0, $amtEdge);

      $correctness = true;
      if(2*count($ans) != count($userAns)) $correctness = false;
      else{
        for($i = 0; $i < count($ans); $i++){
          $currEdge = array($ans[$i]->from(), $ans[$i]->to());
          if(!($qObj->qParams["directed"])) sort($currEdge);
          if($currEdge[0] != $userAns[$i*2] || $currEdge[1] != $userAns[$i*2 + 1]){
            $correctness = false;
            break;
          }
        }
      }

      return $correctness;
    }

    protected function generateQuestionMinimaxEdge(){
      $mst = $this->generateMinST();
      $mstContent = $mst->getAllElements();
      $vertexAIndex = rand(0, count($mstContent)-1);
      $vertexA = $mstContent[$vertexAIndex];
      unset($mstContent[$vertexAIndex]);
      $vertexB = $mstContent[rand(0, count($mstContent)-1)];

      $qObj = new QuestionObject();
      $qObj->qTopic = QUESTION_TOPIC_MST;
      $qObj->qType = QUESTION_TYPE_MINIMAX_EDGE;
      $qObj->qParams = array("vertexA" => $vertexA, "vertexB" => $vertexB,"subtype" => QUESTION_SUB_TYPE_NONE, "directed" => false);
      $qObj->aType = ANSWER_TYPE_EDGE;
      $qObj->aAmt = ANSWER_AMT_ONE;
      $qObj->ordered = false;
      $qObj->allowNoAnswer = false;
      $qObj->graphState = $mst->toGraphState();
      $qObj->internalDS = $mst;

      return $qObj;
    }

    protected function checkAnswerMinimaxEdge($qObj, $userAns){
      $mst = $qObj->internalDS;
      $vertexA = $qObj->qParams["vertexA"];
      $vertexB = $qObj->qParams["vertexB"];
      $ans = $mst->minimax($vertexA, $vertexB);

      $correctness = true;
      $currEdge = array($ans->from(), $ans->to());
      if(!($qObj->qParams["directed"])) sort($currEdge);
      if($currEdge[0] != $userAns[0] || $currEdge[1] != $userAns[1]){
        $correctness = false;
      }

      return $correctness;
    }
}

?>