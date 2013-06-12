/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午9:01
 * Description: 处理用户注册、登录、密码找回等业务
 */
var models = require('../models');
var User = models.User;

var check = require('validator').check,
    sanitize = require('validator').sanitize;

var config = require('../config');
var Security = require('../utils/security_utils');


//login
//exports.login = function (req, res) {
//    req.session._loginReferer = req.headers.referer; //来自nodeclub不知道什么意思?
//    res.render('index');
//}

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
    console.log('------用户登录-----');
    var email = req.body.email;
    var pass = req.body.password;

    if (!email) {
        var msg = {status: 'failure', field: 'email,', info: '邮箱不能为空!'};
        res.send(msg);
    }
    if (!pass) {
        var msg = {status: 'failure', field: 'password', info: '密码不能为空!'};
        res.send(msg);
    }
    email = sanitize(email).trim().toLowerCase();
    pass = sanitize(pass).trim();

    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var msg = {status: 'failure', info: '这个用户不存在!'};
            res.send(msg);
        }
        pass = Security.md5(pass);
        if (pass !== user.password) {
            var msg = {status: 'failure', field: 'password', info: '密码错误!'};
            res.send(msg);
        }
        // store session cookie
        gen_session(user, res);

        var msg = {status: 'success', info: '登录成功!'};
        res.send(msg);
    });
}

//sign up
//exports.signup = function(req, res) {
//  res.render('sign/signup');
//};

/**
 * Handle user signup.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.signup = function (req, res, next) {
//  var name = sanitize(req.body.username).trim();
//  name = sanitize(name).xss();
//  var username = name.toLowerCase();
    console.log('------用户注册-----');
    var email = req.body.email;
    var pass = req.body.password;
    var re_pass = req.body.re_pwd;

    if (!email) {
        var msg = {status: 'failure', field: 'email,', info: '邮箱不能为空!', data: ''};
        res.send(msg);
    }
    try {
        check(email, '邮箱格式不正确!').isEmail();
    } catch (e) {
        var msg = {status: 'failure', field: 'email,', info: e.message, data: ''};
        res.send(msg);
    }
    if (!pass) {
        var msg = {status: 'failure', field: 'password', info: '密码不能为空!', data: ''};
        res.send(msg);
    }
    if (!re_pass) {
        var msg = {status: 'failure', field: 're_pwd', info: '确认密码不能为空!', data: ''};
        res.send(msg);
    }
    if (pass !== re_pass) {
        var msg = {status: 'failure', field: 're_pwd', info: '两次密码输入不一致!', data: ''};
        res.send(msg);
    }

    email = sanitize(email).trim().toLowerCase();
    email = sanitize(email).xss();

    pass = sanitize(pass).trim();
    pass = sanitize(pass).xss();

    re_pass = sanitize(re_pass).trim();
    re_pass = sanitize(re_pass).xss();

    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            var msg = {status: 'failure', field: 'email', info: '此邮箱已被使用，请换一个重试!'};
            res.send(msg);
        }

        // md5 the pass
        pass = Security.md5(pass);
        // create gavatar
        var avatar_url = 'http://www.gravatar.com/avatar/' + Security.md5(email.toLowerCase()) + '?size=48';

        var user = new User();
        var name = email.split('@')[0];
        user.username = name;
        user.password = pass;
        user.email = email;
        user.avatar = avatar_url;
        user.save(function (err) {
            if (err) return next(err);
            console.log('---注册成功！--');
            var msg = {status: 'success', info: '注册成功!'};
            res.send(msg);
        });
    });
};

exports.logout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.redirect(req.headers.referer || 'index');
}
/**
 * 重设密码
 * @param req
 * @param res
 * @param next
 */
exports.resetpwd = function (req, res, next) {
    var method = req.method;
    if (method == 'get') {
        res.render('sign/resetpwd');
    } else if (method == 'post') {

    } else {
        var msg = {status: 'failure', info: '访问错误!'};
        res.send(msg);
    }
}

// private
function gen_session(user, res) {
    var auth_token = Security.encrypt(user._id + '\t' + user.username + '\t' + user.password + '\t' + user.email, config.session_secret);
    res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
}