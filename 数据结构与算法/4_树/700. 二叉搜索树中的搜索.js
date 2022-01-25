// 给定二叉搜索树（BST）的根节点和一个值。 你需要在BST中找到节点值等于给定值的节点。
// 返回以该节点为根的子树。 如果节点不存在，则返回 NULL。
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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function (root, val) {
    let result = null;
    function deepGET(node) {
        if (node.val > val) {
            if (node.left && node.left.val <= val) {
                deepGET(node.left);
            }
        } else if (node.val < val) {
            if (node.right && node.right.val >= val) {
                deepGET(node.right);
            }
        } else {
            result = node;
        }
    }
    deepGET(root);
    return result;
};
