/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午8:56
 * Description: 所有实体类的入口文件
 */

var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.url, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.url, err.message);
    process.exit(1); //连接失败则终止程序，这里应该是链接失败的时候给予提示而不是终止程序
  }
});

// models
require('./user');
require('./memo');

exports.User = mongoose.model('User');
exports.Memo = mongoose.model('Memo');
