<?php
  require 'Everything.php';

  $bstQuestionGen = new BstQuestionGenerator();
  $heapQuestionGen = new HeapQuestionGenerator();

  $questionGenerator = array(
    QUESTION_TOPIC_BST => $bstQuestionGen,
    QUESTION_TOPIC_HEAP => $heapQuestionGen
    );

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
    $qTopics = $_GET["topics"];

    mt_srand($seed);

    $qTopics = explode(",", $qTopics);

    $bstQuestionGen->seedRng(mt_rand());
    $heapQuestionGen->seedRng(mt_rand());

    $qArr = array();
    $qAmtTopic = array();

    // $qArr += $questionGenerator[QUESTION_TOPIC_HEAP]->generateQuestion($qAmt);

    for($i = 0; $i < count($qTopics); $i++){
      $qAmtTopic[] = 1;
      $qAmt--;
    }

    for($i = 0; $qAmt > 0; $i = ($i+1)%count($qAmtTopic)){
      $addition = mt_rand(1, $qAmt);
      $qAmt -= $addition;
      $qAmtTopic[$i] += $addition;
    }

    for($i = 0; $i < count($qTopics); $i++){
      if(array_key_exists($qTopics[$i], $questionGenerator))
        $qArr = array_merge($qArr, $questionGenerator[$qTopics[$i]]->generateQuestion($qAmtTopic[$i]));
    }
    
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
      if($aArr[$i][0] == UNANSWERED){
        $aCorrectness[$i] = false;
        continue;
      }
      else if($aArr[$i][0] == NO_ANSWER){
        $aArr[$i] = array();
      }
      // echo($i);
      $aCorrectness[$i] = $bstQuestionGen->checkAnswer($qArr[$i],$aArr[$i]);
      if($aCorrectness[$i]){
        $score++;
        // echo 1;
      }
      // else echo 0;
    }

    echo $score;
  }
?>