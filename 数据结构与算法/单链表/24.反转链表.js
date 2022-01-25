// 定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    let result = null;
    deep(head);
    return result;
    function deep(node) {
        // 有下一个node
        if (node.next) {
            let next = deep(node.next);
            next.next = node;
            // 清楚头节点对下一个节点的引用
            if (node == head) {
                node.next = null;
            }
        } else {
            result = node;
        }
        return node;
    }
};
