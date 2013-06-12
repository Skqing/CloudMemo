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
    var method = req.method;
    if (method.toLowerCase() == 'post') {
        var title = req.body.title;
        var text = req.body.text;  //要防止攻击

        if (!title || !text ) {
            var msg = { status: "failure", info: '参数获取失败!' };
            res.send(msg);
        }
        title = sanitize(title).xss();
        text = sanitize(text).xss();

        var memo = new Memo();
        memo.title = title;
        memo.context = text;
        memo.create_at = new Date();
//    memo.create_by = req.session.userid;
        memo.create_by = 1111;

        memo.save(function (err) {
            if (err) return next(err);
            Memo.findOne(memo, function(err, memo) {
                if (err) return next(err);

                var msg = { status: 'success', info: '新增便签成功!', data: memo };
                console.log(msg);
                res.send(msg);
            });
        });
    } else {
        var msg = { status: 'failure', info: '非法请求!' };
        res.send(msg);
    }

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
    var tid = req.query.tid;
    console.log('---删除文档, ID: %s --', tid);

    if (!tid) {
        var msg = { status: "failure", message: '参数获取失败!' };
        res.send(msg);
    }

    Memo.findByIdAndRemove(tid, function (err, memo) {
        if (err) {
            return next(err);
        }
        if (!memo) {
            res.contentType('json');  //返回的数据类型
            var msg = { status: 'failure', info: '便签数据丢失或者不存在，请刷新之后重试!' };
            res.send(msg);  //给客户端返回一个json格式的数据
        }
    });
    var msg = { status: 'success', info: '删除成功!' };
    console.log('---删除成功!--');
    res.send(msg);
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

exports.loadAll = function(req, res, next) {
    console.log('------加载所有数据-----');
    var query = Memo.find({});
    query.sort('-create_at');
    query.exec(function (err, memos) {
        if (err) {
            return next(err);
        }
        if (memos) {
            var msg = { status: "success", message: '获取便签成功！', data: memos };
            console.log(msg);
            res.send(msg);  //给客户端返回一个json数组的数据
        } else {
            console.log('木有数据啦！');
            var msg = { status: "success", message: '木有数据啦!' };
            res.send(msg);
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
    var page = req.query.page;
    var begindate = req.query.begindate;
    var enddate = req.query.enddate;
    console.log('page no: %d:', page);

//    for (var i=0; i<100; i++) {
//        var memo = new Memo();
//        memo.title = '测试'+(i++);
//        memo.context = (i++)+'测试数据----URL：putty 也就是刚才导出来得私钥。';
//        memo.create_at = new Date();
//        memo.create_by = 1111;
//
//        memo.save(function (err) {
//            if (err) return next(err);
//            console.log(memo.title);
//        });
//    }



    // 分页,按时间排序
    var suminpage = 10;
    Memo.count({}, function(err, count) {
        if (err) {
            return next(err);
        }
        console.log('查询到 %d 条数据!', count);

        page = page ? page : page < 1 ? 1 : page;

        if (count < suminpage*page) {
            console.log('木有数据啦！');
            return true;
        } else {
            var query = Memo.find({});
            if (begindate) {
                console.log('begindate:'+begindate);
                query.where({create_at: { $gte: begindate }});
            }
            if (enddate) {
                console.log('enddate:'+enddate);
                query.where({create_at: { $lte: enddate }});
            }
            query.limit(suminpage);
            query.skip(suminpage*page);

            query.sort('-create_at');

            query.exec(function (err, memos) {
                if (err) {
                    return next(err);
                }
                if (memos) {
                    var msg = { status: "success", message: '获取便签成功！', data: memos };
                    res.send(msg);  //给客户端返回一个json数组的数据
                } else {
                    console.log('木有数据啦！');
                    var msg = { status: "success", message: '木有数据啦!' };
                    res.send(msg);
                }
            });
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