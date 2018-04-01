// 加载

define([
    'jquery',
    'createjs',
    'utils/utils',
    'text!../components/loading.html!strip',
    'jquery.browser'],
($, createjs, utils, htmlLoading) => {
    return (callback) => {
        // 如果小于ie9，则取消loading（createjs不支持）;
        if ($.browser.msie && $.browser.version < 9) {
            return callback();
        }

        // img标签方式加载图片
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。
        loader.maintainScriptOrder = true;

        let elLoading = null;
        var source = [
            { 'src': 'main/landscape.png' },
            { 'src': 'main/loading.jpg' }
        ];

        loader.on('complete', onComplete);
        loader.loadManifest(source, true, 'assets/img/');

        function onComplete() {
            $('body').append(htmlLoading);

            elLoading = $('.sys-loading');
            mainload();
        }

        function mainload() {
            var loader = new createjs.LoadQueue(false);

            // 关键！----设置并发数
            loader.setMaxConnections(5);
            // 关键！---一定要将其设置为 true, 否则不起作用。
            loader.maintainScriptOrder = true;

            var source = [
                { 'src': 'main/loading.jpg' }
            ];

            loader.on('progress', onProgress);
            loader.on('complete', onComplete);
            loader.loadManifest(source, true, 'assets/img/');

            function onComplete() {
                // t.stop();
                elLoading.fadeOut();
                utils.tryFun(callback);

                console.log('资源加载完成');
            }

            function onProgress() {
                // console.log(loader.progress);
                elLoading.find('span').text((loader.progress * 100 | 0) + ' %');
                elLoading.find('.progress div').css('width', (loader.progress * 100 | 0) + '%');
            }
        }
    };
});
