/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-6
 * Time: 下午9:30
 * Description: 用户实体
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, index: true, unique: true },
  password: { type: String },
  email: { type: String, unique: true },
  profile_image_url: {type: String},
  location: { type: String },
  profile: { type: String },
  weibo: { type: String },
  avatar: { type: String },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

UserSchema.virtual('avatar_url').get(function () {
  var avatar_url = this.profile_image_url || this.avatar;
  if (!avatar_url) {
    avatar_url = '/images/user_icon&48.png';
  }
  return avatar_url;
});

mongoose.model('User', UserSchema);

