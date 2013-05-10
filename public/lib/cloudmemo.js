/**
 * Author: DolphinBoy
 * Email: dolphinboyo@gmail.com
 * Date: 13-5-8
 * Time: 下午6:30
 * Description: Kiss组件-标签
 */

function CloudMemo(container, config) {
  var self = this;

  if (!(self instanceof CloudMemo)) {
    return new CloudMemo(container, config);
  }

  /**
   * 容器元素
   * @type {Element}
   */
  self.container = container = S.one(container);
  if (!container) return;

  CloudMemo.superclass.constructor.call(self, config);

  self._init();

}

S.extend(CloudMemo, S.Base);

CloudMemo.ATTRS = {

}


S.augment(CloudMemo, {
/**
   * 初始化 label 状态及绑定 focus/blur 事件
   * @private
   */
  _init: function() {
    var self = this,
      blurStyle = self.get(BLUR_STYLE),
      position = self.get(POSITION);

    self.container.all('label').each(function(elem) {
      var lab = new S.Node(elem),
          area = S.one('#' + lab.attr('for')), prt, len;

      // 注意: 只取那些有 for 属性的 label
      if (!area) return;

      // label 的父元素设置为 relative
      prt = lab.parent();
      if (prt.css(POSITION) !== RELATIVE) {
          prt.css({ position: RELATIVE });
      }

      lab.css({
          position : ABSOLUTE,
          // 默认把 label 移入输入框
          left : position[0] + PX,
          top : position[1] + PX,
          zIndex : self.get('zIndex')
      });
      blurStyle && lab.css(blurStyle);

      // 输入框有值时, 把 label 移出输入框
      len = S.trim(area.val()).length;
      if ( len > 0) {
          self._css(lab);// or self._anim(lab);
      }

      // 绑定事件
      self._bindUI(area, lab);
    });
  },

  /**
   * 绑定 focusin/focusout 事件
   * @param {Node} area
   * @param {Node} lab
   * @private
   */
  _bindUI: function(area, lab) {
    var self = this;

    area.on('focusin', function() {
      var len = S.trim(area.val()).length;

      if (!len) {
          self._anim(lab);
      }
    }).on('focusout', function() {
      var len = S.trim(area.val()).length;

      if (!len) {
          self._anim(lab, true);
      }
    });
  },

  /**
   * @param {Node} lab
   * @parem {boolean} isDefault
   * @private
   */
  _anim: function(lab, isDefault) {
      this._change('animate', lab, isDefault);
  },

  /**
   * @param {Node} lab
   * @parem {boolean} isDefault
   * @private
   */
  _css: function(lab, isDefault) {
      this._change('css', lab, isDefault);
  },

  /**
   * 输入区域是否有值, 对应改变 label 所在位置
   * @param {string} fn 'css' or 'animate'
   * @param {Node} lab
   * @param {boolean} isDefault 为 true 时, 表示没有值, 移入, 为 false, 表示有值, 移开
   * @private
   */
  _change: function(fn, lab, isDefault) {
    var self = this,
        //axis = self.get('axis'),
        position = self.get(POSITION),
        blurStyle = self.get(BLUR_STYLE),
        focusStyle = self.get(FOCUS_STYLE),
        duration = self.get('duration'),
        offset = self.get('offset');
    //if (axis == X) {
        lab[fn](S.merge({
            left: (isDefault ? position[0] : -lab.width() - offset) + PX
        }, isDefault ? blurStyle : focusStyle), duration);
    /*}
    else if (axis == Y) {
        lab[fn](S.merge({
            top: (isDefault ? position[1] : -lab.height() - offset) + PX
        }, isDefault ? blurStyle : focusStyle), duration);
    }*/
  }
})