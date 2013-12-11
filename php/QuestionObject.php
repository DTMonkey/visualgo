<?php
  /* Contains:
   * - Question topic (BST, heap, etc.)
   * - Question type (search, insert, etc.)
   * - Question sub-type (delete AVL vertex for exactly one left rotation / right rotation / etc.)
   * - Question parameters (values to be searched/inserted/deleted, etc.)
   * - Answer type (MCQ, click on vertexes, etc.)
   * - Answer amount (one or multiple)
   * - Answer parameters (MCQ choices, range of values, etc.)
   * - Order matters (true or false)
   * - Allow "no possible answer"
   * - Graph State Object (frames to be sent to GraphWidget)
   * - Answer to the question (will NOT be sent to client) (Consider passing a function to be executed instead)
   *
   * Functions:
   * - Check answer
   * - Getter and setter
   */

  class QuestionObject{
    private $qTopic;
    private $qType;
    private $qParams; // Misc. values, such as the node being searched in BST search sequence question
    private $aType;
    private $aParams; // Misc. values, such as MCQ choices, range, etc.
    private $aAmt;
    private $ordered;
    private $allowNoAnswer;
    private $graphState;
    private $internalDS;

    public function __construct(){
      $this->qTopic = NULL;
      $this->qType = NULL;
      $this->qParams = NULL;
      $this->aType = NULL;
      $this->aParams = NULL;
      $this->aAmt = NULL;
      $this->ordered = NULL;
      $this->allowNoAnswer = NULL;
      $this->graphState = NULL;
      $this->internalDS = NULL;
    }

    public function __get($property) {
      if (property_exists($this, $property)) {
        return $this->$property;
      }
    }

    public function __set($property, $value) {
      if (property_exists($this, $property)) {
        $this->$property = $value;
      }

      return $this;
    }

    public function toJsonObject(){
      $arr = array(
        "qTopic" => $this->qTopic,
        "qType" => $this->qType,
        "qParams" => $this->qParams,
        "aType" => $this->aType,
        "aParams" => $this->aParams,
        "aAmt" => $this->aAmt,
        "ordered" => $this->ordered,
        "allowNoAnswer" => $this->allowNoAnswer,
        "graphState" => $this->graphState
        );
      return json_encode($arr);
    }

    public static function fromJsonObject($jsonStr){
      $qObj = new QuestionObject();
      $qObjJson = json_decode($jsonStr);

      $qObj->qTopic = NULL;
      $qObj->qType = NULL;
      $qObj->qParams = NULL;
      $qObj->aType = NULL;
      $qObj->aParams = NULL;
      $qObj->aAmt = NULL;
      $qObj->ordered = NULL;
      $qObj->allowNoAnswer = NULL;
      $qObj->graphState = NULL;
      $qObj->internalDS = NULL;

      return $qObj;
    }
  }
?>