/*
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。


*/

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
    let len = s.length,
        stack = [];
    if (len == 0) {
        return true;
    }
    if (len % 2 !== 0) {
        return false;
    }
    for (let i = 0; i < len; i++) {
        if (s[i] == '(' || s[i] == '[' || s[i] == '{') {
            stack.push(s[i]);
        } else {
            if (stack.length == 0) {
                return false;
            }
            if (s[i] == ')') {
                if (stack.pop() !== '(') {
                    return false;
                }
            } else if (s[i] == ']') {
                if (stack.pop() !== '[') {
                    return false;
                }
            } else {
                if (stack.pop() !== '{') {
                    return false;
                }
            }
        }
    }
    return stack.length == 0;
};
