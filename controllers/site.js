/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-7
 * Time: 下午9:45
 * Description: site index controller
 */

exports.index = function(req, res, next) {

  res.render('index');
}
exports.about = function(req, res, next) {
    res.render('about');
}



exports.home = function(req, res, next) {

  res.render('home');
}

exports.form = function(req, res, next) {

    res.render('form');
}

exports.flatform = function(req, res, next) {

    res.render('flatform');
}