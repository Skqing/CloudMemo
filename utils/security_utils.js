/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午10:28
 * Description: 安全方面的工具，例如MD5
 */
var crypto = require('crypto');
var xss = require('xss');

module.exports.encrypt = function(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

module.exports.decrypt = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

module.exports.md5 = function(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

module.exports.randomString = function (size) {
  size = size || 6;
  var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var max_num = code_string.length + 1;
  var new_pass = '';
  while (size > 0) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
    size--;
  }
  return new_pass;
}

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function (html) {
    var codeSpan = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm;
    var codeBlock = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
    var spans = [];
    var blocks = [];
    var text = String(html).replace(/\r\n/g, '\n')
        .replace('/\r/g', '\n');

    text = '\n\n' + text + '\n\n';

    text = text.replace(codeSpan, function (code) {
        spans.push(code);
        return '`span`';
    });

    text += '~0';

    return text.replace(codeBlock, function (whole, code, nextChar) {
        blocks.push(code);
        return '\n\tblock' + nextChar;
    })
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/`span`/g, function () {
            return spans.shift();
        })
        .replace(/\n\tblock/g, function () {
            return blocks.shift();
        })
        .replace(/~0$/, '')
        .replace(/^\n\n/, '')
        .replace(/\n\n$/, '');
};

/**
 * 过滤XSS攻击代码
 *
 * @param {string} html
 * @return {string}
 */
exports.xss = function (html) {
    return xss(html);
};