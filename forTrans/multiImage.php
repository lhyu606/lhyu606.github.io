<?php

$file = $_FILES['myfile'];
$name = $file['name'];

var_dump($file);
var_dump($name);

$upload_path = './img/';

foreach ($name as $k => $val) {
	$type = strtolower(substr($val, strrpos($val, '.')+1));
	$allow_type = array('jpg', 'jpeg', 'gif', 'png');

	if(!in_array($type, $allow_type)) {
		echo 'unset '.$k;
	}
}
$str = '';
foreach ($name as $k => $val) {
	if (move_uploaded_file($file['tmp_name'][$k], $upload_path.time().$name[$k])) {
		echo 'success';
	} else {
		echo "fail";
	};
}
