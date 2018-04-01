// amd 方式加载createjs
// createjs用shim加载失败
define(['easeljs-base', 'preloadjs-base'], function(){return window.createjs;});