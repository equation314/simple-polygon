#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>
#include "2-Opt-Move.hpp"
#include "basicOperation.hpp"
using namespace std;

/******************************************
 *                                        *
 *             Clarification              *
 *                                        *
 *****************************************/

int p_isIntersectSegments(tom_points *points, int edge1s, int edge1e, int edge2s, int edge2e);
int isAOnLine(tom_point point1,  tom_point point2, tom_point a);
tom_point p_getPointOfArray(tom_points *points, int index);
bool isIntersectOrderedSegs(tom_point e1point1, tom_point e1point2, tom_point e2point1, tom_point e2point2);



/******************************************
 *                                        *
 *          Error Handling                *
 *                                        *
 *****************************************/

void reportError(int errNum)
{
    switch (errNum)
    {
    case ERR_MEM:
        fprintf(stderr, "ERROR: ALLOCATE MEMORY\n");
        break;
    case ERR_UNDEFINED:
        fprintf(stderr, "ERROR: SOMETHING UNDEFINED HAPPENDS\n");
        break;
    case ERR_INDEX:
        fprintf(stderr, "ERROR: INDEX OVERFLOWS OR UNDERFLOWS\n");
        break;
    case ERR_FILE:
        fprintf(stderr, "ERROR: FILE HANDLING PROBLEM\n");
        break;
    case ERR_LINE:
        fprintf(stderr, "ERROR: TWO POINTS OVERLAPS\n");
        break;
    default:
        return;
    }
    exit(1);
}

/******************************************
 *                                        *
 *          Basic Operation               *
 *                                        *
 *****************************************/

void randomSeed()
{
    srand((unsigned)time(0));
}

int randomInt(int min, int max)     //闭区间 -> [min, max]
{
    int result = min + (rand() % (max - min + 1));
    if (result > max)
        result = max;
    else if (result < min)
        result = min;
    return result;
}

void writeToFile(FILE *file, tom_polygon *poly)
{
    if (file == NULL)
    {
        reportError(ERR_FILE);
    }
    int nOfPolyPoints = p_numOfPolyElems(poly);
    if (nOfPolyPoints > 0)
    {
        fprintf(file, "RANDOM SIMPLE POLYGON BY 2-opt Moves\n");
        for (int i = 0; i < nOfPolyPoints; i++)
        {
            fprintf(file, "%u\n", p_getPIndexOfPoly(poly, i));
        }
    }
    fflush(file);
}

/******************************************
 *                                        *
 *         CG Structure Operation         *
 *                                        *
 *****************************************/

void p_initPoly(tom_polygon *poly, int numOfPoints)
{
    if (numOfPoints > 0)
    {
        poly->numOfElems = numOfPoints;
        poly->array = (int *)calloc(poly->numOfElems, sizeof(int)); //为poly的array进行空间分配
        if (poly->array == NULL)
            reportError(ERR_MEM);
        //init
        int *arr = poly->array;
        for (int i = 0; i < poly->numOfElems; i++)
        {
            arr[i] = -1;
        }
    }
    else
        poly->numOfElems = 0;
}


void p_freeArrayOfPoly(tom_polygon *poly)
{
    if (poly->numOfElems > 0)
        free(poly->array);
    poly->numOfElems = 0;
}

void p_setIndexOfPoly(tom_polygon *poly, int index, int value)
{
    if (index < 0 || index >= p_numOfPolyElems(poly))
        reportError(ERR_INDEX);
    poly->array[index] = value;
}



//交换poly->array的index1和index2下的val
void p_polyElementSwap(tom_polygon *poly, int index1, int index2)
{
    if (min(index1, index2) < 0 || max(index1, index2) >= p_numOfPolyElems(poly))
    {
        reportError(ERR_INDEX);
    }
    if (index1 != index2)
    {
        int val1 = p_getPIndexOfPoly(poly, index1);
        p_setIndexOfPoly(poly, index1, p_getPIndexOfPoly(poly, index2));
        p_setIndexOfPoly(poly, index2, val1);
    }
}

void p_getrandomPermuation(tom_polygon *poly)
{
    int swapIdx;
    int sz = p_numOfPolyElems(poly);
    for (int i = 0; i < sz; i++)
    {
        p_setIndexOfPoly(poly, i, i); //以index进行赋值
    }
    for (int i = 0; i < sz - 1; i++)
    {
        swapIdx = randomInt(i, sz - 1);
        p_polyElementSwap(poly, i, swapIdx);
    }
}

//顶点与顶点不重合、顶点不在边上、边与边不相交的多边形
int p_isSimplePolygon(tom_polygon *poly, tom_points *points)
{
    int nOfPolyPoints = p_numOfPolyElems(poly);
    int idx1, idx2;
    int isSPG = 1;
    for (int i = 0; (i < nOfPolyPoints - 1) && isSPG; i++)
    {
        idx1 = i;
        for (int j = i + 1; j < nOfPolyPoints && isSPG; j++)
        {
            idx2 = j;
            isSPG = (!p_isIntersectSegments(points, p_getPIndexOfPoly(poly, idx1), p_getPIndexOfPoly(poly, idx1 + 1), p_getPIndexOfPoly(poly, idx2), p_getPIndexOfPoly(poly, (idx2 + 1) % nOfPolyPoints)));
        }
    }
    return isSPG;
}
//CCW:逆时针顺序
bool p_isCCWOrderPoly(tom_polygon* poly, tom_points* points){
    bool ans = true;
    tom_point p1 = p_idxOfPoints(points, p_getPIndexOfPoly(poly, poly->numOfElems - 1));
    tom_point p2 = p_idxOfPoints(points, p_getPIndexOfPoly(poly, 0));
    tom_point p3 = p_idxOfPoints(points, p_getPIndexOfPoly(poly, 1));
    if(isAOnLine(p1, p2, p3) == -1)
        ans = false;
    return ans;
}

void p_normalizePoly(tom_polygon* poly, tom_points *points){
    if(poly->numOfElems > 0){
        if(p_getPIndexOfPoly(poly, 0) != 0){    //要求poly的连接顺序必须是以节点1开始的
            //check whether the first point has index 1
            //不满足则重新通过linkpoly来重构poly【copy to a link polygon and back】
            tom_linkPoly linkPoly;
            p_poly2LinkedPoly(poly, &linkPoly);
            if(poly->numOfElems > 0)
                free(poly->array);
            poly->numOfElems = 0;
            p_linkedPoly2Poly(&linkPoly, poly);
            if(linkPoly.array.numOfElems > 0);
                free(linkPoly.array.array);
            linkPoly.array.numOfElems = 0;
        }

        //check if in ccw order
        if(!p_isCCWOrderPoly(poly, points)){
            //cw的顺序，需要转换为ccw的顺序[做一半len的对称交换]
            for(int i = 1; i < (poly->numOfElems+1)/2; i++){    //交换的时候，对于偶数点，idx=0和mid的不交换；奇数点idx=0的不交换
                p_polyElementSwap(poly, i, poly->numOfElems - i);
            }
        }
    }
}


void p_initLinkPoly(tom_linkPoly *linkPoly, int numOfPoints){
    linkPoly->startPoint = -1;
    tom_intArray *a_linkPoly = &(linkPoly->array);
    if(numOfPoints > 0){
        a_linkPoly->numOfElems = numOfPoints;
        a_linkPoly->array = (int *)calloc(a_linkPoly->numOfElems, sizeof(int));
        if(a_linkPoly->array == NULL)
            reportError(ERR_MEM);
        for(int i = 0; i < a_linkPoly->numOfElems; i++){
            a_linkPoly->array[i] = -1;
        }    
    }else{
        a_linkPoly->numOfElems = 0;
    }
}


//@argv: idx和nextidx为points的下标，存在直接相连的关系。
//从linkpoly的startPoint开始，不停访问array就可以得到下一个point的idx。
void p_setNextOfLinkPoly(tom_linkPoly* linkPoly, int idx, int nextidx){
    tom_intArray* a_linkPoly = &(linkPoly->array);
    if( idx < 0 || idx >= a_linkPoly->numOfElems)
        reportError(ERR_INDEX);
    a_linkPoly->array[idx] = nextidx;   // link的关系
    linkPoly->startPoint = idx;
}

int p_getNextOfLinkPoly(tom_linkPoly* linkPoly, int idx){
    if(idx < 0 || idx >= (linkPoly->array).numOfElems)
        reportError(ERR_INDEX);
    return (linkPoly->array).array[idx];
}

void p_poly2LinkedPoly(tom_polygon* poly, tom_linkPoly *linkPoly){
    int sz = p_numOfPolyElems(poly);
    p_initLinkPoly(linkPoly, sz);

    for(int i = 0; i < sz - 1; i++){
        p_setNextOfLinkPoly(linkPoly, p_getPIndexOfPoly(poly, i), p_getPIndexOfPoly(poly, i+1));
    }
    p_setNextOfLinkPoly(linkPoly, p_getPIndexOfPoly(poly, sz - 1), p_getPIndexOfPoly(poly, 0));
}

void p_linkedPoly2Poly(tom_linkPoly* linkPoly, tom_polygon* poly){

    //清空poly，重新从linkpoly生成
    p_initPoly(poly, linkPoly->array.numOfElems);
    int currIdx = 0;
    
    if(linkPoly->array.numOfElems > 0){
        //Q: ??为什么要判断==-1?什么时候linkPoly中的array value会等于-1【前面的点不形成polygon的一部分？】
        while(p_getNextOfLinkPoly(linkPoly, currIdx) == -1) //感觉像是找到一个连通域
            currIdx++;
        //找到第一个不等于-1的linkpoly array点。【这样的话说明形成的polygon不是包括所有的点】
        for(int i = 0; i < poly->numOfElems; i++){
            p_setIndexOfPoly(poly, i, currIdx);
            currIdx = p_getNextOfLinkPoly(linkPoly, currIdx);
        }
    }
}

void p_freeAllPoints(tom_points *points)
{
    if (points->numOfPoints > 0)
        free(points->array);
    points->numOfPoints = 0;
}

//@return: 相交(true)，不相交(false)
//@argv: 不要求顺序
int p_isIntersectSegments(tom_points *points, int edge1s, int edge1e, int edge2s, int edge2e)
{
    int e1min, e1max;
    int e2min, e2max;

    e1min = min(edge1e, edge1s);
    e1max = max(edge1e, edge1s);
    e2min = min(edge2e, edge2s);
    e2max = max(edge2e, edge2s);

    //Q: points的idx按照x轴/y轴维护过顺序？【否则下述不一定成立？】
    if (e1max <= e2min) //挨着共线认为是不相交
        return false;
    if(e2max <= e1min)
        return false;

    tom_point e1spoint, e1epoint, e2spoint, e2epoint;
    e1spoint = p_getPointOfArray(points, e1min);
    e1epoint = p_getPointOfArray(points, e1max);
    e2spoint = p_getPointOfArray(points, e2min);
    e2epoint = p_getPointOfArray(points, e2max);

    if((e1min < e2min) ||((e1min == e2min) && (e1max < e2max))){
        return isIntersectOrderedSegs(e1spoint,e1epoint,e2spoint,e2epoint);
    }else{
        return isIntersectOrderedSegs(e2spoint,e2epoint,e1spoint,e1epoint);
    }       
}

int p_isIntersectEdge(tom_points *points, int edge1s, int edge1e, int edge2s, int edge2e){
    return p_isIntersectSegments(points, edge1s, edge1e, edge2s, edge2e);
}


//调用该函数前check了，搭接的情况
bool isIntersectOrderedSegs(tom_point e1point1, tom_point e1point2, tom_point e2point1, tom_point e2point2){
    int e1sPos, e1ePos, e2sPos, e2ePos;
    int res1, res2, ans;
    e1sPos = isAOnLine(e2point1, e2point2, e1point1);
    e1ePos = isAOnLine(e2point1, e2point2, e1point2);

    //if in same side
    if((res1 = e1sPos * e1ePos) == 1){    //1 ~
        ans = false; //不相交
    }
    else{
        e2sPos = isAOnLine(e1point1, e1point2, e2point1);
        e2ePos = isAOnLine(e1point1, e1point2, e2point2);
        if ( (res2 = e2sPos * e2ePos) == 1 ){ // ~ 1
            ans = false;    //不相交
        }else if(res1 + res2 == -2){    // -1 -1
            ans = true; //相交
        }else if((e1sPos + 2*e1ePos + 4*e2sPos + 8*e2ePos) == 0){ //-1 0、0 -1、0 ~、~ 0【这里即以后是handle 0 的情况】
            //测试共线[必须四个点都为0，才可能满足=0]
            //ans = 0;
            if(e2point1 < e1point2)
                ans = true; //部分重叠、共线[认为是相交]
            else
                ans = false;
        }else{  //非全为0，而是部分为0【-1 0、1 0、0 -1、0 1】
            //点在线上【不包括线的端点】
            ans = (!(e1point1 == e2point1) &&
                    !(e1point1 == e2point2) &&
                     !(e1point2 == e2point1) &&
                      !(e1point2 == e2point2));
        }
    }
    return ans;
}

//找到边point1-point2的相交关系list的头部的边，在isectArray的位置。
//为了节省空间，不直接使用完整的二维数组记录heeder。
//isectArray可以理解为一维的指针数组。每个元素都是一组相交关系的header
//其中Point Idx = 0有关的相关相交关系占用n-1的位置、Point Idx = 1有关的相关相交关系占用n-2的位置、……
//每个点只记录idx大于这个点的相交关系的header。【每个指针指向的结构体的prev、next才是记录这条边以西恶劣】
//备注：(2*n - i1 - 1)*i1/2 = (n-1) + (n-2) + ... + (n-i1)
tom_sectP* getHeadSectOfEdgeInArray(tom_sectP* sectArray, int pIdx1, int pIdx2, int numOfPoints){
    int minpIdx,maxpIdx;
    minpIdx = min(pIdx1, pIdx2);
    maxpIdx = max(pIdx1, pIdx2);
    //(2*numOfPoints - minpIdx)*(minpIdx - 1)/2先定位到i1点相关的相交关系所在位置
    //改该位的偏移 maxpIdx - minpIdx - 1，是edge = points[minpIdx]~points[maxpIdx]的相交关系的header
    int offset = (2*numOfPoints - minpIdx -1 )*(minpIdx)/2 + maxpIdx - minpIdx - 1;
    return (sectArray + offset);
}

/// 维护sectArray、sectList的数据结构，newSect为需要新插入的交线
/// 
/// argv: sectArray存储了所有相交关系的数组
///
/// Panic: 
void addIntersect(tom_sectP *sectArray, tom_intersectInfoList* sectList, tom_intersectInfo* newSect, int numOfPoints){
    tom_sectP* firstSectOfEdge;
    //insert edge0 into head of its sect list
    firstSectOfEdge = getHeadSectOfEdgeInArray(sectArray, newSect->edge[0].pIdx1, newSect->edge[0].pIdx2, numOfPoints);
    newSect->edge[0].next = (*firstSectOfEdge);
    newSect->edge[0].prev = NULL;

    //如果不是第一条边/原来没有和这个edge的相交边，需要更新原来head的prev
    if((*firstSectOfEdge) != NULL){
        //判断这个相交关系要放到哪个list里面
        if(((*firstSectOfEdge)->edge[0].pIdx1 == newSect->edge[0].pIdx1) &&
            (*firstSectOfEdge)->edge[0].pIdx2 == newSect->edge[0].pIdx2){
                (*firstSectOfEdge)->edge[0].prev = newSect; //因为原来已经是head了，原来的next不用改变，前驱从null变为现在的newsect【完成头部插入】
            }
        else{
            (*firstSectOfEdge)->edge[1].prev = newSect;
        }
    }
    (*firstSectOfEdge) = newSect;

    //insert edge1 into head of its sect list
    firstSectOfEdge = getHeadSectOfEdgeInArray(sectArray, newSect->edge[1].pIdx1, newSect->edge[1].pIdx2, numOfPoints);
    newSect->edge[1].next = (*firstSectOfEdge);
    newSect->edge[1].prev = NULL;

    if((*firstSectOfEdge) != NULL){
        if(((*firstSectOfEdge)->edge[0].pIdx1 == newSect->edge[1].pIdx1) &&
            (*firstSectOfEdge)->edge[0].pIdx2 == newSect->edge[1].pIdx2){
                (*firstSectOfEdge)->edge[0].prev = newSect;
            }
        else{
            (*firstSectOfEdge)->edge[1].prev = newSect;
        }
    }
    (*firstSectOfEdge) = newSect;

    //从头部插入sectList【这里面应该是按照插入顺序存储的相交关系】
    newSect->prev = NULL;
    newSect->next = sectList->first;
    if(sectList->first != NULL){
        sectList->first->prev = newSect;
    }
    sectList->first = newSect;
    sectList->numOfElems++;
}

void removeInterset(tom_sectP *sectArray, tom_intersectInfoList* sectList, tom_intersectInfo* delSect, int numOfPoints){
    tom_sectP auxSect;
    //delete edge0 of sectArray
    //前向解链
    if(delSect->edge[0].prev != NULL){
        auxSect = delSect->edge[0].prev;
        if(auxSect->edge[0].next == delSect){
            auxSect->edge[0].next = delSect->edge[0].next;
        }else{
            auxSect->edge[1].next = delSect->edge[0].next;
        }
    }else{
        //现在delete的就是和自己相关的相交关系组的header
        tom_sectP* firstSectOfEdge = getHeadSectOfEdgeInArray(sectArray,delSect->edge[0].pIdx1,delSect->edge[0].pIdx2,numOfPoints);
        (*firstSectOfEdge) = delSect->edge[0].next;
    }

    //后向解链
    if(delSect->edge[0].next != NULL){
        auxSect = delSect->edge[0].next;
        if(auxSect->edge[0].prev == delSect){
            auxSect->edge[0].prev = delSect->edge[0].prev;
        }else{
            auxSect->edge[1].prev = delSect->edge[0].prev;
        }
    }

    //delete edge1 of sectArray
    //前向解链
    if(delSect->edge[1].prev != NULL){
        auxSect = delSect->edge[1].prev;
        if((auxSect->edge[0].pIdx1 == delSect->edge[1].pIdx1) && (auxSect->edge[0].pIdx2 == delSect->edge[1].pIdx2)){
            auxSect->edge[0].next = delSect->edge[1].next;
        }else{
            auxSect->edge[1].next = delSect->edge[1].next;
        }
    }else{
        //现在delete的就是和自己相关的相交关系组的header
        tom_sectP* firstSectOfEdge = getHeadSectOfEdgeInArray(sectArray,delSect->edge[1].pIdx1,delSect->edge[1].pIdx2,numOfPoints);
        (*firstSectOfEdge) = delSect->edge[1].next;
    }

    //后向解链
    if(delSect->edge[1].next != NULL){
        auxSect = delSect->edge[1].next;
        if((auxSect->edge[0].pIdx1 == delSect->edge[1].pIdx1) && (auxSect->edge[0].pIdx2 == delSect->edge[1].pIdx2)){
            auxSect->edge[0].prev = delSect->edge[1].prev;
        }else{
            auxSect->edge[1].prev = delSect->edge[1].prev;
        }
    }

    //delete interset relation from sectList 
    if(delSect->prev != NULL){
        delSect->prev->next = delSect->next;
    }else{
        sectList->first = delSect->next;
    }
    if(delSect->next != NULL){
        delSect->next->prev = delSect->prev;
    }
    sectList->numOfElems--;
}

void createIntersect(int edge1s, int edge1e, int edge2s, int edge2e, tom_sectP* sectArray, tom_sectList* sectList, int numOfPoints){
    tom_sectP sectInfo;

    int e1p1 = min(edge1e, edge1s);
    int e1p2 = max(edge1e, edge1s);
    int e2p1 = min(edge2s, edge2e);
    int e2p2 = max(edge2s, edge2e);

    //存储下这条交线
    sectInfo = (tom_sectP) malloc(sizeof(tom_sect));    //有malloc
    if(sectInfo == NULL)
        reportError(ERR_MEM);
    if((e1p1 < e2p1) || ((e1p1 == e2p1)&& (e1p2 > e2p2))){
        sectInfo->edge[0].pIdx1 = e1p1;
        sectInfo->edge[0].pIdx2 = e1p2;
        sectInfo->edge[1].pIdx1 = e2p1;
        sectInfo->edge[1].pIdx2 = e2p2;
    }else{
        sectInfo->edge[0].pIdx1 = e2p1;
        sectInfo->edge[0].pIdx2 = e2p2;
        sectInfo->edge[1].pIdx1 = e1p1;
        sectInfo->edge[1].pIdx2 = e1p2;
    }   
    addIntersect(sectArray, sectList, sectInfo, numOfPoints);
}

void createAllIntersect(tom_points *points, tom_linkPoly *linkPoly, int org, tom_sectP* sectArray, tom_sectList* sectList, int numOfPoints){
    int currPIdx = p_getNextOfLinkPoly(linkPoly, org);
    int dst = p_getNextOfLinkPoly(linkPoly, org);
    //遍历整个linkPoly，查看是否有和org-dst相交的边，有就create
    do{
        //判断给定的边，是否和当前edge相交。
        if(p_isIntersectEdge(points, org, dst, currPIdx, p_getNextOfLinkPoly(linkPoly, currPIdx))){
            createIntersect(org, dst, currPIdx, p_getNextOfLinkPoly(linkPoly, currPIdx), sectArray, sectList, numOfPoints);
        }
        currPIdx = p_getNextOfLinkPoly(linkPoly, currPIdx);
    }while(currPIdx != org);
}

void removeAllIntersect(int pIdx1, int pIdx2, tom_sectP* sectArray, tom_sectList *sectList, int numOfPoints){
    tom_intersectInfo* currSect;
    currSect = *(getHeadSectOfEdgeInArray(sectArray, pIdx1, pIdx2, numOfPoints));
    while(currSect != NULL){
        removeInterset(sectArray,sectList,currSect,numOfPoints);    //内部没有free，出来之后进行free
        free(currSect);
        currSect = *(getHeadSectOfEdgeInArray(sectArray, pIdx1, pIdx2, numOfPoints));
    }
}

//进来之前，edge1和edge2的相交关系就已经被remove过了
//现在只是要2-optmove这两条边，然后重新建立section的关系
void untangleIntersect(int e1pIdx1, int e1pIdx2, int e2pIdx1, int e2pIdx2, tom_points* points, tom_linkPoly* linkPoly, tom_sectP * sectArray, tom_sectList* sectList, int numOfPoints){
    int org1, dst1, org2, dst2;
    //之前的remove操作都没有涉及到linkPoly结构维护，这里才开始处理
    
    //根据linkpoly的link关系，确定edge的方向，找到org点和dst点。
    if(p_getNextOfLinkPoly(linkPoly, e1pIdx1) == e1pIdx2){
        org1 = e1pIdx1;
        dst1 = e1pIdx2;
    }else{
        org1 = e1pIdx2;
        dst1 = e1pIdx1;
    }

    if(p_getNextOfLinkPoly(linkPoly, e2pIdx1) == e2pIdx2){
        org2 = e2pIdx1;
        dst2 = e2pIdx2;
    }else{
        org2 = e2pIdx2;
        dst2 = e2pIdx1;
    }

    tom_point org1Point, org2Point, dst1Point, dst2Point;
    org1Point = p_getPointOfArray(points,org1);
    dst1Point = p_getPointOfArray(points,dst1);
    org2Point = p_getPointOfArray(points,org2);
    dst2Point = p_getPointOfArray(points,dst2);


    int befEdge2org;
    bool swapFlag = false;
    int nextPIdx,oldPIdx;
    /* 第一种情况：一条线段完全在另外一条线段的内部
    
    /* 已知e1p1 <= e1p2, e1p1 <= e2p1, e2p1 < e2p2 和 e1p2 < e1p1 (相交关系存储的时候维护的顺序信息) 
     唯一需要check的是 e2p2 < e1p2 是否满足*/
    if(isAOnLine(org1Point,dst1Point,org2Point) == 0 && (isAOnLine(org1Point, dst1Point, dst2Point) == 0) && (e2pIdx2 <= e1pIdx2)){
        //edge2在edge1内部
        //根据link的关系，edge1：org1 -> dst1, edge2: org2 -> dst2。
        //按照相交规则，org2应该是"回头"连到dst2，才和edge1相交。
        //节点顺序上应该是org1 dst2 org2 dst1
        //①先处理共端点的情况
        if(org1 == dst2){
            befEdge2org = dst1;
            while(p_getNextOfLinkPoly(linkPoly, befEdge2org) != org2){
                befEdge2org = p_getNextOfLinkPoly(linkPoly, befEdge2org);
            }
            removeAllIntersect(befEdge2org, org2, sectArray, sectList, numOfPoints);    //只要有动到的edge，相交关系就先删掉，之后再重新check sect的情况
            p_setNextOfLinkPoly(linkPoly, befEdge2org, org1);
            p_setNextOfLinkPoly(linkPoly, org1, org2);
            p_setNextOfLinkPoly(linkPoly, org2, dst1);
            
            createAllIntersect(points, linkPoly, org1, sectArray, sectList, numOfPoints);
            createAllIntersect(points, linkPoly, org2, sectArray, sectList, numOfPoints);
            createAllIntersect(points, linkPoly, befEdge2org, sectArray, sectList, numOfPoints);
        }else if(dst1 == org2){
            removeAllIntersect(dst2, p_getNextOfLinkPoly(linkPoly, dst2), sectArray, sectList, numOfPoints);

            p_setNextOfLinkPoly(linkPoly, dst1, p_getNextOfLinkPoly(linkPoly,dst2));
            p_setNextOfLinkPoly(linkPoly, org1, dst2);
            p_setNextOfLinkPoly(linkPoly, dst2, dst1);

            createAllIntersect(points, linkPoly, org1, sectArray, sectList, numOfPoints);
            createAllIntersect(points, linkPoly, dst2, sectArray, sectList, numOfPoints);
            createAllIntersect(points, linkPoly, dst1, sectArray, sectList, numOfPoints);
        }else{  //②端点没有重叠
            befEdge2org = dst1;
            while(p_getNextOfLinkPoly(linkPoly, befEdge2org) != org2){
                befEdge2org = p_getNextOfLinkPoly(linkPoly, befEdge2org);
            }
            removeAllIntersect(befEdge2org, org2, sectArray, sectList, numOfPoints);
            removeAllIntersect(dst2, p_getNextOfLinkPoly(linkPoly, dst2), sectArray, sectList, numOfPoints);

            p_setNextOfLinkPoly(linkPoly, befEdge2org, p_getNextOfLinkPoly(linkPoly, dst2));
            createAllIntersect(points, linkPoly, befEdge2org, sectArray, sectList, numOfPoints);

            //重新连接org1, dst1, org2, dst2【Q：为什么这里要分类？】
            if((org1 < dst1) == (org2 < dst2)){    // o1 => o2 => d2 => d1
                p_setNextOfLinkPoly(linkPoly, org1, org2);
                p_setNextOfLinkPoly(linkPoly, org2, dst2);
                p_setNextOfLinkPoly(linkPoly, dst2, dst1);
            }else{                               // o1 => d2 => o2 => d1
                p_setNextOfLinkPoly(linkPoly, org1, dst2);
                p_setNextOfLinkPoly(linkPoly, dst2, org2);  //可能是为了想要相对有序？
                p_setNextOfLinkPoly(linkPoly, org2, dst1);
            }
            createAllIntersect(points, linkPoly, org1, sectArray, sectList, numOfPoints);    //所有动过的边的org都要重新create
            createAllIntersect(points, linkPoly, org2, sectArray, sectList, numOfPoints);
            createAllIntersect(points, linkPoly, dst2, sectArray, sectList, numOfPoints);
        }
    }else{  //其他情况：非完全重叠/包含【部分重叠或有夹角的相交，org和org相连，dst和dst相连】
        nextPIdx = dst2;
        oldPIdx = p_getNextOfLinkPoly(linkPoly, org1);
        /* check whether Index 0 lies within d2->o1 */
        while((nextPIdx != oldPIdx) && !swapFlag){
            swapFlag = (nextPIdx == 0); //check，在dst2重新连接到dst1之前，跳过的那么多点，是不是有经过idx 0点，如果有经过idx 0，会改变ccw的顺序
            nextPIdx = p_getNextOfLinkPoly(linkPoly, nextPIdx);
        }
         /* point 0 lies on the chain from d2->o1, so we must invert the other half of the polygon! => swap edge1 and edge2 */
        int tmpSwap;
        if(swapFlag){
            tmpSwap = org1;
            org1 = org2;
            org2 = tmpSwap;

            tmpSwap = dst1;
            dst1 = dst2;
            dst2 = tmpSwap;
        }

         /* Q：revert orientation in the chain from d2->o1[逆顺序这条边， 因为要relink了，有一个侧的边的顺序要修改过来] */ 
        int newNextIdx = p_getNextOfLinkPoly(linkPoly, dst2);
        //newNext nextPIdx -> oldPIdx
        nextPIdx = dst2;
        do{
            oldPIdx = nextPIdx;
            nextPIdx = newNextIdx;
            newNextIdx = p_getNextOfLinkPoly(linkPoly, nextPIdx);

            p_setNextOfLinkPoly(linkPoly, nextPIdx, oldPIdx);
        }while(nextPIdx != org1);

        p_setNextOfLinkPoly(linkPoly, dst2, dst1);
        p_setNextOfLinkPoly(linkPoly, org2, org1);
        createAllIntersect(points, linkPoly, dst2, sectArray, sectList, numOfPoints);
        createAllIntersect(points, linkPoly, org2, sectArray, sectList, numOfPoints);
    }
    
}

double area(tom_point point1, tom_point point2, tom_point point3){
    //return point1.x * point2.y - point1.y * point2.x + point2.x * point3.y - point2.y * point3.x + point3.x * point1.y - point3.y * point1.x;
    double twiceArea = (point3.y - point1.y)*(point2.x - point1.x) -
    (point3.x - point1.x)*(point2.y - point1.y);  
    if (fabs(twiceArea) <= DELTA)  /* test if result lt delta */
        twiceArea = 0.0;
    return twiceArea;
}

int isAOnLine(tom_point point1,  tom_point point2, tom_point a){
    double areaTwice = area(point1, point2, a);

    if(fabs(areaTwice) <= DELTA){
        return 0;
    }else if(areaTwice > DELTA){
        return 1;
    }else if(areaTwice < -DELTA){
        return -1;
    }
    reportError(ERR_UNDEFINED);
    return 0;
}

tom_point p_getPointOfArray(tom_points *points, int index)
{
    if (index < 0 || index >= p_NumOfPoints(points))
        reportError(ERR_INDEX);
    return points->array[index];
}


void p_initIntersectInfoList(tom_intersectInfoList * sectList){
    sectList->first = NULL;
    sectList->numOfElems = 0;
}