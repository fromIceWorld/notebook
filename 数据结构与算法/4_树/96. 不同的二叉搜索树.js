/**
 * 给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？
 * 返回满足题意的二叉搜索树的种数。
 *
 * */

/**
 * 【二叉搜索树：左节点 <= 中间节点；中间节点 <= 右节点】
 */
/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function (n) {
    let cache = [1, 1];
    return f(n);
    function f(count) {
        if (cache[count] == undefined) {
            let num = 0;
            if (count == 1) {
                num = 1;
            } else if (count <= 0) {
                num = 0;
            } else {
                for (let i = 0; i < count; i++) {
                    num = num + f(i) * f(count - 1 - i);
                }
            }
            cache[count] = num;
            return num;
        } else {
            return cache[count];
        }
    }
};
