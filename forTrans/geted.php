<?php

// echo urldecode($_SERVER["QUERY_STRING"]) ;
$file = './geted.txt';
$fp = fopen($file, 'a+');
fwrite($fp, urldecode($_SERVER["QUERY_STRING"])."\r\n\r\n");
?>