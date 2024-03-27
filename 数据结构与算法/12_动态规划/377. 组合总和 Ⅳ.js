/**
 *给你一个由 不同 整数组成的数组 nums ，和一个目标整数 target 。请你从 nums 中找出并返回总和为 target 的元素组合的个数。

 题目数据保证答案符合 32 位整数范围。

 *
 */

/**
 *示例 1：
    输入：nums = [1,2,3], target = 4
    输出：7
    解释：
    所有可能的组合为：
    (1, 1, 1, 1)
    (1, 1, 2)
    (1, 2, 1)
    (1, 3)
    (2, 1, 1)
    (2, 2)
    (3, 1)
    请注意，顺序不同的序列被视作不同的组合。
 * 
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var combinationSum4 = function (nums, target) {
    nums.sort((a, b) => a - b);
    // 0-1背包问题
    // dp[i][j] 前i个元素，凑成j的组合数
    // dp[i][j] <= dp[i-1][j] + dp[i][j-nums[i]]
    let dp = Array.from(new Array(target + 1)).fill(0);
    dp[0] = 1;
    for (let i = 1; i <= target; i++) {
        for (let j = 0; j < nums.length; j++) {
            if (i - nums[j] >= 0) {
                dp[i] += dp[i - nums[j]];
            } else {
                break;
            }
        }
    }
    return dp[target];
};
