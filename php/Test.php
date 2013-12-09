<?php
  require BstQuestionGenerator.php;
  require QuestionObject.php;

  $bstQuestionGen = new BstQuestionGenerator();
  $q1 = ($bstQuestionGen->generateQuestions(1))[1];

  echo($q1->toJsonObject());
  echo();
  echo();
?>