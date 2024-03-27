/**
 * 
 * 给你一个整数数组 nums 和一个整数 k ，判断数组中是否存在两个 不同的索引 i 和 j ，
 * 满足 nums[i] == nums[j] 且 abs(i - j) <= k 。如果存在，返回 true ；否则，返回 false 。

 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function (nums, k) {
    let map = new Map(),
        result = false;
    for (let i = 0; i < nums.length; i++) {
        let value = map.get(nums[i]);
        if (value !== undefined) {
            if (i - value <= k) {
                result = true;
                break;
            } else {
                map.set(nums[i], i);
            }
        } else {
            map.set(nums[i], i);
        }
    }
    return result;
};
