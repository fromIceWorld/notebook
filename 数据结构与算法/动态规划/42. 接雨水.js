/**
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
 *
 */

/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
    let box = [],
        left,
        right,
        result = 0;
    for (let i = 0; i < height.length; i++) {
        if (left == undefined) {
            left = height[i];
            box[i] = left;
            continue;
        }
        if (height[i] > left) {
            left = height[i];
        }
        box[i] = left;
    }
    for (let i = height.length - 1; i >= 0; i--) {
        if (right == undefined) {
            right = height[i];
            box[i] = Math.min(right, box[i]);
            continue;
        }
        if (height[i] > right) {
            right = height[i];
        }
        box[i] = Math.min(right, box[i]);
        result += box[i] - height[i];
    }
    return result;
};
