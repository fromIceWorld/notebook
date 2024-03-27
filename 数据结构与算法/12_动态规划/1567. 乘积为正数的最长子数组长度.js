/**
 * 
 * 给你一个整数数组 nums ，请你求出乘积为正数的最长子数组的长度。
 * 一个数组的子数组是由原数组中零个或者更多个连续数字组成的数组。
 * 请你返回乘积为正数的最长子数组长度。

 */

/**
 * 
示例  1：
    输入：nums = [1,-2,-3,4]
    输出：4
    解释：数组本身乘积就是正数，值为 24 。

示例 2：
    输入：nums = [0,1,-2,-3,-4]
    输出：3
    解释：最长乘积为正数的子数组为 [1,-2,-3] ，乘积为 6 。
    注意，我们不能把 0 也包括到子数组中，因为这样乘积为 0 ，不是正数。

示例 3：
    输入：nums = [-1,-2,-3,0,1]
    输出：2
    解释：乘积为正数的最长子数组是 [-1,-2] 或者 [-2,-3] 。

示例 4：
    输入：nums = [-1,2]
    输出：1


 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var getMaxLen = function (nums) {
    let dp = Array.from(new Array(nums.length + 1), () =>
            new Array(nums.length + 1).fill(1)
        ),
        result = 0;
    for (let i = 1; i <= nums.length; i++) {
        for (let j = i; j <= nums.length; j++) {
            if (nums[j - 1] == 0) {
                dp[i][j] = 0;
            } else {
                dp[i][j] = dp[i][j - 1] * nums[j - 1];
                if (dp[i][j] > 0) {
                    result = Math.max(result, j - i + 1);
                }
            }
        }
    }
    return result;
};
// 👆，数据多时，内存不够
var getMaxLen = function (nums) {
    let pre = 0,
        result = 0;
    for (let i = 0; i < nums.length; i++) {
        pre = 0;
        if (nums[i] == 0) {
            continue;
        }
        for (let j = i; j < nums.length; j++) {
            if (nums[j] == 0) {
                break;
            }
            if (pre == 0) {
                pre = nums[j];
            } else {
                pre = pre * nums[j];
            }
            if (pre > 0) {
                result = Math.max(result, j - i + 1);
            }
        }
    }
    return result;
};
// 👆，超出时间限制
var getMaxLen = function (nums) {
    // max 乘积为正数的以i为结尾子数组的长度
    // min 乘积为负数的以i为结尾子数组的长度
    let max = [],
        min = [],
        result = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i == 0) {
            max[i] = nums[i] > 0 ? 1 : 0;
            min[i] = nums[i] < 0 ? 1 : 0;
        } else {
            if (nums[i] > 0) {
                max[i] = max[i - 1] + 1;
                min[i] = min[i - 1] > 0 ? min[i - 1] + 1 : 0;
            } else if (nums[i] < 0) {
                max[i] = min[i - 1] > 0 ? min[i - 1] + 1 : 0;
                min[i] = max[i - 1] + 1;
            } else {
                max[i] = 0;
                min[i] = 0;
            }
        }
        result = Math.max(result, max[i]);
    }
    return result;
};
// 优化 空间
var getMaxLen = function (nums) {
    // max 乘积为正数的以i为结尾子数组的长度
    // min 乘积为负数的以i为结尾子数组的长度
    let positive,
        negative,
        result = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i == 0) {
            positive = nums[i] > 0 ? 1 : 0;
            negative = nums[i] < 0 ? 1 : 0;
        } else {
            if (nums[i] > 0) {
                positive = positive + 1;
                negative = negative > 0 ? negative + 1 : 0;
            } else if (nums[i] < 0) {
                let nextPositive, nextNegative;
                nextPositive = negative > 0 ? negative + 1 : 0;
                nextNegative = positive + 1;
                positive = nextPositive;
                negative = nextNegative;
            } else {
                positive = 0;
                negative = 0;
            }
        }
        result = Math.max(result, positive);
    }
    return result;
};
