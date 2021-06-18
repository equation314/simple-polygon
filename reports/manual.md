# 用户手册

## 1. 执行环境说明

### 1.1 命令行执行

直接在命令行执行二进制程序 `simple-polygon-cli`，通过参数指定算法和数据，具体如下：

#### 简单多边形生成

```
simple-polygon-cli gen [OPTIONS] -n <N>

OPTIONS:
    -n <N>                    Number of vertices
    -a, --algo <ALGORITHM>    The algorithm of the generator [default: 2opt]  [possible values: space, 2opt,
                              permute]
    -o, --output <FILE>       The output polygon file
    -r, --range <R>           The coordinate range [0, R) of the generated polygon [default: 1000]
```

#### 简单多边形三角剖分

```
simple-polygon-cli tri [OPTIONS] <IN_FILE>

OPTIONS:
    -a, --algo <ALGORITHM>    The triangulation algorithm [default: mono_partition]  [possible values: ear_cutting,
                              mono_partition]
    -o, --output <OUT_FILE>   Output diagonals to the file

ARGS:
    <IN_FILE>    The input polygon file
```

#### 简单多边形内最短路

```
simple-polygon-cli sp [OPTIONS] <FILE> --start <x> <y> --end <x> <y>

OPTIONS:
    -s, --start <x> <y>       The start point
    -e, --end <x> <y>         The end point
    -a, --algo <ALGORITHM>    The triangulation algorithm [default: mono_partition]  [possible values: ear_cutting,
                              mono_partition]

ARGS:
    <FILE>    The input polygon file
```

### 1.2 Web 应用

本项目同时提供了一个 Web 应用，可通过浏览器在网页上显示与交互，并支持 PC 端和移动端。

演示网址：https://equation314.github.io/simple-polygon/

## 2. 系统界面说明

项目主要实现了简单多边形的随机生成和多边形内两点间最短距离的查询。

* 页面上端左侧展示了项目的核心操作，分别是：创建简单多边形，作为中间过程的三角剖分，求取最短路径，以及单步演示生成算法和求取最短路的过程。
* 页面上端右侧响应左侧的输入，展示必要的次级操作。

### 2.1 多边形

* 点击最左侧的 "Polygon" 按键出现下拉列表，展示支持的三种创建简单多边形的方式：
    + Random：算法随机生成
        1. 支持用户设置点数、选择生成算法、随机生成多边形，相关按键出现在页面右侧
        2. 目前支持的生成算法有 2-Opt Moves (点数 ≤ 2000)，Space Partitioning (点数 ≤ 50000)，Permute & Reject (点数 ≤ 15)
    + Draw：手动点选输入
        1. 鼠标左键点击，顺次创建多边形顶点
        2. 左键点选任意已有顶点，可闭合多边形
        3. 创建完多边形后可继续拖动顶点进行修改
        4. 支持用户自定义多边形着色和重置输入，相关按键在页面右侧
    + Load From：导入多边形
        1. 从本地文件导入逆时针或顺时针次序的多边形顶点数据
        2. 支持的数据格式：纯文本，每行两个空格隔开的浮点数，表示多边形的顶点坐标
* 支持导出随机生成/手动创建的多边形数据，以方便再次导入，只需点击下拉列表的 "Export" 按键。

### 2.2 三角剖分

* 点击左侧第二个 "Trianggulation" 图标，显示简单多边形的三角剖分结果，再次点击隐藏。

### 2.3 最短路

* 点击左侧第三个 "Shortest path" 图标，创建查询路径的起点和终点，如果查询点在简单多边形内部，随即显示出计算出的最短路径；
* 再次点击可隐藏路径；
* 移动查询点/多边形顶点后，路径会消失，再次点击此键，将重新计算并显示路径。

### 2.4 单步演示

* 点击左侧第四个 "Single step" 图标，出现下拉列表，包含了可进行单步演示的算法；
* 目前支持单步演示的算法有：2-Opt Moves 生成算法 (点数 ≤ 500)，Space Partitioning 生成算法 (点数 ≤ 1000)、最短路算法。
* 选择需要演示的算法，页面上端右侧更新展示过程调控组件，支持自动播放和逐帧查看等操作。

## 3. 使用示例

### 3.2 手动创建多边形

1. 在下拉列表中选择 Draw，手动创建多边形：

2. 点击创建顶点，闭合多边形：

3. 多边形闭合后以实色填充，支持自定义颜色

### 3.4 三角剖分与最短路求解

1. 点击 "Triangulation" 按键，显示/隐藏三角剖分对角线：

2. 点击 "Shortest path" 按键，点选起点终点，求取最短路径：

3. 用户创建的点 (多边形顶点和路径端点) 支持拖拽移动、修改位置，然后可重新求解:

4. 点击 "Single step" 按键，选择 "Shortest Path", 展示求取最短路径的过程：

5. 最短路中间过程 (1)：

6. 最短路中间过程 (2)：

### 3.6 2-Opt Moves 算法及单步演示

1. 点击左侧 "Polygon" 按键选择 "Random"，并在右侧选择 2-Opt Moves 算法，随机生成点数为 100 的简单多边形：

2. 点击 "Single step" 按键，选择 "2-Opt Moves", 多边形的生成过程可供展示：

3. 2-Opt Move 中间过程 (1)：

4. 2-Opt Move 中间过程 (2)：

### 3.7 Space Partitioning 算法单步演示

1. 点击左侧 "Polygon" 按键选择 "Random"，并在右侧选择 Space Partitioning 算法，随机生成点数为 100 的简单多边形：

2. 点击 "Single step" 按键，选择 "Space Partitioning", 多边形的生成过程可供展示：

3. Space Partitioning 中间过程 (1)：

4. Space Partitioning 中间过程 (2)：