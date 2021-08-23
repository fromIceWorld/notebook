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
//  dp[i]的数量 = min(dp[i-j*j]+1)

function over(n) {
    let dp = [0];
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j * j <= i; j++) {
            dp[i] = Math.min(i, dp[i - j * j] + 1);
        }
    }
    return dp[n];
}
