<?php
  require 'Everything.php';

  $bstQuestionGen = new BstQuestionGenerator();
  $qArr = ($bstQuestionGen->generateQuestion(1));
  $q1 = $qArr[0];

  echo($q1->toJsonObject());
  // $bstQuestionGen->checkAnswer($q1, [1,2,3]);
  // echo();

  // echo("Hello world!");
?>