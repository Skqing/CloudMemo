/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-9
 * Time: 下午8:07
 * Description: for home page
 */

//标签的textarea域失去焦点则保存此便签

$(function(){
  //监听键盘事件,支持快捷键操作.
  $(document).keypress(function(e)
  {
    if(e.ctrlKey && (e.which == 13 || e.which == 10)) {
      // 1.发送数据,并保存
      var memotext = $("#memotext").val();
      $.post('/memo/write', { memotext : memotext }, function(data){
        alert("Data Loaded: " + data.status);
      });
      // 2. 清空cookies
      $.cookie('memotext', null);

      // 3.新建标签

    }
  });

  //失去焦点
  $("#context").focusout(function(){
    var memotext = $("#memotext").val();
    console.log(memotext);
    $.cookie('memotext', memotext, { expires: 30 });
  });

  //归档
  $("#filling").click(function(){
    var memotext = $("#memotext").val();
    $.post('/memo/write', { memotext : memotext }, function(data){
      alert("Data Loaded: " + data.status);
    });
  });
  $("#clear").click(function(){
    // 1.清空textarea的值
    $("#memotext").val('');
    // 2. 清空cookies
    $.cookie('memotext', null);
  });

});



