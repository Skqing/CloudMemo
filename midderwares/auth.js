/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午8:59
 * Description: 用户登录安全验证中间件
 */
var Security = require('../utils/security_utils');
var config = require('../config');
var models = require('../models');
var User = models.User;

/**
 * 处理用户登录的任务的中间件
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.auth_user = function (req, res, next) {
    if (req.session.user) {
//        Message.getMessagesCount(req.session.user._id, function (err, count) {
//            if (err) {
//                return next(err);
//            }
//            req.session.user.messages_count = count;
//            if (!req.session.user.avatar_url) {
//                req.session.user.avatar_url = getAvatarURL(req.session.user);
//            }
//            res.local('session_user', req.session.user);
            return next();
//        });
    } else {
        var cookie = req.cookies[config.auth_cookie_name];
        if (!cookie) {
            return next();
        }

        var auth_token = Security.decrypt(cookie, config.session_secret);
        var auth = auth_token.split('\t');
        var user_id = auth[0];
        User.findById(user_id, function (err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
//                Message.getMessagesCount(user._id, function (err, count) {
//                    if (err) {
//                        return next(err);
//                    }
//                    user.messages_count = count;
                    req.session.user = user;
//                    req.session.user.avatar_url = user.avatar_url;
//                    res.local('session_user', req.session.user);
                    return next();
//                });
//            } else {
//                return next();
            }
        });
    }
};


/**
 * 需要登录, 返回JSON
 */
exports.userRequiredJson = function (req, res, next) {
    if (!req.session || !req.session.user) {
        var msg = {status: 'failure', action: 'login', url:'/', info: '用户未登录，请先登录!'};
        console.log(msg);
        res.send(msg);
    } else {
        next();
    }
//    next();
};

/**
 * 需要登录，响应错误页面
 */
exports.userRequiredRedirect = function (req, res, next) {
    if (!req.session || !req.session.user) {
        console.log('用户未登录，请先登录!');
        res.render('index', {message: '用户未登录，请先登录!'});
        return;
    }
    next();
};
