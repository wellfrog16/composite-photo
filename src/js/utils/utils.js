define(['jquery'], ($) => {
    //
    var self = {};

    self.jqueryPlugins = function() {
        $.fn.extend({
            // animateCss: function (animationName) {
            //     var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            //     this.addClass('animated ' + animationName).one(animationEnd, function() {
            //         //$(this).removeClass('animated ' + animationName);
            //     });
            //     return this;
            // },

            // 自动根据屏幕调整元素尺寸
            autofixStyle: function(options) {
                var args = {
                    baseWidth: $(window).width(), // 元素原先参照容器宽度
                    designWidth: $(window).width(), // 元素现在参照容器宽度
                    changeFontSize: false
                };

                $.extend(args, options);

                args.scaleNum = args.designWidth / args.baseWidth;
                this.each((index, item) => {
                    var o = $(item);
                    var fix = o.attr('data-fixStyle') || 'top,left,bottom,right,width,height'; // 需要调整的方向，默认top-left
                    var fixArray = fix.split(',');

                    $.each(fixArray, (index, item) => {
                        if (parseInt(o.css(item)) === 0) { return true; }
                        o.css(item, args.scaleNum * parseInt(o.css(item)));
                    });
                });

                return this;
            }
        });
    };

    // 全局变量存储用
    self.variable = {};

    // 获得url参数
    self.getUrlParam = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) return decodeURIComponent(r[2]); return null; // 返回参数值
    };

    // 移动设备简单判断
    self.device = (() => {
        return /android/.test(navigator.userAgent.toLowerCase()) ? 'android' : 'iphone';
    })();

    // 是否PC端简单判断23
    self.isPC = (() => {
        var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (navigator.userAgent.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    })();

    // 尝试执行函数
    self.tryFun = function(fun) {
        if (typeof fun === 'function') { return fun(); }
    };

    // 自动修正rem基数
    self.fixRem = function(designWidth, radix) {
        var win = window;
        var docEl = win.document.documentElement;
        var tid;

        // 下面的640表示设计稿大小，50(px)是rem基数
        designWidth = designWidth || 640;
        radix = radix || 50;

        function refreshRem() {
            // 获取当前窗口的宽度
            var width = docEl.getBoundingClientRect().width;
            // 大于640px 按640算
            // if (width > 640) { width = 640; }

            var rem = width / designWidth * radix;  // cms 只要把这行改成  var rem = width /640 * 100
            docEl.style.fontSize = rem + 'px';

            // 误差、兼容性处理
            var actualSize = parseFloat(window.getComputedStyle(document.documentElement)['font-size']);
            if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
                var remScaled = rem * rem / actualSize;
                docEl.style.fontSize = remScaled + 'px';
            }
        }

        // 函数节流，避免频繁更新
        function dbcRefresh() {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 100);
        }

        // 窗口更新动态改变font-size
        win.addEventListener('resize', function() { dbcRefresh(); }, false);

        // 页面显示的时候再计算一次   难道切换窗口之后再切换来窗口大小会变?....
        win.addEventListener('pageshow', function(e) {
            if (e.persisted) { dbcRefresh(); }
        }, false);
        refreshRem();
    };

    return self;
});
