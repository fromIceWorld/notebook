/**
 * 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）
 */
/**
 *
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
 * @return {number[][]}
 */
var levelOrder = function (root) {
    let result = [];
    deep(root, 0);
    return result;
    function deep(node, n) {
        if (node) {
            if (result[n]) {
                result[n].push(node.val);
            } else {
                result[n] = [node.val];
            }
            deep(node.left, n + 1);
            deep(node.right, n + 1);
        }
    }
};
