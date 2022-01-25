/**
 * 
 * 给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果。

 * 
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function (nums) {
    let n = nums.length,
        set = new Set(nums),
        result = [];
    while (n > 0) {
        if (!set.has(n)) {
            result.push(n);
        }
    }
    return result;
};

// 不使用额外空间，时间复杂度为 O(n)
var findDisappearedNumbers = function (nums) {
    let result = [],
        len = nums.length;
    for (let i = 0; i < len; i++) {
        let current = nums[i] % (len + 1);
        nums[current - 1] += len + 1;
    }
    for (let i = 0; i < len; i++) {
        if (nums[i] <= len) {
            result.push(i + 1);
        }
    }
    return result;
};
