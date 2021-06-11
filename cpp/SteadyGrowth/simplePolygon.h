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


//ѭ������ǰ��
inline list<int>::iterator Pred(list<int>& l, list<int>::iterator curr) {
	if (curr == l.begin()) {
		return --l.end();
	}
	else return --curr;
}
//ѭ�����Һ��
inline list<int>::iterator Succ(list<int>& l, list<int>::iterator curr) {
	++curr;
	if (curr == l.end()) {
		return l.begin();
	}
	else return curr;
}


/* ��㴦��vector��ɾ�� */
void SwapAndRemove(SegVec& s, int i) {
	idxRange tmp = s[i];
	s[i] = s[s.size() - 1];
	s[s.size() - 1] = tmp;
	s.pop_back();
}
//ͬʱɾ������Ԫ��
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

	vector<Point> points;//all points: ��¼���еĵ㣬�������ظ���
	vector<int> toBeInsert;//δ����ĵ�ı��

	list<int> polygon;//CCW��¼simple polygon�ĵ�ı��
	list<int> convexHull;//CCW��¼convex hull�ĵ�ı��



	void build(vector<Point> p);//����㼯�������򵥶����
	void Init();//������ʼ��������
	int insert();//��������


	/* �ҵ����ʵĲ���� */
	idxRange findSupport(Point p);//�ҵ�������͹�����е����Ҷ˵�
	idxRange findSupportInChain(idxRange& chain, Point p);
	int FindCandidate(idxRange& supports, int idx, int& i, int& r);//����µ�͹�����Ƿ��������� ���ݹ���ã�ֱ���ҵ����ʵĲ����


	/* �ҵ����ʵ���չ�� */
	enum EndType { Left, Right };
	int FindAdjointSegID(const SegVec& s, int i, EndType e);
	bool VisibleTest(SegVec& s, int& SegID, int PointID);//�����ڲ���㣬��ȡ�ıߵĶ˵��Ƿ񶼿ɼ�


	void output();
};

/* ++++ �ҵ����ʵĲ���� ++++ */
idxRange simplePolygon::findSupport(Point p) {
	Point u, v, w;
	list<int>::iterator left = convexHull.end(), right = convexHull.end();

	list<int>::iterator i = convexHull.begin();
	u = points[convexHull.back()];
	v = points[*i];

	while (i != convexHull.end()) {
		//�˴�iָ��Point w
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
			i++;//����Խ��end
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

	//�˴�iָ��Point v
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
			i = Succ(convexHull, i);//������ҪԽ��end()
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
			//������Ϣ
			/*printf("Find point in new CH  %d (%d,%d), change query to it\n", toBeInsert[i], points[toBeInsert[i]].x, points[toBeInsert[i]].y);*/
			r = i;
			supports = findSupportInChain(supports, points[toBeInsert[i]]);//��С���ҷ�Χ
			ableIndex = FindCandidate(supports, toBeInsert[i], i, r);
		}
	}
	return ableIndex;
}
/* ---- �ҵ����ʵĲ���� ---- */




/* ++++ �ҵ����ʵ���չ�� ++++ */
int simplePolygon::FindAdjointSegID(const SegVec& s, int i, EndType e) {
	int adjointSegID = -1;
	//�����ѯ������˵�
	if (e == Left) {
		if (i != 0 && points[*(s[i - 1].second)] == points[*(s[i].first)])
		{
			adjointSegID = i - 1;
		}
	}
	//�����ѯ�����Ҷ˵�
	else if (e == Right) {
		if (i != s.size() - 1 && points[*(s[i + 1].first)] == points[*(s[i].second)]) { adjointSegID = i + 1; }
	}
	return adjointSegID;
}


bool simplePolygon::VisibleTest(SegVec& s, int& SegID, int PointID) {
	//�ȼ����˵��Ƿ�ɼ�
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

	//�����˵�ɼ����ټ���Ҷ˵��Ƿ�ɼ�
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

		//��������˵㶼�ɼ�
		if (!rightEnd_Beblocked) { return true; }

		//�����˵�ɼ����Ҷ˵㲻�ɼ����������ڵ�ǰһ��segment
		if (rightEnd_Beblocked && left_AdjointSegID != -1)
		{
			//!* ����SegID *!
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

		//���ǰ��û�����ڵ�Segment
		else return false;
	}
}
/* ---- �ҵ����ʵ���չ�� ---- */



int simplePolygon::insert() {

	/*�ҵ����ʵĲ����*/
	int r = rand() % toBeInsert.size();
	int insertIndex = toBeInsert[r];
	pair<list<int>::iterator, list<int>::iterator> supports = findSupport(points[insertIndex]);
	int i = 0;
	insertIndex = FindCandidate(supports, insertIndex, i, r);

	/*�ҵ����ʵ���չ��*/
	int leftSupportIdx = *supports.first;
	int rightSupportIdx = *supports.second;
	list<int>::iterator leftSupportPtr = find(polygon.begin(), polygon.end(), leftSupportIdx);
	list<int>::iterator rightSupportPtr = find(polygon.begin(), polygon.end(), rightSupportIdx);

	SegVec visibleTestPtr;
	for (list<int>::iterator i = leftSupportPtr; i != rightSupportPtr; i = Succ(polygon, i)) {
		visibleTestPtr.push_back(idxRange(i, Succ(polygon, i)));
	}

	//ȷ�Ͽɼ���
	int VisCheckSeg = rand() % (visibleTestPtr.size());
	while (!VisibleTest(visibleTestPtr, VisCheckSeg, insertIndex)) {
		VisCheckSeg = rand() % (visibleTestPtr.size());
	}

	/*���� Polygon*/
	polygon.insert(visibleTestPtr[VisCheckSeg].second, insertIndex);

	/*���� Convex Hull*/

	list<int>::iterator n = convexHull.insert(supports.second, insertIndex);
	list<int>::iterator RemovePt = Succ(convexHull, supports.first);
	while (RemovePt != n) {
		list<int>::iterator tmp = RemovePt;
		RemovePt = Succ(convexHull, RemovePt);
		convexHull.erase(tmp);
	}
	//ɾ��͹���ϵĹ��ߵ�

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


	/*���� toBeInsert*/
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

	//��֤A��B���޹��ߵ�
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
	//��֤���㲻����
	while (Area2(points[a], points[b], points[c]) == 0) {
		r3 = rand() % toBeInsert.size();
		c = toBeInsert[r3];
	}
	//��� ccw order
	if (!ToLeft(points[a], points[b], points[c])) {
		int tmp = a;
		a = b;
		b = tmp;
	}
	//����ʼ�������ڲ���������
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

	//������Ϣ������ҵ��ĳ�ʼ������
	/*printf("(%d,%d)  id: %d\n", points[a].x, points[a].y, a);
	printf("(%d,%d)  id: %d\n", points[b].x, points[b].y, b);
	printf("(%d,%d)  id: %d\n", points[c].x, points[c].y, c);*/
}

void simplePolygon::build(vector<Point> p) {
	points = p;
	for (int i = 0; i < points.size(); i++) {
		points[i].id = i;//����id��rank��ͬ
		toBeInsert.push_back(i);
	}
	Init();//��ʼ��

	while (toBeInsert.size() > 0) {
		insert();//������
	}
}


//ccw�����������id
void simplePolygon::output() {
	for (list<int>::iterator i = polygon.begin(); i != polygon.end(); i++) {
		printf("(%d,%d)  id: %d\n", points[*i].x, points[*i].y, *i);
	}
}
