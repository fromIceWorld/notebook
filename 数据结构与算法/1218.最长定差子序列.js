// 给你一个整数数组 arr 和一个整数 difference，请你找出并返回 arr 中最长等差子序列的长度，该子序列中相邻元素之间的差等于 difference 。
// 子序列 是指在不改变其余元素顺序的情况下，通过删除一些元素或不删除任何元素而从 arr 派生出来的序列。

/**
 * @param {number[]} arr
 * @param {number} difference
 * @return {number}
 */
var longestSubsequence = function (arr, difference) {
    if (difference.length > 0) {
        let max = 1;
        let keyMapCount = new Map();
        for (let key in arr) {
            let count = keyMapCount.get(arr[key] - difference);
            if (count) {
                max = Math.max(max, count + 1);
                keyMapCount.set(arr[key], count + 1);
            } else {
                keyMapCount.set(arr[key], 1);
            }
        }
        return max;
    } else {
        return 0;
    }
};
