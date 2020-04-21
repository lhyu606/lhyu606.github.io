<?php 
	$value = '1300180.200a';
	
	if( preg_match('/^\d+.\d{2}$/', $value, $s) ){
		echo $s[0];
	} elseif ( preg_match('/^\d+$/', $value, $s) ){
		echo $s[0] ;
	};
?>

<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<title>search</title>
<style>
	body{font-size: 14px; }
	form{margin-top: 30px;margin-left: 50px;}
	.input{width:500px;padding: 4px 8px;}
	.ml50{padding-left: 50px;color: #2ba245}
	.lable{display: inline-block;width: 90px;text-align: right;}
	.badge{padding: 4px 2px;line-height: 25px;margin: 2px;}
	.tip{background: #eeeeee;margin-right: 15px;padding: 2px 4px;cursor: pointer;display: inline-block;margin-top: 4px;}
</style>	
</head>
<body>
	


<form action="#" method='post'>
	<span class='lable'>搜索目录：</span><input type="text" name='file' id='file' class='input' value="E:/lhyu">
	<div id='badge'>
		<p class="badge">
			<span class='tip'>E:/lhyu/wechat_<b style="color:red">destine</b>_vue/src</span>
			<!-- <span class='tip'>E:/business_web/wechat_member_vue/src/components</span> -->
			<span class='tip'>E:/lhyu/wechat_<b style="color:red">order</b>_vue/src/components</span>
			<span class='tip'>E:/lhyu/wechat_<b style="color:red">member</b>_vue/src/components</span>
			<span class='tip'>E:/lhyu/wechat_<b style="color:red">ticket</b>_vue/src/components</span>
		</p>
        <p class="badge">
			<span class='tip'>E:/business_web/<b style="color:red">sandBox</b>_vue/src/components</span>
			<span class='tip'>E:/lhyu/WXXCX/<b style="color:red">wxOnlineMarket</b>/src</span>
		</p>
		<p class="badge">
			<span class='tip'>E:/lhyu/system_admin/<b style="color:red">system_admin</b>/Application</span>
			<span class='tip'>E:/lhyu/company_admin/<b style="color:red">company_admin</b>/Application</span>
			<span class='tip'>E:/lhyu/destine_admin/<b style="color:red">destine_admin</b>/Application</span>
			<span class='tip'>E:/lhyu/memb_admin/<b style="color:red">member_admin</b>/Application</span>
			<span class='tip'>E:/lhyu/wechat_order_service/<b style="color:red">wechat_order_service</b>/Api</span>
			<span class='tip'>E:/lhyu/wechat_member/<b style="color:red">wechat_member</b>/Api</span>
			<span class='tip'>E:/lhyu/wechat_destine/<b style="color:red">wechat_destine</b>/Api</span>
		</p>
	</div>
	<br>
	<span class='lable'>关键词：</span><input type='text' name='keyword' id='keyword' class='input' placeholder='投资' autofocus="autofocus">
	<br><br>
	<span class='lable'> </span><input type="submit" value='开始搜索'>
</form>




<?php
header("Content-type: text/html; charset=utf-8");

if($_SERVER['REQUEST_METHOD'] == 'POST'){
	echo '<p class="ml50"><br>---------------------------------<br><br>';
	echo '搜索目录：';
	echo $_POST['file'];
	echo '<br><br>';
	echo '搜索关键词：';
	echo $_POST['keyword'];
	echo '<br><br>---------------------------------</p>';
	echo '<div id="result"><br>-----------------  搜索结果：  -------------------<span>总共有 <b id="totle" style="color: #2ba245;">0</b> 个</span><br>';


	$keyword = $_POST['keyword'];
    $dirname = $_POST['file'];//'E:/xampps/htdocs/p2p_m_ns/app/view'; //保存当前目录下用来便利的一个目录名
    
    // 转义
    $specialWord = ["\\$", "\\(", "\\)", "\\*", "\\.", "\\+", "\\[", "\\]", "\\?", "\\^", "\\{", "\\}"]; // , "\\|","\\\\\\\\"
    foreach($specialWord  as $key => $val) {
        $keyword = preg_replace('/'.$val.'/', '\\'.$val.'', $keyword);
    }
	$keyword = preg_replace('/\//', '\/', $keyword);
	echo '跳过的目录：<br>';
	dir_file($dirname, $keyword);
	 
	echo '</div>';
	//closedir($dir_handle); //关闭文件操作句柄

}
function dir_file($path, $keyword){
	// 跳过不查询的目录
	$jumpDirList = ['node_modules', '\.'];
	foreach($jumpDirList  as $k => $v) {
		
		$ptn = '/'.$v.'/i'; // 跳过
		if(preg_match($ptn, $path)) {
			echo $path.'<br>';
			return false;
		}
	}
		
        if(is_file($path)){  
            echo $path;  
        }  
        if(!is_dir($path)){  
            return false;  
        }  
        $handle = opendir($path);  
        while(false !== ($foldeordir = readdir($handle))){  
            if($foldeordir != "." && $foldeordir != ".."){  
                if(is_dir($path."/".$foldeordir)){  
                    dir_file("{$path}/{$foldeordir}", $keyword);  
                }elseif(is_file("{$path}/{$foldeordir}")){
					
					$linenum = 0; // 搜索行数
					$isHave = 0; // 匹配次数
					$file = fopen($path.'/'.$foldeordir, "r") or exit("无法打开文件!");
					// 读取文件每一行，直到文件结尾
					while(!feof($file))
					{
						$linenum++;
						

						$content = fgets($file);

						$pattern = '/'.$keyword.'/i';
						if(preg_match($pattern, $content, $dir)) {
							if($isHave == 0) {
								echo '<br /><br /><span style="background: #adf;">------------------';  
			                    echo $path.'/<b style="color:red">-----></b>'.$foldeordir; 
								echo "--------------</span><br />";
							}
							$isHave++;
							echo '第 <b>'.$linenum.'</b> 行：<br />';
							
                            $content = preg_replace('/</', '∠', $content);
                            $sourceKeyword = preg_replace('/\\\\/', '', $keyword); // 还原
							// $content = preg_replace($pattern, '<b style="color:red">'.$sourceKeyword.'</b>', $content);
							$content = preg_replace($pattern, '<b style="color:red">'.$dir[0].'</b>', $content);
							echo $content.'<br><br>';
						}
						
					}
					fclose($file);
                }  
            }  
        }  
        closedir($handle);  
    }  

?>



<script>
<?php if($_SERVER['REQUEST_METHOD'] == 'POST'): ?>
	document.getElementById('file').value = "<?php echo $_POST['file']?>";
	document.getElementById('keyword').value = "<?php echo $_POST['keyword']?>";
<?php endif;?>

// 预选项  E:/xampps/htdocs/
document.getElementById('badge').onclick = function(e){
	var target = e.target;
	var pre = '';
	// var pre = 'E:/lhyu/';

	if(target.tagName !== 'SPAN'){
		return;
    } 
    var keyWord = target.innerHTML
    keyWord = keyWord.replace('<b style="color:red">','')
    keyWord = keyWord.replace('</b>','')
	document.getElementById('file').value = pre + keyWord;
}
document.getElementById('file').onchange = function () {
	this.value = this.value.replace(/\\/g, '\/');
}
var result = document.getElementById('result').innerHTML;
var keyword = document.getElementById('keyword').value;
var reg = new RegExp(keyword,"g");
document.getElementById('totle').innerText = result.match(reg).length;
</script>
</body>
</html>