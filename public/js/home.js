/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-9
 * Time: 下午8:07
 * Description: for home page
 */

//标签的textarea域失去焦点则保存此便签

$(function () {
    //监听键盘事件,支持快捷键操作.
    $(document).keypress(function (e) {
        if (e.ctrlKey && (e.which == 13 || e.which == 10)) {
            // 1.发送数据,并保存
            var memotitle = $("#memotitle").val();
            var memotext = $("#memotext").val();
            $.post('/memo/add', { title: memotitle, text: memotext }, function (data) {
                alert("Data Loaded: " + data.status);
            });
            // 2. 清空cookies
            $.cookie('memotitle', null);
            $.cookie('memotext', null);

            // 3.新建标签
            $("#memotitle").val('');
            $("#memotext").val('');
        }
    });

    //失去焦点
    $("#context").focusout(function () {
        var memotitle = $("#memotitle").val();
        var memotext = $("#memotext").val();
        console.log(memotitle);
        console.log(memotext);
        $.cookie('memotitle', memotitle, { expires: 30 });
        $.cookie('memotext', memotext, { expires: 30 });
    });

    //归档
    $("#filling").click(function () {
        var memotitle = $("#memotitle").val();
        var memotext = $("#memotext").val();
        $.post('/memo/add', { title: memotitle, text: memotext }, function (data) {
            console.log("Data Loaded: " + data.status);
        });
        // 2. 清空cookies
        $.cookie('memotitle', null);
        $.cookie('memotext', null);

        // 3.新建标签
        $("#memotitle").val('');
        $("#memotext").val('');
    });
    $("#clear").click(function () {
        // 1.清空textarea的值
        $("#memotext").val('');
        // 2. 清空cookies
        $.cookie('memotext', null);
    });
    //进入此页面，如果cookies中有内容，则显示到标签里面
    var title = $.cookie('memotitle');
    var context = $.cookie('memotext');
    if (context) {
        $("#memotitle").val(title);
        $("#memotext").val(context);
    }


    /*** waterfall ***/
    // 按需加载方式
//    var page = 1;
//    $('#waterfall').waterfall({
//        // 自定义跨域请求
//        ajaxFunc: function(success, error){
//            $.ajax({
//                type: 'GET',
//                url: '/memo/waterfall?callback=?',
//                cache: false,
//                data: {page: ++page},
//                dataType:'jsonp',
//                timeout: 60000,
//                success: success,
//                error: error
//            });
//        },
//        createHtml: function(data){
//            console.log('waterfall data:');
//            console.log(data);
//            var html = '<li><a href="#"><h2>'+data.title+'</h2><p>'+data.text+'</p></a></li>';
//            return html;
//        }
//    });

//    $('#waterfall').waterfall(
//        {
//            itemSelector:'.post-home',     //子元素id/class, 可留空
//            columnCount:4,                 // 列数,  纯数字, 可留空
//            columnWidth:300,               // 列宽度, 纯数字, 可留空
//            isResizable:false,             // 自适应浏览器宽度, 默认false
//            isAnimated:false,              // 元素动画, 默认false
//            Duration:500,                  // 动画时间
//            Easing:'swing',                // 动画效果, 配合 jQuery Easing Plugin 使用
//            endFn:function(){              // 回调函数
//                console.log(1);
//            }
//        }
//    )


});



