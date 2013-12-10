<?php
  require 'Everything.php';

  $bstQuestionGen = new BstQuestionGenerator();
  $qArr = ($bstQuestionGen->generateQuestion(1));
  $q1 = $qArr[0];

  echo($q1->toJsonObject());
  $correctness = $bstQuestionGen->checkAnswer($q1, array(1,2,3));
  echo gettype($correctness);
  // echo();

  // echo("Hello world!");
?>