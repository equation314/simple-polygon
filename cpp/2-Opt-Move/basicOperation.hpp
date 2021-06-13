#include "2-Opt-Move.hpp"
#ifndef BASIC_H
#define BASIC_H


/******************************************
 *                                        *
 *          Error Handling                *
 *                                        *
 *****************************************/
#define DELTA 1.0e-16

#define ERR_MEM 0
#define ERR_UNDEFINED 1
#define ERR_INDEX 2 
#define ERR_FILE 3
#define ERR_LINE 4

void randomSeed();
int randomInt(int min, int max);
void writeToFile(FILE* file, tom_polygon* poly);
void reportError(int errNum);



/******************************************
 *                                        *
 *          Basic Operation               *
 *                                        *
 *****************************************/

void p_initPoly(tom_polygon* poly, int numOfPoints);
void p_freeArrayOfPoly(tom_polygon* poly);
void p_getrandomPermuation(tom_polygon* poly);
int p_isSimplePolygon(tom_polygon* poly, tom_points * points);


inline int p_numOfPolyElems(tom_polygon *poly)
{
    return poly->numOfElems;
}

inline int p_getPIndexOfPoly(tom_polygon *poly, int index)
{
    if (index < 0 || index >= p_numOfPolyElems(poly))
        reportError(ERR_INDEX);
    return poly->array[index];
}

inline int p_NumOfPoints(tom_points *points)
{
    return points->numOfPoints;
}

inline tom_point p_idxOfPoints(tom_points *points, int pIdx)
{
    return points->array[pIdx];
}


void p_freeAllPoints(tom_points *points);
int p_isIntersectEdge(tom_points *points, int edge1s, int edge1e, int edge2s, int edge2e);
void p_poly2LinkedPoly(tom_polygon* poly, tom_linkPoly *linkPoly);
int p_getNextOfLinkPoly(tom_linkPoly* linkPoly, int idx);
void p_linkedPoly2Poly(tom_linkPoly* linkPoly, tom_polygon* poly);
void p_normalizePoly(tom_polygon* poly, tom_points *points);
void p_initIntersectInfoList(tom_intersectInfoList * sectList);

void removeAllIntersect(int pIdx1, int pIdx2, tom_sectP* sectArray, tom_sectList *sectList, int numOfPoints);
void createIntersect(int edge1s, int edge1e, int edge2s, int edge2e, tom_sectP* sectArray, tom_sectList* sectList, int numOfPoints);
void untangleIntersect(int e1pIdx1, int e1pIdx2, int e2pIdx1, int e2pIdx2, tom_points* points, tom_linkPoly* linkPoly, tom_sectP * sectArray, tom_sectList* sectList, int numOfPoints);
#endif