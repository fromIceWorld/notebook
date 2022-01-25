/**
 * 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
 */
/**
 * 示例 1：
    输入：l1 = [1,2,4], l2 = [1,3,4]
    输出：[1,1,2,3,4,4]

示例 2：
    输入：l1 = [], l2 = []
    输出：[]

示例 3：
    输入：l1 = [], l2 = [0]
    输出：[0]
 

 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
    let result = null,
        index = null;
    while (list1 !== null || list2 !== null) {
        let next;
        if (list2 == null) {
            next = list1;
            list1 = list1.next;
        } else if (list1 == null) {
            next = list2;
            list2 = list2.next;
        } else {
            if (list1.val >= list2.val) {
                next = list2;
                list2 = list2.next;
            } else {
                next = list1;
                list1 = list1.next;
            }
        }
        if (result) {
            index.next = next;
            index = next;
        } else {
            result = index = next;
        }
    }
    return result;
};
