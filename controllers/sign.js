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

//sign up
exports.signup = function (req, res) {
  res.render('sign/signup');
};

exports.doSignup = function (req, res, next) {
  var name = sanitize(req.body.username).trim();
  name = sanitize(name).xss();
  var loginname = name.toLowerCase();
  var pass = sanitize(req.body.password).trim();
  pass = sanitize(pass).xss();
  var email = sanitize(req.body.useremail).trim();
  email = email.toLowerCase();
  email = sanitize(email).xss();
  var re_pass = sanitize(req.body.re_pwd).trim();
  re_pass = sanitize(re_pass).xss();

  if (name === '' || pass === '' || re_pass === '' || email === '') {
    res.render('sign/signup', {error: '信息不完整。', name: name, email: email});
    return ;
  }

  if (name.length < 5) {
    res.render('sign/signup', {error: '用户名至少需要5个字符。', name: name, email: email});
    return ;
  }

  try {
    check(name, '用户名只能使用0-9，a-z，A-Z。').isAlphanumeric();
  } catch (e) {
    res.render('sign/signup', {error: e.message, name: name, email: email});
    return ;
  }

  if (pass !== re_pass) {
    res.render('sign/signup', {error: '两次密码输入不一致。', name: name, email: email});
    return ;
  }

  try {
    check(email, '不正确的电子邮箱。').isEmail();
  } catch (e) {
    res.render('sign/signup', {error: e.message, name: name, email: email});
    return ;
  }

  User.find({'$or': [{'loginname': loginname}, {'email': email}]}, {}, function (err, users) {
    if (err) {
      return next(err);
    }
    if (users.length > 0) {
      res.render('sign/signup', {error: '用户名或邮箱已被使用。', name: name, email: email});
      return ;
    }

    // md5 the pass
    pass = security.md5(pass);
    // create gavatar
    var avatar_url = 'http://www.gravatar.com/avatar/' + security.md5(email.toLowerCase()) + '?size=48';

    var user = new User();
    user.username = name;
    user.password = pass;
    user.email = email;
    user.avatar = avatar_url;
    user.active = true;  //产品模式为false
    user.save(function(err){
      if(err) return next(err);
      console.log('---注册成功！--');
      res.render('home');
    });
  });
};


// private
function gen_session(user, res) {
  var auth_token = security.encrypt(user._id + '\t' + user.name + '\t' + user.pass + '\t' + user.email, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
}