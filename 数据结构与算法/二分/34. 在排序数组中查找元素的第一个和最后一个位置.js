/**
 * 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
   如果数组中不存在目标值 target，返回 [-1, -1]。

进阶：
    你可以设计并实现时间复杂度为 O(log n) 的算法解决此问题吗？
*/

/**
 * 
示例 1：
    输入：nums = [5,7,7,8,8,10], target = 8
    输出：[3,4]

示例 2：
    输入：nums = [5,7,7,8,8,10], target = 6
    输出：[-1,-1]

示例 3：
    输入：nums = [], target = 0
    输出：[-1,-1]


 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
    let result = [-1, -1];
    deep(0, nums.length - 1);
    return result;
    function deep(from, end) {
        while (from <= end) {
            let mid = (from + end) >> 1;
            if (nums[mid] == target) {
                if (result[0] == -1) {
                    result[0] = mid;
                    result[1] = mid;
                } else {
                    result[0] = Math.min(mid, result[0]);
                    result[1] = Math.max(mid, result[1]);
                }
                deep(from, mid - 1);
                deep(mid + 1, end);
                break;
            } else if (nums[mid] > target) {
                end = mid - 1;
            } else {
                from = mid + 1;
            }
        }
    }
};
