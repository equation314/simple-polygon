#include"SimplePolygon.h"

#pragma warning(disable : 4996)

int main() {

	int n = 0;
	scanf("%d", &n);

	vector<Point> p;
	for (int i = 0; i < n; i++) {
		Point I;
		scanf("%lf%lf", &I.x, &I.y);
		p.push_back(I);
	}

	simplePolygon polygon;
	polygon.Init(p);

	polygon.output();

	return 0;
}