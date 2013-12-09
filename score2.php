<?php
$con = mysqli_connect("","onlinequiz","roseivanfyp","quiz");
if (mysqli_connect_errno($con))
  echo "Failed to connect to MySQL: " . mysqli_connect_error();

$result = mysqli_query($con, "SELECT * FROM quiz2 ORDER BY score DESC, testtime");
$lowest = 11;

$avg = 0;
$tot = 0;
$totnonzero = 0;
$totclickearly = 0;

srand(7);

echo '<p>This is the data as recorded in our server (two random characters from students\' matric numbers are replaced with two stars).<br>';
echo 'Only if your Lab TA confirm your score then it is considered valid.<br>';
echo 'Scores [17-20] are highlighted with <font color=blue>blue color</font>.<br>';
echo 'Scores [12-16] are highlighted with black color.<br>';
echo 'Scores [0-11] are highlighted with <font color=red>red color</font>.</p>';

echo '<table border=1>';
echo '<tr align="center">';
echo '<th>No</th>';
echo '<th>Matric Number</th>';
echo '<th>Student Name</th>';
echo '<th>Score</th>';
echo '<th>Elapsed time</th>';
echo '</tr>';

while ($row = mysqli_fetch_array($result)) {
  echo '<tr>';
  $tot = $tot + 1;

  if (intval($row['login']) < 1383195891)
    echo '<td>' . $tot . '</td>';
  else
    echo '<td><b><font color=green>' . $tot . '</font></b></td>';

  // hide two chars
  $idx1 = rand(2, strlen($row['matric'])-3); // one nearing the back
  $row['matric'][$idx1] = '*';
  $idx2 = $idx1;
  while ($idx1 == $idx2)
    $idx2 = rand(0, strlen($row['matric'])-1);
  $row['matric'][$idx2] = '*';
  echo '<td>' . $row['matric'] . '</td>';

  if ($row['score'] >= 12)
    echo '<td>' . $row['name'] . '</td>';
  else {
    echo '<td><font color=red>Hidden</font></td>';
    //echo '<td>' . $row['matric'] . '</td>';
    //echo '<td><font color=red>' . $row['name'] . '</font></td>';
  }

  if (intval($row['score']) >= 17)
    echo '<td align="center"><font color=blue>' . $row['score'] . '</font></td>';
  else if (intval($row['score']) < 12)
    echo '<td align="center"><font color=red>' . $row['score'] . '</font></td>';
  else
    echo '<td align="center">' . $row['score'] . '</td>';

  if (intval($row['score']) > 0) {
    $totnonzero = $totnonzero + 1;
    if ($row['testtime'] < 2400)
      $totalclickearly = $totalclickearly + 1;
  }

  $avg = $avg + intval($row['score']);
  echo '<td align="center">' . floor($row['testtime'] / 60) . 'm ' . ($row['testtime'] % 60) . 's</td>';

  echo '</tr>';
}

echo '</table>';
echo '<p>The current average score for this online quiz 2 in overall is : ' . ($avg / $totnonzero) . '<br>';
echo 'There are ' . $totalclickearly . ' students who submitted their answers earlier than 40 minutes.</p>';

mysqli_close($con);
?>
