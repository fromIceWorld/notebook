/**
 *
 * 如果一个数列 至少有三个元素 ，并且任意两个相邻元素之差相同，则称该数列为等差数列。
 * 例如，[1,3,5,7,9]、[7,7,7,7] 和 [3,-1,-5,-9] 都是等差数列。
 * 给你一个整数数组 nums ，返回数组 nums 中所有为等差数组的 子数组 个数。
 * 子数组 是数组中的一个连续序列。
 *
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var numberOfArithmeticSlices = function (nums) {
    if (nums.length < 3) {
        return 0;
    }
    let dp = new Array(nums.length).fill(0),
        result = 0;
    for (let i = 2; i < nums.length; i++) {
        if (nums[i] - nums[i - 1] == nums[i - 1] - nums[i - 2]) {
            dp[i] = dp[i - 1] + 1;
            result += dp[i];
        }
    }
    return result;
};
// 空间优化【❗将dp数组转换为基础类型，并不能优化，在leedcode中】
var numberOfArithmeticSlices = function (nums) {
    if (nums.length < 3) {
        return 0;
    }
    let pre = 0,
        result = 0;
    for (let i = 2; i < nums.length; i++) {
        if (nums[i] - nums[i - 1] == nums[i - 1] - nums[i - 2]) {
            pre = pre + 1;
            result += pre;
        } else {
            pre = 0;
        }
    }
    return result;
};
