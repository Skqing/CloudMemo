/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午8:48
 * Description: 便签实体类
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MemoSchema = new Schema({
  title: { type: String, index: true },
  context: { type: String, unique: true },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  create_by: { type: ObjectId },
  update_by: { type: ObjectId }
});

//UserSchema.virtual('avatar_url').get(function () {
//  var avatar_url = this.profile_image_url || this.avatar;
//  if (!avatar_url) {
//    avatar_url = '/images/user_icon&48.png';
//  }
//  return avatar_url;
//});

mongoose.model('Memo', MemoSchema);