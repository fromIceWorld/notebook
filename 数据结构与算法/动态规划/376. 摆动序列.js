/**
 * 
 * 
 * 如果连续数字之间的差严格地在正数和负数之间交替，则数字序列称为 摆动序列 。第一个差（如果存在的话）可能是正数或负数。
 * 仅有一个元素或者含两个不等元素的序列也视作摆动序列。
 * 例如， [1, 7, 4, 9, 2, 5] 是一个 摆动序列 ，因为差值 (6, -3, 5, -7, 3) 是正负交替出现的。
 * 子序列 可以通过从原始序列中删除一些（也可以不删除）元素来获得，剩下的元素保持其原始顺序。
 * 给你一个整数数组 nums ，返回 nums 中作为 摆动序列 的 最长子序列的长度 。

 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var wiggleMaxLength = function (nums) {
    // 以某个元素为结尾的摆动序列
    // 上升，下降
    // 2种结果
    // dp[i][0] 以当前节点为降序点
    // dp[i][1] 以当前节点为升序点
    let result = 1,
        dp = Array.from(new Array(nums.length), () => new Array(2).fill(1));
    for (let i = 1; i < nums.length; i++) {
        dp[i][0] = 1;
        dp[i][1] = 1;
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i][1] = Math.max(dp[i][1], dp[j][0] + 1);
            } else if (nums[i] < nums[j]) {
                dp[i][0] = Math.max(dp[i][0], dp[j][1] + 1);
            }
            result = Math.max(dp[i][0], dp[i][1]);
        }
    }
    return result;
};
