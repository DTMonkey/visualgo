<?php
  interface QuestionGeneratorInterface{
    public function generateQuestion($amt);
    public function checkAnswer($qObj, $userAns);
  }
?>