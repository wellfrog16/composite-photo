define([
    'hammerjs'],
(Hammer) => {
    const self = {};

    // 给createjs的bitmap对象添加手势动作
    // area: 手势滑动区域对象
    // bitmap: 手势操作对象
    self.bindGesture = (area, bitmap) => {
        // 手势用，保存基数值
        const states = {
            x: bitmap.x,
            y: bitmap.y,
            scale: bitmap.scaleX,   // 等比缩放时
            rotate: 0,
            angle: bitmap.rotation
        };

        var mc = new Hammer.Manager(area, {
            recognizers: [
                // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
                [Hammer.Rotate],
                [Hammer.Pinch, { enable: true }, ['rotate']],
                [Hammer.Pan]
            ]
        });

        mc.on('panmove', e => {
            bitmap.x = states.x + e.deltaX;
            bitmap.y = states.y + e.deltaY;
        });

        mc.on('panend', e => {
            states.x = bitmap.x;
            states.y = bitmap.y;
        });

        // let rotate = 0;
        mc.on('pinchmove', e => {
            // 缩放，效率减少到80%
            const scale = states.scale + (e.scale - 1) * 0.8;

            // 图片最小缩放到宽度为50
            if (bitmap.image.width * scale <= 50) { return; }

            bitmap.scaleX = scale;
            bitmap.scaleY = scale;

            // 旋转
            if (states.rotate === 0) {
                states.rotate = e.rotation;
            } else {
                bitmap.rotation = states.angle + (e.rotation - states.rotate);
                states.rotate = e.rotation;
                states.angle = bitmap.rotation;
            }
        });

        mc.on('pinchend', () => {
            states.rotate = 0;
            states.scale = bitmap.scaleX;
        });

        mc.on('rotate', e => {
            // console.log(e.rotation);
        });

        return mc;
    };

    // design: 原设计数据
    // bitmap: 操作对象
    self.matchingDesign = (design, bitmap) => {
        const ratioDesign = design.width / design.height;
        const ratiobitmap = bitmap.image.width / bitmap.image.height;

        // 缩放值。true: 设计图宽高比大于上传图的宽高比，则上传图的高度较大。需要宽度相同，高垂直居中
        const bitmapScale = ratioDesign > ratiobitmap ? (design.width / bitmap.image.width) : (design.height / bitmap.image.height);

        bitmap.scaleX = bitmapScale;
        bitmap.scaleY = bitmapScale;

        // 包含中心点偏移regX, regY抵消
        bitmap.x = design.x + design.width / 2;
        bitmap.y = design.y + design.height / 2;

        // 中心点XY
        bitmap.regX = bitmap.image.width / 2;
        bitmap.regY = bitmap.image.height / 2;
    };

    return self;
});
