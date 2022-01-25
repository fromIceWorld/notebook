/**
 * 
 * 给你两个单词 word1 和 word2，请你计算出将 word1 转换成 word2 所使用的最少操作数 。
 * 你可以对一个单词进行如下三种操作：
        插入一个字符
        删除一个字符
        替换一个字符
 */

/**
 * 
示例 1：
    输入：word1 = "horse", word2 = "ros"
    输出：3
    解释：
    horse -> rorse (将 'h' 替换为 'r')
    rorse -> rose (删除 'r')
    rose -> ros (删除 'e')
 * 
 */

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {
    // dp[i][j] 前i个 word1字符，转换为 前j个word2字符，需要的次数
    if (word1.length * word2.length == 0) {
        return word1.length + word2.length;
    }
    let dp = Array.from(new Array(word1.length + 1), () =>
        new Array(word2.length + 1).fill(0)
    );
    for (let i = 0; i < word1.length + 1; i++) {
        for (let j = 0; j < word2.length + 1; j++) {
            if (i == 0 || j == 0) {
                if (i == 0) {
                    dp[0][j] = j;
                } else {
                    dp[i][0] = i;
                }
            } else {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1]
                    );
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1] + 1
                    );
                }
            }
        }
    }
    return dp[word1.length][word2.length];
};
