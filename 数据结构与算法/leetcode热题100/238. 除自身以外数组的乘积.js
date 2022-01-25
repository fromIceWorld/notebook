/**
 * 
 * 
 * 给你一个长度为 n 的整数数组 nums，其中 n > 1，返回输出数组 output ，
 * 其中 output[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。

 */

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
    let dp = Array.from(new Array(nums.length), () => new Array(2).fill(1));
    for (let i = 1; i < nums.length; i++) {
        dp[i][0] = dp[i - 1][0] * nums[i - 1];
    }
    for (let i = nums.length - 2; i >= 0; i--) {
        dp[i][1] = dp[i + 1][1] * nums[i + 1];
    }
    let result = [];
    for (let i = 0; i < nums.length; i++) {
        result[i] = dp[i][0] * dp[i][1];
    }
    return result;
};
