/**
 * 
 * 给你一个字符串 s ，找出其中最长的回文子序列，并返回该序列的长度。
 * 子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。

 */

/**
 * @param {string} s
 * @return {number}
 */
var longestPalindromeSubseq = function (s) {
    // dp[i][j] <= dp[i+1][j-1] + 2
    let dp = Array.from(new Array(s.length), () => new Array(s.length).fill(0));
    for (let i = s.length - 1; i >= 0; i--) {
        for (let j = i; j < s.length; j++) {
            if (i == j) {
                dp[i][j] = 1;
            } else {
                if (s[i] == s[j]) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
    }
    dp[0][s.length - 1];
};
