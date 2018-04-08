// 剧本

define([
    'jquery',
    'utils/utils',
    'loader',
    'createjs',
    'hammerjs',
    'text!../components/block.html!strip',
    'text!../components/index.html!strip'],
($, utils, loader, createjs, Hammer, htmlBlock, htmlIndex) => {
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

            let xx = 0;
            let yy = 0;
            let scale = 1;
            let rotate = 0;
            let angle = 0;

            $('#mainCanvas').attr('width', width);
            $('#mainCanvas').attr('height', height);

            const stage = new createjs.Stage('mainCanvas'); // 创建画布
            const bg = new createjs.Bitmap('./assets/img/main/bg.png'); // 创建背景图
            const bgBounds = bg.getBounds();
            var imgthis; //

            // bg.regX = 100;
            // bg.regY = 100;
            // bg.x = 0;
            // bg.y = 0; // 设置背景图位置
            bg.scaleX = width / bgBounds.width;
            bg.scaleY = bg.scaleX;
            // bg.scaleY = height / bgBounds.height;
            stage.addChild(bg); // 放置背景图到canvas画布

            createjs.Ticker.setFPS(120);
            createjs.Ticker.addEventListener('tick', update);

            // --
            const fileReader = new FileReader();
            const photo = $('#photo');

            photo.on('change', () => {
                if (photo[0].files.length === 0) {
                    return;
                }

                var oFile = photo[0].files[0];
                fileReader.readAsDataURL(oFile);
            });

            const options = {
                top: 278,
                left: 123,
                width: 503,
                height: 506
            };

            fileReader.onload = e => {
                const imgData = e.target.result;
                imgthis = new createjs.Bitmap(imgData);

                let tt = setInterval(() => {
                    if (imgthis.image.width === 0 || imgthis.image.height === 0) { return; }
                    clearInterval(tt);

                    // imgthis.x = options.left * bg.scaleX;
                    // imgthis.y = options.top * bg.scaleY;

                    imgthis.x = (options.left + options.width / 2) * bg.scaleX;
                    imgthis.y = (options.top + options.height / 2) * bg.scaleY;

                    // imgthis.rotation = 90;

                    const kuangaobi1 = options.width / options.height;
                    const kuangaobi2 = imgthis.image.width / imgthis.image.height;

                    // console.log(kuangaobi1);
                    // console.log(kuangaobi2);

                    if (kuangaobi1 > kuangaobi2) {
                        // const scale1 = options.width / imgthis.image.width;
                        const scale2 = options.width / imgthis.image.width * bg.scaleX;
                        imgthis.scaleX = scale2;
                        imgthis.scaleY = scale2;

                        // imgthis.y = (options.top - (imgthis.image.height - options.height) / 2) * bg.scaleX;
                        // imgthis.y = options.top * bg.scaleY - (imgthis.image.height * scale2 - options.height * bg.scaleY) / 2;
                        imgthis.y = options.top * bg.scaleY - (imgthis.image.height * scale2 - options.height * bg.scaleY) / 2 + imgthis.image.height * scale2 / 2;
                    } else {
                        const scale1 = options.height / imgthis.image.height * bg.scaleX;
                        imgthis.scaleX = scale1;
                        imgthis.scaleY = scale1;

                        // imgthis.y = (options.top - (imgthis.image.height - options.height) / 2) * bg.scaleX;
                        // imgthis.x = options.left * bg.scaleY - (imgthis.image.width * scale1 - options.width * bg.scaleY) / 2;
                        // imgthis.x = (options.left + options.width / 2) * bg.scaleX - (imgthis.image.width * scale1 - options.width * bg.scaleY) / 2;
                        imgthis.x = options.left * bg.scaleY - (imgthis.image.width * scale1 - options.width * bg.scaleY) / 2 + imgthis.image.width * scale1 / 2;
                    }

                    // 最终缩放倍数
                    scale = imgthis.scaleX;

                    console.log(imgthis.image.width * imgthis.scaleX / 2);
                    console.log(imgthis.image.height * imgthis.scaleX / 2);

                    imgthis.regX = imgthis.image.width / 2;
                    imgthis.regY = imgthis.image.height / 2;

                    // imgthis.rotation = 90;

                    xx = imgthis.x;
                    yy = imgthis.y;
                    // scale = 1;

                    stage.addChild(imgthis);

                    // stage.setChildIndex(imgthis, 0);
                    // stage.setChildIndex(bg, 1);
                    stage.swapChildren(bg, imgthis);    // bg始终在顶层
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

            var mc = new Hammer.Manager($('#mainCanvas')[0], {
                recognizers: [
                    // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
                    [Hammer.Rotate],
                    [Hammer.Pinch, { enable: true }, ['rotate']],
                    [Hammer.Pan]
                ]
            });

            mc.on('panmove', e => {
                // console.log(e);
                imgthis.x = xx + e.deltaX;
                imgthis.y = yy + e.deltaY;
                // console.log(`x:${e.deltaX}, y:${e.deltaY}`);
                console.log(imgthis.rotation);
            });

            mc.on('panend', e => {
                console.log('结束');
                xx = imgthis.x;
                yy = imgthis.y;
                // angle = imgthis.rotation;
                // angle = angle + imgthis.rotation;
                // console.log(rotate);
                // console.log(`x:${e.deltaX}, y:${e.deltaY}`);
            });

            // let rotate = 0;
            mc.on('pinchmove', e => {
                if (scale + e.scale - 1 < 0) { return; }
                imgthis.scaleX = scale + e.scale - 1;
                imgthis.scaleY = scale + e.scale - 1;
                // imgthis.rotation = angle + e.angle;
                // console.log(e);
                // console.log(e.rotation);
                // console.log(e.scale);
                if (rotate === 0) {
                    rotate = e.rotation;
                } else {
                    // console.log(e.rotation - rotate);
                    // console.log(`angle:${angle}, e.rotation:${e.rotation}, rotate:${rotate},xx:${e.rotation - rotate}`);
                    imgthis.rotation = angle + (e.rotation - rotate);
                    rotate = e.rotation;
                    angle = imgthis.rotation;
                    // console.log(angle);
                }

                // console.log(e);
            });

            mc.on('pinchend', () => {
                rotate = 0;
                scale = imgthis.scaleX;
                console.log('pinchend');
            });

            // mc.on('pinchout', () => {
            //     rotate = 0;
            //     // scale = imgthis.scaleX;
            //     console.log('pinchout');
            // });

            mc.on('rotate', e => {
                // imgthis.rotation = rotate + e.rotation;
                // console.log(e.rotation);
                // console.log(e);
                // console.log(rotate);
            });

            function update(event) {
                stage.update();
            }
        });
    };
});
