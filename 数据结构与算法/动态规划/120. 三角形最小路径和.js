/**
 *
 * 给定一个三角形 triangle ，找出自顶向下的最小路径和。
 * 每一步只能移动到下一行中相邻的结点上。
 * 相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。
 * 也就是说，如果正位于当前行的下标 i ，那么下一步可以移动到下一行的下标 i 或 i + 1 。
 *
 */

/**
 * 
 * 示例 1：

    输入：triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
    输出：11
    解释：如下面简图所示：
    2
    3 4
    6 5 7
    4 1 8 3
    自顶向下的最小路径和为 11（即，2 + 3 + 5 + 1 = 11）。
 * 
 */

/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function (triangle) {
    if (triangle.length == 1) {
        return triangle[0][0];
    }
    let result = Infinity;
    for (let i = 1; i < triangle.length; i++) {
        for (let j = 0; j < triangle[i].length; j++) {
            triangle[i][j] =
                triangle[i][j] +
                Math.min(
                    triangle[i - 1][j - 1] == undefined
                        ? Infinity
                        : triangle[i - 1][j - 1],
                    triangle[i - 1][j] == undefined
                        ? Infinity
                        : triangle[i - 1][j]
                );
            if (i == triangle.length - 1) {
                result = Math.min(result, triangle[i][j]);
            }
        }
    }
    return result;
};
