/**
 *
 * 给定一个 24 小时制（小时:分钟 "HH:MM"）的时间列表，找出列表中任意两个时间的最小时间差并以分钟数表示。
 */

/**
 * 
示例 1：
    输入：timePoints = ["23:59","00:00"]
    输出：1

示例 2：
    输入：timePoints = ["00:00","23:59","00:00"]
    输出：0
 * 
 */

/**
 * @param {string[]} timePoints
 * @return {number}
 */
var findMinDifference = function (timePoints) {
    let result = Infinity,
        max = 24 * 60;
    timePoints.sort((a, b) => (a > b ? 1 : -1));
    timePoints.reduce((pre, current) => {
        let d = dValue(pre, current);
        result = Math.min(result, d, max - d);
        return current;
    });
    let end = dValue(timePoints[0], timePoints[timePoints.length - 1]);
    return Math.min(result, end, max - end);
    function dValue(pre, cu) {
        let pv = pre.substring(0, 2) * 60 + Number(pre.substring(3, 5)),
            cv = cu.substring(0, 2) * 60 + Number(cu.substring(3, 5));
        return cv - pv;
    }
};
