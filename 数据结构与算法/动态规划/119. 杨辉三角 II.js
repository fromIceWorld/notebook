/**
 *
 * 给定一个非负索引 rowIndex，返回「杨辉三角」的第 rowIndex 行。
 * 在「杨辉三角」中，每个数是它左上方和右上方的数的和。
 */

/**
 * @param {number} rowIndex
 * @return {number[]}
 */
var getRow = function (rowIndex) {
    let result = [[1]];
    for (let i = 2; i <= rowIndex + 1; i++) {
        let next = [];
        for (let j = 0; j < i; j++) {
            if (j == 0 || j == i - 1) {
                next.push(1);
            } else {
                next.push(result[j - 1] + result[j]);
            }
        }
        result = next;
    }
    return result;
};
