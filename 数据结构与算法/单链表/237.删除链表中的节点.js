// 删除单链表中的某个特定节点
// 给的node是待删除的node
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */

var deleteNode = function (node) {
    node.val = node.next.val;
    if (node.next.next) {
        deleteNode(node.next);
    } else {
        node.next = null;
    }
};
