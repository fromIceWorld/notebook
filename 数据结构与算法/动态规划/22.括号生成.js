/**
 * 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
 * 有效括号组合需满足：左括号必须以正确的顺序闭合。
 */

var generateParenthesis = function (n) {
    let left = n,
        right = n,
        result = [];
    function add(l, r, str) {
        if (l == 0 && r == 0) {
            result.push(str);
            return;
        }
        if (l >= r && l !== 0) {
            str += '(';
            add(l - 1, r, str);
        } else {
            if (l !== 0) {
                add(l - 1, r, str + '(');
            }
            if (r !== 0) {
                add(l, r - 1, str + ')');
            }
        }
    }
    add(left, right, '');
    return result;
};
