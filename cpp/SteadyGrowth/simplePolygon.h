#pragma once
#include<cstdio>
#include<vector>
#include<list>
#include<stdlib.h>
#include<algorithm>
#include<iterator>
#include"Point_Compare.h"

using namespace std;

typedef pair<list<int>::iterator, list<int>::iterator> idxRange;
typedef vector<idxRange> SegVec;


//循环查找前驱
inline list<int>::iterator Pred(list<int>& l, list<int>::iterator curr) {
	if (curr == l.begin()) {
		return --l.end();
	}
	else return --curr;
}
//循环查找后继
inline list<int>::iterator Succ(list<int>& l, list<int>::iterator curr) {
	++curr;
	if (curr == l.end()) {
		return l.begin();
	}
	else return curr;
}


/* 简便处理vector的删除 */
void SwapAndRemove(SegVec& s, int i) {
	idxRange tmp = s[i];
	s[i] = s[s.size() - 1];
	s[s.size() - 1] = tmp;
	s.pop_back();
}
//同时删除两个元素
void SwapAndRemove2(SegVec& s, int i, int j) {
	idxRange tmp1 = s[i];
	idxRange tmp2 = s[j];
	s[i] = s[s.size() - 1];
	s[j] = s[s.size() - 2];
	s[s.size() - 1] = tmp1;
	s[s.size() - 2] = tmp2;

	s.pop_back();
	s.pop_back();
}

void SwapAndRemove(vector<int>& s, int i) {
	int tmp = s[i];
	s[i] = s[s.size() - 1];
	s[s.size() - 1] = tmp;

	s.pop_back();
}


struct simplePolygon {

	vector<Point> points;//all points: 记录所有的点，不含有重复点
	vector<int> toBeInsert;//未插入的点的编号

	list<int> polygon;//CCW记录simple polygon的点的编号
	list<int> convexHull;//CCW记录convex hull的点的编号



	void build(vector<Point> p);//输入点集，构建简单多边形
	void Init();//建立初始的三角形
	int insert();//随机插入点


	/* 找到合适的插入点 */
	idxRange findSupport(Point p);//找到插入点和凸包相切的左右端点
	idxRange findSupportInChain(idxRange& chain, Point p);
	int FindCandidate(idxRange& supports, int idx, int& i, int& r);//检测新的凸包内是否有其他点 ；递归调用，直到找到合适的插入点


	/* 找到合适的扩展边 */
	enum EndType { Left, Right };
	int FindAdjointSegID(const SegVec& s, int i, EndType e);
	bool VisibleTest(SegVec& s, int& SegID, int PointID);//检测对于插入点，择取的边的端点是否都可见


	void output();
};

/* ++++ 找到合适的插入点 ++++ */
idxRange simplePolygon::findSupport(Point p) {
	Point u, v, w;
	list<int>::iterator left = convexHull.end(), right = convexHull.end();

	list<int>::iterator i = convexHull.begin();
	u = points[convexHull.back()];
	v = points[*i];

	while (i != convexHull.end()) {
		//此处i指向Point w
		w = points[*Succ(convexHull, i)];

		if (ToLeft(u, v, p) && !ToLeft(v, w, p)) {
			left = i;
		}
		if (!ToLeft(u, v, p) && ToLeft(v, w, p)) {
			right = i;
		}

		if (left != convexHull.end() && right != convexHull.end())
		{
			/*printf("findSupport for %d (%d,%d),	leftSupport is %d (%d,%d),rightSupport is %d (%d,%d)\n", p.id, p.x, p.y, *left, points[*left].x, points[*left].y, *right, points[*right].x, points[*right].y);*/
			return idxRange(left, right);
		}
		else {
			u = v; v = w;
			i++;//不可越过end
		}
	}
}

idxRange simplePolygon::findSupportInChain(idxRange& chain, Point p) {
	Point u, v, w;
	list<int>::iterator end = chain.second;
	end++;
	list<int>::iterator left = convexHull.end(), right = convexHull.end();

	list<int>::iterator i = chain.first;
	u = points[*Pred(convexHull, i)];
	v = points[*i];

	//此处i指向Point v
	while (i != end) {
		w = points[*Succ(convexHull, i)];

		if (ToLeft(u, v, p) && !ToLeft(v, w, p)) {
			left = i;
		}
		if (!ToLeft(u, v, p) && ToLeft(v, w, p)) {
			right = i;
		}

		if (left != convexHull.end() && right != convexHull.end())
		{
			/*printf("findSupport for %d (%d,%d),	leftSupport is %d (%d,%d),rightSupport is %d (%d,%d)\n", p.id, p.x, p.y, *left, points[*left].x, points[*left].y, *right, points[*right].x, points[*right].y);*/
			return idxRange(left, right);
		}
		else {
			u = v; v = w;
			i = Succ(convexHull, i);//可能需要越过end()
		}
	}
}

int simplePolygon::FindCandidate(idxRange& supports, int idx, int& i, int& r) {
	Point a = points[*(supports.first)];
	Point b = points[idx];
	Point c = points[*(supports.second)];

	int ableIndex = idx;

	for (; i < toBeInsert.size(); i++) {

		if (InTriangleTest(a, b, c, points[toBeInsert[i]])) {
			//调试信息
			/*printf("Find point in new CH  %d (%d,%d), change query to it\n", toBeInsert[i], points[toBeInsert[i]].x, points[toBeInsert[i]].y);*/
			r = i;
			supports = findSupportInChain(supports, points[toBeInsert[i]]);//缩小查找范围
			ableIndex = FindCandidate(supports, toBeInsert[i], i, r);
		}
	}
	return ableIndex;
}
/* ---- 找到合适的插入点 ---- */




/* ++++ 找到合适的扩展边 ++++ */
int simplePolygon::FindAdjointSegID(const SegVec& s, int i, EndType e) {
	int adjointSegID = -1;
	//如果查询点是左端点
	if (e == Left) {
		if (i != 0 && points[*(s[i - 1].second)] == points[*(s[i].first)])
		{
			adjointSegID = i - 1;
		}
	}
	//如果查询点是右端点
	else if (e == Right) {
		if (i != s.size() - 1 && points[*(s[i + 1].first)] == points[*(s[i].second)]) { adjointSegID = i + 1; }
	}
	return adjointSegID;
}


bool simplePolygon::VisibleTest(SegVec& s, int& SegID, int PointID) {
	//先检差左端点是否可见
	Point a = points[*(s[SegID].first)];
	Point x = points[PointID];

	int left_AdjointSegID = FindAdjointSegID(s, SegID, Left);

	bool leftEnd_Bebolcked = false;
	bool rightEnd_Beblocked = false;

	for (int i = 0; i < s.size(); i++) {
		if (i == SegID || i == left_AdjointSegID) { continue; }
		leftEnd_Bebolcked = IntersectionTest(points[*s[i].first], points[*s[i].second], a, x);
		if (leftEnd_Bebolcked) {
			//Process adjoint segment then return
			if (left_AdjointSegID != -1) { SwapAndRemove2(s, SegID, left_AdjointSegID); }
			else { SwapAndRemove(s, SegID); }
			return false;
		}
	}

	//如果左端点可见，再检查右端点是否可见
	if (!leftEnd_Bebolcked)
	{
		Point b = points[*(s[SegID].second)];

		int right_AdjointSegID = FindAdjointSegID(s, SegID, Right);

		for (int i = 0; i < s.size(); i++) {
			if (i == SegID || i == right_AdjointSegID) { continue; }
			rightEnd_Beblocked = IntersectionTest(points[*s[i].first], points[*s[i].second], b, x);
			if (rightEnd_Beblocked) {
				//Process adjoint segment then return
				if (right_AdjointSegID != -1) { SwapAndRemove2(s, SegID, right_AdjointSegID); }
				else { SwapAndRemove(s, SegID); }
				break;
			}
		}

		//如果两个端点都可见
		if (!rightEnd_Beblocked) { return true; }

		//如果左端点可见但右端点不可见，测试相邻的前一条segment
		if (rightEnd_Beblocked && left_AdjointSegID != -1)
		{
			//!* 更改SegID *!
			SegID = left_AdjointSegID;
			Point z = points[*(s[SegID].first)];

			int adjointSegID = FindAdjointSegID(s, SegID, Left);

			bool Beblocked = false;
			for (int i = 0; i < s.size(); i++) {
				if (i == SegID || i == adjointSegID) { continue; }
				Beblocked = IntersectionTest(points[*s[i].first], points[*s[i].second], z, x);
				if (Beblocked) {
					//Process adjoint segment then return
					if (adjointSegID != -1) { SwapAndRemove2(s, SegID, adjointSegID); }
					else { SwapAndRemove(s, SegID); }
					return false;
				}
			}
			if (!Beblocked) { return true; }
		}

		//如果前面没有相邻的Segment
		else return false;
	}
}
/* ---- 找到合适的扩展边 ---- */



int simplePolygon::insert() {

	/*找到合适的插入点*/
	int r = rand() % toBeInsert.size();
	int insertIndex = toBeInsert[r];
	pair<list<int>::iterator, list<int>::iterator> supports = findSupport(points[insertIndex]);
	int i = 0;
	insertIndex = FindCandidate(supports, insertIndex, i, r);

	/*找到合适的扩展边*/
	int leftSupportIdx = *supports.first;
	int rightSupportIdx = *supports.second;
	list<int>::iterator leftSupportPtr = find(polygon.begin(), polygon.end(), leftSupportIdx);
	list<int>::iterator rightSupportPtr = find(polygon.begin(), polygon.end(), rightSupportIdx);

	SegVec visibleTestPtr;
	for (list<int>::iterator i = leftSupportPtr; i != rightSupportPtr; i = Succ(polygon, i)) {
		visibleTestPtr.push_back(idxRange(i, Succ(polygon, i)));
	}

	//确认可见性
	int VisCheckSeg = rand() % (visibleTestPtr.size());
	while (!VisibleTest(visibleTestPtr, VisCheckSeg, insertIndex)) {
		VisCheckSeg = rand() % (visibleTestPtr.size());
	}

	/*更新 Polygon*/
	polygon.insert(visibleTestPtr[VisCheckSeg].second, insertIndex);

	/*更新 Convex Hull*/

	list<int>::iterator n = convexHull.insert(supports.second, insertIndex);
	list<int>::iterator RemovePt = Succ(convexHull, supports.first);
	while (RemovePt != n) {
		list<int>::iterator tmp = RemovePt;
		RemovePt = Succ(convexHull, RemovePt);
		convexHull.erase(tmp);
	}
	//删除凸包上的共线点

	RemovePt = Pred(convexHull, supports.first);
	while (Area2(points[*RemovePt], points[*supports.first], points[*n]) == 0) {
		list<int>::iterator tmp = RemovePt;
		RemovePt = Pred(convexHull, RemovePt);
		convexHull.erase(tmp);
	}
	RemovePt = Succ(convexHull, supports.second);
	while (Area2(points[*RemovePt], points[*supports.second], points[*n]) == 0) {
		list<int>::iterator tmp = RemovePt;
		RemovePt = Succ(convexHull, RemovePt);
		convexHull.erase(tmp);
	}


	/*更新 toBeInsert*/
	SwapAndRemove(toBeInsert, r);

	return insertIndex;
}

void simplePolygon::Init() {
	int r1, r2, r3;

	r1 = rand() % toBeInsert.size();
	int a = toBeInsert[r1];
	SwapAndRemove(toBeInsert, r1);

	r2 = rand() % toBeInsert.size();
	int b = toBeInsert[r2];

	//保证A、B间无共线点
	for (int i = 0; i < toBeInsert.size(); i++) {
		if (i == r2) { continue; }
		else if (between(points[a], points[toBeInsert[i]], points[b])) {
			r2 = rand() % toBeInsert.size();
			b = toBeInsert[r2]; i = 0;
		}
	}
	SwapAndRemove(toBeInsert, r2);


	r3 = rand() % toBeInsert.size();
	int c = toBeInsert[r3];
	//保证三点不共线
	while (Area2(points[a], points[b], points[c]) == 0) {
		r3 = rand() % toBeInsert.size();
		c = toBeInsert[r3];
	}
	//检查 ccw order
	if (!ToLeft(points[a], points[b], points[c])) {
		int tmp = a;
		a = b;
		b = tmp;
	}
	//检查初始三角形内不含其他点
	bool containPoint = false;
	for (int i = 0; i < toBeInsert.size(); i++) {
		containPoint = InTriangleTest(points[a], points[b], points[c], points[toBeInsert[i]]);
		if (containPoint) {
			r3 = i;
			c = toBeInsert[i];
			containPoint = false;
		}
	}

	if (!containPoint) //Double Check (maybe useless)
	{
		SwapAndRemove(toBeInsert, r3);
		polygon.push_back(a); polygon.push_back(b); polygon.push_back(c);
		convexHull.push_back(a); convexHull.push_back(b); convexHull.push_back(c);
	}

	//调试信息，输出找到的初始三角形
	/*printf("(%d,%d)  id: %d\n", points[a].x, points[a].y, a);
	printf("(%d,%d)  id: %d\n", points[b].x, points[b].y, b);
	printf("(%d,%d)  id: %d\n", points[c].x, points[c].y, c);*/
}

void simplePolygon::build(vector<Point> p) {
	points = p;
	for (int i = 0; i < points.size(); i++) {
		points[i].id = i;//设置id和rank相同
		toBeInsert.push_back(i);
	}
	Init();//初始化

	while (toBeInsert.size() > 0) {
		insert();//逐点插入
	}
}


//ccw输出点的坐标和id
void simplePolygon::output() {
	for (list<int>::iterator i = polygon.begin(); i != polygon.end(); i++) {
		printf("(%d,%d)  id: %d\n", points[*i].x, points[*i].y, *i);
	}
}
