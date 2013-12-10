<?php
  function arrayOfJsonStringEncoder($arrJsonStr){
    $encodedArr = "[";
    $encodedArr = $encodedArr.implode(",",$arrJsonStr);
    $encodedArr = $encodedArr."]";

    return $encodedArr;
  }
?>