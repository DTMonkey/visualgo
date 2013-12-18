<?php
	class BitmaskQuestionGenerator implements QuestionGeneratorInterface{
		
		// public function seedRng($seed){
		// 	$this->rngSeed = $seed;
		// 	srand($rngSeed);
		// }
	
		// public function removeSeed(){
		// 	$this->rngSeed = NULL;
		// 	srand();
		// }
		
		//constructor
		public function __construct(){
		}
		
		//interface functions
		public function generateQuestion($amt){
			$questions = array();
			$potentialQuestions = $this->generatePotentialQuestions();
			
			for($i = 0; $i < $amt; $i++){
				if(count($potentialQuestions) == 0) $potentialQuestions = $this->generatePotentialQuestions();

        $questionIndex = rand(0, count($potentialQuestions) - 1);
        $questionFunc = $potentialQuestions[$questionIndex];
	
				$questions[] = $this->$potentialQuestions[$questionIndex]();

        unset($potentialQuestions[$questionIndex]);
        $potentialQuestions = array_values($potentialQuestions);
			}
			return $questions;
		}

		protected function generatePotentialQuestions(){
			$potentialQuestions = array();
	
			$potentialQuestions[] = "generateQuestionBitOperations";
			$potentialQuestions[] = "generateQuestionConversion";
			$potentialQuestions[] = "generateQuestionNumberOn";
			$potentialQuestions[] = "generateQuestionLSOne";

			return $potentialQuestions;
		}
		
		public function checkAnswer($qObj, $userAns){
			if($qObj->qType == QUESTION_TYPE_OPERATION) return $this->checkAnswerBitOperations($qObj, $userAns);
			else if ($qObj->qType == QUESTION_TYPE_CONVERT) return $this->checkAnswerConversion($qObj, $userAns);
			else if ($qObj->qType == QUESTION_TYPE_NUMBER_ON) return $this->checkAnswerNumberOn($qObj, $userAns);
			else if ($qObj->qType == QUESTION_TYPE_LSONE) return $this->checkAnswerLSOne($qObj, $userAns);
			else return false;
		}
		
		//each question type generator and checker
		//AND/OR/XOR
		public function generateQuestionBitOperations() {
			$intval = rand(0,63);
			$j = rand(0,5);
			$subtype = rand(0,2);
			$subtypeArr = array(QUESTION_SUB_TYPE_AND, QUESTION_SUB_TYPE_OR, QUESTION_SUB_TYPE_XOR);
			
			$qObj = new QuestionObject();
			$qObj->qTopic = QUESTION_TOPIC_BITMASK;
			$qObj->qType = QUESTION_TYPE_OPERATION;
			$qObj->qParams = array("value" => $intval,"subtype" => $subtypeArr[$subtype], "shiftAmt" => $j);
			$qObj->aType = ANSWER_TYPE_FILL_BLANKS;
			$qObj->aAmt = ANSWER_AMT_ONE;
			$qObj->ordered = false;
			$qObj->allowNoAnswer = false;
			$qObj->graphState = array("vl" => array(), "el" => array()); //empty graph
		
			return $qObj;
		}
		
		public function checkAnswerBitOperations($qObj, $userAns) {
			$intval = $qObj->qParams["value"];
			$j = $qObj->qParams["shiftAmt"];
			$ans;
			if($qObj->qParams["subtype"] == QUESTION_SUB_TYPE_AND) $ans = $intval & (1 << $j);
			else if($qObj->qParams["subtype"] == QUESTION_SUB_TYPE_OR) $ans = $intval | (1 << $j);
			else if($qObj->qParams["subtype"] == QUESTION_SUB_TYPE_XOR) $ans = $intval ^ (1 << $j);
			return ($userAns[0] == $ans);
		}
		
		//binary <--> decimal conversion
		public function generateQuestionConversion() {
			$val = rand(0,63);
			$whichway = rand(0,1);
			$subtypeArr = array(QUESTION_SUB_TYPE_BINARY, QUESTION_SUB_TYPE_DECIMAL);
			if($whichway == 0) { //binary to decimal question
				$val = intval(base_convert((string)$val, 10, 2)); //convert to binary
			}
			
			$qObj = new QuestionObject();
			$qObj->qTopic = QUESTION_TOPIC_BITMASK;
			$qObj->qType = QUESTION_TYPE_CONVERT;
			$qObj->qParams = array("value" => $val,"fromBase" => $subtypeArr[$whichway], "toBase" => $subtypeArr[1-$whichway]);
			$qObj->aType = ANSWER_TYPE_FILL_BLANKS;
			$qObj->aAmt = ANSWER_AMT_ONE;
			$qObj->ordered = false;
			$qObj->allowNoAnswer = false;
			$qObj->graphState = array("vl" => array(), "el" => array()); //empty graph
		
			return $qObj;
		}
		
		public function checkAnswerConversion($qObj, $userAns) {
			$val = $qObj->qParams["value"];
			$toBase = $qObj->qParams["toBase"];
			$ans;
			if($qObj->qParams["toBase"] == QUESTION_SUB_TYPE_BINARY) $ans = intval(base_convert((string)$val, 10, 2));
			else if($qObj->qParams["toBase"] == QUESTION_SUB_TYPE_DECIMAL) $ans = intval(base_convert((string)$val, 2, 10));
			return ($userAns[0] == $ans);
		}
		
		//popcount
		public function generateQuestionNumberOn() {
			$val = rand(0,63);
			
			$qObj = new QuestionObject();
			$qObj->qTopic = QUESTION_TOPIC_BITMASK;
			$qObj->qType = QUESTION_TYPE_NUMBER_ON;
			$qObj->qParams = array("value" => $val);
			$qObj->aType = ANSWER_TYPE_FILL_BLANKS;
			$qObj->aAmt = ANSWER_AMT_ONE;
			$qObj->ordered = false;
			$qObj->allowNoAnswer = false;
			$qObj->graphState = array("vl" => array(), "el" => array()); //empty graph
		
			return $qObj;
		}
		
		public function checkAnswerNumberOn($qObj, $userAns) {
			$val = $qObj->qParams["value"];
			$ans = 0;
			$pow = 5;
			
			while($val != 0) {
				if($val >= pow(2,$pow)) {
					$val -= pow(2,$pow);
					$ans++;
				}
				$pow--;
			}
			return ($userAns[0] == $ans);
		}
		
		//LS One
		public function generateQuestionLSOne() {
			$val = rand(0,63);
			
			$qObj = new QuestionObject();
			$qObj->qTopic = QUESTION_TOPIC_BITMASK;
			$qObj->qType = QUESTION_TYPE_LSONE;
			$qObj->qParams = array("value" => $val);
			$qObj->aType = ANSWER_TYPE_FILL_BLANKS;
			$qObj->aAmt = ANSWER_AMT_ONE;
			$qObj->ordered = false;
			$qObj->allowNoAnswer = false;
			$qObj->graphState = array("vl" => array(), "el" => array()); //empty graph
		
			return $qObj;
		}
		
		public function checkAnswerLSOne($qObj, $userAns) {
			$val = $qObj->qParams["value"];
			$j = (~ $val) + 1;
			
			$ans = intval(log($val & $j, 2));
			return ($userAns[0] == $ans);
		}
	}
?>