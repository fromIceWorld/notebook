/**
 * 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，
 * 使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
 * 注意：答案中不可以包含重复的三元组。
 */

/**
 * 示例 1：

    输入：nums = [-1,0,1,2,-1,-4]
    输出：[[-1,-1,2],[-1,0,1]]
示例 2：

    输入：nums = []
    输出：[]
示例 3：

    输入：nums = [0]
    输出：[]
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
    let result = [];
    if (nums.length < 3) {
        return result;
    }
    nums.sort((a, b) => a - b);
    for (let i = 0, len = nums.length - 2; i < len; i++) {
        // 去重
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }
        // left >0 结果不会等于0
        if (nums[i] > 0) {
            break;
        }
        let mid = i + 1,
            right = nums.length - 1;
        while (mid < right) {
            let sum = nums[i] + nums[mid] + nums[right];
            if (sum == 0) {
                result.push([nums[i], nums[mid], nums[right]]);
                while (mid < right && nums[mid] == nums[mid + 1]) {
                    mid++;
                }
                while (mid < right && nums[right] == nums[right - 1]) {
                    right--;
                }
                mid++;
                right--;
            } else if (sum < 0) {
                mid++;
            } else {
                right--;
            }
        }
    }
    return result;
};
