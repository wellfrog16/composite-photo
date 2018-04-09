// 剧本

define([
    'jquery',
    'utils/utils',
    'loader',
    'createjs',
    'hammerjs',
    'exif-js',
    'text!../components/block.html!strip',
    'text!../components/index.html!strip'],
($, utils, loader, createjs, Hammer, Exif, htmlBlock, htmlIndex) => {
    return () => {
        // 加载jquery插件
        // utils.jqueryPlugins();
        // utils.fixRem();

        // 如果是手机端，加载横屏提示
        // if (!utils.isPC) { $('body').append(htmlBlock); }

        console.log(new VConsole());

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

            // 手势用，基数值
            const states = {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                angle: 0
            };

            fileReader.onload = e => {
                // 删除旧的
                stage.removeChild(photo);

                const imgData = e.target.result;
                $('#test')[0].src = imgData;
                photo = new createjs.Bitmap(imgData);

                var newimg = new Image();
                newimg.src = $('#test')[0].src;

                // 定时器，不停检测是否加载完成
                let timer = setInterval(() => {
                    if (photo.image.width === 0 || photo.image.height === 0) { return; }
                    clearInterval(timer);

                    setTimeout(() => {
                        Exif.getData(newimg, function() {
                            console.log(Exif.getTag(this, 'Orientation'));
                            console.log(Exif.getAllTags(this));
                            // var make = Exif.getTag(this, 'Make');
                            // var model = Exif.getTag(this, 'Model');
                            // console.log(`${make} ${model}`);
                        });
                    }, 1000);

                    // imgthis.rotation = 90;

                    const ratioDesign = design.width / design.height;
                    const ratioPhoto = photo.image.width / photo.image.height;

                    // 缩放值。true: 设计图宽高比大于上传图的宽高比，则上传图的高度较大。需要宽度相同，高垂直居中
                    const photoScale = ratioDesign > ratioPhoto ? (design.width / photo.image.width) : (design.height / photo.image.height);

                    photo.scaleX = photoScale;
                    photo.scaleY = photoScale;

                    // 包含中心点偏移regX, regY抵消
                    photo.x = design.x + design.width / 2;
                    photo.y = design.y + design.height / 2;

                    // 中心点XY
                    photo.regX = photo.image.width / 2;
                    photo.regY = photo.image.height / 2;

                    // 设定基数值
                    states.scale = photoScale;
                    states.x = photo.x;
                    states.y = photo.y;

                    stage.addChild(photo);

                    // stage.setChildIndex(imgthis, 0);
                    // stage.setChildIndex(bg, 1);
                    stage.swapChildren(bg, photo);    // bg始终在顶层
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
                photo.x = states.x + e.deltaX;
                photo.y = states.y + e.deltaY;
            });

            mc.on('panend', e => {
                console.log('移动结束');
                states.x = photo.x;
                states.y = photo.y;
            });

            // let rotate = 0;
            mc.on('pinchmove', e => {
                if (states.scale + e.scale - 1 < 0) { return; }

                // 缩放
                photo.scaleX = states.scale + e.scale - 1;
                photo.scaleY = states.scale + e.scale - 1;

                // 旋转
                if (states.rotate === 0) {
                    states.rotate = e.rotation;
                } else {
                    photo.rotation = states.angle + (e.rotation - states.rotate);
                    states.rotate = e.rotation;
                    states.angle = photo.rotation;
                }
            });

            mc.on('pinchend', () => {
                states.rotate = 0;
                states.scale = photo.scaleX;
                console.log('pinchend');
            });

            mc.on('rotate', e => {
                // console.log(e.rotation);
            });
        });
    };
});
