/**
 * 给你一个整数数组 nums 和一个整数 k ，请你统计并返回该数组中和为 k 的连续子数组的个数。
 */
/**
 * 示例 1：
    输入：nums = [1,1,1], k = 2
    输出：2

示例 2：
    输入：nums = [1,2,3], k = 3
    输出：2
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
    // 保存前缀和
    let pre = [],
        set = new Map(),
        count = 0;
    for (let i = 0, len = nums.length; i < len; i++) {
        if (i == 0) {
            pre[i] = nums[i];
        } else {
            pre[i] = pre[i - 1] + nums[i];
        }
        if (pre[i] == k) {
            count++;
        }
        if (set.has(pre[i] - k)) {
            let n = set.get(pre[i] - k);
            count += n;
        }
        if (set.has(pre[i])) {
            let n = set.get(pre[i]);
            set.set(pre[i], n + 1);
        } else {
            set.set(pre[i], 1);
        }
    }
    return count;
};
