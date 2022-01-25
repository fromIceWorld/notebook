/**
 *
 * 你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都 围成一圈 ，
 * 这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 。
 * 给定一个代表每个房屋存放金额的非负整数数组，计算你 在不触动警报装置的情况下 ，今晚能够偷窃到的最高金额。
 *
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
    if (nums.length == 1) {
        return nums[0];
    }
    let result = -Infinity;
    let dp = Array.from(new Array(nums.length), () => new Array(2));
    // 0-n-1
    dp[0][0] = 0;
    dp[0][1] = nums[0];
    for (let i = 1; i < nums.length - 1; i++) {
        dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1]);
        dp[i][1] = dp[i - 1][0] + nums[i];
    }
    result = Math.max(dp[nums.length - 2][0], dp[nums.length - 2][1]);
    // 1-n;
    dp[1][0] = 0;
    dp[1][1] = nums[1];
    for (let i = 2; i < nums.length; i++) {
        dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1]);
        dp[i][1] = dp[i - 1][0] + nums[i];
    }
    result = Math.max(result, dp[nums.length - 1][0], dp[nums.length - 1][1]);
    return result;
};
