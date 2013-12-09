<?php
  /* Contains:
   * - Question topic (BST, heap, etc.)
   * - Question type (search, insert, etc.)
   * - Answer type (MCQ, click on vertexes, etc.)
   * - Answer amount (one or multiple)
   * - Order matters (true or false)
   * - Allow "no possible answer"
   * - Graph State Object (frames to be sent to GraphWidget)
   * - Answer to the question (will NOT be sent to client)
   *
   * Functions:
   * - Check answer
   * - Getter
   * - Setter (will only be available to calling class)
   */
  class QuestionObject{
    private $qTopic;
    private $qType;
    private $aType;
  }
?>