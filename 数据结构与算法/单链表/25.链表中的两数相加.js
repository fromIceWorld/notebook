// 给定两个 非空链表 l1和 l2 来代表两个非负整数。【数字最高位位于链表开始位置】。
// 它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。
// 可以假设除了数字 0 之外，这两个数字都不会以零开头。

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
var addTwoNumbers = function (l1, l2) {
    let link1 = [],
        link2 = [],
        result;
    while (l1) {
        link1.unshift(l1.val);
        l1 = l1.next;
    }
    while (l2) {
        link2.unshift(l2.val);
        l2 = l2.next;
    }
    let end1 = link1.length - 1,
        end2 = link2.length - 1,
        max = Math.max(end1, end2),
        begin = 0,
        condition = 0;
    while (begin <= max || condition !== 0) {
        let value1, value2;
        if (begin > end1 || begin > end2) {
            if (begin > end1) {
                value1 = 0;
            } else {
                value1 = link1[begin];
            }
            if (begin > end2) {
                value2 = 0;
            } else {
                value2 = link2[begin];
            }
        } else {
            value1 = link1[begin];
            value2 = link2[begin];
        }
        // 处理相加结果
        let val = value1 + value2 + condition,
            nodeVal;
        if (val == 10) {
            nodeVal = 0;
            condition = 1;
        } else if (val < 10) {
            nodeVal = val;
            condition = 0;
        } else {
            nodeVal = val % 10;
            condition = 1;
        }
        if (result) {
            result = new ListNode(nodeVal, result);
        } else {
            result = new ListNode(nodeVal, null);
        }
        begin++;
    }
    return result;
};
