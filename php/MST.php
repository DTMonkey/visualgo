<?php
  //to remove later
	require 'GraphTemplate.php';
	while(@ob_end_flush());
	$mst = new MST(true);
	$mst->prim(0);

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
	protected $graphTemplate;
    protected $min; // true means the MST is minimum spanning tree

    public function __construct($isMin){
      $this->init();
      $this->min = $isMin;
    }

    public function clearAll(){
      $this->init();
    }

    protected function init(){
	  global $GRAPH_TEMPLATE_K5;
	  $this->graphTemplate = $GRAPH_TEMPLATE_K5;
      $this->adjList = $this->generateAdjList($this->graphTemplate); //array of array of Pairs
    }
	
	protected function generateAdjList($graph) {
		$a = $graph["internalAdjList"];
		$e = $graph["internalEdgeList"];
	  
		for($i=0; $i<count($a); $i++) { //for each vertex
			$temp = array();
			foreach ($a[$i] as $key => $value) {
				if(!is_string($key)) {
					$temp[] = new Pair($key, $e[$value]["weight"]);
				}
			}
			$this->adjList[$i] = $temp;
		}
	  
		/*for($i=0; $i<count($this->adjList); $i++) {
			$str = "";
			for($j=0; $j<count($this->adjList[$i]); $j++) {
				$str .= $this->adjList[$i][$j]->toString();
			}
			$str .= "<br/>";
			echo($str);
		}*/
	}

    public function toGraphState(){
	  return createState($this->graphTemplate);
    }

    public function createRandomGraph(){

    }
	
	protected function pairSort($a, $b) { //a and b are pairs
	  if($a->w() == $b->w()) return ($a->v() - $b->v());
	  else return ($a->w() > $b->w());
	}
	
	protected function tripleSort($a, $b) { //a and b are triples
	  if($a->weight() == $b->weight()) return ($a->to() - $b->to());
	  else return ($a->weight() > $b->weight());
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
	  usort($PQ, "tripleSort"); //by weight
	  
	  while(!empty($PQ)) {
	    $edge = array_shift($PQ); //edge is a (from, to, weight) triple
		$v = $edge->to();
		if(array_search($v, $vertexSet) === false) { //v is not in vertexSet
		  $vertexSet[] = $v; //put it in
		  $edgeSet[] = new Triple($edge->from(), $v, $edge->weight());
		  $nNeighbours = count($this->adjList[$v]);
		  for($i=0; $i<$nNeighbours; $i++) { //and enqueue neighbours
			  $PQ[] = new Triple($v, $this->adjList[$v][$i]->v(), $this->adjList[$v][$i]->w());
		  }
		  usort($PQ, "pairSort"); //by weight
		}
	  }
	  
	  $str = "";
	  //echo(count($edgeSet));
	  for($i=0; $i<count($edgeSet); $i++) {
		$str .=  $edgeSet[$i]->toString();
	  }
	  $str .= "<br/>";
	  //echo($str);
	  return $edgeSet;
    }

    public function kruskal(){

    }
  }
?>