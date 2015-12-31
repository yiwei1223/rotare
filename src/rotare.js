/**!
 * mi.rotare.js 1.0.0 (c) 2015 Yi wei - MIT license
 * @desc 抽奖转盘插件
 */
;(function ($, w) {
    /**
     * @desc the obj rotare expose to user
     */
    var rotare = {
        $conf: null,
        beforeConf: {
            direction: 'right',
            easing: 'linear',
            time: 450
        },
        loop: -1,
        $prev: {
            animateTo: 0
        },
        /**
         * @desc  执行转轮
         * @param conf 配置
         *        {
         *          time: 3000, // 执行时间3000ms，如果没有设定此值，除非执行stop(), 否则将一直执行下去
         *          direction: 'right || left' // 转动方向顺时针或逆时针, 默认为'clockwise'
         *          categoryOrigin: '.disk-img', // 策略源(即要转动的对象，传入一个对应的selector即可),
         *          angle: 0, // 起始角度,默认为0,
         *          random: [5, 6], //指针停止区域, 主要是为了指针正好停止在边界， 默认为[0, 0]
         *          animateTo: [[0, 30]] 结束的角度范围,
         *          easing: 'linear', // 运动方式，与css3 transition一致,
         *          loops: 3 // 完整的圈数 默认为0,
         *          reset: true || false //是否重置，即转完后回到初始位置，默认为false
         *        }
         * @param callback 回调
         */
        start: function (conf, callback) {
            var that = this;
            that.loop++;
            that.$conf = initConf(conf, that.loop, that.beforeConf, that.$prev);
            $(that.$conf.conf.categoryOrigin).css(that.$conf.css);
            $(that.$conf.conf.categoryOrigin).on('webkitTransitionEnd', function () {
                callback && callback();
                if (that.$conf.conf.reset) {
                    reset && reset(that.$conf.conf);
                    return;
                }
                stop && stop(that.$conf);
                that.deg && that.deg(that.$conf);
            });
        },

        /**
         * @desc 真正计算出所转角度前的转动，适用于在$.ajax中的beforeSend回调中使用
         * @param conf 与start方法参数一致
         */
        beforeGo: function (conf)  {
            var that = this;
            $.extend(that.beforeConf, conf);
            $(conf.categoryOrigin).css({
                'animation': 'rotare_' + that.beforeConf.direction + ' ' + that.beforeConf.time + 'ms ' + that.beforeConf.easing + ' infinite',
                '-webkit-animation': 'rotare_' + that.beforeConf.direction + ' ' + that.beforeConf.time + 'ms ' + that.beforeConf.easing + ' infinite'
            });
        },

        /**
         * @desc 获取当前所转角度
         */
        deg: function (conf) {
            var that = this;
            that.$prev.animateTo = conf._css.direction == '-' ? - conf._css.animateTo : conf._css.animateTo;
            that.$prev.direction = conf.conf.direction;
        }
    };

    /**
     * @desc 内部函数，执行参数初始化
     * @param conf
     * @param loop
     * @param beforeConf
     * @param prev
     * @returns {{}}
     */
    var initConf  = function (conf, loop, beforeConf, prev) {
        var _conf = {
            direction: 'right',
            angle: 0,
            easing: 'linear',
            random: [0, 0],
            reset: false
        };
        $.extend(_conf, conf);
        var _css = {
            time: beforeConf.time * (_conf.loops) + 'ms',
            easing: _conf.easing,
            direction:  _conf.direction == 'right' ? '' : '-',
            animateTo: random(_conf.animateTo, _conf.direction,  _conf.random) + (_conf.loops+loop*5) * 360
        };
        return {
            conf: _conf,
            css: {
                'transform': 'rotate(' + _css.direction + _css.animateTo + 'deg)',
                '-webkit-transform': 'rotate(' + _css.direction + _css.animateTo + 'deg)',
                'transition': 'all ' + _css.time + ' ' + _css.easing,
                '-webkit-transition': 'all ' + _css.time + ' ' + _css.easing
            },
            _css: _css
        };
    };

    /**
     * @desc 重置
     * @param conf
     */
    var reset = function (conf) {
        $(conf.categoryOrigin).off('webkitTransitionEnd');
        $(conf.categoryOrigin).attr('style', '');
    };

    /**
     *
     * @param conf
     */
    var stop = function (conf) {
        $(conf.conf.categoryOrigin).off('webkitTransitionEnd');
    };

    /**
     * @desc 生成某个范围内的随机数
     * @param source
     * @param direction
     * @param _random
     */
    var random = function (source, direction, _random) {
        var _source = [];
        if (source.length > 1) {
            var index = Math.floor(Math.random()*source.length);
            if (direction == 'right') {
                _source = source[index].map(function (item) {
                    return 360 - item;
                });
            } else {
                _source = source[index].concat([]);
            }
        } else if (source.length == 1) {
            if (direction == 'right') {
                _source = source[0].map(function (item) {
                    return 360 - item;
                });
            } else {
                _source = source[0].concat([]);
            }
        }
        _source.sort();
        return Math.floor((_source[0]+_random[0])+Math.random()*((_source[1]-_random[1])-(_source[0]+_random[0])));
    };


    if (typeof define == 'function' && define.amd) {
        // AMD define
        define([], function () {
            return rotare;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        // Node CommonJS
        module.exports = rotare;
    } else {
        // browser global
        w.rotare = rotare;
    }
})(window.Zepto || window.$, window);