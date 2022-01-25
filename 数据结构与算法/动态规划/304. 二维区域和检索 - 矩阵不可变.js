/**
 * 
 * 给定一个二维矩阵 matrix，以下类型的多个请求：
 * 计算其子矩形范围内元素的总和，该子矩阵的 左上角 为 (row1, col1) ，右下角 为 (row2, col2) 。
 * 实现 NumMatrix 类：

    NumMatrix(int[][] matrix) 给定整数矩阵 matrix 进行初始化
    int sumRegion(int row1, int col1, int row2, int col2) 返回 左上角 (row1, col1) 、右下角 (row2, col2) 所描述的子矩阵的元素 总和 。

 */

// ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗
// ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗
// ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗【使用前缀和】❗❗❗❗❗❗❗
// ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗
// ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗

/**
 * @param {number[][]} matrix
 */
var NumMatrix = function (matrix) {
    this.matrix = matrix;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (i == 0 && j == 0) {
                continue;
            } else if (i == 0) {
                matrix[i][j] = matrix[i][j - 1] + matrix[i][j];
                continue;
            } else if (j == 0) {
                matrix[i][j] = matrix[i - 1][j] + matrix[i][j];
            } else {
                matrix[i][j] =
                    matrix[i - 1][j] +
                    matrix[i][j - 1] -
                    matrix[i - 1][j - 1] +
                    matrix[i][j];
            }
        }
    }
};

/**
 * @param {number} row1
 * @param {number} col1
 * @param {number} row2
 * @param {number} col2
 * @return {number}
 */
NumMatrix.prototype.sumRegion = function (row1, col1, row2, col2) {
    if (row1 == 0 || col1 == 0) {
        if (row1 == 0 && col1 !== 0) {
            return this.matrix[row2][col2] - this.matrix[row2][col1 - 1];
        }
        if (col1 == 0 && row1 !== 0) {
            return this.matrix[row2][col2] - this.matrix[row1 - 1][col2];
        }
        return this.matrix[row2][col2];
    } else {
        return (
            this.matrix[row2][col2] -
            this.matrix[row2][col1 - 1] -
            this.matrix[row1 - 1][col2] +
            this.matrix[row1 - 1][col1 - 1]
        );
    }
};

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
