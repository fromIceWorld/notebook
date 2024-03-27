/**
 * 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
 * 子数组 是数组中的一个连续部分
 *
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    let dp = 0,
        result = nums[0];
    for (let i = 0; i < nums.length; i++) {
        dp = Math.max(dp + nums[i], nums[i]);
        result = Math.max(result, dp);
    }
    return result;
};
