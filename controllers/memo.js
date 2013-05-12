/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午8:59
 * Description: 处理便签实体的业务
 */

var models = require('../models');
var Memo = models.Memo;

var check = require('validator').check,
  sanitize = require('validator').sanitize;

/**
 * 保留方法，做实时保存用
 * @param req
 * @param res
 * @param next
 */
exports.write = function(req, res, next) {
  var text = req.body.memotext;  //要防止攻击

//  if (text) {
//    res.contentType('json');
//    res.send(JSON.stringify({ status: "failure", message: '参数获取失败!' }));
//    res.end();
//  }

  var memo = new Memo();
  memo.context = text;
  memo.create_at = new Date();
  memo.create_by = req.session.user._id;

  console.log(text);
  res.contentType('json');  //返回的数据类型
  res.send(JSON.stringify({ status: "success" }));  //给客户端返回一个json格式的数据
  res.end();
}

/**
 * 新增便签
 * @param req
 * @param res
 * @param next
 */
exports.add = function(req, res, next) {
  var text = req.body.memotext;  //要防止攻击

  if (text) {
    res.contentType('json');
    res.send(JSON.stringify({ status: "failure", message: '参数获取失败!' }));
    res.end();
  }

  var memo = new Memo();
  memo.context = text;
  memo.create_at = new Date();
  memo.create_by = req.session.userid;

  console.log(text);
  res.contentType('json');  //返回的数据类型
  res.send(JSON.stringify({ status: "success", message: '新增成功！' }));  //给客户端返回一个json格式的数据
  res.end();
}

/**
 * 更新便签
 * @param req
 * @param res
 * @param next
 */
exports.update = function(req, res, next) {
  var tid = req.body.tid;
  var text = req.body.memotext;  //要防止攻击

  if (tid || text) {
    res.contentType('json');
    res.send(JSON.stringify({ status: "failure", message: '参数获取失败!' }));
    res.end();
  }

  Memo.findOne({ _id: tid }, function (err, memo) {
    if (err) {
      return next(err);
    }
    if (!memo) {
      res.contentType('json');  //返回的数据类型
      res.send(JSON.stringify({ status: "failure", message: '便签数据丢失或者不存在，请刷新之后重试！' }));  //给客户端返回一个json格式的数据
      res.end();
    }
    memo.context = text;
    memo.update_at = new Date();
    memo.update_by = req.session.userid;
    memo.save(function() {
      if(err) return next(err);
      res.contentType('json');  //返回的数据类型
      res.send(JSON.stringify({ status: "success", message: '修改成功！' }));  //给客户端返回一个json格式的数据
      res.end();
      console.log('---修改成功！--');
    });
  });
}

/**
 * 删除便签
 * @param req
 * @param res
 * @param next
 */
exports.delete = function(req, res, next) {
  var tid = req.body.tid;

  if (tid) {
    res.contentType('json');  //返回的数据类型
    res.send(JSON.stringify({ status: "failure", message: '参数获取失败!' }));
    res.end();
  }

  Memo.findByIdAndRemove(tid, function(err, memo) {
    if (err) {
      return next(err);
    }
    if (!memo) {
      res.contentType('json');  //返回的数据类型
      res.send(JSON.stringify({ status: "failure", message: '便签数据丢失或者不存在，请刷新之后重试！' }));  //给客户端返回一个json格式的数据
      res.end();
    }
  });

  res.contentType('json');  //返回的数据类型
  res.send(JSON.stringify({ status: "success", message: '删除成功！' }));  //给客户端返回一个json格式的数据
  res.end();
  console.log('---删除成功！--');
}

/**
 * 获取便签总数
 * @param req
 * @param res
 * @param next
 */
exports.count = function(req, res, next) {
  Memo.count(function(err, count) {
    if (err) {
      return next(err);
    }
    if (!count) {
      res.contentType('json');  //返回的数据类型
      res.send(JSON.stringify({ status: "success", message: '获取便签综述成功！', data: count }));  //给客户端返回一个json格式的数据
      res.end();
    }
  });
}

/**
 * 根据日期查询
 * @param req
 * @param res
 * @param next
 */
exports.findByDate = function(req, res, next) {  //应该考虑分页
  var begindate = req.bbody.begindate;
  var enddate = req.bbody.enddate;

  if (!begindate) {
    res.contentType('json');
    res.send(JSON.stringify({ status: "failure", message: '请选择开始日期!' }));
    res.end();
  }
  if (!enddate) {
    enddate = Date.now();
  }

  Memo.find({create_at: {$gte: begindate, $lte: enddate}}, function(err, memos) {
    if (err) {
      return next(err);
    }
    if (!memos) {
      res.contentType('json');  //返回的数据类型
      res.send(JSON.stringify({ status: "success", message: '获取便签综述成功！', data: memos }));  //给客户端返回一个json格式的数据
      res.end();
    }
  });
}

/**
 * 根据关键字搜索
 * @param req
 * @param res
 * @param next
 */
exports.searchByKeyword = function(req, res, next) {  //应该考虑分页

}