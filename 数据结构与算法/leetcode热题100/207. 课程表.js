/**
 * 
 * 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
 * 在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，
 * 其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。
 * 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
 * 
 * 
 * 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。


/**
 * 图，每个节点有入度和出度，每次选入度为0的，
 */

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function (numCourses, prerequisites) {
    let dp = new Array(numCourses).fill(0),
        map = new Map();
    for (let i = 0; i < prerequisites.length; i++) {
        dp[prerequisites[i][0]]++;
        if (map.get(prerequisites[i][1])) {
            map.get(prerequisites[i][1]).push(prerequisites[i][0]);
        } else {
            map.set(prerequisites[i][1], [prerequisites[i][0]]);
        }
    }
    let q = [];
    for (let i = 0; i < numCourses; i++) {
        if (dp[i] == 0) {
            q.push(i);
        }
    }
    let count = 0;
    while (q.length) {
        let next = q.shift();
        count++;
        let I = map.get(next);
        if (I && I.length) {
            for (let i = 0; i < I.length; i++) {
                dp[I[i]]--;
                if (dp[I[i]] == 0) {
                    q.push(I[i]);
                }
            }
        }
    }
    return count == numCourses;
};
