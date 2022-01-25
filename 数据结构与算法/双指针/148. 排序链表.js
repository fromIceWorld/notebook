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
var sortList = function (head) {
    let arr = [],
        result = null,
        current = null;
    while (head) {
        arr.push(head.val);
        head = head.next;
    }
    arr.sort((a, b) => a - b);
    arr.forEach((val) => {
        if (result) {
            current.next = new ListNode(val, null);
            current = current.next;
        } else {
            result = current = new ListNode(val, null);
        }
    });
    return result;
};
