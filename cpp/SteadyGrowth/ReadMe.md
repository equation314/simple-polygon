#Steady Growth

* 初始化：建构初始三角形（保证内部和边界无点）

* 反复插入：
	+ 选择合适的插入点 ： 该点s'与已插入点构成的凸包，与待插入的点集 ( S/s')无交
	+ 找到合适的插入边 ： 边的两个端点都对该点可见，插入该点