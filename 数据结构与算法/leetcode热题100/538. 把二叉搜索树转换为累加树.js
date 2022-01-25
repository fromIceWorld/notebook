/**
 * 
 * 给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），
 * 使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。
 * 提醒一下，二叉搜索树满足下列约束条件：

    节点的左子树仅包含键 小于 节点键的节点。
    节点的右子树仅包含键 大于 节点键的节点。
    左右子树也必须是二叉搜索树。

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
var convertBST = function (root) {
    let cache = deep(root);
    for (let i = cache.length - 2; i >= 0; i--) {
        cache[i].val = cache[i + 1].val + cache[i].val;
    }
    return root;
    function deep(node) {
        if (node) {
            return [...deep(node.left), node, ...deep(node.right)];
        } else {
            return [];
        }
    }
};
// 每个节点的 根节点和 根的右节点都比当前节点=大，因此，右->根->左
var convertBST = function (root) {
    let sum = 0;
    deep(root);
    return root;
    function deep(node) {
        if (node) {
            let { val, left, right } = node;
            deep(right);
            sum += val;
            node.val = sum;
            deep(left);
        }
    }
};
