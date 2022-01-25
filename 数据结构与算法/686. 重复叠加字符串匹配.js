// 给定两个字符串 a 和 b，寻找重复叠加字符串 a 的最小次数，
// 使得字符串 b 成为叠加后的字符串 a 的子串，如果不存在则返回 -1。

// 注意：字符串 "abc" 重复叠加 0 次是 ""，重复叠加 1 次是 "abc"，重复叠加 2 次是 "abcabc"。

// 示例 1：

// 输入：a = "abcd", b = "cdabcdab"
// 输出：3
// 解释：a 重复叠加三遍后为 "abcdabcdabcd", 此时 b 是其子串。

// 示例 4：

// 输入：a = "abc", b = "wxyz"
// 输出：-1

// 示例 5：

// 输入：a = "aa", b = "a"
// 输出：1
// 示例 6：

// 输入：a = "abcd", b = "bcdab"
// 输出：2

/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
var repeatedStringMatch = function (a, b) {
    let result = 0;
    // b是空串
    if (b.length == 0) {
        return 0;
    }
    // a比b长，但 b不是空串,【可能 b就是a 的字串 / b是a重复两次的字串】【】【也可能不匹配】
    if (a.length >= b.length && b.length !== 0) {
        return a.includes(b) ? 1 : (a + a).includes(b) ? 2 : -1;
    }
    // 使用字符去尝试匹配 字串
    let sourceIndex = 0,
        first = null;
    let can = true;
    while (sourceIndex < b.length && can) {
        if (isEqual(sourceIndex)) {
            if (first == null) {
                if (first >= a.length) {
                    can = false;
                }
                first = sourceIndex;
            }
            sourceIndex += a.length;
            result++;
        } else {
            if (first == null && sourceIndex >= a.length) {
                can = false;
            } else if (first !== null) {
                can = false;
            }
            sourceIndex++;
        }
    }
    // 如果从第一次匹配成功，到最后都匹配成功，确定first的位置，与a 的前几位匹配
    if (can) {
        if (first == 0) {
            return result;
        }
        return a.substring(a.length - first, a.length) == b.substring(0, first)
            ? result + 1
            : -1;
    } else {
        return -1;
    }
    function isEqual(index) {
        if (index + a.length <= b.length) {
            return b.substring(index, index + a.length) == a;
        } else {
            let sub = b.substring(index, b.length);
            return sub == a.substring(0, sub.length);
        }
    }
};

// 总结 【以上为暴力发，还有 Rabin-Karp算法】
// Rabin-Karp 算法
/*
   将每个字符串使用 hash函数，转换成 数字【数字记录每一个字符，及其位置】，比较数字
   当不同时，去除前一个字符的值，再将下一个字符表示的值加上，获得新值，再比较【记录前置信息，比每次使用substring，每次都把前面计算的值抛弃掉，效率高】  
   'abcd':源字符串  
   'abc': (a*128 + b)*128 + c = n;
   'bcd': (n- a*128^2)*128 + d = m;
    ...
    ...
*/

// 【kmp算法】
/*
 第一步： 在 b 字符串中 查找 a字符串的位置
 第二部： 根据第一步的查找结果，确定a是否可以重复n次后，构成部分b 串
 第三步： 如果重复后，b还有 前缀/后缀，判断前缀和后缀，是否和a匹配
*/
var repeatedStringMatch = function (a, b) {
    // b是空串
    if (b.length == 0) {
        return 0;
    }
    // a比b长，但 b不是空串,【可能 b就是a 的字串 / b是a重复两次的字串】
    if (a.length >= b.length && b.length !== 0) {
        return a.includes(b) ? 1 : (a + a).includes(b) ? 2 : -1;
    }
    // b由a的两部分部分逆序组成 上述【实例6】
    if ((a + a).includes(b)) {
        return 2;
    }
    // b 比a长，只能去匹配
    let { minIndex, maxIndex, result } = kmp(b, a);
    // 如果从第一次匹配成功，到最后都匹配成功，确定first的位置，与a 的前几位匹配
    let count = (maxIndex - minIndex + 1) / a.length,
        left = b.substring(0, minIndex),
        right = b.substring(maxIndex + 1);
    if (result.length) {
        if (minIndex !== 0) {
            if (a.lastIndexOf(left) == a.length - left.length) {
                count++;
            } else {
                return -1;
            }
        }
        if (maxIndex !== b.length - 1) {
            if (a.indexOf(right) == 0) {
                count++;
            } else {
                return -1;
            }
        }
    } else {
        return -1;
    }
    return count;
};
// kmp算法
function kmp(main, sub) {
    // 返回所有匹配的位置
    let min = (max = null);
    // 求next 串
    let next = getNext(sub);
    // 根据next，模式匹配
    let i = 0,
        j = 0,
        result = [];
    while (i < main.length) {
        if (j == -1 || main[i] == sub[j]) {
            if (j == sub.length - 1) {
                j = 0; // 更新j的位置
                if (max !== null) {
                    if (i - max == sub.length) {
                        max = i;
                        result.push(i);
                    } else {
                        max = min = null;
                        result = [];
                        break;
                    }
                } else {
                    max = min = i;
                    result.push(i);
                }
                i++;
            } else {
                j++;
                i++;
            }
        } else {
            j = next[j];
        }
    }
    return {
        minIndex: min - sub.length + 1,
        maxIndex: max,
        result,
    };
}
function getNext(p) {
    let next = [-1],
        i = 0,
        j = -1;
    while (i < p.length) {
        if (j == -1 || p[i] == p[j]) {
            i++;
            j++;
            next[i] = j;
        } else {
            j = next[j];
        }
    }
    return next;
}
