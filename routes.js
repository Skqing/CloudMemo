/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-6
 * Time: 下午8:41
 * Description: 路由
 */

var site = require('./controllers/site');
var sign = require('./controllers/sign');
var user = require('./controllers/user');
var memo = require('./controllers/memo');


module.exports = function (app) {
    app.get('/', site.index);

    app.get('/home', site.home);  //测试使用
    app.get('/form', site.form);  //测试使用
    app.get('/flatform', site.flatform);  //测试使用

    app.post('/login', sign.login);
    app.post('/signup', sign.signup);
    app.get('/signup/resetpwd', sign.resetpwd);
    app.post('/signup/resetpwd', sign.resetpwd);

    app.post('/memo/write', memo.write);
    app.post('/memo/add', memo.add);
    app.get('/memo/waterfall', memo.waterfall);

}