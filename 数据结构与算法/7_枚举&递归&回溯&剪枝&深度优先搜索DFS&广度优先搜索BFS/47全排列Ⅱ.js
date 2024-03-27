// 给定一个可包含重复数字的整数集合 nums ，按任意顺序 返回它所有不重复的全排列。

/**
 * 
 *示例 1：

    输入：nums = [1,1,2]
    输出：
        [[1,1,2],
        [1,2,1],
        [2,1,1]]
示例 2：

    输入：nums = [1,2,3]
    输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 */

// 回溯,剪纸
function combination(arr) {
    let result = [],
        used = [];
    arr.sort((a, b) => a - b);
    next('');
    return result;
    function next(str) {
        if (str.length == arr.length) {
            result.push(str);
        }
        for (let index in arr) {
            if (used[index]) {
                continue;
            }
            if (
                index - 1 >= 0 &&
                arr[index] == arr[index - 1] &&
                used[index - 1]
            ) {
                continue;
            }
            used[index] = true;
            next(str + arr[index]);
            used[index] = false;
        }
    }
}
