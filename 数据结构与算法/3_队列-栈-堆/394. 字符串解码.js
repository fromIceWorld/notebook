/**
 * 给定一个经过编码的字符串，返回它解码后的字符串。

    编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

    你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

    此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

 */

/**
 * 示例 1：
    输入：s = "3[a]2[bc]"
    输出："aaabcbc"

示例 2：
    输入：s = "3[a2[c]]"
    输出："accaccacc"

示例 3：
    输入：s = "2[abc]3[cd]ef"
    输出："abcabccdcdcdef"

示例 4：
    输入：s = "abc3[cd]xyz"
    输出："abccdcdcdxyz"

 */
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
    let preS = '',
        preN = '',
        repeat = 0,
        stack = [];
    for (let i = 0, len = s.length; i < len; i++) {
        // 数字
        if ('0' <= s[i] && s[i] <= '9') {
            if (preS) {
                stack.push(preS);
                preS = '';
            }
            preN += s[i];
        } else if ('a' <= s[i] && s[i] <= 'z') {
            if (preN) {
                stack.push(preN);
                preN = '';
            }
            preS += s[i];
        } else if (s[i] == '[') {
            repeat++;
            stack.push(preN);
            preN = '';
        } else if (s[i] == ']') {
            if (preS) {
                stack.push(preS);
                preS = '';
                concat();
            }
            let str = stack.pop(),
                s = '';
            count = Number(stack.pop());
            while (count) {
                s += str;
                count--;
            }
            stack.push(s);
            concat();

            repeat--;
        }
    }
    return stack.length ? stack[0] + preS : preS;
    function concat() {
        let s = '';
        while (
            stack.length &&
            'a' <= stack[stack.length - 1][0] &&
            stack[stack.length - 1][0] <= 'z'
        ) {
            s = stack.pop() + s;
        }
        stack.push(s);
    }
};

/**优化思路 以 [ ] 为边界，遇到 ]，让所有的字母出栈【直到[】，遇到[，让前面的数字出栈 */
var decodeString = function (s) {
    let stack = [],
        subStr = '',
        n = '';
    for (let i = 0, len = s.length; i < len; i++) {
        if (s[i] !== ']') {
            stack.push(s[i]);
        } else {
            let out = '';
            while (out !== '[') {
                subStr = out + subStr;
                out = stack.pop();
            }
            out = stack.pop();
            while (out >= '0' && out <= '9') {
                n = out + n;
                out = stack.pop();
            }
            if (out !== undefined) {
                stack.push(out);
            }
            let repeat = Number(n),
                str = '';
            while (repeat) {
                str += subStr;
                repeat--;
            }
            subStr = '';
            n = '';
            stack.push(str);
        }
    }
    return stack.join('');
};
