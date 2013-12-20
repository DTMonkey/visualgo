const BST_SEARCH = "Given the BST as shown in the picture, click the sequence of vertices (the order matters) that are visited by Search(|value|)!";
const BST_TRAVERSAL = "Given the BST as shown in the picture, click the sequence of vertices (the order matters) that are visited by |subtype| traversal!";
const BST_SUCCESSOR = "Given the BST as shown in the picture, click the sequence of vertices (the order matters) that are visited by Successor(|value|)!";
const BST_PREDECESSOR = "Given the BST as shown in the picture, click the sequence of vertices (the order matters) that are visited by Predecessor(|value|)!";
const BST_MIN = "What is the value of the minimum element in this BST?";
const BST_MAX = "What is the value of the maximum element in this BST?";
const BST_K_SMALLEST_VALUE = "What is the value of the element with rank |value| in this BST? Rank is defined as the index in the sorted list of elements of the tree";
const BST_DELETION = "Given the normal BST (not AVL) as shown in the picture, delete at most |maxAmt| vertex/vertices such that the height of the BST decreases by 1!";
const BST_SWAP = "Is the graph in the picture a valid BST?";
const BST_IS_AVL = "Is the graph in the picture a valid AVL?";
const BST_HEIGHT = "What is the height of this BST?";
const BST_ROOT = "Click the root of this BST!";
const BST_LEAVES = "Click all the leaf vertices of this BST!";
const BST_INTERNAL = "Click all the internal vertices of this BST!";
const BST_AVL_ROTATION_INSERT = "Given the AVL as shown in the picture, insert at least |limitBtm| vertex/vertices and at most |limitTop| vertex/vertices such that |rotationAmt| rotation(s) occur(s)!";
const BST_AVL_ROTATION_DELETE = "Given the AVL as shown in the picture, delete at least |limitBtm| vertex/vertices and at most |limitTop| vertex/vertices such that |rotationAmt| rotation(s) occur(s)!";
const BST_AVL_HEIGHT = "";

const HEAP_INSERTION = "An integer |value| is going to be inserted into the binary |subtype| heap as shown in the picture, click the sequence of vertices (the order matters) that will swap their content with vertex |value| during this insertion!";
const HEAP_EXTRACT = "We are performing extract operation to the binary |subtype| heap as shown in the picture, click the sequence of vertices (the order matters) that will swap their content with the leaf vertex that replaces the root node!";
const HEAP_HEAP_SORT = "We perform |amt| extract operations to the binary |subtype| heap as shown in the picture, click all vertices (in any order) that will remain in the binary |subtype| heap after all these operations are executed!";
const HEAP_HEAPIFY = "We perform Build Heap O(n) to the binary |subtype| heap as shown in the picture, click all vertices (in any order) that violates the property of a |subtype| heap and will be shifted down!";
const HEAP_ROOT = "Click the root of this heap!";
const HEAP_LEAVES = "Click all the leaf vertices of this heap!";
const HEAP_INTERNAL = "Click all the internal vertices of this heap!";
const HEAP_GREATER_LESS = "Click all vertices that are |greaterless| than |value| in this |subtype| heap!";
const HEAP_RELATIONS = "Click the |relation| of |value|.";
const HEAP_IS_HEAP = "Is this a valid |subtype| heap?";

const BITMASK_OPERATIONS = "What is the integer result of |value| |subtype| (1 << |shiftAmt|)?";
const BITMASK_CONVERT = "What is the |toBase| representation of |fromBase| value |value|?";
const BITMASK_NUMBER_ON = "How many bit(s) in the binary representation of |value| is/are 1?";
const BITMASK_LSONE = "What is the index of the least significant bit (first bit counted from the right, 0-based indexing) that is 1 in the binary representation of |value|?";

const UFDS_FIND_SET_COMPRESSION = "Given the UFDS as shown in the picture, click all vertices when findSet(v) is performed on vertex v, the UFDS structure does not change! The path compression and union by rank heuristics are used.";
const UFDS_FIND_SET_SEQUENCE = "Given the UFDS as shown in the picture, click the sequence of vertices (the order matters) that are visited by findSet(|value|)!";
const UFDS_IS_SAME_SET = "Given the UFDS as shown in the picture, click all vertices that belongs to the same set as |value|!";

const MST_PRIM_SEQUENCE = "Given the undirected weighted graph as shown in the picture, click the first |amt| edges (the order matters) that are added to the MST by Prim\'s algorithm starting at vertex |value|!";
const MST_KRUSKAL_SEQUENCE = "Given the undirected weighted graph as shown in the picture, click the first |amt| edges (the order matters) that are added to the MST by Kruskal\'s algorithm!";
const MST_MINIMAX_EDGE = "Click the edge that has the maximum edge weight along the minimax path from vertex |vertexA| to vertex |vertexB|. The minimax path between two vertices is defined as the path that minimizes the maximum edge weight between the two vertices.";