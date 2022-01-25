// 给你一个整数数组 nums 和一个整数 k ，按以下方法修改该数组：

// 选择某个下标 i 并将 nums[i] 替换为 -nums[i] 。
// 重复这个过程恰好 k 次。可以多次选择同一个下标 i 。

// 以这种方式修改数组后，返回数组 可能的最大和 。

// 输入：nums = [4,2,3], k = 1
// 输出：5
// 解释：选择下标 1 ，nums 变为 [4,-2,3] 。

// 有负值，转换为正值
// 无负值，有0，直接返回和
// 无赋值，无0，看剩余转换次数为奇/偶; 偶数直接返回，奇数，转换一个最小值

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var largestSumAfterKNegations = function (nums, k) {
    nums.sort((a, b) => a - b);
    let less = 0,
        zero = 0,
        min = Infinity,
        minIndex = null;
    nums.forEach((num, index) => {
        if (num < 0) {
            // 确定绝对值最小值；
            if (min > -num) {
                min = -num;
                minIndex = index;
            }
            less++;
            if (k > 0) {
                nums[index] = -num;
                less--;
                k--;
            }
        } else if (num == 0) {
            zero++;
        } else {
            // 确定绝对值最小值；
            if (min > num) {
                min = num;
                minIndex = index;
            }
        }
    });
    if (k > 0) {
        if (zero == 0) {
            let c = k % 2;
            if (c == 1) {
                nums[minIndex] = -nums[minIndex];
            }
        }
    }
    return nums.reduce((a, b) => a + b, 0);
};
