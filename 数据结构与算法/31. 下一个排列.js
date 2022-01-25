/**
 * 
 * 
 * 实现获取 下一个排列 的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列（即，组合出下一个更大的整数）。
 * 如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。
 * 必须 原地 修改，只允许使用额外常数空间。


 */

/**
 * 
示例 1：
    输入：nums = [1,2,3]
    输出：[1,3,2]

示例 2：
    输入：nums = [3,2,1]
    输出：[1,2,3]

示例 3：
    输入：nums = [1,1,5]
    输出：[1,5,1]

示例 4：
    输入：nums = [1]
    输出：[1]
示例 5：
    输入：nums = [4,2,0,2,3,2,0]
    输出:[4,2,0,3,0,2,2]

 * 
 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function (nums) {
    let change,
        index = nums.length - 1;
    // 寻找转折点
    while (change == undefined && index >= 1) {
        if (nums[index] > nums[index - 1]) {
            change = index - 1;
        }
        index--;
    }

    // 将剩余数排序
    if (change !== undefined) {
        // 在降序列表种，找到下一个更大的值
        let next = change + 1;
        for (let i = change + 2; i < nums.length; i++) {
            if (nums[i] > nums[change]) {
                next = i;
            } else {
                break;
            }
        }
        // 交换 转折点 和 更大值
        let cache = nums[change];
        nums[change] = nums[next];
        nums[next] = cache;
        for (let i = change + 1, end = nums.length; i < end; end--) {
            for (let j = i; j < end; j++) {
                if (nums[j] > nums[j + 1]) {
                    let cache = nums[j];
                    nums[j] = nums[j + 1];
                    nums[j + 1] = cache;
                }
            }
        }
        return nums;
    } else {
        return nums.sort((a, b) => a - b);
    }
};
