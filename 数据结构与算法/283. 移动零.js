/**
 * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

示例:

    输入: [0,1,0,3,12]
    输出: [1,3,12,0,0]
说明:

必须在原数组上操作，不能拷贝额外的数组。
尽量减少操作次数。

。
 */
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
    // 存储0 的位置
    let cache = [];
    for (let i = 0, len = nums.length; i < len; i++) {
        if (nums[i] == 0) {
            cache.push(i);
        } else {
            if (cache.length) {
                let index = cache.shift();
                nums[index] = nums[i];
                nums[i] = 0;
                cache.push(i);
            }
        }
    }
    return nums;
};
