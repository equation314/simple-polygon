#pragma once

struct Point {
	double x;
	double y;
	
	Point() { x = y = 0; }
};


double Area2(Point p, Point q, Point s) {
	return p.x * q.y - p.y * q.x + q.x * s.y - q.y * s.x + s.x * p.y - s.y * p.x;
}

//q是否在p、s之间
bool between(Point p, Point q, Point s) {
	return
		(p.x - q.x) * (q.x - s.x) + (p.y - q.y) * (q.y - s.y) > 0;
}


//s在p、q之间时, ToLeft判定依然为true
bool ToLeft(Point p, Point q, Point s) {
	if (Area2(p, q, s) > 0)return true;
	if (Area2(p, q, s) < 0)return false;

	return between(p, s, q);
}
