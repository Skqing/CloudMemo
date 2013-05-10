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


module.exports = function(app) {
  app.get('/', site.index);

  app.get('/home', site.home);  //测试使用

  app.get('/login', sign.login);
  app.post('/login', sign.doLogin);

  app.get('/signup', sign.signup);
  app.post('/signup', sign.doSignup);

  app.post('/memo/write', memo.write);

}