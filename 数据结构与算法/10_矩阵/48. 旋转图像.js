/** 给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。
    你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。
*/

/** 
 * 示例 1：
    输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
    输出：[[7,4,1],[8,5,2],[9,6,3]]

 示例 2：
    输入：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
    输出：[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

示例 3：
    输入：matrix = [[1]]
    输出：[[1]]

示例 4：
    输入：matrix = [[1,2],[3,4]]
    输出：[[3,1],[4,2]]
  
*/
/**注意 ，偶数 和奇数，需要旋转的x，y范围不同 */
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
    let current = null,
        next = null,
        x,
        y,
        end = matrix[0].length - 1;
    if (matrix[0].length % 2 == 1) {
        x = Math.floor(matrix[0].length / 2);
        y = x + 1;
    } else {
        x = matrix[0].length / 2;
        y = matrix[0].length / 2;
    }
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            // 挪动第一个
            current = matrix[i][j];
            next = matrix[j][end - i];
            matrix[j][end - i] = current;
            // 挪动第二个
            current = next;
            next = matrix[end - i][end - j];
            matrix[end - i][end - j] = current;
            // 挪动第三个
            current = next;
            next = matrix[end - j][i];
            matrix[end - j][i] = current;
            // 挪动第四个
            current = next;
            next = matrix[i][j];
            matrix[i][j] = current;
        }
    }
    return matrix;
};
