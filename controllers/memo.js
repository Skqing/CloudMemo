/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午8:59
 * Description: 处理便签实体的业务
 */

var check = require('validator').check,
  sanitize = require('validator').sanitize;

exports.write = function(req, res, next) {
  var text = req.body.memotext;  //要防止攻击
  console.log(text);
  res.contentType('json');  //返回的数据类型
  res.send(JSON.stringify({ status: "success" }));  //给客户端返回一个json格式的数据
  res.end();
}