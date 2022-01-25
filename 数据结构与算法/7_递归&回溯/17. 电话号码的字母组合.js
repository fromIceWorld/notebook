/**
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
   给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

 */

/**
 * 
示例 1：
    输入：digits = "23"
    输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]

示例 2：
    输入：digits = ""
    输出：[]

示例 3：
    输入：digits = "2"
    输出：["a","b","c"]
 */

/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
    let phone = [
        [],
        [],
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i'],
        ['j', 'k', 'l'],
        ['m', 'n', 'o'],
        ['p', 'q', 'r', 's'],
        ['t', 'u', 'v'],
        ['w', 'x', 'y', 'z'],
    ];
    let result = [];
    for (let i = 0, len = digits.length; i < len; i++) {
        if (i == 0) {
            result = [...phone[digits[i]]];
        } else {
            let s = phone[digits[i]],
                cache = [];
            for (let j = 0; j < result.length; j++) {
                for (let m = 0; m < s.length; m++) {
                    cache.push(result[j] + s[m]);
                }
            }
            result = cache;
        }
    }
    return result;
};
