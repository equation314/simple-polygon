#include<cstdio>
#include"simplePolygon.h"

#pragma warning(disable : 4996)

int main() {

	//�������ĸ���n����˳������n�����x��y����
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

	//ccw�����������id
	poly.output();

	return 0;
}