// 冬季已经来临。 你的任务是设计一个有固定加热半径的供暖器向所有房屋供暖。

// 在加热器的加热半径范围内的每个房屋都可以获得供暖。

// 现在，给出位于一条水平线上的房屋 houses 和供暖器 heaters 的位置，请你找出并返回可以覆盖所有房屋的最小加热半径。

// 说明：所有供暖器都遵循你的半径标准，加热的半径也一样。
// 示例 1:

// 输入: houses = [1,2,3], heaters = [2]
// 输出: 1
// 解释: 仅在位置2上有一个供暖器。如果我们将加热半径设为1，那么所有房屋就都能得到供暖。

/**
 * @param {number[]} houses
 * @param {number[]} heaters
 * @return {number}
 */
//  查找离房屋【左/右】最近的两个供暖设备
var findRadius = function (houses, heaters) {
    // 排序
    heaters.sort((a, b) => a - b);

    let result = -Infinity;
    for (let value of houses) {
        const i = getLeft(heaters, value);
        const j = i + 1;
        const left = i < 0 ? Number.MAX_VALUE : value - heaters[i];
        const right =
            j >= heaters.length ? Number.MAX_VALUE : heaters[j] - value;
        const cur = Math.min(left, right);
        result = Math.max(result, cur);
    }
    return result;
    function getLeft(nums, target) {
        let left = 0,
            right = nums.length - 1;
        if (nums[left] > target) {
            return -1;
        }
        while (left < right) {
            const mid = Math.floor((right - left + 1) / 2) + left;
            if (nums[mid] > target) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }
        return left;
    }
};
