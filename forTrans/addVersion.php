<?php

$path = 'test';
// $file = 'js/test.js';
	function dir_file($path, $dfile){
        if(is_file($path)){  
            echo $path;  
        }  
        if(!is_dir($path)){  
            return false;  
        }  
        $handle = opendir($path);  
        while(false !== ($foldeordir = readdir($handle))){ 
        	// echo $foldeordir; 
        	// echo "<br/>";
            if($foldeordir != "." && $foldeordir != ".."){  
                if(is_dir($path."/".$foldeordir)){  
                    dir_file("{$path}/{$foldeordir}", $dfile);  
                }elseif(is_file("{$path}/{$foldeordir}")){
                	$pattern = '/.html/';
					if(preg_match($pattern, $foldeordir)) {
						
						// 扫描文件
						$fileContent = file_get_contents($path.'/'.$foldeordir);
						$tm = date('m-d H-i-s');
						$tm = preg_replace('/-/', '', $tm);
						$tm = preg_replace('/\s/', '', $tm);
						// echo $tm;
						$dfilePat = preg_replace('/\//','\/' , $dfile);
						// 如果匹配
						if(preg_match('/'.$dfilePat.'\?v=\d*/', $fileContent)){
							echo '<br/><span style="color:green;">文件：'.$foldeordir.'</span>';
							echo '<br/><span style="color:red;">更新了： '.$dfile.'</span><br/>';
							$fileContent = preg_replace('/'.$dfilePat.'\?v=\d*/', $dfile.'?v='.$tm, $fileContent);
							$rpfile = fopen($path.'/'.$foldeordir, "w") or die("Unable to open file!");
							fwrite($rpfile, $fileContent);
							fclose($rpfile);

							// 更新内容
							$fileContent = preg_replace('/</', '∠', $fileContent);
							$fileContent = preg_replace('/'.$dfilePat.'\?v/', '<span style="color:red;">'.$dfile.'?v</span>', $fileContent);

							// echo $fileContent;
						}
					}
                }  
            }  
        }  
        closedir($handle);  
    }  


$dfiles = array();
// 需要替换的文件
array_push($dfiles, 
	'js/test.js',
	'css/test.css',
	'js/users.js',
	'css/users.css'
);

foreach($dfiles as $idx => $val){
	dir_file($path, $val);
}





?>
