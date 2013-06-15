/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-6-15
 * Time: 下午1:17
 * Description: 自定义验证器
 */

function Verifier(reverse){
    this.isReverse = reverse || false;

};

Verifier.prototype.isEmail = function(email) {
    var rex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    if(rex.test(email)) {
        return true;
    } else {
        return false;
    }
}

