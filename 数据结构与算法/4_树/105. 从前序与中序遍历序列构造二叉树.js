/**
 * 给定一棵树的前序遍历 preorder 与中序遍历  inorder。请构造二叉树并返回其根节点。
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
    let i = 0;
    return deep(0, inorder.length - 1);
    function deep(from, end) {
        if (from == end) {
            return new TreeNode(inorder[from]);
        } else if (from < end) {
            let index = from,
                target = preorder[i];
            while (inorder[index] !== target) {
                index++;
            }
            let left = null,
                right = null;
            if (from <= index - 1) {
                i++;
                left = deep(from, index - 1);
            }
            if (index + 1 <= end) {
                i++;
                right = deep(index + 1, end);
            }

            return new TreeNode(target, left, right);
        }
    }
};
