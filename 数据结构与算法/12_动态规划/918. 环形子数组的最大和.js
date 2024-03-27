/**
 * 
 * 给定一个由整数数组 A 表示的环形数组 C，求 C 的非空子数组的最大可能和。
 * 在此处，环形数组意味着数组的末端将会与开头相连呈环状。
 * 
 * （形式上，当0 <= i < A.length 时 C[i] = A[i]，且当 i >= 0 时 C[i+A.length] = C[i]）
 * 
 * 此外，子数组最多只能包含固定缓冲区 A 中的每个元素一次。（形式上，对于子数组 C[i], C[i+1], ..., C[j]
 * 不存在 i <= k1, k2 <= j 其中 k1 % A.length = k2 % A.length）

 */

/**
 * 
 * 
示例 1：
    输入：[1,-2,3,-2]
    输出：3
    解释：从子数组 [3] 得到最大和 3

示例 2：
    输入：[5,-3,5]
    输出：10
    解释：从子数组 [5,5] 得到最大和 5 + 5 = 10

示例 3：
    输入：[3,-1,2,-1]
    输出：4
    解释：从子数组 [2,-1,3] 得到最大和 2 + (-1) + 3 = 4

示例 4：
    输入：[3,-2,2,-3]
    输出：3
    解释：从子数组 [3] 和 [3,-2,2] 都可以得到最大和 3

示例 5：
    输入：[-2,-3,-1]
    输出：-1
    解释：从子数组 [-1] 得到最大和 -1

 */

/**
 * 分情况讨论：
 *   1. 数组和在中间 【正常解法】
 *   2. 数组在尾部 + 首部【中间就是最小值，负， 子数组和就是数组和 - 中间值】
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubarraySumCircular = function (nums) {
    // 1.
    let pre = 0,
        total = 0,
        result = -Infinity;
    for (let i = 0; i < nums.length; i++) {
        total += nums[i];
        pre = Math.max(nums[i], pre + nums[i]);
        result = Math.max(result, pre);
    }
    // 数组值都为负
    if (result < 0) {
        return result;
    }
    // 2.
    let pre2 = 0,
        result2 = Infinity;
    for (let i = 0; i < nums.length; i++) {
        pre2 = Math.min(nums[i], pre2 + nums[i]);
        result2 = Math.min(result2, pre2);
    }
    return Math.max(result, total - result2);
};
