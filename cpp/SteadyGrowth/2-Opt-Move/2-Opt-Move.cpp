/*
 *      ___       ___       ___   
 *     /\  \     /\  \     /\__\  
 *     \:\  \   /::\  \   /::L_L_ 
 *     /::\__\ /:/\:\__\ /:/L:\__\
 *    /:/\/__/ \:\/:/  / \/_/:/  /
 *    \/__/     \::/  /    /:/  / 
 *               \/__/     \/__/  
 * FileName: 2-Opt-Move.cpp
 * Remark: 2-Opt-Move.cpp
 * Project: CG大作业
 * Author: spidermana
 * File Created: Wednesday, 9th June 2021 3:17:08 pm
 * Last Modified: Wednesday, 9th June 2021 5:31:23 pm
 * Modified By: spidermana
 */

#include<iostream>
#include<algorithm>
#include<vector>
#include "2-Opt-Move.hpp"
#include "basicOperation.hpp"
using namespace std;
//@argv: points-> nothing;
tom_polygon tom_initPoly(){
    tom_polygon poly;
    //poly = (tom_polygon*)malloc(sizeof(tom_polygon));
    poly.numOfElems = 0;
    poly.array = NULL;
    return poly;
}
tom_points tom_initPoint(vector<pair<double, double> > &pointVec){
    tom_points points;
    // if(pointVec.size() == 0)
    //     return;
    //points = (tom_points *)malloc(sizeof(tom_points));
    int sz = pointVec.size();
    points.array = (tom_point *)calloc(sz, sizeof(tom_point));
    points.numOfPoints = sz;
    for(int i = 0; i < sz; i++){
        points.array[i] = tom_point(pointVec[i].first, pointVec[i].second);
    }
    return points;
}
//@argv: polygon-> alloc self(not include inside); points-> alloc all and have value
void tom_polyToFile(tom_polygon *polygon, tom_points *points, int numOfpolys, FILE *outFile){
    randomSeed();   
    int numOfPoints = p_NumOfPoints(points);
    //小于三个点的不处理
    //Q: 【甚至等于3个点的也可以不处理，因为只有一种类型的poly】
    if( numOfPoints >= 3 ){
        // 初始基于给定的点集，生成numOfpolys个polygon。
        for(int polyidx = 0; polyidx <= numOfpolys; polyidx++){
            // init
            p_freeArrayOfPoly(polygon);
            p_initPoly(polygon, numOfPoints);
            // a random permutation【polygon中的array顺序就是polygon的连接顺序，polygon->array[i]~polygon->array[i+1]相连【point[polygon->array[i]]和point[polygon->array[i+1]]相连】
            p_getrandomPermuation(polygon);
            // do two opts moves [ less than O(n^3) operations ]
            tom_do2optMoves(polygon, points, numOfPoints);
            
            //check
            if(!p_isSimplePolygon(polygon, points)){
                printf("WRONG ANS of RPG!");
                exit(1);
            }
            //output the ans
            if(outFile != NULL){
                writeToFile(outFile, polygon);
            }
        }
    }
    p_freeAllPoints(points);
    p_freeArrayOfPoly(polygon);
}

//最终生成的simply polygon，重新覆盖在polygon参数中返回
void tom_do2optMoves(tom_polygon* polygon, tom_points *points, int numOfpoints){
    
    //1. 将polygon转为linkpoly，linkpoly直接存储了points下标的连接关系
    tom_linkPoly linkedPoly;
    p_poly2LinkedPoly(polygon,&linkedPoly);
    
    //2. init相交信息
    tom_intersectInfoList sectList;    
    p_initIntersectInfoList(&sectList);
    
    int numOfsecEdges;  //max的值【对于n个点，最多会有n*(n-1)/2个交点、交线】
    tom_sectP *sectArray, currSect;

    numOfsecEdges = ((numOfpoints*numOfpoints) - numOfpoints)/2;  
    sectArray = (tom_sectP *)calloc(numOfsecEdges, sizeof(tom_sectP));
    for(int i = 0; i < numOfsecEdges; i++){
        sectArray[i] = NULL;    //初始化为NULL
    }

    //算法正式开始，计算交点、并且记录到结构体中
    int edge1P = 0, edge2P;
    for(int i = 0; i < numOfpoints - 1; i++, edge1P = p_getNextOfLinkPoly(&linkedPoly, edge1P)){   //n个点，共有n-1条边
        edge2P = edge1P;
        for(int j = i; j < numOfpoints - 1; j++){
            edge2P = p_getNextOfLinkPoly(&linkedPoly, edge2P);
            if(p_isIntersectEdge(points, edge1P, p_getNextOfLinkPoly(&linkedPoly, edge1P), edge2P, p_getNextOfLinkPoly(&linkedPoly, edge2P))){
                createIntersect(edge1P, p_getNextOfLinkPoly(&linkedPoly, edge1P), edge2P, p_getNextOfLinkPoly(&linkedPoly, edge2P),sectArray, &sectList, numOfpoints);
            }
        }
    }

    //现在处理所有相交的问题=>解相交
    while(sectList.numOfElems > 0){ //直到没有相交关系的时候结束，O(n^3)的相交关系
        //随机选择一个相交关系
        int randomIndex = randomInt(0, sectList.numOfElems - 1);  
        currSect = sectList.first;
        while(randomIndex > 0){
            currSect = currSect->next;
            randomIndex--;
        }
        //对当前随机选中的currSect进行处理
        int e1s, e1e, e2s, e2e;  
        e1s = currSect->edge[0].pIdx1;
        e1e = currSect->edge[0].pIdx2;
        e2s = currSect->edge[1].pIdx1;
        e2e = currSect->edge[1].pIdx2;

        //delete all the intersections related to this relation(two edges) 
        removeAllIntersect(e1s, e1e, sectArray, &sectList, numOfpoints);
        removeAllIntersect(e2s, e2e, sectArray, &sectList, numOfpoints);

        //untangle the intersection
        untangleIntersect(e1s, e1e, e2s, e2e, points, &linkedPoly, sectArray, &sectList, numOfpoints);
    }

    //结尾处理
    free(sectArray);
    if(polygon->numOfElems > 0)
        free(polygon->array);
    polygon->numOfElems = 0;
    p_linkedPoly2Poly(&linkedPoly, polygon);    //funal ans is in polygon

    //free linkpoly
    if(linkedPoly.array.numOfElems > 0)
        free(linkedPoly.array.array);
    linkedPoly.array.numOfElems = 0;

    p_normalizePoly(polygon, points);   //不一定需要这一步[只是保证了ccw的顺序以及以point idx=1的开始作为polygon的起点]

}