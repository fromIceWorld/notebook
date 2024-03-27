/**给定一个不含重复字符的字符串 ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。 */

/**
示例 1：
    输入：nums = [1,2,3]
    输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

示例 2：
    输入：nums = [0,1]
    输出：[[0,1],[1,0]]

示例 3：
    输入：nums = [1]
    输出：[[1]]

 */
// 剪枝 去重
var permutation = function (S) {
    let result = [],
        targetHas = new Array(S.length).fill(false);
    // 字符排序，为剪枝做准备
    S = S.split('').sort((a, b) => (a > b ? 1 : -1));
    deep([]);
    return Array.from(result);
    function deep(arr) {
        if (arr.length == S.length) {
            result.push(arr);
            return;
        }
        for (let i = 0; i < S.length; i++) {
            // 剪枝，剪去相同的分支逻辑
            if (i > 0 && S[i] == S[i - 1] && targetHas[i - 1]) {
                continue;
            }
            if (!targetHas[i]) {
                arr += S[i];
                targetHas[i] = true;
                deep(arr);
                targetHas[i] = false;
                arr = arr.substring(0, arr.length - 1);
            }
        }
    }
};

function all(nums) {
    let cache = new Array(nums.length).fill(false),
        result = [];
    dfs([]);
    return result;
    function dfs(arr) {
        if (arr.length == nums.length) {
            result.push(arr);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (!cache[i]) {
                cache[i] = true;
                dfs([...arr, nums[i]]);
                cache[i] = false;
            }
        }
    }
}
