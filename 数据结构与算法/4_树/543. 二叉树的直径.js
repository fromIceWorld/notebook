/** 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。
 *  这条路径可能穿过也可能不穿过根结点。
 */

/** 
 * 示例 :
    给定二叉树

             1
            / \
          2   3
        / \     
       4   5    

    返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。
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
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
    let result = 0;
    deep(root);
    return result;
    function deep(node) {
        if (node) {
            let { left, right } = node;
            let l = deep(left),
                r = deep(right);
            result = Math.max(result, l + r);
            return Math.max(l, r) + 1;
        } else {
            return 0;
        }
    }
};
