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
    private $qSubType;
    private $qParams; // Misc. values, such as the node being searched in BST search sequence question
    private $aType;
    private $aParams; // Misc. values, such as MCQ choices, range, etc.
    private $aAmt;
    private $ordered;
    private $allowNoAnswer;
    private $graphState;
    private $internalDS;

    public __construct(){
      $qTopic = NULL;
      $qType = NULL;
      $qSubType = NULL;
      $qParams = NULL;
      $aType = NULL;
      $aParams = NULL;
      $aAmt = NULL;
      $ordered = NULL;
      $allowNoAnswer = NULL;
      $graphState = NULL;
      $internalDS = NULL;
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
        "qTopic" => $qTopic;
        "qType" => $qType;
        "qSubType" => $qSubType;
        "qParams" => $qParams;
        "aType" => $aType;
        "aParams" => $aParams;
        "aAmt" => $aAmt;
        "ordered" => $ordered;
        "allowNoAnswer" => $allowNoAnswer;
        "graphState" => $graphState;
        );
      return json_encode($arr);
    }
  }
?>