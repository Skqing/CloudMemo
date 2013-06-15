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

var Config = require('../config');
var Security = require('../utils/security_utils');
var Mail = require('../service/mail');


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
        return ;
    }
    if (!pass) {
        var msg = {status: 'failure', field: 'password', info: '密码不能为空!'};
        res.send(msg);
        return ;
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
            return ;
        }
        pass = Security.md5(pass);
        if (pass !== user.password) {
            var msg = {status: 'failure', field: 'password', info: '密码错误!'};
            res.send(msg);
            return ;
        }
        // store session cookie
        gen_session(user, res);

        var msg = {status: 'success', info: '登录成功!'};
        res.send(msg);
        return ;
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
        var msg = {status: 'failure', field: 'email,', info: '邮箱不能为空!'};
        res.send(msg);
        return ;
    }
    try {
        check(email, '邮箱格式不正确!').isEmail();
    } catch (e) {
        var msg = {status: 'failure', field: 'email,', info: e.message};
        res.send(msg);
        return ;
    }
    if (!pass) {
        var msg = {status: 'failure', field: 'password', info: '密码不能为空!'};
        res.send(msg);
        return ;
    }
    if (!re_pass) {
        var msg = {status: 'failure', field: 're_pwd', info: '确认密码不能为空!'};
        res.send(msg);
        return ;
    }
    if (pass !== re_pass) {
        var msg = {status: 'failure', field: 're_pwd', info: '两次密码输入不一致!'};
        res.send(msg);
        return ;
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
            return ;
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
            return ;
        });
    });
};

/**
 * 用户登出
 * @param req
 * @param res
 * @param next
 */
exports.logout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(Config.auth_cookie_name, { path: '/' });
    res.redirect(req.headers.referer || 'index');
}

/**
 * 显示找回密码界面
 * @param req
 * @param res
 * @param next
 */
exports.showFindPass = function (req, res, next) {
    res.render('sign/send_mail');
    return ;
}
/**
 * 找回密码
 * @param req
 * @param res
 * @param next
 */
exports.findPass = function (req, res, next) {
    var email = req.query.email;

    if (!email) {
        var msg = { status: 'failure', field: 'email,', info: '邮箱不能为空!' };
        res.send(msg);
        return ;
    }

    email = sanitize(email).trim().toLowerCase();
    email = sanitize(email).xss();

    try {
        check(email, '邮箱格式不正确!').isEmail();
    } catch (e) {
        var msg = { status: 'failure', field: 'email,', info: '邮箱格式不正确', error: e.message };
        res.send(msg);
        return ;
    }

    // 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
    var retrieveKey = Security.randomString(15);
    var retrieveTime = new Date().getTime();
    User.findOne({'email': email}, function (err, user) {
        if (!user) {
            var msg = { status: 'failure', field: 'email,', info: '没有这个电子邮箱!' };
            res.send(msg);
            return;
        }

        user.retrieve_key = retrieveKey;
        user.retrieve_time = retrieveTime;
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            // 发送重置密码邮件
            try {
                Mail.sendResetPassMail(email, retrieveKey, user.username);
            } catch (e) {
                var msg = { status: 'failure', info: '发送邮件失败!', error: e.message };
                res.send(msg);
                return ;
            }

            var par = email.split('@')[1];
            var site = Config.email_site[par];
            var msg = { status: 'success', site: site, info: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。' };
            res.send(msg);
            return;
//            res.render('notify/send_mail_ok', msg);
        });
    });
};

/**
 * reset password
 * 'get' to show the page, 'post' to reset password
 * after reset password, retrieve_key&time will be destroy
 * @param  {http.req}   req
 * @param  {http.res}   res
 * @param  {Function} next
 */
exports.reset_pass = function (req, res, next) {
    var key = req.query.key;
    var name = req.query.name;
    User.getUserByQuery(name, key, function (err, user) {
        if (!user) {
            return res.render('notify/notify', {error: '信息有误，密码无法重置。'});
        }
        var now = new Date().getTime();
        var oneDay = 1000 * 60 * 60 * 24;
        if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
            return res.render('notify/notify', {error : '该链接已过期，请重新申请。'});
        }
        return res.render('sign/reset', {name : name, key : key});
    });
};

exports.update_pass = function (req, res, next) {
    var psw = req.body.psw || '';
    var repsw = req.body.repsw || '';
    var key = req.body.key || '';
    var name = req.body.name || '';
    if (psw !== repsw) {
        return res.render('sign/reset', {name : name, key : key, error : '两次密码输入不一致。'});
    }
    User.getUserByQuery(name, key, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('notify/notify', {error : '错误的激活链接'});
        }
        user.pass = md5(psw);
        user.retrieve_key = null;
        user.retrieve_time = null;
        user.active = true; // 用户激活
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.render('notify/notify', {success: '你的密码已重置。'});
        });
    });
};

// private
function gen_session(user, res) {
    var auth_token = Security.encrypt(user._id + '\t' + user.username + '\t' + user.password + '\t' + user.email, Config.session_secret);
    res.cookie(Config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
}