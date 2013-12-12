<?php
  require 'Everything.php';

  $bstQuestionGen = new BstQuestionGenerator();
  // $bstQuestionGen->seedRng(5342);

  $qSeed = 0;
  $qArr = array();
  $aArr = array();
  $aCorrectness = array();
  $score = 0;

  $mode = $_GET["mode"];

  if($mode == MODE_GENERATE_SEED){
    echo(mt_rand());
  }

  if($mode == MODE_GENERATE_QUESTIONS){
    $qAmt = $_GET["qAmt"];
    $qSeed = $_GET["seed"];

    $bstQuestionGen->seedRng($qSeed);
    $qArr = ($bstQuestionGen->generateQuestion($qAmt));

    $qArrJson = array();

    for($i = 0; $i < count($qArr);$i++){
      $qArrJson[] = $qArr[$i]->toJsonObject();
    }

    echo arrayOfJsonStringEncoder($qArrJson);
  }

  else if($mode == MODE_CHECK_ANSWERS){
    $aArrCsv = $_GET["ans"];
    $qSeed = $_GET["seed"];
    $qAmt = $_GET["qAmt"];
    // echo implode("|",$aArrCsv);
    for($i = 0; $i < count($aArrCsv); $i++){
      $aArr[] = explode(",",$aArrCsv[$i]);
    }
    $score = 0;

    $bstQuestionGen->seedRng($qSeed);
    $qArr = ($bstQuestionGen->generateQuestion($qAmt));

    // echo(count($qArr));
    // echo $qArr[0]->toJsonObject;

    for($i = 0; $i < count($qArr);$i++){
      if($aArr[$i] == UNANSWERED){
        $aCorrectness[$i] = false;
        continue;
      }
      else if($aArr[$i] == NO_ANSWER){
        $aArr[$i] = array();
      }
      $aCorrectness[$i] = $bstQuestionGen->checkAnswer($qArr[$i],$aArr[$i]);
      if($aCorrectness[$i]){
        $score++;
        // echo 1;
      }
      // else echo 0;
    }

    echo($score);
  }
?>