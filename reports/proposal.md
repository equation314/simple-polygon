# 简单多边形的生成与内部最短路

贾越凯 徐瑞翔 许怡文

## 问题描述

在计算几何中，求一个几何区域内的最优路径是一个基础问题，在机器人路径规划、地理信息系统 (GIS)、电路布线等领域上有广泛应用。另一方面，为了测试各类计算几何算法的正确性、鲁棒性和实际运行效率，需要生成大规模的满足一定约束的几何体，例如生成一个随机的简单多边形。因此，本文将针对以下两个问题分别进行研究：

1. 简单多边形生成(或平面点集的简单多边形化)：给定平面内一组点，构造一个简单多边形，使得多边形的顶点恰好就是点集中的点。
2. 简单多边形内部最短路：给定一个简单多边形，和多边形内部的两个点 $s$ 和 $t$，求 $s$ 到 $t$ 的最短路，要求路径也在多边形内。

## 相关工作

### 简单多边形生成

在 Auer 和 Held 的工作中 [1]，提出了一系列启发式的简单多边形生成算法。其中 Steady Growth 和 Space Partitioning 算法并不能生成给定点集的所有可能的简单多边形，时间复杂度均为 $O(n^2)$。而 2-opt Moves 和 Incremental Construction & Backtracking 算法虽然能生成所有可能的简单多边形，但时间复杂度远高于前者。

另外还有一些算法能生成全部的具有特定性质的简单多边形，如 [1] 中的 Star Universe 算法可以等概率地生成所有可能的星型多边形。Zhu 等人的算法可以等概率地生成所有 x-单调多边形 [6]。Zhu 等人的算法还能等概率地生成所有以给点集的子集为顶点的凸多边形 [6]。

但是，如何高效、等概率地生成一般的简单多边形，还是一个未解决的开放问题。

### 简单多边形内最短路

解决该问题的绝大多数算法都需要先将简单多边形三角剖分。Lee 和 Preparata 等人使用一种漏斗结构，在三角剖分后可以用 $O(n)$ 时间求出简单多边形内两点的最短路 [2]。Guibas 和 Hershberger 等人的算法可以用 $O(n)$ 的预处理时间构出最短路径图，然后以 $O(\log n)$ 的时间查询单源 [12] 或两点间的最短路 [13]。

### 简单多边形三角剖分

Garey 等人提出了将单调多边形三角剖分的线性算法 [3]，并结合 Lee 和 Preparata 提出的简单多边形单调块分解的算法 [14]，可在 $O(n \log n)$ 的时间完成简单多边形的三角剖分。除此之外还有一些 $O(n \log n)$ 的不同算法，如 Chazelle 提出的分治算法 [7]，Hertel 和 Mehlhorn 提出的平面扫描算法 [8] 等。

在 1988 年，Tarjan 等人首次突破了 $O(n \log n)$ 的限制，提出了一种 $O(n \log\log n)$ 的算法 [10]。此外，使用随机化算法可以达到 $O(n \log^* n)$ 的时间复杂度，如 Seidel 的算法 [9]。

1990 年，Chazelle 终于将该问题的时间复杂度降为了线性 [11]，但是算法非常复杂，难以实现。

## 解决方案

### 简单多边形生成

首先，我们计划实现 [1] 中的几种启发式的简单多边形生成算法：

1. Steady Growth。一种增量式算法，每次会尝试向已生成的简单多边形加点，并通过调整以得到新的简单多边形。时间复杂度 $O(n^2)$。
2. Space Partitioning。一种分治算法，对于给定点集，随机其中两个点，根据过两点的直线将点集分为两部分，然后对这两部分递归生成两条多边形链，最后连起来得到简单多边形。时间复杂度最坏为 $O(n^2)$。
3. 2-opt Moves。先给出一个随机的顶点顺序，然后通过一种 2-opt moves 操作，交换顶点顺序，消除相交的边，最终得到一个简单多边形。时间复杂度为 $O(n^4)$。

为了分析这几种多边形生成算法的随机性，可以对一个小的点集(10 个点)，先用暴力方法枚举顶点排列，判断相应的多边形是否自交，以得到所有可能的简单多边形。然后再调用以上算法多次，统计生成的简单多边形的分布情况。分布是否均匀，以及能生成的不同简单多边形个数占简单多边形总数的比例，可以作为算法的评价指标。

如果时间允许，我们计划实现一些生成特殊性质简单多边形的算法，例如：

1. 凸多边形 [6]
2. 星型多边形 [1]
3. 单调多边形 [6]

### 简单多边形内最短路

然后，我们将根据生成的简单多边形，使用 [2] 中的基于三角剖分的算法求解简单多边形内两点的最短路径。该算法首先对简单多边形三角剖分，并构出对偶图。然后求出 $s$ 和 $t$ 所在的三角形在对偶图中的路径，路径上每个点对应的三角形合起来形成原多边形的一个子多边形，其三角剖分的对偶图是一条链，或称其为一个袖形多边形 (sleeve)。然后，算法会维护一个“漏斗” (funnel)，它是由两条向内凸 (inward-convex) 的链组成的。当依次处理路径上每个三角形时，根据新顶点与两条向内凸链的切线，要么缩小漏斗的开口，要么使用切点作为尖顶 (cusp) 新生成一个漏斗。最后把每次新生成的漏斗的顶点连起来，即得到 $s$ 到 $t$ 的最短路径。

该算法的瓶颈在于简单多边形的三角剖分，而之后求解最短路的过程是 $O(n)$ 的。

### 简单多边形三角剖分

在求简单多边形内最短路之前，首先需要对简单多边形进行三角剖分。我们计划实现课上讲的基于单调多边形分解的三角剖分算法 [3]：首先使用平面扫描算法，在 $O(n \log n)$ 的时间里，通过引入对角线，消除简单多边形的内部尖顶 (interior cusp)，将简单多边形分解为若干个单调多边形。然后可用 $O(n)$ 的时间对每个单调多边形进行三角剖分。

因此，我们可以在 $O(n \log n)$ 的时间里，求解简单多边形内部两点的最短路问题。

### 系统架构

最后，我们计划制作一个完整的演示系统，可以交互式演示算法的步骤和结果，方便此类问题的其他研究者学习与调试。

我们的系统只有网页前端，而没有后端，所有算法都将运行在浏览器上。其中算法核心使用 [Rust](https://www.rust-lang.org) 语言实现，并通过编译为 [WebAssembly](https://en.wikipedia.org/wiki/WebAssembly) 得以在浏览器里运行。对于用户界面和交互，可以使用 [Two.js](https://two.js.org) 等 JavaScript 图形库进行绘图。

### 技术难点

1. 对生成的简单多边形的随机性的定量分析。
2. $O(n \log n)$ 的简单多边形三角剖分算法的实现。
3. 如何通过网页交互将算法原理和步骤直观地展示出来。

## 小组成员与分工

* 贾越凯：系统框架搭建、简单多边形三角剖分与最短路算法的实现
* 徐瑞翔：Steady Growth 和 Space Partitioning 算法的实现
* 许怡文：2-opt Moves 算法的实现、网页前端的设计与实现

## 参考文献

1. T. Auer and M. Held. Heuristics for the generation of random polygons. In Proc. 8th Canad. Conf. Comput. Geom., pages 38–43, 1996.
2. D.T. Lee and F.P. Preparata. Euclidean shortest paths in the presence of rectilinear barriers. Networks, 14:393–410, 1984.
3. M.R. Garey, D.S. Johnson, F.P. Preparata, and R.E. Tarjan. Triangulating a simple polygon. Inform. Process. Lett., 7:175–179, 1978.
4. J.E. Goodman, J. O'Rourke and C.D. Tóth, Handbook of Discrete and Computational Geometry, third edition. CRC Press LLC, Boca Raton, FL, 2017, ISBN 978-1498711395.
5. J. O’Rourke. Computational Geometry in C, second edition. Cambridge University Press, 1998.
6. C. Zhu, G. Sundaram, J. Snoeyink, and J. S. B. Mitchell. Generating random polygons with given vertices. Comput. Geom. Theory Appl., 6:277–290, 1996.
7. B. Chazelle. A theorem on polygon cutting with applications. In Proc. 23rd IEEE Sympos. Found. Comput. Sci., pages 339–349, 1982.
8. S. Hertel and K. Mehlhorn. Fast triangulation of the plane with respect to simple polygons. Inform. Control, 64:52–76, 1985.
9. R. Seidel. A simple and fast incremental randomized algorithm for computing trapezoidal decompositions and for triangulating polygons. Comput. Geom., 1:51–64, 1991.
10. R. E. Tarjan and C. J. Van Wyk. An O(nloglogn)-time algorithm for triangulating a simple polygon. SIAM J. Comput., 17:143-178, 1988. Erratum in 17:1061, 1988.
11. B. Chazelle. Triangulating a simple polygon in linear time. Discrete Comput. Geom., 6:485–524, 1991.
12. L.J. Guibas, J. Hershberger, D. Leven, M. Sharir, and R.E. Tarjan. Linear-time algorithms for visibility and shortest path problems inside triangulated simple polygons. Algorithmica, 2:209–233, 1987.
13. L.J. Guibas and J. Hershberger. Optimal shortest path queries in a simple polygon. J. Comput. Syst. Sci., 39:126–152, 1989.
14. D. T. Lee and F. P. Preparata. Location of a point in a planar subdivision and its applications. SIAM J. Comput., 6:594-606, 1977.
