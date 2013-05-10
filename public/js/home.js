/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-9
 * Time: 下午8:07
 * Description: for home page
 */

//标签的textarea域失去焦点则保存此便签

$(function(){
  $("#memo").focusout(function(){
    var memotext = $("#memotext").val();
    console.log(memotext);
    $.cookie('memotext', memotext, { expires: 30 });
//    $.post('/memo/write', { memotext : memotext }, function(data){
//      alert("Data Loaded: " + data.status);
//    });
  });
});