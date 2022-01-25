/**
 * 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
    实现 LRUCache 类：
    LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
    int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
    void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。
    如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
    函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。
 */
/**
 * 示例：

输入
    ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
    [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]

输出
    [null, null, null, 1, null, -1, null, -1, 3, 4]

解释
    LRUCache lRUCache = new LRUCache(2);
    lRUCache.put(1, 1); // 缓存是 {1=1}
    lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
    lRUCache.get(1);    // 返回 1
    lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
    lRUCache.get(2);    // 返回 -1 (未找到)
    lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
    lRUCache.get(1);    // 返回 -1 (未找到)
    lRUCache.get(3);    // 返回 3
    lRUCache.get(4);    // 返回 4
 */

/**使用双向链表 + hash */
class DoubleLinked {
    constructor(capacity) {
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.capacity = capacity;
    }
    add(key, value, map) {
        let n = this.node(key, value);
        if (this.head) {
            this.head.pre = n;
        }
        n.next = this.head;
        this.head = n;
        this.length++;
        // 初始化尾部
        if (this.tail == null) {
            this.tail = this.head;
        }
        if (this.length > this.capacity) {
            this.pop(map);
        }
        return this.head;
    }
    move(node) {
        if (this.length == 1 || node == this.head) {
            return;
        } else {
            let { pre, next } = node;
            pre.next = next;
            // 移动node时，tail 保持在尾部
            if (node == this.tail) {
                this.tail = pre;
            }
            if (next) {
                next.pre = pre;
            }
            if (pre.pre == null) {
                pre.pre = node;
            }
            if (this.head) {
                this.head.pre = node;
            }
            node.next = this.head;
            node.pre = null;
            this.head = node;
        }
    }
    pop(map) {
        if (this.tail && this.tail.pre) {
            map.delete(this.tail.key);
            this.tail = this.tail.pre;
            this.tail.next = null;
        } else {
            this.head = null;
            this.length = 0;
        }
    }
    node(key, value) {
        return {
            key,
            value,
            pre: null,
            next: null,
        };
    }
}
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.link = new DoubleLinked(capacity);
    }
    get(key) {
        if (this.cache.has(key)) {
            let node = this.cache.get(key);
            this.link.move(node);
            return node.value;
        } else {
            return -1;
        }
    }
    put(key, value) {
        let node = this.cache.get(key);
        if (node !== undefined) {
            let node = this.cache.get(key);
            node.value = value;
            this.link.move(node);
        } else {
            let newNode = this.link.add(key, value, this.cache);
            this.cache.set(key, newNode);
        }
    }
}
