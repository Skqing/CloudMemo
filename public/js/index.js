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

    $("#sign").data("action", "login");
    //用户登录
    $("#login").click(function () {
        var action = $("#sign").data("action");
        console.log('action: %s', action);
        var form = $("#sign").serialize();
        console.log('请求数据:');
        console.log(form);
        if (action == 'login') {
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
        } else if (action == 'signup') {
            $.post('/sign/signup', form, function (data) {
                console.log('注册返回数据:');
                console.log(data);
                if (data) {
                    if (data.status == 'success') {
                        window.location.href = '/home';
                    } else if (data.status == 'failure') {
                        alert(data.info);
                    }
                } else {
                    alert('获取数据失败，请重试!');
                }
            }, 'json');
        }
//        else if (action == 'findpwd') {
//            $("#sign").action = '/sign/findPass';
//            $("#sign").submit();
//        }
    });

    $("#signup").click(function() {
        var repwdbut = $("#repwd").css('display');
        if (repwdbut == 'none') {
            $("#sign").data("action", "signup");
            $("#repwd").fadeIn();
            $("a.getpwd-link").fadeOut();
            $("#login").text('注  册');
            $("#signup").text('登  录');
        } else {
            $("#sign").data("action", "login");
            $("#repwd").fadeOut();
            $("a.getpwd-link").fadeIn();
            $("#login").text('登  录');
            $("#signup").text('注  册');
        }
    });
    $("#lostpass").click(function() {
//        var pwdbut = $("#password").css('display');
//        if (pwdbut == 'none') {
//            $("#sign").data("action", "login");
//            $("#password").fadeIn();
//            $("#login").text('登  录');
//            $("#lostpass").text('找回密码？');
//        } else {
//            $("#sign").data("action", "findpwd");
//            $("#password").fadeOut();
//            $("#login").text('确  定');
//            $("#lostpass").text('登  录');
//        }
        window.location.href = '/sign/findPassPage';
    });

    //用户注册


});