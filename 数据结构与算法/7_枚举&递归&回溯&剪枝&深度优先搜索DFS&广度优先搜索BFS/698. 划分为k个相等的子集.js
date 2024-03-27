/**
 * 给定一个整数数组  nums 和一个正整数 k，找出是否有可能把这个数组分成 k 个非空子集，其总和都相等
 */
/**
 * 示例 1：

    输入： nums = [4, 3, 2, 3, 5, 2, 1], k = 4
    输出： True
    说明： 有可能将其分成 4 个子集（5），（1,4），（2,3），（2,3）等于总和。
示例 2:

    输入: nums = [1,2,3,4], k = 3
    输出: false
 

提示：

    1 <= k <= len(nums) <= 16
    0 < nums[i] < 10000
    每个元素的频率在 [1,4] 范围内
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var canPartitionKSubsets = function (nums, k) {
    if (nums.length < k) {
        return false;
    }
    nums.sort((a, b) => b - a);
    let sum = nums.reduce((pre, cur) => pre + cur);
    if (sum % k !== 0) {
        return false;
    }
    let target = sum / k,
        dp = new Array(k).fill(0);
    function dfs(index) {
        if (index == nums.length) {
            return true;
        }
        for (let i = 0; i < dp.length; i++) {
            if (dp[i] + nums[index] > target) {
                continue;
            }
            dp[i] += nums[index];
            if (dfs(index + 1)) {
                return true;
            }
            dp[i] -= nums[index];
        }
        return false;
    }
    return dfs(0);
};
