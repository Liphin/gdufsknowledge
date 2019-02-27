/**
 * Created by Administrator on 2019/2/16.
 * util工具类方法
 */

/**
 * 返回当前时间，格式为2018-01-01 12:00:00
 * @returns {string}
 */
let getCurrentDataTime = function () {
    var date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "  " + date.getHours() + ":" +
        date.getMinutes() + ":" + date.getSeconds();
};

module.exports = {
    getCurrentDataTime: getCurrentDataTime,
};