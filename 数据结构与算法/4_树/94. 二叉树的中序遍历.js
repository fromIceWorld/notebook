/**
 * 给定一个二叉树的根节点 root ，返回它的 中序 遍历。
 */
/**
 * 示例 1：
    输入：root = [1,null,2,3]
    输出：[1,3,2]

示例 2：
    输入：root = []
    输出：[]

示例 3：
    输入：root = [1]
    输出：[1]

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
 * @return {number[]}
 */
var inorderTraversal = function (root) {
    let result = [];
    next(root);
    return result;
    function next(node) {
        if (node) {
            next(node.left);
            result.push(node.val);
            next(node.right);
        }
    }
};
