/**
 * 
 * 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
  百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，
  满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。

 */

/** */

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
    let parent1 = [],
        parent2 = [];
    deep(root, p, parent1);
    deep(root, q, parent2);
    let result = null,
        i = 0;
    while (
        i < parent1.length &&
        i < parent2.length &&
        parent1[i].val == parent2[i].val
    ) {
        result = parent1[i];
        i++;
    }
    return result;
    function deep(node, target, box) {
        if (node) {
            let { left, right } = node;
            if (left && left.val == target) {
                box.push(left);
                return true;
            } else {
                let has = deep(left, target, box);
                if (has) {
                    box.push(node);
                    return true;
                }
            }
            if (right && right.val == target) {
                box.push(right);
                return true;
            } else {
                let has = deep(right, target, box);
                if (has) {
                    box.push(node);
                    return true;
                }
            }
        }
    }
};
