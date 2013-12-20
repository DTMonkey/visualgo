<?php

class SSSP {
	
	protected $weighted; //boolean
	protected $adjList; //array of arrays of pairs (use Pair class from MST)
	
	public function __construct(){
		$this->init();
    }
	
	protected function init() {
		
	}
	
	public function clearAll() {
		$this->init();
	}
	
	public function getAllElements() {
		return array_keys($this->adjList);
	}
	
	//returns an array of integers
	public function sssp($start) {
		if($this->weighted) {
			return $this->bellmanFord($start);
		} else {
			return $this->BFS($start);
		}
	}
	
	//returns an array of integers
	public function BFS($start) {
		$Q = array();
		$visited = array();
		$shortestPath = array(); //from $start
		
		$Q[] = $start;
		$visted[$start] = true;
		$shortestPath[$start] = 0;
		while(!empty($Q)) {
			$u = array_shift($Q);
			$nNeighbours = count($this->adjList[$u]);
			for($i=0; $i<$nNeighbours; $i++) {
				$v = $this->adjList[$u][$i]->v();
				if(!$visited[$v]) {
					$Q[] = $v;
					$shortestPath[$v] = $shortestPath[$u]+1;
				}
			}
		}
		return $shortestPath;
	}
	
	public function bellmanFord($start) {
		$akeys = $this->getAllElements();
		for($i=0; $i<count($akeys); $i++) {
			$shortestPaths[$akeys[$i]] = INFINITY;
		}
	}
	
}

?>