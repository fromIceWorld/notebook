/**
 * 
 * 给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

 */

/***
示例 1：
    输入：nums = [1,5,11,5]
    输出：true
    解释：数组可以分割成 [1, 5, 5] 和 [11] 。

示例 2：
    输入：nums = [1,2,3,5]
    输出：false
    解释：数组不能分割成两个元素和相等的子集。

 * 
 * 
 */

// 背包问题【完全背包】

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
    }
    if (sum % 2 !== 0) {
        return false;
    }
    //
    let dp = Array.from(new Array(nums.length + 1), () =>
        new Array(sum / 2 + 1).fill(0)
    );
    dp[0][0] = 1;
    for (let i = 1; i <= nums.length; i++) {
        for (let j = 0; j <= sum / 2; j++) {
            dp[i][j] =
                dp[i - 1][j] +
                (j - nums[i - 1] >= 0 ? dp[i - 1][j - nums[i - 1]] : 0);
        }
    }
    return dp[nums.length][sum / 2] > 0 ? true : false;
};
// dp[i][j] = dp[i-1][j] + dp[i-1][j-nums[i-1]]
// 第n层的数据都是 n-1层的来的，不需要 m *n 的空间

var canPartition = function (nums) {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
    }
    if (sum % 2 !== 0) {
        return false;
    }
    //
    let dp = new Array(sum / 2 + 1).fill(0);
    dp[0] = 1;
    for (let i = 1; i <= nums.length; i++) {
        for (let j = sum / 2; j >= 0; j--) {
            dp[j] = dp[j] + (j - nums[i - 1] >= 0 ? dp[j - nums[i - 1]] : 0);
        }
    }
    return dp[sum / 2] > 0 ? true : false;
};
