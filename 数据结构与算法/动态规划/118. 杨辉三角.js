/**
 *
 * 给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。
 * 在「杨辉三角」中，每个数是它左上方和右上方的数的和。
 */

/**
 * 
示例 1:
    输入: numRows = 5
    输出: [ [1],
          [1,1],
         [1,2,1],
        [1,3,3,1],
       [1,4,6,4,1]]

示例 2:
    输入: numRows = 1
    输出: [[1]]
 */

/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function (numRows) {
    let result = [[1]];
    for (let i = 2; i <= numRows; i++) {
        let next = [];
        for (let j = 0; j < i; j++) {
            if (j == 0 || j == i - 1) {
                next.push(1);
            } else {
                next.push(result[i - 2][j - 1] + result[i - 2][j]);
            }
        }
        result.push(next);
    }
    return result;
};
