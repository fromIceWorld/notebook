/**
给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。
数组中的每个元素代表你在该位置可以跳跃的最大长度。
判断你是否能够到达最后一个下标。
 */
var canJump = function (nums) {
    let max = 0,
        end = nums.length - 1;
    for (let i = 0; i < end; i++) {
        if (i <= max) {
            max = Math.max(i + nums[i], max);
        } else {
            return false;
        }
    }
    return max >= end;
};
