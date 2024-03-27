/**
给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。

完全平方数 是一个整数，其值等于另一个整数的平方；换
句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。

 示例 1：

    输入：n = 12
    输出：3 
    解释：12 = 4 + 4 + 4
示例 2：

    输入：n = 13
    输出：2
    解释：13 = 4 + 9
 
提示：

    1 <= n <= 104
 */

// 基于 四分法的 广度优先
function four(n) {
    let from = [],
        result = null,
        container = [[]];
    for (let i = 1; i * i <= n; i++) {
        from.push(i * i);
    }
    function bfs(nodes, containers) {
        let child = [],
            cache = [];
        for (let i = 0, len = nodes.length; i < len; i++) {
            for (let y = 0, length = from.length; y < length; y++) {
                let min = nodes[i] - from[y];
                let mid = containers[i].slice();
                mid.push(from[y]);
                child.push(min);
                cache.push(mid);
                if (min == 0) {
                    result = cache[cache.length - 1];
                    break;
                }
            }
        }
        if (result) {
            return;
        } else {
            container = cache;
            bfs(child, container);
        }
    }
    bfs([n], container);
    return result;
}
// 动态规划,求 组成的数量
//  dp[i]的数量 = min(dp[i-j*j]+1, dp[i])

function over(n) {
    let dp = [0];
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j * j <= i; j++) {
            dp[i] = Math.min(i, dp[i - j * j] + 1);
        }
    }
    return dp[n];
}
