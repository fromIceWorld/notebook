/**
 * 
 * 
 * Alice 和 Bob 用几堆石子在做游戏。一共有偶数堆石子，排成一行；每堆都有 正 整数颗石子，数目为 piles[i] 。
 * 游戏以谁手中的石子最多来决出胜负。石子的 总数 是 奇数 ，所以没有平局。
 * Alice 和 Bob 轮流进行，Alice 先开始 。 每回合，玩家从行的 开始 或 结束 处取走整堆石头。 
 * 这种情况一直持续到没有更多的石子堆为止，此时手中 石子最多 的玩家 获胜 。
 * 假设 Alice 和 Bob 都发挥出最佳水平，当 Alice 赢得比赛时返回 true ，当 Bob 赢得比赛时返回 false 。

 */

// 将 石子 分组，奇数在第一组，偶数在第二组
// 当alice 取 首 的时候，bob将只能在第二组拿
//            尾                    一
// 因此 alice 必胜
/**
 * @param {number[]} piles
 * @return {boolean}
 */
var stoneGame = function (piles) {
    return true;
};
