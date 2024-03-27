/**
 * 你将得到一个整数数组 matchsticks ，其中 matchsticks[i] 是第 i 个火柴棒的长度。你要用 所有的火柴棍 拼成一个正方形。你 不能折断 任何一根火柴棒，但你可以把它们连在一起，而且每根火柴棒必须 使用一次 。

 如果你能使这个正方形，则返回 true ，否则返回 false 。
 */
/**
 * 
 * 示例 1:



    输入: matchsticks = [1,1,2,2,2]
    输出: true
    解释: 能拼成一个边长为2的正方形，每边两根火柴。
示例 2:

    输入: matchsticks = [3,3,3,3,4]
    输出: false
    解释: 不能用所有火柴拼成一个正方形。
 */

/**
 * @param {number[]} matchsticks
 * @return {boolean}
 */
var makesquare = function (matchsticks) {
    let sum = 0,
        max = -Infinity;
    for (let val of matchsticks) {
        max = Math.max(val, max);
        sum += val;
    }
    let target = sum / 4;
    if (max > target || sum % 4 !== 0 || matchsticks.length < 4) {
        return false;
    }
    matchsticks.sort((a, b) => b - a);
    return deep(0, 0, 0, 0, 0);
    function deep(index, sum1, sum2, sum3, sum4) {
        if (sum1 > target || sum2 > target || sum3 > target || sum4 > target) {
            return false;
        }
        if (index == matchsticks.length) {
            if (
                target == sum1 &&
                sum1 == sum2 &&
                sum2 == sum3 &&
                sum3 == sum4
            ) {
                return true;
            }
            return false;
        } else {
            return (
                deep(index + 1, sum1 + matchsticks[index], sum2, sum3, sum4) ||
                deep(index + 1, sum1, sum2 + matchsticks[index], sum3, sum4) ||
                deep(index + 1, sum1, sum2, sum3 + matchsticks[index], sum4) ||
                deep(index + 1, sum1, sum2, sum3, sum4 + matchsticks[index])
            );
        }
    }
};
