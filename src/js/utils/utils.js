define(['exif-js'], (EXIF) => {
    //
    const self = {};

    self.getPhotoOrientation = img => {
        let orientation = 1;
        EXIF.getData(img, function() {
            orientation = EXIF.getTag(this, 'Orientation') || 1;
            // console.log(EXIF.getTag(this, 'Orientation'));
            // console.log(EXIF.getAllTags(this));
        });

        return orientation;
    };

    // 尝试执行函数
    self.tryFun = function(fun) {
        if (typeof fun === 'function') { return fun(); }
    };

    return self;
});
