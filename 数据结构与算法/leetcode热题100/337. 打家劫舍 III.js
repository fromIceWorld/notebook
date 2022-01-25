/**
 * 
 * 在上次打劫完一条街道之后和一圈房屋后，小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，
 * 我们称之为“根”。 除了“根”之外，每栋房子有且只有一个“父“房子与之相连。
 * 一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果两个直接相连的房子在同一天晚上被打劫，房屋将自动报警。
 * 计算在不触动警报的情况下，小偷一晚能够盗取的最高金额。

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
var rob = function (root) {
    let can = new Map(),
        not = new Map();
    function deep(node) {
        if (node) {
            let { val, left, right } = node;
            deep(left);
            deep(right);
            can.set(node, val + (not.get(left) || 0) + (not.get(right) || 0));
            not.set(
                node,
                Math.max(can.get(left) || 0, not.get(left) || 0) +
                    Math.max(can.get(right) || 0, not.get(right) || 0)
            );
        } else {
            return 0;
        }
    }
    deep(root);
    return Math.max(can.get(root), not.get(root));
};
