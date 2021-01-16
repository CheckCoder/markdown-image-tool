
let _start;

/**
 * 开始倒计时
 */
function start() {
    _start = new Date();
    console.log('开始计时：', _start);
}

/**
 * 倒计时打点
 */
function dot() {
    _now = new Date();
    console.log('打点时间：', _now, _now.getTime() - _start.getTime());
}

module.exports = {
    start,
    dot
}