<?php
$get = $_GET;

$result = date("Y-m-d H:i:s", time()+6*60*60);
$result = $result.' => ';
foreach ($get as $key => $value) {
	$result = $result.$key.'='.$value.'&';
}
echo $result;

// 部分产生编码现象
// $result = preg_replace("/-[0-9]+=/","=",$result);

$result = $result."^_^\r\n\r\n";
$file = './private.txt';
file_put_contents($file, $result, FILE_APPEND);

