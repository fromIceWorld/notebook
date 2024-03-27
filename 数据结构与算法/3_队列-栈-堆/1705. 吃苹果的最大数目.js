// 有一棵特殊的苹果树，一连 n 天，每天都可以长出若干个苹果。在第 i 天，树上会长出 apples[i] 个苹果，
// 这些苹果将会在 days[i] 天后（也就是说，第 i + days[i] 天时）腐烂，变得无法食用。
// 也可能有那么几天，树上不会长出新的苹果，此时用 apples[i] == 0 且 days[i] == 0 表示。

// 你打算每天 最多 吃一个苹果来保证营养均衡。注意，你可以在这 n 天之后继续吃苹果。

// 给你两个长度为 n 的整数数组 days 和 apples ，返回你可以吃掉的苹果的最大数目。

// 示例 1：

// 输入：apples = [1,2,3,5,2], days = [3,2,1,4,2]
// 输出：7
// 解释：你可以吃掉 7 个苹果：
// - 第一天，你吃掉第一天长出来的苹果。
// - 第二天，你吃掉一个第二天长出来的苹果。
// - 第三天，你吃掉一个第二天长出来的苹果。过了这一天，第三天长出来的苹果就已经腐烂了。
// - 第四天到第七天，你吃的都是第四天长出来的苹果。

// 示例 2：

// 输入：apples = [3,0,0,0,0,2], days = [3,0,0,0,0,2]
// 输出：5
// 解释：你可以吃掉 5 个苹果：
// - 第一天到第三天，你吃的都是第一天长出来的苹果。
// - 第四天和第五天不吃苹果。
// - 第六天和第七天，你吃的都是第六天长出来的苹果。

//   可以不吃苹果🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎
//    每次吃的🍎，选存放时间短的 ：【2，1，10】
//                               【2，10，1】
//                               第一天吃一个；第二天吃第一天剩下的
//                               第三天吃今天产的，因为今天的会过期，留下昨天的

// 声明一个数据结构，存放剩余苹果的情况，个数,每次吃快过期的🍎【堆/栈】

/**----------------------栈-----------------------【每次排序 是 n^2】 */
var eatenApples = function (apples, days) {
    let result = 0,
        heap = [];
    for (let i = 0, length = apples.length; i < length; i++) {
        del(i);
        if (apples[i] > 0 && days[i] > 0) {
            heap.push([i + days[i] - 1, apples[i]]);
            heap.sort((a, b) => a[0] - b[0]);
        }
        if (heap.length !== 0) {
            if (heap[0][1] > 1) {
                heap[0][1] = heap[0][1] - 1;
            } else {
                heap.shift();
            }
            result++;
        }
    }
    // 吃剩余🍎
    let from = days.length;
    while (heap.length !== 0) {
        let next = heap.shift();
        if (next[0] >= from) {
            let min = Math.min(next[0] - from + 1, next[1]);
            result += min;
            from += min;
        }
    }
    function del(index) {
        for (let end = heap.length - 1; end >= 0; end--) {
            if (heap[end][0] < index) {
                heap.splice(end, 1);
            }
        }
    }
    return result;
};
/**----------------------堆----------------------- 【排序 是 n】*/

/**
 * @param {number[]} apples
 * @param {number[]} days
 * @return {number}
 */
var eatenApples = function (apples, days) {
    let result = 0,
        heap = new Heap();
    for (let i = 0, length = apples.length; i < length; i++) {
        heap.delete(i);
        if (apples[i] > 0 && days[i] > 0) {
            heap.add([i + days[i] - 1, apples[i]]);
        }
        heap.sort();
        if (!heap.isEmpty()) {
            if (heap.tree[0][1] > 1) {
                heap.tree[0][1] = heap.tree[0][1] - 1;
            } else {
                heap.tree.shift();
            }
            result++;
        }
    }
    heap.sort();
    // 吃剩余🍎
    let from = days.length;
    while (heap.tree.length !== 0) {
        let next = heap.tree.shift();
        heap.sort();
        if (next[0] >= from) {
            let min = Math.min(next[0] - from + 1, next[1]);
            result += min;
            from += min;
        }
    }

    return result;
};

// 最小堆
/**
 * param {origin: Array<number>}
 * param {mode: max | min}
 * param tree[[day,apple]] 以day排序
 */
class Heap {
    constructor(origin = [], mode = 'min') {
        this.tree = [...origin];
        this.mode = mode;
        this.sort();
    }
    sort(from = 0) {
        if (this.isEmpty() || this.tree.length == 1) {
            return;
        }
        if (this.tree.length == 2) {
            this.tree.sort((a, b) => a[0] - b[0]);
            return;
        }
        for (
            let i = from, end = Math.floor(this.tree.length / 2);
            i <= end;
            i++
        ) {
            if (
                (this.tree[2 * i + 1] &&
                    this.tree[i][0] > this.tree[2 * i + 1][0]) ||
                (this.tree[2 * i + 2] &&
                    this.tree[i][0] > this.tree[2 * i + 2][0])
            ) {
                let min = this.getMin(
                        this.tree[i],
                        this.tree[2 * i + 1],
                        this.tree[2 * i + 2]
                    ),
                    cache;

                if (min == this.tree[i]) {
                    this.sort(2 * i + 1);
                    this.sort(2 * i + 2);
                } else if (min == this.tree[2 * i + 1]) {
                    cache = this.tree[i];
                    this.tree[i] = this.tree[2 * i + 1];
                    this.tree[2 * i + 1] = cache;
                    this.sort();
                } else {
                    cache = this.tree[i];
                    this.tree[i] = this.tree[2 * i + 2];
                    this.tree[2 * i + 2] = cache;
                    this.sort();
                }
                break;
            }
        }
    }
    delete(day) {
        for (let end = this.tree.length - 1; end >= 0; end--) {
            if (this.tree[end][0] < day) {
                this.tree.splice(end, 1);
            }
        }
    }
    getMin(node, left, right) {
        // 可能只有2个，1个
        if (left == undefined || right == undefined) {
            if (left == undefined) {
                return node;
            } else {
                return node[0] <= left[0] ? node : left;
            }
        }
        if (node[0] <= left[0] && node[0] <= right[0]) {
            return node;
        } else if (left[0] < node[0] && left[0] <= right[0]) {
            return left;
        } else {
            return right;
        }
    }
    add(arr) {
        this.tree.push(arr);
        this.sort();
    }
    length() {
        return this.tree.length;
    }
    isEmpty() {
        return this.tree.length == 0;
    }
}
