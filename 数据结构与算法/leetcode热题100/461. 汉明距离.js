/**
 *
 * 两个整数之间的 汉明距离 指的是这两个数字对应二进制位不同的位置的数目。
 * 给你两个整数 x 和 y，计算并返回它们之间的汉明距离。
 */

/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
var hammingDistance = function (x, y) {
    let target = x ^ y,
        result = 0;
    while (target > 0) {
        let has = target & 1;
        if (has) {
            result++;
        }
        target = target >> 1;
    }
    return result;
};
