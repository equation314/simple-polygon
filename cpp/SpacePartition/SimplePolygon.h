#pragma once
#include<vector>
#include"Point_Compare.h"
#include<algorithm>

using namespace std;



struct simplePolygon {
	vector<Point> points;
	int count;

	void swap(int i, int j) {
		Point tmp = points[i];
		points[i] = points[j];
		points[j] = tmp;
	}

	void Init(vector<Point> p) {
		points = p;
		count = p.size();

		int idxFirst = 0;
		int idxLast = rand() % (count - 1) + 1;
		Point f = points[idxFirst];
		Point l = points[idxLast];
		swap(1, idxLast);

		int i = 2;
		int j = count - 1;
		while (i <= j) {
			while (i < count&&ToLeft(f, l, points[i]))i++;
			while (j > 1 && !ToLeft(f, l, points[j]))j--;
			if (i <= j) {
				swap(i, j);
				i++;
				j--;
			}
		}
		swap(1, j);
		spacePartition(0,j);
		spacePartition(j,count);
	}
	
	Point randomPointBetween(const Point& a, const Point& b) {
		double rand_ratio = rand()/(double)RAND_MAX;
		Point p;
		p.x = a.x + rand_ratio * (b.x - a.x);
		p.y = a.y + rand_ratio * (b.y - a.y);
		return p;
	}

	void spacePartition(int f,int l) {
		if (l <= f + 1) { return; }
		else {
			int randomIdx = rand() % (l - f - 1) + f + 1;
			Point prev_f = points[f];
			Point prev_l = (l == count) ? points[0] : points[l];
			Point first = randomPointBetween(prev_f, prev_l);
			Point last = points[randomIdx];
			swap(f + 1, randomIdx);
			int i = f + 2;
			int j = l - 1;
			bool dir = ToLeft(first, last, points[f]);
			while (i <= j) {
				while (i < l&&ToLeft(first, last, points[i]) == dir)i++;
				while (j > f + 1 && ToLeft(first, last, points[j]) != dir)j--;
				if (i <= j) {
					swap(i, j);
					i++;
					j--;
				}
			}
			swap(f + 1, j);
			spacePartition(f, j);
			spacePartition(j, l);
		}

	}

	void output() {
		for (int i = 0; i < points.size(); i++) {
			printf("(%lf,%lf)\n", points[i].x, points[i].y);
		}
	}
	
};