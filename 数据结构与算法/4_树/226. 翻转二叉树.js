/**
 * 翻转一棵二叉树。
 */

/**
 * 输入：

          4
        /   \
       2     7
      / \   / \
    1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1

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
 * @return {TreeNode}
 */
var invertTree = function (root) {
    return deep(root);
    function deep(node) {
        if (node) {
            let { left, right } = node;
            node.right = deep(left);
            node.left = deep(right);
            return node;
        } else {
            return null;
        }
    }
};
