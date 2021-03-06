// 全排列 [1,1,2], 避免产生重复的排列

// 回溯,剪纸
function combination(arr) {
    let result = [],
        used = [];
    arr.sort((a, b) => a - b);
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
    next('');
    return result;
}
