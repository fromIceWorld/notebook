/**
 *  累加数 是一个字符串，组成它的数字可以形成累加序列。

    一个有效的 累加序列 必须 至少 包含 3 个数。除了最开始的两个数以外，字符串中的其他数都等于它之前两个数相加的和。

    给你一个只包含数字 '0'-'9' 的字符串，编写一个算法来判断给定输入是否是 累加数 。如果是，返回 true ；否则，返回 false 。

    说明：累加序列里的数 不会 以 0 开头，所以不会出现 1, 2, 03 或者 1, 02, 3 的情况。
 */
/**
 * 示例 1：

    输入："112358"
    输出：true 
    解释：累加序列为: 1, 1, 2, 3, 5, 8 。1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8
示例 2：

    输入："199100199"
    输出：true 
    解释：累加序列为: 1, 99, 100, 199。1 + 99 = 100, 99 + 100 = 199
 */
/**
 * @param {string} num
 * @return {boolean}
 */
var isAdditiveNumber = function (num) {
    let pre = 0,
        len = num.length,
        result = false;
    // 长度 > 3
    if (len < 3) {
        return false;
    }
    // 以0 开头
    for (let current = pre + 1; current <= Math.floor(len / 2); current++) {
        if (num[current] !== '0') {
            let preNumber = Number(num.substring(pre, current));
            for (let next = current + 1; next < len; next++) {
                if (num[next] !== 0) {
                    let currentNumber = Number(num.substring(current, next));
                    let add = String(preNumber + currentNumber);
                    if (num.substring(next).indexOf(add) == 0) {
                        deep(
                            currentNumber,
                            Number(add),
                            next + String(add).length
                        );
                        if (result == true) {
                            return true;
                        }
                    }
                } else {
                    // 和为0
                    if (num.substring(next).indexOf('0') == 0) {
                        deep(0, 0, next + 1);
                        if (result == true) {
                            return true;
                        }
                    }
                }
            }
            if (num[0] == 0) {
                return false;
            }
        } else {
            let preNumber = num.substring(pre, current);
            let currentNumber = 0;
            if (num.substring(current + 1).indexOf(preNumber) == 0) {
                deep(
                    currentNumber,
                    Number(preNumber),
                    current + 1 + String(preNumber).length
                );
                if (result == true) {
                    return true;
                }
            }
        }
    }
    return result;
    function deep(preN, currentN, next) {
        if (next < len) {
            let add = String(preN + currentN);
            if (num.substring(next).indexOf(add) == 0) {
                deep(currentN, Number(add), next + add.length);
            }
        } else if (next == len) {
            result = true;
            return;
        } else {
            return;
        }
    }
};
