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
exports.write = function (req, res, next) {
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
    var msg = { status: 'success', info: '写入成功!' };
    res.send(msg);  //给客户端返回一个json格式的数据
    return true;
}

/**
 * 新增便签
 * @param req
 * @param res
 * @param next
 */
exports.add = function (req, res, next) {
    var title = req.body.title;
    var text = req.body.text;  //要防止攻击

    if (text) {
        res.contentType('json');
        res.send(JSON.stringify({ status: "failure", message: '参数获取失败!' }));
        res.end();
    }

    var memo = new Memo();
    memo.title = title;
    memo.context = text;
    memo.create_at = new Date();
//    memo.create_by = req.session.userid;
    memo.create_by = 1111;

    memo.save(function (err) {
        if (err) return next(err);
        console.log('---新增便签成功！--');
        var msg = {status: 'success', info: '新增便签成功!'};
        res.send(msg);
    });
}

/**
 * 更新便签
 * @param req
 * @param res
 * @param next
 */
exports.update = function (req, res, next) {
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
        memo.save(function () {
            if (err) return next(err);
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
exports.delete = function (req, res, next) {
    var tid = req.body.tid;

    if (tid) {
        res.contentType('json');  //返回的数据类型
        res.send(JSON.stringify({ status: "failure", message: '参数获取失败!' }));
        res.end();
    }

    Memo.findByIdAndRemove(tid, function (err, memo) {
        if (err) {
            return next(err);
        }
        if (!memo) {
            res.contentType('json');  //返回的数据类型
            var msg = { status: 'failure', info: '便签数据丢失或者不存在，请刷新之后重试!', data: '' };
            res.send(msg);  //给客户端返回一个json格式的数据
        }
    });
    var msg = { status: 'success', info: '删除成功!', data: '' };
    res.send(msg);
    console.log('---删除成功！--');
}

/**
 * 获取便签总数
 * @param req
 * @param res
 * @param next
 */
exports.count = function(req, res, next) {
    Memo.count(function (err, count) {
        if (err) {
            return next(err);
        }
        if (!count) {
            var msg = { status: 'success', info: '获取便签综述成功!', data: count };
            res.send(msg);  //给客户端返回一个json格式的数据
        }
    });
}

/**
 * 便签首页用瀑布流加载
 * @param req
 * @param res
 * @param next
 */
exports.waterfall = function(req, res, next) {
    console.log('------瀑布流加载-----');
    var page = req.body.page;
    var begindate = req.body.begindate;
    var enddate = req.body.enddate;

    // 分页,按时间排序
    var suminpage = 20;
    var count = Memo.count();
    var query = Memo.find({});
    if (begindate) {
        query.where({create_at: { $gte: begindate }});
    }
    if (enddate) {
        query.where({create_at: { $lte: enddate }});
    }
    query.limit(20);
    query.skip(20*page);

    query.exec(function (err, memos) {
        if (err) {
            return next(err);
        }
        if (!memos) {
//            var msg = { status: "success", message: '获取便签成功！', data: memos };
//            console.log(msg);
            console.log(memos);
            res.send(memos);  //给客户端返回一个json格式的数据
        }
    });
    return true;

//    Memo.find({create_at: {$gte: begindate, $lte: enddate}}, function (err, memos) {
//        if (err) {
//            return next(err);
//        }
//        if (!memos) {
//            var msg = { status: "success", message: '获取便签成功！', data: memos };
//            res.send(msg);  //给客户端返回一个json格式的数据
//        }
//    });
}

/**
 * 根据日期查询
 * @param req
 * @param res
 * @param next
 */
exports.findByDate = function(req, res, next) {  //应该考虑分页
    var begindate = req.body.begindate;
    var enddate = req.body.enddate;

    if (!begindate) {
        res.contentType('json');
        res.send(JSON.stringify({ status: "failure", message: '请选择开始日期!' }));
        res.end();
    }
    if (!enddate) {
        enddate = Date.now();
    }

    Memo.find({create_at: {$gte: begindate, $lte: enddate}}, function (err, memos) {
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