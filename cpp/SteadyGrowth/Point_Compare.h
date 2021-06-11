#pragma once

struct Point {
	int x;
	int y;
	int id;//vector���rank

	Point() { x = y = 0; id = -1; }
	bool operator ==(Point p) { return x == p.x && y == p.y; }
};


long long int Area2(Point p, Point q, Point s) {
	return
		  (long long int)p.x * (long long int)q.y - (long long int)p.y * (long long int)q.x
		+ (long long int)q.x * (long long int)s.y - (long long int)q.y * (long long int)s.x
		+ (long long int)s.x * (long long int)p.y - (long long int)s.y * (long long int)p.x;
}

//q�Ƿ���p��s֮��
bool between(Point p, Point q, Point s) {
	return
		(long long int)(p.x - q.x) * (long long int)(q.x - s.x) +
		(long long int)(p.y - q.y) * (long long int)(q.y - s.y) > 0;
}


//s��p��q���ߣ�������p��q֮��ʱ, ToLeft�ж���ȻΪtrue

//���ڴ������supportʱ�Ĺ��������ʹ�÷��ص�Ϊ���й��ߵ��������ѯ��ĵ�
bool ToLeft(Point p, Point q, Point s) {
	if (Area2(p, q, s) > 0)return true;
	if (Area2(p, q, s) < 0)return false;

	return between(p, q, s);
}


bool ToRight(Point p, Point q, Point s) {
	if (Area2(p, q, s) > 0)return false;
	if (Area2(p, q, s) < 0)return true;

	return between(p, q, s);
}


//Triangle ABC in CCW order. Colinear cases are in account
bool InTriangleTest(Point a, Point b, Point c, Point p) {
	//��ѯ���˵���غϵ�ʱ����
	if ((p == c) || (p == a) || (p == b))return false;
	else {
		return !(ToRight(a, b, p) || ToRight(b, c, p) || ToRight(c, a, p));
	}
}

//�߶�qΪ��ѯ�߶Σ������chain�е��߶�p��Ѱ���Ƿ�����ཻ
bool IntersectionTest(Point p1, Point p2, Point q1, Point q2) {

	int k = (q2.y - q1.y) * (p2.x - p1.x) - (q2.x - q1.x) * (p2.y - p1.y);
	int p = (q2.x - q1.x) * (p1.y - q1.y) - (q2.y - q1.y) * (p1.x - q1.x);
	int q = (p2.x - p1.x) * (p1.y - q1.y) - (p2.y - p1.y) * (p1.x - q1.x);

	if (k == 0) {
		//Colinear Case
		if (p == 0 && q == 0) {
			//Check Range
			if ((between(p1, q1, p2) || between(p1, q2, p2)) || between(q1, p1, q2) || between(q1, p2, q2)) {
				return true;
			}
			else return false;
		}
		//Parallel Case
		else {
			return false;
		}
	}

	double kp = (double)p / (double)k;
	double kq = (double)q / (double)k;

	//p����˵㣬q������˵�
	if ((kp <= 1 && kp >= 0) && (kq < 1 && kq>0)) {
		return true;
	}
	else return false;
}