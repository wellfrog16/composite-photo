// 剧本

define([
    'zepto',
    'utils/utils',
    'helper/helper',
    'loader',
    'createjs',
    'hammerjs',
    'text!../components/block.html!strip',
    'text!../components/index.html!strip'],
($, utils, helper, loader, createjs, Hammer, htmlBlock, htmlIndex) => {
    return () => {
        // 加载jquery插件
        // utils.jqueryPlugins();
        // utils.fixRem();

        // 如果是手机端，加载横屏提示
        // if (!utils.isPC) { $('body').append(htmlBlock); }

        // console.log(new VConsole());

        loader(() => {
            $('body').append(htmlIndex);

            // 屏幕
            const width = $(window).width();
            const height = $(window).height();

            // 设置画布大小
            $('#mainCanvas').attr('width', width);
            $('#mainCanvas').attr('height', height);

            const stage = new createjs.Stage('mainCanvas'); // 创建画布
            const bg = new createjs.Bitmap('./assets/img/main/bg.png'); // 创建背景图实例
            const scale = width / bg.image.width;   // 全局缩放值

            // 背景属性
            bg.scaleX = scale;
            bg.scaleY = scale;

            // 放置背景图到canvas画布
            stage.addChild(bg);

            // 设置fps
            createjs.Ticker.setFPS(120);
            createjs.Ticker.addEventListener('tick', event => {
                stage.update();
            });

            // 上传的对象
            let photo;
            // 手势
            let mc;

            const fileReader = new FileReader();
            const btnPhoto = $('#photo');

            btnPhoto.on('change', () => {
                if (btnPhoto[0].files.length === 0) { return; }

                const oFile = btnPhoto[0].files[0];
                fileReader.readAsDataURL(oFile);
            });

            // 设计中默认上传图片属性，基于750px
            const design = {
                x: 123,
                y: 278,
                width: 503,
                height: 506
            };

            // 设计图实际使用时，缩放后的结果
            for (const key in design) {
                design[key] *= scale;
            }

            fileReader.onload = e => {
                // 删除旧的
                stage.removeChild(photo);

                // 清除事件
                if (mc) { mc.destroy(); }

                const imgData = e.target.result;
                photo = new createjs.Bitmap(imgData);

                var newimg = new Image();
                newimg.src = imgData;

                // 定时器，不停检测是否加载完成
                let timer = setInterval(() => {
                    if (photo.image.width === 0 || photo.image.height === 0) { return; }
                    clearInterval(timer);

                    // 拍照90度修复
                    if (utils.getPhotoOrientation(newimg) === 6) {
                        photo.rotation = 90;
                    }

                    // 调整photo数据以匹配design
                    helper.matchingDesign(design, photo);

                    stage.addChild(photo);

                    // stage.setChildIndex(imgthis, 0);
                    // stage.setChildIndex(bg, 1);
                    stage.swapChildren(bg, photo);    // bg始终在顶层

                    // 添加手势动作
                    mc = helper.bindGesture($('#mainCanvas')[0], photo);
                }, 10);
            };

            $('.btn-generate').on('click', () => {
                var getCanvas = $('#mainCanvas')[0];
                var imgData = getCanvas.toDataURL('image/jpg');
                $('#result img')[0].src = imgData;

                setTimeout(function() {
                    // var data = yasuo.reduce('show', 0.1);
                    // document.getElementById('show').src = data;

                    // document.getElementById('content1').style.display = 'none';
                    // document.getElementById('content2').style.display = 'block';
                    $('#result').show();
                }, 200);
            });
        });
    };
});
