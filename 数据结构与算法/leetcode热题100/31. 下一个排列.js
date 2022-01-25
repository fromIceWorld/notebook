/**
 * 
 * 实现获取 下一个排列 的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列（即，组合出下一个更大的整数）。
 * 如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。
 * 必须 原地 修改，只允许使用额外常数空间。

 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function (nums) {
    let change,
        index = nums.length - 1;
    // ①寻找转折点
    while (change == undefined && index >= 1) {
        if (nums[index] > nums[index - 1]) {
            change = index - 1;
        }
        index--;
    }
    if (change !== undefined) {
        // ②在降序列表种，找到下一个更大的值
        let next = change + 1;
        for (let i = change + 2; i < nums.length; i++) {
            if (nums[i] > nums[change]) {
                next = i;
            } else {
                break;
            }
        }
        // ③交换 转折点 和 更大值
        let cache = nums[change];
        nums[change] = nums[next];
        nums[next] = cache;
        let i = change + 1,
            j = nums.length - 1;
        while (i <= j) {
            if (i == j) {
                break;
            } else {
                let mid = nums[i];
                nums[i] = nums[j];
                nums[j] = mid;
            }
            i++;
            j--;
        }
        return nums;
    } else {
        return nums.sort((a, b) => a - b);
    }
};
// 优化👆【③】降序种寻找一个比①值更大的数进行了交换，因此交换完毕的剩余队列是降序的，直接翻转就可以了，不必进行排序
// 因为我们在
