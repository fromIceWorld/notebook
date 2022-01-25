/**
 * 
 * 给你一个用字符数组 tasks 表示的 CPU 需要执行的任务列表。其中每个字母表示一种不同种类的任务。
 * 任务可以以任意顺序执行，并且每个任务都可以在 1 个单位时间内执行完。在任何一个单位时间，CPU 可以完成一个任务，或者处于待命状态。
 * 然而，两个 相同种类 的任务之间必须有长度为整数 n 的冷却时间，因此至少有连续 n 个单位时间内 CPU 在执行不同的任务，或者在待命状态。
 * 你需要计算完成所有任务所需要的 最短时间 。

 */

/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
var leastInterval = function (tasks, n) {
    class maxHeap {
        constructor(tasks) {
            this.cache = [];
            this.countMap = new Map();
            for (let i = 0; i < tasks.length; i++) {
                let count = this.countMap.get(tasks[i]);
                if (count) {
                    this.countMap.set(tasks[i], count + 1);
                } else {
                    this.cache.push(tasks[i]);
                    this.countMap.set(tasks[i], 1);
                }
            }
            this.sort();
        }
        sort() {
            for (let i = 0; i < Math.floor(this.cache.length / 2); i++) {
                let mid = this.cache[i],
                    left = this.cache[2 * i + 1],
                    right = this.cache[2 * i + 2];
                // 有右节点
                if (right) {
                    if (
                        this.countMap.get(this.cache[i]) <
                            this.countMap.get(this.cache[2 * i + 1]) ||
                        this.countMap.get(this.cache[i]) <
                            this.countMap.get(this.cache[2 * i + 2])
                    ) {
                        if (
                            this.countMap.get(this.cache[2 * i + 1]) <
                            this.countMap.get(this.cache[2 * i + 2])
                        ) {
                            [this.cache[i], this.cache[2 * i + 2]] = [
                                this.cache[2 * i + 2],
                                this.cache[i],
                            ];
                        } else {
                            [this.cache[i], this.cache[2 * i + 1]] = [
                                this.cache[2 * i + 1],
                                this.cache[i],
                            ];
                        }
                        this.sort();
                    }
                } else {
                    if (
                        this.countMap.get(this.cache[i]) <
                        this.countMap.get(this.cache[2 * i + 1])
                    ) {
                        [this.cache[i], this.cache[2 * i + 1]] = [
                            this.cache[2 * i + 1],
                            this.cache[i],
                        ];
                        this.sort();
                    }
                }
            }
        }
        out() {
            let out = this.cache.shift();
            this.sort();
            return out;
        }
    }
    let heap = new maxHeap(tasks),
        result = [];
    while (heap.cache.length > 0) {
        let out = heap.out();
    }
};
