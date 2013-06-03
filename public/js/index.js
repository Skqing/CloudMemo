/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-9
 * Time: 下午8:07
 * Description: for index page
 */


// 跨域取得图片
function getBingImage(idx,number,callback) {//callback为回调函数，即数据获取成功后的操作
    var js=document.createElement('script'),rand=parseInt(Math.random()*100000000);
    js.setAttribute('type', 'text/javascript');
    js.src='http://www.qiqiboy.com/bingimage.php?idx='+(idx?idx:0)+'&number='+(number?number:1)+'&varname=imgs_'+rand;
    js.onload = js.onerror = js.onreadystatechange = function () {
        if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
            return;
        }
        callback(window['imgs_'+rand]);
        js.onload = js.onreadystatechange = js.onerror = null;
        js.parentNode.removeChild(js);
        js = null;
    };
    document.getElementsByTagName('head')[0].appendChild(js);
}

// 回调函数
function setBg(data){
    document.getElementById('iPbg').background = 'url(data[0].imgurl) center center no-repeat';
}

// 每日图片,和图片切换
$(function(){
  //getBingImage(0,1,setBg);

  //图片切换



  //用户登录
  $("#login").click(function() {
    var form = $("#sign").serializeArray();
    console.log('登录请求数据:');
    console.log(form);
    $.getJSON('/login', form, function(data) {
      console.log('登录返回数据:');
      console.log(data);
      if (data) {
        if (data.status == 'success') {

        } else if (data.status == 'failure') {

        }
      } else {
        alert('获取数据失败，请重试!');
      }
    });
  });

  $("#signup")

  //用户注册




});