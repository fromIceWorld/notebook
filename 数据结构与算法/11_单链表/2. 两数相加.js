// 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

// 请你将两个数相加，并以相同形式返回一个表示和的链表。

// 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

// 输入：l1 = [2,4,3], l2 = [5,6,4]   //个位 -> 十位
// 输出：[7,0,8]
// 解释：342 + 465 = 807.

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (r1, r2) {
    let result = (index = null),
        add = 0;
    while (r1 || r2) {
        let count = add;
        if (r1 && r2) {
            count = count + r1.val + r2.val;
        } else if (r1 && !r2) {
            count = count + r1.val;
        } else if (!r1 && r2) {
            count = count + r2.val;
        }
        if (count > 9) {
            add = 1;
            count = count - 10;
        } else {
            add = 0;
        }
        if (index) {
            index.next = new ListNode(count);
            index = index.next;
        } else {
            result = index = new ListNode(count);
        }
        r1 = r1 && r1.next ? r1.next : null;
        r2 = r2 && r2.next ? r2.next : null;
    }
    if (add) {
        index.next = new ListNode(add);
    }
    return result;
};
