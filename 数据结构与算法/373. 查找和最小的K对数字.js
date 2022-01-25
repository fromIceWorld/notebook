/**
 *  给定两个以升序排列的整数数组 nums1 和 nums2 , 以及一个整数 k 。
    定义一对值 (u,v)，其中第一个元素来自 nums1，第二个元素来自 nums2 。
    请找到和最小的 k 个数对 (u1,v1),  (u2,v2)  ...  (uk,vk) 。

 */

/**
 * 
示例 1:
    输入: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
    输出: [1,2],[1,4],[1,6]
    解释: 返回序列中的前 3 对数：
        [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]

示例 2:
    输入: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
    输出: [1,1],[1,1]
    解释: 返回序列中的前 2 对数：
         [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]

示例 3:
    输入: nums1 = [1,2], nums2 = [3], k = 3 
    输出: [1,3],[2,3]
    解释: 也可能序列中所有的数对都被返回:[1,3],[2,3]


 */

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[][]}
 */
var kSmallestPairs = function (nums1, nums2, k) {
    let result = [];
    for (let i = 0; i < Math.min(nums1.length, k); i++) {
        for (let j = 0; j < Math.min(nums2.length, k); j++) {
            result.push([nums1[i], nums2[j]]);
        }
    }
    result.sort(
        (i, j) => nums1[i[0]] + nums1[i[1]] - nums2[j[0]] - nums2[j[1]]
    );
    return result.slice(0, k);
};

//优先队列
/**
 * 对于已经排序好的 nums1 和nums2，假设已经有(a1,b1),(a2,b2),(a3,b3)...
 * 下一个更大的是 (a1+1,b1),(a1,b1+1),(a2+1,b2),(a2,b2+1),(a3+1,b3),(a3,b3+1)...
 *
 *先将 (0,0),(1,0),(2,0)....放入优先队列中，再以nums 的指针移动【符合👆规律】
 */
class PriorityQueue {
    constructor(option) {
        this.k = option.k;
        this.compare = option.compare;
        this.cache = [];
    }
    enqueue(item) {
        this.cache.push(item);
        this.sort();
    }
    sort() {
        this.cache.sort(this.compare);
        if (this.cache.length > this.k) {
            this.cache.shift();
        }
    }
    front() {
        return this.cache.shift();
    }
    isEmpty() {
        return this.cache.length == 0;
    }
}
var kSmallestPairs = function (nums1, nums2, k) {
    let result = [];
    let q = new PriorityQueue({
        compare: (a, b) =>
            nums1[a[0]] + nums2[a[1]] - (nums1[b[0]] + nums2[b[1]]),
        max: k,
    });

    let m = nums1.length,
        n = nums2.length;
    for (let i = 0; i < Math.min(m, k); i++) {
        q.enqueue([i, 0]);
    }
    while (k-- > 0 && !q.isEmpty()) {
        let index = q.front() || [];
        result.push([nums1[index[0]], nums2[index[1]]]);
        if (index[1] + 1 < n) {
            q.enqueue([index[0], index[1] + 1]);
        }
    }
    return result;
};
