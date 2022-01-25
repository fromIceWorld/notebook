// 给你一个整数 n ，请你在无限的整数序列 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ...] 中找出并返回第 n 位数字。

/** 示例 2：
 * 
 *    输入：n = 11
      输出：0
      解释：第 11 位数字在序列 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ... 里是 0 ，它是 10 的一部分。
 * 
 */
// 难点： 起始点 和 起始点再次前进的位置
/**
 * @param {number} n
 * @return {number}
 */
var findNthDigit = function (n) {
    // 获取当前的 n 在 几位数字中, 在第几个数字

    // 个位 9；
    // 十位 9*10
    // 百位：9*10*10
    // 千位：9*10*10*10
    // 9 * Math.pow(10, x-1)
    let d = 1,
        count = 9;
    while (n > d * count) {
        n -= d * count;
        d++;
        count *= 10;
    }
    let index = n - 1,
        start = Math.pow(10, d - 1),
        no = start + Math.floor(index / d),
        digistIndex = index % d;
    return String(no)[digistIndex];
};
