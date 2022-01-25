/**
 * 给你一个二叉树的根节点 root ， 检查它是否轴对称。

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
 * @return {boolean}
 */
var isSymmetric = function (root) {
    let result = true;
    deep(root, root);
    return result;

    function deep(left, right) {
        if (left == null && right == null) {
            return;
        }
        if (left == null || right == null) {
            result = false;
            return;
        }
        if (left.val == right.val) {
            deep(left.left, right.right);
            deep(left.right, right.left);
        } else {
            result = false;
            return;
        }
    }
};
