/**
 *
 * 在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。
 */

/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function (matrix) {
    let result = -Infinity;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (i == 0 || j == 0) {
                if (result !== 1) {
                    result = Math.max(result, matrix[i][j]);
                } else {
                    continue;
                }
            } else {
                if (matrix[i][j] == 1) {
                    matrix[i][j] =
                        Math.min(
                            matrix[i - 1][j - 1],
                            matrix[i - 1][j],
                            matrix[i][j - 1]
                        ) + 1;
                    result = Math.max(result, matrix[i][j] * matrix[i][j]);
                }
            }
        }
    }
    return result;
};
