/**
 * 
 * 给你一个整数数组 nums 和一个整数 target 。向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：
 * 例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
 * 返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。

 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
    let len = nums.length,
        result = 0;
    deep(0, 0);
    return result;
    function deep(index, preSum) {
        if (index == len) {
            if (preSum == target) {
                result++;
            }
        } else {
            deep(index + 1, preSum + nums[index]);
            deep(index + 1, preSum - nums[index]);
        }
    }
};
