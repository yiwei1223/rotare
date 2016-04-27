/**!
 * mi.rotare.js 2.0.0 (c) 2015 Yi wei - MIT license
 * @desc 抽奖转盘插件
 */
;(function ($, w) {
    // 全局参数
    var _loop = -1,
        _keys = null,
        _callback = null,
        _count = 0;

    /**
     * @desc the obj rotare expose to user
     */
    var rotare = {
        VERSION: '2.0.0',
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
            if (checkConf(conf)) {
                console.error('参数初始化错误！');
            } else {
                _loop++;
                _keys = Object.keys(conf.categoryOrigin).sort().reverse();
                _callback = callback.bind(this);
                var that = this;
                initConf && initConf($.extend(conf, {_flag: _keys.length}));
            }
        }
    };

    /**
     * @desc 检查参数
     * @param conf
     */
    function checkConf(conf) {
        return !conf || !conf.categoryOrigin || Object.keys(conf.categoryOrigin).length == 0 || !conf.animateTo || !Array.isArray(conf.animateTo);
    }

    /**
     * @desc 初始化转盘
     * @param conf
     */
    function initConf(conf) {
        var origin = conf.categoryOrigin[_keys[0]],
            symbol = _keys[0] == 'pointer' ? '-' : '+';
        var _css = {
                time: conf.time + 'ms',
                easing: origin.easing,
                direction:  origin.direction == 'right' ? '' : '-'
            },
            css = {
                'transition': 'all ' + _css.time + ' ' + _css.easing,
                '-webkit-transition': 'all ' + _css.time + ' ' + _css.easing
            };
        if (conf._flag ==1) { // 指针或者转盘转动
            if (symbol == '-') {
                _css.animateTo = parseInt(symbol + random(conf.animateTo, origin.direction,  conf.random)) + (origin.loops+_loop*5) * 360;
            } else {
                _css.animateTo =random(conf.animateTo, origin.direction,  conf.random) + (origin.loops+_loop*5) * 360;
            }
            css['transform'] = 'rotate(' + _css.direction + _css.animateTo + 'deg)';
            css['-webkit-transform'] = 'rotate(' + _css.direction + _css.animateTo + 'deg)';
            goRotare && goRotare([{
                selector: origin.selector,
                reset: conf.reset || false,
                css: css
            }]);
        } else { //指针和转盘同时转动
            _css.animateTo = (origin.loops+_loop*5) * 360;
            css['transform'] = 'rotate(' + _css.direction + _css.animateTo + 'deg)';
            css['-webkit-transform'] = 'rotate(' + _css.direction + _css.animateTo + 'deg)';
            var origin_two = conf.categoryOrigin[_keys[1]];
            var _css_two = {
                    time: conf.time + 'ms',
                    easing: origin_two.easing,
                    direction:  origin_two.direction == 'right' ? '' : '-',
                    animateTo: random(conf.animateTo, origin_two.direction,  conf.random) + (origin_two.loops+_loop*5) * 360
                },
                css_two = {
                    'transform': 'rotate(' + _css_two.direction + _css_two.animateTo + 'deg)',
                    '-webkit-transform': 'rotate(' + _css_two.direction + _css_two.animateTo + 'deg)',
                    'transition': 'all ' + _css_two.time + ' ' + _css_two.easing,
                    '-webkit-transition': 'all ' + _css_two.time + ' ' + _css_two.easing
                };
            goRotare && goRotare([{
                selector: origin.selector,
                reset: conf.reset || false,
                css: css
            }, {
                selector: origin_two.selector,
                reset: conf.reset || false,
                css: css_two
            }]);
        }
    }

    /**
     * @desc 最终执行动画函数
     * @param arr []
     */
    function goRotare(arr) {
        arr.forEach(function (item, index) {
            $(item.selector).css(item.css).on('webkitTransitionEnd', function (ev) {
                $(item.selector).off('webkitTransitionEnd');
                if (_keys.length == index + 1) {
                    _callback && _callback();
                }
                if (item.reset) {
                    _loop = -1;
                    $(item.selector).attr('style', '');
                }
            });
        });
    }

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
        _source.sort(function (item1, item2) {
            return item1 - item2;
        });
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