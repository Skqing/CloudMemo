/**
 * Name: jScrollload
 * version: 1.0.0 (2013-06-08)
 * @ jQuery v1.2.*
 * Licensed under the GPL:
 *   http://gplv3.fsf.org
 * usage as:
 *    var jscrollload = $.fn.jScrollload({...});
 *    slider.setSliderValue(value,callback);
 * Copyright 2013 DolphinBoy [ dolphinboyo[at]gmail.com ]
 * Description: Infinite scroll plug for jQuery.
 */

;(function($, window, document){
    $.fn.scrollload = function(options){
        var opts = $.extend({}, $.fn.scrollload.defaults, options),  // 配置信息

            isIE6 = !-[1,] && !window.XMLHttpRequest,

            ajaxTimes = 0,		// 已向服务器请求的次数
            isScroll = false,	// 窗口是否出现滚动条
            isLoading = false,	// 是否正在加载数据
            isFinish = false,	// true时不再向服务器发送请求

            page = 1,           // 请求第n页的数据

            jsonCache = [],		// 服务器返回的JSON缓存数据

            // 异步请求函数
            ajaxFunc = $.isFunction(opts.ajaxFunc) ?
                opts.ajaxFunc :
                function(success, error){
                    $.ajax({
                        type: 'GET',
                        url: opts.url,
                        cache: false,
                        data: opts.params,
                        dataType:'json',
                        timeout: 60000,
                        success: success,
                        error: error
                    });
                },
            // 生成html字符串函数
            createHtml = $.isFunction(opts.createHtml) ? opts.createHtml :
                function(data){
                    return '<div class="wf_item_inner">' +
                        '<a href="'+ data.href +'" class="thumb" target="_blank">' +
                        '<img class="'+opts.imgClass+'"  src="'+ data.imgSrc +'" />' +
                        '</a>' +
                        '<h3 class="title"><a href="'+ data.href +'" target="_blank">'+ data.title +'</a></h3>' +
                        '<p class="desc">'+ data.describe +'</p>' +
                        '</div>';
                };

        // 异步获取数据
        function getJSONData(){
            // 不再向服务器发送请求
            if(isFinish){
                showMsg('finish');
                return;
            }
            if(!isLoading){ // 确保上一次加载完毕才发送新的请求
                // 滚动条下拉时判断是否需要向服务器请求数据或者是处理缓存数据
                if(colsHeight.minHeight + wf_col_top < $(window).height() + $(window).scrollTop()){
                    // 如果缓存还有数据，直接处理数据
                    if(jsonCache.length > 0){
                        dealData();
                    }else{
                        if(opts.ajaxTimes === 'infinite' || ajaxTimes < opts.ajaxTimes){
                            showMsg('loading');
                            // 传参给服务器
                            opts.params.ajax = ++ajaxTimes;
                            ajaxFunc(
                                function(jsonData){
                                    try{
                                        if(jsonData.length > 0){
                                            jsonCache = jsonCache.concat(jsonData).reverse();
                                            dealData();
                                        }else{
                                            showMsg('finish');
                                        }
                                    }
                                    catch(e){
                                        showMsg('error');
                                    }
                                },
                                function(){
                                    showMsg('error');
                                }
                            );

                        }else{
                            showMsg('finish');
                        }
                    }

                }else{
                    isScroll = true;
                }
            }
        }

        // 处理返回的数据
        function dealData(){
            var colNum = typeof opts.perNum === 'number' ? opts.perNum : opts.colNum,
                data = null,
                wf_col_height = $wf_col.height(),
                $wf_item, $wf_img, htmlStr;




//            // 确保所有图片都已知宽高
//            loadImg(jsonCache, function(){
//                isLoading = false;
//                $wf_result.hide();
//                // 如果还没满屏出现滚动，继续获取数据
//                if(!isScroll){
//                    getJSONData();
//                }
//            });
        }

        // 显示结果信息
        function showMsg(type){
            switch(type){
                case 'loading':
                    isLoading = true;
                    $wf_result.html('').addClass('wf_loading').show();
                    break;
                case 'error':
                    $wf_result.removeClass('wf_loading').show().html('服务器返回数据格式错误！');
                    isFinish =  true;
                    break;
                case 'finish':
                    $wf_result.removeClass('wf_loading').show().html('已加载完毕，没有更多了！');
                    isFinish = true;
                    break;
            }
        }
    };

    // 默认配置
    $.fn.scrollload.defaults = {
        itemClass: 'wf_item',
        imgClass: 'thumb_img',
        colWidth: 235,			// 列宽(int)
        marginLeft: 15,			// 每列的左间宽(int)
        marginTop: 15,			// 每列的上间宽(int)
        perNum: 'auto',			// 每次下拉时显示多少个(默认是列数)
        isAnimation: true,		// 是否使用动画效果
        ajaxTimes: 'infinite',	// 限制异步请求的次数(int) 字符串'infinite'表示无限加载
        params: {},				// 键值对，发送到服务器的数据。将自动转换为请求字符串格式。
        // 如 {foo:["bar1", "bar2"]} 转换为 "&foo=bar1&foo=bar2"。
        url: '',				// 数据来源(ajax加载，返回json格式)，传入了ajaxFunc参数，此参数可省略(string)
        // 自定义异步函数, 第一个参数为成功回调函数，第二个参数为失败回调函数
        // 当执行成功回调函数时，传入返回的JSON数据作为参数
        ajaxFunc: null,		// (function)
        createHtml: null	// 自定义生成html字符串函数,参数为一个信息集合，返回一个html字符串(function)

    };

})(jQuery, window, document);