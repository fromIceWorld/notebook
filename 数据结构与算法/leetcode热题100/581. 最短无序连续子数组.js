/**
 * 
 * 给你一个整数数组 nums ，你需要找出一个 连续子数组 ，如果对这个子数组进行升序排序，那么整个数组都会变为升序排序。
 * 请你找出符合题意的 最短 子数组，并输出它的长度。

 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var findUnsortedSubarray = function (nums) {
    let cache = [...nums],
        sortArr = nums.sort((a, b) => a - b),
        i = 0,
        j = nums.length - 1,
        max = false,
        min = false;
    while (i <= nums.length - 1 && !max) {
        if (sortArr[i] == cache[i]) {
            i++;
        } else {
            max = true;
        }
    }
    while (j >= 0 && !min) {
        if (sortArr[j] == cache[j]) {
            j--;
        } else {
            min = true;
        }
    }
    return j >= i ? j - i + 1 : 0;
};
// 不用排序，求当前元素的左侧最大值与当前元素比较，取右侧最小值与当前元素比较，如果符合升序，不用动当前元素
var findUnsortedSubarray = function (nums) {
    let preMax = -Infinity,
        cache = new Array(nums.length);
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] >= preMax) {
            cache[i] = true;
            preMax = nums[i];
        } else {
            cache[i] = false;
        }
    }
    let postMin = Infinity;
    for (let i = nums.length - 1; i >= 0; i--) {
        if (nums[i] <= postMin) {
            cache[i] = cache[i] ? true : false;
            postMin = nums[i];
        } else {
            cache[i] = false;
        }
    }
    let from = 0,
        end = nums.length - 1;
    while (cache[from]) {
        from++;
    }
    while (cache[end]) {
        end--;
    }
    return end >= from ? end - from + 1 : 0;
};
// 优化空间，👆，不用缓存，直接找无序索引
//               👇
// 从左往右，找到比左边最大值还小的最右下标，从右往左，找到比右边最小值还大的最左下标
var findUnsortedSubarray = function (nums) {
    let max = -Infinity,
        min = Infinity,
        left,
        right;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < max) {
            right = i;
        } else {
            max = nums[i];
        }
    }
    for (let i = nums.length - 1; i >= 0; i--) {
        if (nums[i] > min) {
            left = i;
        } else {
            min = nums[i];
        }
    }
    return right >= left ? right - left + 1 : 0;
};
// 【官方解】
var findUnsortedSubarray = function (nums) {
    let max = -Infinity,
        min = Infinity,
        n = nums.length,
        left,
        right;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < max) {
            right = i;
        } else {
            max = nums[i];
        }
        if (min < nums[n - i - 1]) {
            left = n - i - 1;
        } else {
            min = nums[n - i - 1];
        }
    }
    return right == -1 ? 0 : right - left + 1;
};
