/**
 * 
 * 给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。
 * 一个字符串的 子序列 是指这样一个新的字符串：
 *                   它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
 * 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
 * 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。

 * 
 */
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
    // dp[i][j] 代表 text1 的 0-i 和 text2的 0-j 的公共最长子序列
    // dp[i][j] = dp[i-1][j-1] + 1
    let dp = Array.from(new Array(text1.length), () =>
        new Array(text2.length).fill(0)
    );
    for (let i = 0; i < text1.length; i++) {
        for (let j = 0; j < text2.length; j++) {
            if (i == 0 || j == 0) {
                if (text1[i] == text2[j]) {
                    dp[i][j] = 1;
                } else {
                    if (i == 0 && j !== 0) {
                        dp[i][j] = dp[i][j - 1];
                    } else if (i !== 0 && j == 0) {
                        dp[i][j] = dp[i - 1][j];
                    } else {
                        dp[i][j] = 0;
                    }
                }
            } else {
                if (text1[i] == text2[j]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
    }
    return dp[text1.length - 1][text2.length - 1];
};
