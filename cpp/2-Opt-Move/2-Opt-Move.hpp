#ifndef twoOptMove_H
#define twoOptMove_H
#include<vector>
using namespace std;

typedef struct tom_singleEdge tom_edge;
typedef tom_edge *tom_edgeP;
typedef struct tom_intersectInfo tom_sect;
typedef tom_sect *tom_sectP;

struct tom_singleEdge{
    tom_sectP prev, next;  //存储了与这条边相交的相交关系的list【维护连续相交关系用的，一条边的多个相交线】
    int pIdx1, pIdx2;   //存储了edge两个端点所在points的下标
};

struct tom_intersectInfo{   //tom_sectP为指向这个结构体的指针
    //存储相交的两条边
    tom_edge edge[2];   //存储edge的时候是有顺序的，起始端点idx小的edge先存储。起始端点相同，末尾端点大的先存储
    tom_sectP prev, next;   //在tom_sectList中的前驱和后继【维护tom_sectList链表用的，前驱后继】
};

typedef struct tom_intersectInfoList{
    tom_sectP first;
    int numOfElems;
}tom_sectList;

typedef struct tom_intArray{
    int *array;     //里面存储真实的idx？【val】，这个index对应的是tom_points的idx。【与这个结构体中array的不一定不一致】
    int numOfElems; //表示polygon里面有多少个点
}tom_polygon;

typedef struct {
    tom_intArray array; //其中的array中的每个idx，为下一个相连point的idx【idx与array[idx]相连】
    int startPoint; //存储了一个linkpoly的开始位置
}tom_linkPoly;


struct tom_point{
    double x;
    double y;
    tom_point(){}
    tom_point(double xx, double yy):x(xx),y(yy){}
    bool operator == (const tom_point b) const {
        return (x == b.x)&&(y == b.y);
    }
    bool operator < (const tom_point b) const {
        return (x < b.x) || ((x == b.x) && (y < b.y));
    }
};

typedef struct tom_pointArray{
    tom_point *array;  
    int numOfPoints;    
}tom_points;

tom_polygon tom_initPoly();
tom_points tom_initPoint(vector<pair<double, double> > &pointVec);
void tom_polyToFile(tom_polygon *polygon, tom_points *points, int numOfpolys, FILE *outFile);
void tom_do2optMoves(tom_polygon* polygon, tom_points *points, int numOfpoints);
// tom_genPoly(tom_polygon *polygon, tom_points *points, int numOfpolys);


#endif