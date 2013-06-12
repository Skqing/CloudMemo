
function getBingBackground(url) {  //获取bing每日首页背景图片
	url = url || "http://bing.com";
	var html = '';
	// 1.取得首页的html内容
	var req = http.get(url, function(res) {
		  console.log("Got response: " + res.statusCode);
		  res.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			    html = chunk;
		  });
		})
	req.on('error', function(e) {
		console.log("Download bing background failed!");
	    console.log("Got error: " + e.message);
	});
	
	var imgurl = '';
	
}
//#bgDiv{opacity:1;background-image:url(http://s.cn.bing.net/az/hprichbg/rb/PatchworkLandscape_ZH-CN6728662377_1366x768.jpg);}
/**
	var download_file_httpget = function(file_url) {
		var options = {
		    host: url.parse(file_url).host,
		    port: 80,
		    path: url.parse(file_url).pathname

		};

		//use the date as the file name
		var date = new Date();
		var file_name = (date.getMonth()+1).toString() + '-' + date.getDate().toString();
		file_name += '.jpg';
		
		var file = fs.createWriteStream(download_path + "\\" + file_name);

		http.get(options,function(res) {
		    res.on('data',function(data) {
		        file.write(data);
		    }).on('end',function() {
		        file.end();
		        console.log('download success');
		    });
		});
	
	
}*/ //参考(http://www.w3c.com.cn/nodejs%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E6%97%B6%E9%81%87%E5%88%B0%E9%98%B2%E5%A4%96%E9%93%BE%E7%9A%84%E5%9B%BE%E7%89%87%E6%97%A0%E6%B3%95%E4%B8%8B%E8%BD%BD) 