/**
 * 
 * Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补完和拼写检查。

请你实现 Trie 类：

    Trie() 初始化前缀树对象。
    void insert(String word) 向前缀树中插入字符串 word 。
    boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
    boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。


 */
var Trie = function () {
    this.diretionary = new Map();
};

/**
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
    let i = 0,
        current = this.diretionary;
    while (i < word.length) {
        let next = current.get(word[i]);
        if (next) {
            current = next;
        } else {
            next = new Map();
            current.set(word[i], next);
            current = next;
        }
        i++;
    }
    current.set('end', true);
};

/**
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
    let result = true,
        origin = this.diretionary,
        index = 0;
    while (index < word.length) {
        origin = origin.get(word[index]);
        if (origin) {
            index++;
        } else {
            result = false;
            break;
        }
    }
    return result && origin.get('end') == true;
};

/**
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
    let origin = this.diretionary,
        index = 0;
    while (index < prefix.length) {
        origin = origin.get(prefix[index]);
        if (origin) {
            index++;
        } else {
            return false;
        }
    }
    return origin && origin.size > 0;
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
