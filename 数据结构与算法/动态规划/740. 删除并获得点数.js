/**
 * 
 * 给你一个整数数组 nums ，你可以对它进行一些操作。
 * 每次操作中，选择任意一个 nums[i] ，删除它并获得 nums[i] 的点数。之后，你必须删除 所有 等于 nums[i] - 1 和 nums[i] + 1 的元素。
 * 开始你拥有 0 个点数。返回你能通过这些操作获得的最大点数。

 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var deleteAndEarn = function (nums) {
    nums.sort((a, b) => a - b);
    let dp = Array.from(new Array(nums.length), () => new Array(2));
    dp[0][0] = 0;
    dp[0][1] = nums[0];
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) {
            dp[i][0] = dp[i - 1][0];
            dp[i][1] = dp[i - 1][1] + nums[i];
        } else if (nums[i] - nums[i - 1] == 1) {
            dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1]);
            dp[i][1] = dp[i - 1][0] + nums[i];
        } else {
            dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1]);
            dp[i][1] = Math.max(dp[i - 1][0], dp[i - 1][1]) + nums[i];
        }
    }
    return Math.max(dp[nums.length - 1][0], dp[nums.length - 1][1]);
};
