/**
 * 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。请你判断是否可以利用字典中出现的单词拼接出 s 。
 */

/**
 * 
示例 1：
    输入: s = "leetcode", wordDict = ["leet", "code"]
    输出: true
    解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。

示例 2：
    输入: s = "applepenapple", wordDict = ["apple", "pen"]
    输出: true
    解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
         注意，你可以重复使用字典中的单词。

示例 3：
    输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
    输出: false


 */

/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    let set = new Set(wordDict),
        dp = new Array(s.length),
        preIndex = new Set([-1]);
    for (let i = 0; i < s.length; i++) {
        for (let index of preIndex) {
            if (set.has(s.slice(index + 1, i + 1))) {
                dp[i] = true;
                preIndex.add(i);
            }
        }
    }
    return dp[s.length - 1];
};
