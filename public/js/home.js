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
        $.cookie('memotitle', memotitle, { expires: 30 });
        $.cookie('memotext', memotext, { expires: 30 });
    });

    //归档
    $("#filling").click(function (e) {
        var memotitle = $("#memotitle").val();
        var memotext = $("#memotext").val();
        $.post('/memo/add', { title: memotitle, text: memotext }, function (json) {
            if (json) {
                if (json.status == 'success') {
                    var item = json.data;
                    var html = '<li><a href="javascript:void(0)"><span id="'+item._id+'" class="close"></span><h2>'+item.title+'</h2><p>'+item.context+'</p></a></li>';
                    $("#context").after(html);
                } else if (json.status = 'failure') {
                    alert(json.info);
                    if (json.action && json.action == 'login') {
                        window.location.href = json.url;
                    }
                }
            } else {
                alert('木有数据!');
            }
        }, 'json');
        // 2. 清空cookies
        $.cookie('memotitle', null);
        $.cookie('memotext', null);

        // 3.新建标签
        $("#memotitle").val('');
        $("#memotext").val('');

        e.stopPropagation();  //防止事件冒泡
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

    /** 加载数据 */
    $.getJSON('/memo/loadall', {}, function(json) {
//        console.log('异步加载数据：');
//        console.log(json);
        if (json) {
            if (json.status == 'success') {
                var html = '';
                $.each(json.data, function(i,item){
                    html += '<li><a href="javascript:void(0)"><span id="'+item._id+'" class="close"></span><h2>'+item.title+'</h2><p>'+item.context+'</p></a></li>';
                });
//                console.log('html: %s', html);
                $("#context").after(html);

                /** 样式 */
                $("#waterfall li").hover(
                    function () {
//                        console.log('change over style.');
                        $(this).children('a').children('span.close').css('display', 'block');
                    },
                    function () {
//                        console.log('change out style.');
                        $(this).children('a').children('span.close').css('display', 'none');
                    }
                );

                // 绑定删除事件
                $("#waterfall span.close").click(function(e) {
                    $li = $(this).parent('a').parent('li');
                    var id = $(this).attr('id');
                    $.getJSON('/memo/delete', { tid: id }, function(json) {
                        if (json) {
                            if (json.status = 'success') {
                                $li.remove();  //移除已经删除的对象
                                console.log('删除文档成功!');
                            } else if (json.status = 'failure') {
                                alert(json.info);
                                alert(json.info);
                                if (json.action && json.action == 'login') {
                                    window.location.href = json.url;
                                }
                            }
                        } else {
                            alert('木有获取到数据, 删除失败!');
                        }
                    });
                    e.stopPropagation();  //防止事件冒泡
                });
            } else if (json.status == 'failure') {
                alert(json.info);
                if (json.action && json.action == 'login') {
                    window.location.href = json.url;
                }
            }
        } else {
            console.log('木有获取到数据!');
        }
    });

    // 绑定删除事件
//    $("#waterfall span.close").on('click', function() {
//        $that = $(this);
//        var id = $(this).attr('id');
//        $.getJSON('/memo/delete', { tid: id }, function(json) {
//            if (json) {
//                if (json.status = 'success') {
//                    $that.remove();  //移除已经删除的对象
//                    console.log('删除文档成功!');
//                } else if (json.status = 'failure') {
//                    alert(json.info);
//                }
//            } else {
//                alert('木有获取到数据, 删除失败!');
//            }
//        });
//    });


//    $("#waterfall li").live({
//        mouseover: function() {
//            console.log('change over style.');
//        },
//        mouseout: function() {
//            console.log('change out style.');
//        }
//
//    });



    /*** waterfall ***/
    // 按需加载方式
//    var page = 0;
//    $('#waterfall').waterfall({
//        colWidth: 237,
//        perNum: 5,	// 每次显示五个
//        ajaxTimes: 1,	// 只发送一次请求
//        // 自定义跨域请求
//        ajaxFunc: function(success, error){
//            $.ajax({
//                type: 'GET',
//                url: '/memo/waterfall',
////                url: '/memo/waterfall?callback=?',
//                cache: false,
//                data: {page: page++},
//                dataType:'json',
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

//    var page = 0;
//    $('#waterfall').scrollload({
//        colWidth: 237,
//        perNum: 5,	// 每次显示五个
//        ajaxTimes: 1,	// 只发送一次请求
//        // 自定义跨域请求
//        ajaxFunc: function(success, error){
//            $.ajax({
//                type: 'GET',
//                url: '/memo/waterfall',
////                url: '/memo/waterfall?callback=?',
//                cache: false,
//                data: {page: page++},
//                dataType:'json',
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

});



