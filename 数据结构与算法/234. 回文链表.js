/**
 * 给你一个单链表的头节点 head ，请你判断该链表是否为【回文链表】。如果是，返回 true ；否则，返回
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**注意：【回文链表】 */
/**
 *
 *
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function (head) {
    let arr = [],
        result = true;
    while (head) {
        arr.push(head.val);
        head = head.next;
    }
    let left = 0,
        right = arr.length - 1;
    while (left <= right) {
        if (arr[left] !== arr[right]) {
            result = false;
            break;
        }
        left++;
        right--;
    }
    return result;
};
