/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-6
 * Time: 下午8:41
 * Description: 路由
 */


var sign = require('./controllers/sign.js');
var user = require('./controllers/user.js');
var memo = require('./controllers/memo.js');
var site = require('./controllers/site');

module.exports = function(app) {
  app.get('/', site.index);
  app.get('/signup', sign.signup);
  app.post('/signup', sign.doSignup);
}