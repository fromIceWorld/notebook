/** 
 *  整数数组 nums 按升序排列，数组中的值 互不相同 。
    在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，
    使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。
    例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。
    给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
*/

/** 
 * 
 示例 1：
    输入：nums = [4,5,6,7,0,1,2], target = 0
    输出：4

示例 2：
    输入：nums = [4,5,6,7,0,1,2], target = 3
    输出：-1

示例 3：
    输入：nums = [1], target = 0
    输出：-1
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    let result = -1;
    deep(0, nums.length - 1);
    return result;
    function deep(from, end) {
        if (from < end) {
            let mid = Math.floor((from + end) / 2);
            if (nums[mid] == target) {
                result = mid;
                return;
            } else {
                let leftSort = isNormal(from, mid - 1),
                    rightSort = isNormal(mid + 1, end);
                if (leftSort) {
                    if (nums[from] <= target && nums[mid - 1] >= target) {
                        deep(from, mid - 1);
                    } else {
                        if (rightSort) {
                            if (
                                nums[mid + 1] <= target &&
                                nums[end] >= target
                            ) {
                                deep(mid + 1, end);
                            }
                        } else {
                            deep(mid + 1, end);
                        }
                    }
                } else {
                    if (nums[mid + 1] <= target && nums[end] >= target) {
                        deep(mid + 1, end);
                    } else {
                        deep(from, mid - 1);
                    }
                }
            }
        } else if (from == end) {
            result = nums[from] == target ? from : -1;
        }
    }
    function isNormal(i, j) {
        if (i <= j) {
            return nums[i] <= nums[j];
        } else {
            return false;
        }
    }
};
// 指针，非递归
var search = function (nums, target) {
    let left = 0,
        right = nums.length - 1,
        mid;
    while (left <= right) {
        mid = (left + right) >> 1;
        if (nums[mid] == target) {
            return mid;
        }
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && nums[mid] >= target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid + 1] <= target && nums[right] >= target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
};
