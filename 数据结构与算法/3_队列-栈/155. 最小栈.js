/**
 * 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

        push(x) —— 将元素 x 推入栈中。
        pop() —— 删除栈顶的元素。
        top() —— 获取栈顶元素。
        getMin() —— 检索栈中的最小元素。
 */
/**
 *
 */
class MinStack {
    cache = [];
    constructor() {}
    push(member) {
        this.cache[this.cache.length] = member;
    }
    pop() {
        if (this.cache.length == 0) {
            return null;
        }
        let need = this.cache[this.cache.length - 1];
        this.cache.length = this.cache.length - 1;
        return need;
    }
    top() {
        return this.cache[this.cache.length - 1];
    }
    getMin() {
        if (this.cache.length == 0) {
            return null;
        }
        let result = Infinity;
        for (let i = 0, len = this.cache.length; i < len; i++) {
            result = Math.min(result, this.cache[i]);
        }
        return result;
    }
}
