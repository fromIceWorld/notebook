/**
给你一个长度为 n 的整数数组 nums 和 一个目标值 target。请你从 nums 中选出三个整数，使它们的和与 target 最接近。
返回这三个数的和。
假定每组输入只存在恰好一个解。 


示例 1：

    输入：nums = [-1,2,1,-4], target = 1
    输出：2
    解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
示例 2：

    输入：nums = [0,0,0], target = 1
    输出：0
 

提示：

    3 <= nums.length <= 1000
    -1000 <= nums[i] <= 1000
    -104 <= target <= 104

 */

let source = [3, 6, 9, -3, -8, 0, 11, 8],
    cache = arr[0] + arr[1] + arr[2],
    target = 24,
    arr = source.sort((a, b) => a - b);
for (let i = 0, len = arr.length; i < len; i++) {
    let L = i + 1,
        R = len - 1;
    while (L < R) {
        let result = arr[i] + arr[L] + arr[R];
        if (target > result) {
            cache = Math.min(Math.abs(cache), Math.abs(target - result));
            L++;
        } else {
            cache = Math.min(Math.abs(cache), Math.abs(result - target));
            R--;
        }
    }
}
console.log(cache);
