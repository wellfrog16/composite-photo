// 加载

define([
    'jquery',
    'createjs',
    'utils/utils',
    'text!../components/loading.html!strip'],
($, createjs, utils, htmlLoading) => {
    return (callback) => {
        // img标签方式加载图片
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。
        loader.maintainScriptOrder = true;

        let elLoading = null;
        var source = [
            { 'src': 'main/landscape.png' }
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
                { 'src': 'main/bg.png' }
            ];

            loader.on('progress', onProgress);
            loader.on('complete', onComplete);
            loader.loadManifest(source, true, 'assets/img/');

            function onComplete() {
                elLoading.fadeOut();
                utils.tryFun(callback);
            }

            function onProgress() {
                // console.log(loader.progress);
                elLoading.find('.text').text((loader.progress * 100 | 0) + ' %');
                elLoading.find('.progress div').css('width', (loader.progress * 100 | 0) + '%');
            }
        }
    };
});
