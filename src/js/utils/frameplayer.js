define(['jquery'], $ => {
    var self = (options) => {
        var args = {
            target: null,                  // 对象
            baseWidth: 640,                //
            scale: 1,                      // 缩放倍数
            total: 0,                      // 总帧数
            row: 0,                        // 一行几帧
            fps: 0,                        // fps
            loop: false,                   // 是否循环
            loopDelay: 0,                  // 循环间隔帧数
            loopTimes: -1,                 // 循环次数，-1为无限
            finishedCallback: null,        // 回调
            loopCallback: null,            // 循环回调
            autosize: true,                // 自适应
            onProgress(frame) { return frame; }            // 帧数变化时
        };

        $.extend(args, options);

        var scale = args.scale;
        var baseScale = args.autosize ? document.documentElement.clientWidth / args.baseWidth : 1;

        let flagPause = false;
        let breaknum = -1;

        // 内部变量
        args.times = args.times || 0;

        args.target.css('transform', 'scale(' + baseScale * scale + ')');
        args.target.css('background-size', args.row * 100 + '%');
        args.target.css('background-position', '0 0');
        // args.target.css("transform-origin", '0px 0px 0px');
        args.target.show();

        const fplayer = {
            target: args.target,
            pause() {
                flagPause = true;
            },
            continued() {   // ie8 continue系统占用
                flagPause = false;
            },
            breakpoint(n) {
                breaknum = n;
            },
            play() {
                start();
            },
            stop() {
                clearInterval(timer);

                // 执行结束回调
                if (args.finishedCallback) { args.finishedCallback(fplayer); }
            }
        };

        var num = 0;
        var delay = args.loopDelay;
        var timer = null;

        function start() {
            timer = setInterval(() => {
                // 暂停，空循环。播放到指定帧，空循环。
                if (flagPause || breaknum === num) { return; }

                // 状态改变，返回帧数
                args.onProgress(num + 1);

                // 完成循环时
                if (num++ >= args.total - 1) {
                    // 有循环，且有循环回调，优先执行
                    if (args.loop && args.loopCallback && delay === args.loopDelay) {
                        args.loopCallback(fplayer, ++args.times);

                        // 有循环次数，则次数到达后退出
                        if (args.times === args.loopTimes) {
                            clearInterval(timer);

                            // 执行结束回调
                            if (args.finishedCallback) { args.finishedCallback(fplayer); }

                            // 结束函数
                            return;
                        }
                    }

                    // 延迟，空执行
                    if (delay > 0) {
                        delay--;
                        return;
                    }

                    // 有循环
                    if (args.loop) {
                        args.target.css('background-position', '0 0');
                        num = 0;
                        delay = args.loopDelay;
                    }

                    // 无循环
                    if (!args.loop) { clearInterval(timer); }

                    // 无循环，且有 结束回调
                    if (!args.loop && args.finishedCallback) { args.finishedCallback(fplayer); }
                } else {
                    var x = (num % args.row) * -100;
                    var y = parseInt(num / args.row) * -100;

                    args.target.css('background-position', x + '% ' + y + '%');
                }
            }, 1000 / args.fps);
        }

        return fplayer;
    };

    return self;
});
