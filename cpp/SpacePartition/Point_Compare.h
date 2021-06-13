#pragma once

struct Point {
	double x;
	double y;
	//int id;//vector���rank

	Point() { x = y = 0; }
};


double Area2(Point p, Point q, Point s) {
	return p.x * q.y - p.y * q.x + q.x * s.y - q.y * s.x + s.x * p.y - s.y * p.x;
}

//q�Ƿ���p��s֮��
bool between(Point p, Point q, Point s) {
	return
		(p.x - q.x) * (q.x - s.x) + (p.y - q.y) * (q.y - s.y) > 0;
}


//s��p��q���ߣ�������p��q֮��ʱ, ToLeft�ж���ȻΪtrue
bool ToLeft(Point p, Point q, Point s) {
	if (Area2(p, q, s) > 0)return true;
	if (Area2(p, q, s) < 0)return false;

	return between(p, s, q);
}


bool ToRight(Point p, Point q, Point s) {
	if (Area2(p, q, s) > 0)return false;
	if (Area2(p, q, s) < 0)return true;

	return between(p, q, s);
}

