/*
 * Sync this file with the PHP file Constant.php
 */

const SITE_PREFIX = "http://algorithmics.comp.nus.edu.sg/~onlinequiz/Test.php";

const QUESTION_TOPIC_BITMASK = "Bitmask";
const QUESTION_TOPIC_BST = "BST";
const QUESTION_TOPIC_HEAP = "Heap";
const QUESTION_TOPIC_UFDS = "UFDS";
const QUESTION_TOPIC_MST = "MST";
const QUESTION_TOPIC_SSSP = "SSSP";

// General in several data-structures
const QUESTION_TYPE_DELETION = "Deletion";
const QUESTION_TYPE_INSERTION = "Insertion";
const QUESTION_TYPE_MIN_VALUE = "MinVal";
const QUESTION_TYPE_MAX_VALUE = "MaxVal";
const QUESTION_TYPE_K_SMALLEST_VALUE = "KSmallestVal";
const QUESTION_TYPE_INTERNAL = "Internal";
const QUESTION_TYPE_LEAVES = "Leaves";
const QUESTION_TYPE_ROOT = "Root";

// BST-Specific
const QUESTION_TYPE_AVL_ROTATION_INSERT = "avlRotationInsert";
const QUESTION_TYPE_AVL_ROTATION_DELETE = "avlRotationDelete";
const QUESTION_TYPE_AVL_HEIGHT = "avlHeight";
const QUESTION_TYPE_HEIGHT = "Height";
const QUESTION_TYPE_IS_AVL = "isAvl";
const QUESTION_TYPE_PREDECESSOR = "Predecessor";
const QUESTION_TYPE_SEARCH = "Search";
const QUESTION_TYPE_SUCCESSOR = "Successor";
const QUESTION_TYPE_SWAP = "Swap";
const QUESTION_TYPE_TRAVERSAL = "Traversal";

// Heap-Specific
const QUESTION_TYPE_EXTRACT = "extract";
const QUESTION_TYPE_HEAPIFY = "heapify";
const QUESTION_TYPE_HEAP_SORT = "heapSort";
const QUESTION_TYPE_GREATER_LESS = "greaterLess";
const QUESTION_TYPE_RELATIONS = "relations";
const QUESTION_TYPE_IS_HEAP = "isHeap";

//Bitmask-Specific
const QUESTION_TYPE_OPERATION = "operation";
const QUESTION_TYPE_CONVERT = "convert";
const QUESTION_TYPE_NUMBER_ON = "numberOn";
const QUESTION_TYPE_LSONE = "LSOne";

// UFDS-Specific
const QUESTION_TYPE_FIND_SET_SEQUENCE = "findSetSeq";
const QUESTION_TYPE_FIND_SET_COMPRESSION = "findSetCompress";
const QUESTION_TYPE_IS_SAME_SET = "isSameSet";

// MST-Specific
const QUESTION_TYPE_PRIM_SEQUENCE = "prim";
const QUESTION_TYPE_KRUSKAL_SEQUENCE = "kruskal";
const QUESTION_TYPE_MINIMAX_EDGE = "minimax";

// General
const QUESTION_SUB_TYPE_NONE = "";
const QUESTION_SUB_TYPE_INSERTION = "insert";
const QUESTION_SUB_TYPE_DELETION = "delete";

// BST-Specific
const QUESTION_SUB_TYPE_INORDER_TRAVERSAL = "inorder";
const QUESTION_SUB_TYPE_POSTORDER_TRAVERSAL = "postorder";
const QUESTION_SUB_TYPE_PREORDER_TRAVERSAL = "preorder";

// Heap-Specific
const QUESTION_SUB_TYPE_MAX_HEAP = "max";
const QUESTION_SUB_TYPE_MIN_HEAP = "min";

// Bitmask-Specific
const QUESTION_SUB_TYPE_AND = "AND";
const QUESTION_SUB_TYPE_OR = "OR";
const QUESTION_SUB_TYPE_XOR = "XOR";
const QUESTION_SUB_TYPE_BINARY = "binary";
const QUESTION_SUB_TYPE_DECIMAL = "integer";

const ANSWER_TYPE_VERTEX = "vertex";
const ANSWER_TYPE_VERTEX_MCQ = "vertexMcq";
const ANSWER_TYPE_EDGE = "edge";
const ANSWER_TYPE_MCQ = "mcq";
const ANSWER_TYPE_FILL_BLANKS = "fillBlanks";

const ANSWER_AMT_ONE = 1;
const ANSWER_AMT_MULTIPLE = 2;

const MODE_GENERATE_SEED = 0;
const MODE_GENERATE_QUESTIONS = 1;
const MODE_CHECK_ANSWERS = 2;

const UNANSWERED = "unanswered";
const NO_ANSWER = "noAnswer";