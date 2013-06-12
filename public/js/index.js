/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-9
 * Time: 下午8:07
 * Description: for index page
 */


// 跨域取得图片
function getBingImage(idx, number, callback) {//callback为回调函数，即数据获取成功后的操作
    var js = document.createElement('script'), rand = parseInt(Math.random() * 100000000);
    js.setAttribute('type', 'text/javascript');
    js.src = 'http://www.qiqiboy.com/bingimage.php?idx=' + (idx ? idx : 0) + '&number=' + (number ? number : 1) + '&varname=imgs_' + rand;
    js.onload = js.onerror = js.onreadystatechange = function () {
        if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
            return;
        }
        callback(window['imgs_' + rand]);
        js.onload = js.onreadystatechange = js.onerror = null;
        js.parentNode.removeChild(js);
        js = null;
    };
    document.getElementsByTagName('head')[0].appendChild(js);
}

// 回调函数
function setBg(data) {
    document.getElementById('iPbg').background = 'url(data[0].imgurl) center center no-repeat';
}

// 每日图片,和图片切换
$(function () {
    //getBingImage(0,1,setBg);

    //图片切换


    //用户登录
    $("#login").click(function () {
//        var repwdbut = $("#re_pwd");
//        var repwdhtml = "<div class='control-group'>"
//            + "<input id='re_pwd' type='password' class='login-field' placeholder='确认密码' />"
//            + "<label class='login-field-icon fui-lock' for='re_pwd'></label>"
//            + "</div>";
//        $(repwdhtml).before( $("div.control-group")[0]);
        var repwdbut = $("div.repwd").css('display');
        var form = $("#sign").serialize();
        console.log('请求数据:');
        console.log(form);
        if (repwdbut == 'none') {
            $.post('/sign/login', form, function (data) {
                console.log('登录返回数据:');
                console.log(data);
                if (data) {
                    if (data.status == 'success') {
                        window.location.href = '/home';
                    } else if (data.status == 'failure') {
                        alert(data.status);
                    }
                } else {
                    alert('获取数据失败，请重试!');
                }
            }, 'json');
        } else {
            $.post('/sign/signup', form, function (data) {
                console.log('注册返回数据:');
                console.log(data);
                if (data) {
                    if (data.status == 'success') {
                        window.location.href = '/home';
                    } else if (data.status == 'failure') {
                        alert(data.status);
                    }
                } else {
                    alert('获取数据失败，请重试!');
                }
            }, 'json');
        }
    });

    $("#signup").click(function() {
        var repwdbut = $("div.repwd").css('display');
        if (repwdbut == 'none') {
            $("div.repwd").css('display', 'block');
            $("a.getpwd-link").css('display', 'none');
            $("#login").text('注  册');
            $("#signup").text('登录');
        } else {
            $("div.repwd").css('display', 'none');
            $("a.getpwd-link").css('display', 'inline-block');
            $("#login").text('登  录');
            $("#signup").text('注册');
        }
    });

    //用户注册


});