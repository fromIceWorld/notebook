/**
 * 给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
   字母异位词 是由重新排列源单词的字母得到的一个新单词，所有源单词中的字母通常恰好只用一次。
 */
/**
 * 示例 1:
    输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
    输出: [["bat"],["nat","tan"],["ate","eat","tea"]]

示例 2:
    输入: strs = [""]
    输出: [[""]]

示例 3:
    输入: strs = ["a"]
    输出: [["a"]]
 * 
 */
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
    let cache = {};
    strs.forEach((str) => {
        let arr = str.split('');
        arr.sort((a, b) => (a > b ? 1 : -1));
        let s = arr.join('');
        if (cache[s]) {
            cache[s].push(str);
        } else {
            cache[s] = [str];
        }
    });
    let result = [];
    Object.keys(cache).forEach((key) => {
        result.push(cache[key]);
    });
    return result;
};
