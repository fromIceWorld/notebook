/**
 * 
 * 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
 * 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function (root, targetSum) {
    let result = 0;
    deep(root, 0, true);
    return result;
    function deep(node, sum, isFirst) {
        if (node) {
            let { val, left, right } = node;
            sum = val + sum;
            if (sum == targetSum) {
                result++;
            }
            deep(left, sum, false);
            deep(right, sum, false);
            // 以当前节点为起始
            if (isFirst) {
                deep(left, 0, true);
                deep(right, 0, true);
            }
        }
    }
};
// 前缀和
var pathSum = function (root, targetSum) {
    let map = new Map(),
        result = 0;
    deep(root, 0);
    return result;
    function deep(node, pre) {
        if (node) {
            map.set(pre, (map.get(pre) || 0) + 1);
            let { val, left, right } = node;
            let current = pre + val;
            result += map.get(current - targetSum) || 0;
            deep(left, current);
            deep(right, current);
            map.set(pre, map.get(pre) - 1);
        }
    }
};
