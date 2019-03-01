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

/**
 * 时间排序，倒序排列，时间最晚排最前
 * @param a
 * @param b
 * @returns {number}
 */
let neo4jSortDate = function (a, b) {
    return new Date(b['timestamp']) - new Date(a['timestamp'])
};

module.exports = {
    neo4jSortDate: neo4jSortDate,
    getCurrentDataTime: getCurrentDataTime,
};