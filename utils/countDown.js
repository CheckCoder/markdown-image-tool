
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
function dot(showLog = true) {
    _now = new Date();
    let experience = _now.getTime() - _start.getTime();
    if (showLog) {
        console.log('打点时间：', _now, experience);
    }
    return experience;
}

module.exports = {
    start,
    dot
}