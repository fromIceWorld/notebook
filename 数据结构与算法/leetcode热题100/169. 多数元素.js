/**
 * 
 * 给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。
 * 你可以假设数组是非空的，并且给定的数组总是存在多数元素。

 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
    if (nums.length == 1) {
        return nums[0];
    }
    let map = new Map(),
        n = nums.length;
    for (let i = 0; i < n; i++) {
        let count = map.get(nums[i]);
        if (count) {
            count++;
            if (count > n / 2) {
                return nums[i];
            }
            map.set(nums[i], count);
        } else {
            map.set(nums[i], 1);
        }
    }
    return -1;
};
