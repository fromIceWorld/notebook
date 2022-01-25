/**
 * 
 * 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
 * 百度百科中最近公共祖先的定义为：
 * “对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

var lowestCommonAncestor = function (root, p, q) {
    let pLink = deep(root, p),
        qLink = deep(root, q),
        i = 0,
        j = 0,
        result;
    while (pLink[i] == qLink[j] && i < pLink.length && j < qLink.length) {
        result = pLink[i];
        i++;
        j++;
    }
    return result;
    function deep(node, target) {
        if (node) {
            if (node == target) {
                return [target];
            } else {
                let { left, right } = node;
                let inLeft, inRight;
                inLeft = deep(left, target);
                if (inLeft) {
                    return [node, ...inLeft];
                } else {
                    inRight = deep(right, target);
                    return inRight ? [node, ...inRight] : inRight;
                }
            }
        } else {
            return false;
        }
    }
};
// 新思路
var lowestCommonAncestor = function (root, p, q) {
    if (!root || root == p || root == q) {
        return root;
    }
    let left = lowestCommonAncestor(root.left, p, q),
        right = lowestCommonAncestor(root.right, p, q);
    if (!left) return right;
    if (!right) return left;
    return root;
};
