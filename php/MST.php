<?php

	class Pair {
		protected $v;
		protected $w;
	
		public function __construct($v, $w) {
			$this->v = $v;
			$this->w = $w;
		}
	
		//accessors
		public function v() { return $this->v; }
		public function w() { return $this->w; }
	
		public function toString() {
			return "(".$this->v.",".$this->w.") ";
		}
	}

	class Triple {
		protected $from;
		protected $tp;
		protected $w; 
	
		public function __construct($f, $t, $w) {
			$this->from = $f;
			$this->to = $t;
			$this->w = $w;
		}
	
		//accessors
		public function from() { return $this->from; }
		public function to() { return $this->to; }
		public function weight() { return $this->w; }
	
		public function toString() {
			return "(".$this->from.",".$this->to.",".$this->w.") ";
		}
	}
  
  class MST{
	protected $adjList;
	protected $edgeList;
	protected $graphTemplate;
	protected $size;
    protected $min; // true means the MST is minimum spanning tree

    public function __construct($isMin){
      $this->init();
      $this->min = $isMin;
    }
	
	protected static function pairSort($a, $b) { //a and b are pairs
	  if($a->w() == $b->w()) return ($a->v() - $b->v());
	  else return ($a->w() > $b->w());
	}
	
	protected static function tripleSort($a, $b) { //a and b are triples
	  if($a->weight() == $b->weight()) return ($a->to() - $b->to());
	  else return ($a->weight() > $b->weight());
	}

    public function clearAll(){
		$this->init();
    }

    protected function init(){
		$this->size = rand(6,8);
		$this->graphTemplate = GraphTemplate::getGraph(array("numVertex" => $this->size, "directed" => false, "connected" => true));
		$this->generateAdjList($this->graphTemplate); //array of array of Pairs
		$this->generateEdgeList($this->graphTemplate); //array of triples
    }
	
	protected function generateAdjList($graph) {
		$a = $graph["internalAdjList"];
		$e = $graph["internalEdgeList"];
	  
	  	$akeys = array_keys($a);
		for($i=0; $i<count($akeys); $i++) { //for each vertex
			$temp = array();
			foreach ($a[$akeys[$i]] as $key => $value) {
				if(!is_string($key)) {
					$new = new Pair($key, $e[$value]["weight"]);
					$temp[] = $new;
				}
			}
			$this->adjList[$akeys[$i]] = $temp;
		}
	}

	protected function generateEdgeList($graph) {
		$e = $graph["internalEdgeList"];
		$keys = array_keys($e);
		for($i=0; $i<count($keys); $i++) { //for each edge
			$this->edgeList[] = new Triple($e[$keys[$i]]["vertexA"], $e[$keys[$i]]["vertexB"], $e[$keys[$i]]["weight"]);
		}
		/*
		for($i=0; $i<count($this->edgeList); $i++) {
			echo($this->edgeList[$i]->toString()." ");
			echo("<br/>");
		}*/
	}

    public function toGraphState(){
		return GraphTemplate::createState($this->graphTemplate, array("displayWeight" => true, "directed" => false));
    }

    public function createRandomGraph(){

    }
	
	public function getSize() {
		return $this->size;
	}
	
	public function getAllElements() {
		return array_keys($this->adjList);
	}

    public function prim($start){
	  $edgeSet = array(); //empty set
      $vertexSet = array(); //empty set
	  $vertexSet[] = $start; //put starting vertex in set
	  
	  $PQ = array(); //array of triples (from, to, weight)
	  $nNeighbours = count($this->adjList[$start]);
	  for($i=0; $i<$nNeighbours; $i++) { //enqueue neighbours
	  	  $neighbourEdge = new Triple($start, $this->adjList[$start][$i]->v(), $this->adjList[$start][$i]->w());
		  $PQ[] = $neighbourEdge;
	  }
	  usort($PQ, array('MST', 'tripleSort')); //by weight
	  
	  while(!empty($PQ)) {
	    $edge = array_shift($PQ); //edge is a (from, to, weight) triple
		$v = $edge->to();
		if(!in_array($v, $vertexSet)) { //v is not in vertexSet
		  $vertexSet[] = $v; //put it in
		  $edgeSet[] = new Triple($edge->from(), $v, $edge->weight());
		  $nNeighbours = count($this->adjList[$v]);
		  for($i=0; $i<$nNeighbours; $i++) { //and enqueue neighbours
		  	  $neighbourEdge = new Triple($v, $this->adjList[$v][$i]->v(), $this->adjList[$v][$i]->w());
			  $PQ[] = $neighbourEdge;
		  }
		  usort($PQ, array('MST', 'tripleSort')); //by weight
		}
	  }
	  return $edgeSet;
    }

    public function kruskal(){
		$ufds = new UFDS();
		$edgeQ = $this->edgeList;
		$akeys = array_keys($this->adjList);
		for($i=0; $i<count($akeys); $i++) {
			$ufds->insert($akeys[$i]);
		}
		$edgeSet = array();
		usort($edgeQ, array('MST', 'tripleSort')); //by weight
		
		$length = count($edgeQ);
		for($i=0; $i<$length; $i++) {
			$e = array_shift($edgeQ);
			if(!($ufds->isSameSet($e->from(), $e->to()))) { //if does not form cycle
				$edgeSet[] = $e;
				$ufds->unionSet($e->from(), $e->to());
			}
		}
		return $edgeSet;
    }
	
	public function minimax($start, $end) { //on minimum ST
		$tree = $this->prim($start); //edge triple list
		//make adj list
		$treeAdj = array();
		for($i=0; $i<count($tree); $i++) { //works for undirected graph only
			$v1 = $tree[$i]->from();
			$v2 = $tree[$i]->to();
			$w = $tree[$i]->weight();
			
			if(!isset($treeAdj[$v1])) $treeAdj[$v1] = array();
			if(!isset($treeAdj[$v2])) $treeAdj[$v2] = array();
			$treeAdj[$v1][] = new Pair($v2, $w);
			$treeAdj[$v2][] = new Pair($v1, $w);
		}
		//traverse tree
		$stack = array();
		$visited = array();
		$parent = array();
		
		$stack[] = $start;
		$visited[$start] = true;
		while(!empty($stack)) {
			$u = array_pop($stack);
			for($i=0; $i<count($treeAdj[$u]); $i++) {
				$v = $treeAdj[$u][$i]->v();
				if(!$visited[$v]) {
					$visited[$v] = true;
					$parent[$v] = $u;
					$stack[] = $v;
				}
			}
		}
		//backward traverse path to find max on path
		$ans = 0;
		$ansTriple;
		$v = $end;
		while(isset($parent[$v])) {
			$p = $parent[$v];
			$weight = 0;
			for($i=0; $i<count($treeAdj[$p]); $i++) {
				if($treeAdj[$p][$i]->v() == $v) {
					$weight = $treeAdj[$p][$i]->w();
				}
			}
			if($weight > $ans) {
				$ans = $weight;
				$ansTriple = new Triple($p,$v,$weight);
			}
			$v = $p;
		}
		return $ansTriple;
	}
	
  }
?>