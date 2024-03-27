/**
 *给你链表的头结点 head ，请将其按 升序 排列并返回排序后的链表
 */
/**
 *示例 1：
    输入：head = [4,2,1,3]
    输出：[1,2,3,4]

  示例 2：
    输入：head = [-1,5,3,4,0]
    输出：[-1,0,3,4,5]  

  示例 3：
    输入：head = []
    输出：[]

 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function (node) {
    // 不可拆分
    if (!node || !node.next) {
        return node;
    } else {
        let mid = getMidNode(node);
        let left = node,
            right = mid.next;
        // 切割链表
        mid.next = null;
        left = sortList(left);
        right = sortList(right);
        return merge(left, right);
    }
};
function getMidNode(node) {
    if (node && node.next && node.next.next) {
    }
    let slow = node,
        fast = node;
    while (fast && fast.next && fast.next.next) {
        fast = fast.next.next;
        slow = slow.next;
    }
    return slow;
}
function merge(left, right) {
    let head = (virul = new ListNode());
    while (left && right) {
        if (left.val >= right.val) {
            virul.next = right;
            right = right.next;
            virul.next.next = null;
        } else {
            virul.next = left;
            left = left.next;
            virul.next.next = null;
        }
        virul = virul.next;
    }
    virul.next = left || right;
    return head.next;
}
