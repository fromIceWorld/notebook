/**
 * 
 * 给你一个 m x n 的矩阵 mat 和一个整数 k ，请你返回一个矩阵 answer ，其中每个 answer[i][j] 是所有满足下述条件的元素 mat[r][c] 的和： 
    i - k <= r <= i + k,
    j - k <= c <= j + k 且
    (r, c) 在矩阵内。

 */

/**
 * @param {number[][]} mat
 * @param {number} k
 * @return {number[][]}
 */
var matrixBlockSum = function (mat, k) {
    let result = Array.from(new Array(mat.length), () =>
        new Array(mat[0].length).fill(0)
    );
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[0].length; j++) {
            result[i][j] = getArea(i, j);
        }
    }
    return result;
    function getArea(x, y) {
        let sum = 0;
        for (
            let i = Math.max(x - k, 0);
            i < Math.min(x + k + 1, mat.length);
            i++
        ) {
            for (
                let j = Math.max(y - k, 0);
                j < Math.min(y + k + 1, mat[0].length);
                j++
            ) {
                sum += mat[i][j];
            }
        }
        return sum;
    }
};
// 官方解：二维前缀和
