// 给定两个单链表的头节点 headA 和 headB ，请找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。

// 图示两个链表在节点 c1 开始相交：
/**
     a1->a2
            c1->c2->c3
b1->b2->b3
 
 *  */
// TODO:双指针，一起走，等到 A走到头，B距终点的距离就是B比A长的距离，B2指针和B指针再一起走，等到B到头时，A指针放到起点，那A指针和B2指针碰面就是相交点

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
    let A = headA,
        B = headB;
    while (A !== B) {
        A = A ? A.next : headB;
        B = B ? B.next : headA;
    }
    return A;
};
