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
var security = require('../utils/security_utils');

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
    '/active_account', //active page
    '/reset_pass',     //reset password page, avoid to reset twice
    '/signup',         //regist page
    '/search_pass'    //serch pass page
];

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
    var email = sanitize(req.body.email).trim().toLowerCase();
    var pass = sanitize(req.body.password).trim();

    if (!email) {
        var msg = {status: 'failure', field: 'email,', info: '邮箱不能为空!', data: ''};
        res.send(msg);
    }
    if (!pass) {
        var msg = {status: 'failure', field: 'password,', info: '密码不能为空!', data: ''};
        res.send(msg);
    }

    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var msg = {status: 'failure', field: '', info: '这个用户不存在!', data: ''};
            res.send(msg);
        }
        pass = security.md5(pass);
        if (pass !== user.password) {
            var msg = {status: 'failure', field: 'password', info: '密码错误!', data: ''};
            res.send(msg);
        }
        // store session cookie
        gen_session(user, res);

        var msg = {status: 'success', field: '', info: '登录成功!', data: ''};
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

    var email = sanitize(req.body.email).trim();
    email = email.toLowerCase();
    email = sanitize(email).xss();
    var pass = sanitize(req.body.password).trim();
    pass = sanitize(pass).xss();
    var re_pass = sanitize(req.body.re_pwd).trim();
    re_pass = sanitize(re_pass).xss();

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
        var msg = {status: 'failure', field: 'password,', info: '密码不能为空!', data: ''};
        res.send(msg);
    }
    if (!re_pass) {
        var msg = {status: 'failure', field: 're_pwd,', info: '确认密码不能为空!', data: ''};
        res.send(msg);
    }
    if (pass !== re_pass) {
        var msg = {status: 'failure', field: 're_pwd,', info: '两次密码输入不一致!', data: ''};
        res.send(msg);
    }

    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            var msg = {status: 'failure', field: 'email,', info: '此邮箱已被使用，请换一个重试!', data: ''};
            res.send(msg);
        }

        // md5 the pass
        pass = security.md5(pass);
        // create gavatar
        var avatar_url = 'http://www.gravatar.com/avatar/' + security.md5(email.toLowerCase()) + '?size=48';

        var user = new User();
        var name = email.split('@')[0];
        user.username = name;
        user.password = pass;
        user.email = email;
        user.avatar = avatar_url;
        user.save(function (err) {
            if (err) return next(err);
            console.log('---注册成功！--');
            var msg = {status: 'success', field: ',', info: '注册成功!', data: ''};
            res.send(msg);
        });
    });
};


// private
function gen_session(user, res) {
    var auth_token = security.encrypt(user._id + '\t' + user.username + '\t' + user.password + '\t' + user.email, config.cookie_secret);
    res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
}