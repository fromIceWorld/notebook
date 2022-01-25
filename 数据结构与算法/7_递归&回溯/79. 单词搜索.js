/**
 * 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
   单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

*/

/**
 * 
 * 
示例 1：
    输入：board = [["A","B","C","E"],
                  ["S","F","C","S"],
                  ["A","D","E","E"]], word = "ABCCED"
    输出：true

 */

/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    let set = new Set(),
        result = false;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] == word[0]) {
                set.add(`${i},${j}`);
                find(i, j, 1);
                set.clear();
            }
        }
    }
    return result;
    function find(x, y, index) {
        if (index == word.length) {
            result = true;
            return;
        } else {
            let w = word[index];
            if (
                x - 1 >= 0 &&
                !set.has(`${x - 1},${y}`) &&
                board[x - 1][y] == w
            ) {
                set.add(`${x - 1},${y}`);
                find(x - 1, y, index + 1);
                set.delete(`${x - 1},${y}`);
            }
            if (
                x + 1 < board.length &&
                !set.has(`${x + 1},${y}`) &&
                board[x + 1][y] == w
            ) {
                set.add(`${x + 1},${y}`);
                find(x + 1, y, index + 1);
                set.delete(`${x + 1},${y}`);
            }
            if (
                y - 1 >= 0 &&
                !set.has(`${x},${y - 1}`) &&
                board[x][y - 1] == w
            ) {
                set.add(`${x},${y - 1}`);
                find(x, y - 1, index + 1);
                set.delete(`${x},${y - 1}`);
            }
            if (
                y + 1 < board[0].length &&
                !set.has(`${x},${y + 1}`) &&
                board[x][y + 1] == w
            ) {
                set.add(`${x},${y + 1}`);
                find(x, y + 1, index + 1);
                set.delete(`${x},${y + 1}`);
            }
        }
    }
};
