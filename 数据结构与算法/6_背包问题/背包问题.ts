// 有n个物品，它们有各自的体积和价值，现有给定容量的背包，如何让背包里装入的物品具有最大的价值总和？
// box = [[体积，价值],.....]; package:包的容量
const boxs = [
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
    ],
    package = 8;
//   i:代表前i个物品最佳组合
//   j:代表背包容量
//   box 代表物品 box[0] 代表质量 box[1]代表价值
//   dp[i][v] 代表 前i个物品的最大价值

// --- 初始化状态-----
//   i/j   0   1   2   3   4   5
//  ------------------------------
//   0 |   0   0   0   0   0   0
//   1 |   0
//   2 |   0
//   3 |   0
//   4 |   0
//   5 |   0

//  i = 1  j = 1;  box[0] =1 box[1]=2  j = box[0] 所以可以装下物品1  dp[1][1] = 1
//  i = 1  j = 2;  box[0] =1 box[1]=2  j > box[0] 所以可以装下物品1  dp[1][2] = max(dp[1-1][2],dp[1-1][2-box[0]] + box[1])
//  ......
// -----------------------动态规划-------
//   dp[i][j]

//  dp[0][*]:代表 0 个物品，对应的所有包容积情况：为0
//  dp[*][0]:代表 0 容积， 对应的所有物品情况：为0

// 将 物品分为两个状态：装进包【 包的体积减小，价值增加
//                    不装进包【 包的体积不变，价值不变【和之前的状态一样】

let dp = Array.from(new Array(boxs.length + 1), () =>
    new Array(package + 1).fill(0)
);

for (let i = 0; i < boxs.length; i++) {
    let [w, v] = boxs[i]; //取出 质量和价值
    for (let j = 1; j <= package; j++) {
        dp[i + 1][j] = Math.max(
            dp[i][j], // 不装进包，值就是 前一个最大值
            j >= w ? dp[i][j - w] + v : 0 //如果能装进包，包的容积减少，；前一个背包容积减小的最大值 加上当前物品的值
        );
    }
}

// 优化 ：从右填表；优化成一维---------------------
