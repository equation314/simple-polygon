#include<cstdio>
#include"simplePolygon.h"

#pragma warning(disable : 4996)

int main() {

	//先输入点的个数n，再顺次输入n个点的x，y坐标
	int n = 0;
	scanf("%d", &n);

	vector<Point> p;
	for (int i = 0; i < n; i++) {
		Point I;
		I.id = i;
		scanf("%d%d", &I.x, &I.y);
		p.push_back(I);
	}

	simplePolygon poly;
	poly.build(p);

	//ccw输出点的坐标和id
	poly.output();

	return 0;
}