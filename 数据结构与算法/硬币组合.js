// 动态规划
let source = [1, 2, 5],
    target = 16;
let dp = new Array(target + 1);
dp[0] = 0;
for (let i = 1, endIndex = dp.length - 1; i <= endIndex; i++) {
    for (let value of source) {
        if (i >= value) {
            dp[i] = Math.min(dp[i - value] + 1, dp[i]);
        }
    }
}
console.log(dp[16]);
// n 指针
