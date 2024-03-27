// 给定一个字符串数组 words，找到 length(word[i]) * length(word[j]) 的最大值，
// 并且这两个单词不含有公共字母。你可以认为每个单词只包含小写字母。
// 如果不存在这样的两个单词，返回 0。

/*示例------------------------------*
 *  输入: ["abcw","baz","foo","bar","xtfn","abcdef"]
    输出: 16 
    解释: 这两个单词为 "abcw", "xtfn"。
 * 
 * 
 * 
 */

/**
 * @param {string[]} words
 * @return {number}
 */
var maxProduct = function (words) {
    let two = [],
        result = 0,
        a = 'a'.charCodeAt();
    for (let str of words) {
        let cache = 0;
        for (let s of str) {
            let index = s.charCodeAt() - a,
                abs = Math.pow(2, index);
            if (!(cache & abs)) {
                cache = cache + abs;
            }
        }
        for (let key in two) {
            if ((cache & two[key]) == 0) {
                let len = str.length * words[key].length;
                result = Math.max(len, result);
            }
        }
        two.push(cache);
    }
    return result;
};
