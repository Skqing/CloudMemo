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


    $('#waterfall').infinitescroll({
        navSelector: "div.navigation", // 导航的选择器，会被隐藏
        nextSelector: "div.navigation a:first", // 包含下一页链接的选择器
        itemSelector: "#content div.post", // 你将要取回的选项(内容块)
        debug: true, // 启用调试信息
        loadingImg: "/img/loading.gif", //加载的时候显示的图片
        //默认采用："http://www.infinite-scroll.com/loading.gif"
        loadingText: "正在给力载入中...", //加载的时候显示的文字
        // 默认显示： "<em>Loading the next set of posts...</em>"
        animate: true, //当有新数据加载进来的时候，页面是否有动画效果，默认没有
        extraScrollPx: 50, //滚动条距离底部多少像素的时候开始加载，默认150
        donetext: "客官已经结束了...", //数据加载完的时候显示的信息
        // 默认显示： "<em>Congratulations, you've reached the end of the internet.</em>"
        bufferPx: 40, //载入信息的显示时间，时间越大，载入信息显示时间越短
        errorCallback: function () {
        }, //当出错的时候，比如404页面的时候执行的函数
        localMode: true //是否允许载入具有相同函数的页面，默认为false
    }, function (arrayOfNewElems) { //程序执行完的回调函数

        // optional callback when new content is successfully loaded in.

        // keyword `this` will refer to the new DOM content that was just added.
        // as of 1.5, `this` matches the element you called the plugin on (e.g. #content)
        //                   all the new elements that were found are passed in as an array

    });

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



