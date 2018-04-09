require.config({
    // optimize: 'none',
    baseUrl: 'js',

    buildCSS: false,
    inlineText: true,

    // config: {
    //     i18n: {
    //         locale: (function() {
    //             try {
    //                 var lang = 'en';
    //                 var reg = new RegExp('(^| )lang=([^;]*)(;|$)');
    //                 var m = {'en': true, 'zh-cn': true};
    //                 var arr = document.cookie.match(reg);
    //                 if (arr) { lang = unescape(arr[2]); }
    //                 if (!m[lang]) { lang = 'en'; }
    //                 return lang;
    //             } catch (e) {
    //                 // 打包环境
    //             }
    //         })()
    //     }
    // },

    // map: {
    //     '*': {
    //         'css': 'requirejs/css.min'
    //     }
    // },

    // text: {
    //    onXhr: function (xhr, url) {
    //        xhr.setRequestHeader('X-Requested-Width', 'XMLHttpRequest');
    //        //Called after the XHR has been created and after the
    //        //xhr.open() call, but before the xhr.send() call.
    //        //Useful time to set headers.
    //        //xhr: the xhr object
    //        //url: the url that is being used with the xhr object.
    //    },
    // },
    // map: {

    //    // 不同模块加载不同版本加载
    //    'api1' : {
    //        'jquery' : '版本1'
    //    },

    //    'api2': {
    //        'jquery': '版本2'
    //    }
    // },

    paths: {
        '@': 'app', // 废弃，这个加载方式会导致text!加载路径错误

        // requirejs
        // ------------------------------------
        'text': 'lib/requirejs/text',
        // 'i18n': 'lib/requirejs/i18n',

        // createjs
        // ------------------------------------
        'createjs-base': 'lib/createjs/createjs-2015.11.26.min',
        'preloadjs-base': 'lib/createjs/preloadjs-0.6.2.min',
        'easeljs-base': 'lib/createjs/easeljs-0.8.2.min',

        // 修改createjs来决定加载createjs的什么模块
        'createjs': 'lib/createjs/createjs',

        // jquery
        // ------------------------------------
        'jquery': 'lib/jquery/jquery-3.3.1.min',
        // 'jquery': 'lib/jquery/jquery-3.3.1.slim.min',
        // 'jquery': 'lib/jquery/jquery-1.12.4.min',
        // 'jquery.cookie': 'lib/jquery/jquery.cookie',
        'jquery.browser': 'lib/jquery/jquery.browser',
        'jquery.hammer': 'lib/jquery/jquery.hammer',
        'hammerjs': 'lib/hammerjs/hammer.min',
        
        // 'jquery.scrollTo': 'lib/jquery/jquery.scrollTo',

        // exif
        'exif-js': 'lib/exif/exif.min',

        // helper
        // 'utils': 'utils/helper',
        // 'frameplayer': 'lib/helper-es5/frameplayer',

        // app
        // ------------------------------------
        // js直接引用成app/xxx 会导致text!xxx.html加载路径错误
        'loader': 'app/loader',
        'script': 'app/script',
        'music': 'app/music'
    },

    shim: {
        // 'bootstrap': ['jquery'],
        // // 'bootstrap' : ['css!./lib/bootstrap/bootstrap-3.3.7.min.css'],
        // 'swiper': ['jquery', 'css!./lib/swiper/swiper-3.4.2.min.css'],
        // 'jquery.fullPage': ['jquery', 'css!./lib/jquery/jquery.fullPage.css'],
        // 'jquery.cookie': ['jquery']
        // test: {
        //     exports: 'StringUtils'
        // }
    },

    // shim : {
    //    'moduleName' : {
    //        deps: ['jquery'],
    //        exports : '模块的全局变量',
    //        init: function(QQ) {
    //            return QQ;
    //        }
    //    },

    //    'bootstrap': ['jquery'],

    //    'modernizr': {
    //        exports: 'Modernizr'
    //    }
    // },

    waitSeconds: 30,
    urlArgs: '_=' + new Date().getTime()
});
