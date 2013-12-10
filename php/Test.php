<?php
  require 'Everything.php';

  $bstQuestionGen = new BstQuestionGenerator();

  $qArr = array();
  $aArr = array();
  $aCorrectness = array();
  $score = 0;

  $mode = $_GET["mode"];
  if($mode == MODE_GENERATE_QUESTIONS){
    $qAmt = $_GET["qAmt"];

    $qArr = ($bstQuestionGen->generateQuestion($qAmt));
    $qArrJson = array();

    for($i = 0; $i < count($qArr);$i++){
      $qArrJson[] = $qArr[$i]->toJsonObject();
    }

    echo arrayOfJsonStringEncoder($qArrJson);
  }

  else if($mode == MODE_CHECK_ANSWERS){
    $aArrJson = $get["aArr"];
    $aArr = json_decode($ansArrJson);
    $score = 0;

    for($i = 0; $i < count($qArr);$i++){
      $aCorrectness[$i] = $bstQuestionGen->checkAnswer($qArr[$i],$aArr[$i]);
      if($aCorrectness[$i]) $score++;
    }

    echo($score);
  }
?>