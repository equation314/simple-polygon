#include<iostream>
#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#include"2-Opt-Move.hpp"
using namespace std;

#define DELTA1 1.0e-12
#define TRUE 1
#define FALSE !TRUE

tom_point BGdefaultPoint = {-1, -1};  


double calcArea(tom_point point1, tom_point point2, tom_point point3)
{
  /* for details of the calculation, refer to O'Rourke, Comp Geometry 
     in C, pp.  19-20 */
  double twiceArea;  

  /*  twiceArrea = point1.x * point2.y - point1.y * point2.x +
      point1.y * point3.x - point1.x * point3.y +
      point2.x * point3.y - point3.x * point2.y;   */

  twiceArea = (point3.y - point1.y)*(point2.x - point1.x) -
    (point3.x - point1.x)*(point2.y - point1.y);  


  if (fabs(twiceArea) <= DELTA1)  /* test if result lt DELTA1 */
    twiceArea = 0.0;  
  
  return(twiceArea);  
}

int equalPoints(tom_point point1, tom_point point2)
/* this procedure tests if point 1 = point2 and returns the result */
{
  int res;  

  res = ((point1.x == point2.x) && (point1.y == point2.y));  

  return(res);  
}



int compPoints(tom_point point1, tom_point point2)
/* this procedure tests if point 1 < point2 and returns the result */
{
  int res;  

  res = ((point1.x < point2.x) || ((point1.x == point2.x) &&
                                   (point1.y < point2.y)));  

  return(res);  
}

int isOnOrderedLine(tom_point linePoint1, tom_point linePoint2, tom_point aPoint)
{
  int res;  
  double area;  

  if (equalPoints(linePoint1, linePoint2))  {
    fprintf(stderr,"error in one line\n");  
  }

  area = calcArea(linePoint1, linePoint2, aPoint);  

  if (area > DELTA1)
    res = 1;  
  else if (area < -DELTA1)
    res = -1;  
  else 
    res = 0;  

  return(res);  
}


int isOnLine(tom_point linePoint1, tom_point linePoint2, 
             tom_point aPoint)
{
  int res;  

  if (compPoints(linePoint1, linePoint2))
    res = isOnOrderedLine(linePoint1, linePoint2, aPoint);  
  else
    res = -isOnOrderedLine(linePoint2, linePoint1, aPoint);  
  return(res);  
}


tom_point PAgetPoint(tom_pointArray *anArray, int index)
{
   tom_point *getElem;  
   
   if ((index < anArray->numOfPoints) && (0 <= index))
      getElem = (anArray->array+index);  
   else
      getElem = &BGdefaultPoint;  
   
   return(*getElem);  
}


int isectOrderedSegments(tom_point line1point1, tom_point line1point2, 
                         tom_point line2point1, tom_point line2point2)
{
   int posL1P1, posL1P2, posL2P1, posL2P2;  
   int res1, res2;  
   int result;  

   //printf("isectOrderedSegments():\n");
   //printf("(%f,%f))-->(%f,%f)\n", line1point1.x, line1point1.y, line1point2.x, line1point2.y);
   //printf("(%f,%f))-->(%f,%f)\n", line2point1.x, line2point1.y, line2point2.x, line2point2.y);
   /* determine where the points of line1 lie with respect to line2 */
   posL1P1 = isOnLine(line2point1, line2point2, line1point1);  
   posL1P2 = isOnLine(line2point1, line2point2, line1point2);  
   
   if ((res1 = posL1P1*posL1P2) == 1)  {
      result = FALSE;  
   }
   else	{
      /* determine where the points of line2 lie with respect to line1 */
      posL2P1 = isOnLine(line1point1, line1point2, line2point1);  
      posL2P2 = isOnLine(line1point1, line1point2, line2point2);  
      
      /* test whether either a and b lie on one side of (c, d) or vice versa */
      if ((res2 = posL2P1*posL2P2) == 1)
         /* lines do not intersect */
         result = FALSE;  
      
      /* we check whether we have intersection */
      else if ((res1 + res2) == -2)
         /* we have intersection */
         result = TRUE;  
      
      /* test for collinearity */
      else if ((posL1P1 + 2*posL1P2 + 4*posL2P1 + 8*posL2P2) == 0)
         /* We have collinearity */
         /* since we have l1p1 < l1p2, l2p1 < l2p2 and further
            l1p1 <= l2p1, all we have to check is whether l2p1 < l1p2, 
            if yes, the lines overlap! */
         /* we ignore collinearities for the moment, though! */
         //result = compPoints(line2point1, line1point2);  
         result = 0;
      
      else
      /* One point lies on the other line, e.g. a on (c, d). If
         a!=c and a!=d we have intersection */
         result = (!equalPoints(line1point1, line2point1) &&
                   !equalPoints(line1point1, line2point2) &&
                   !equalPoints(line1point2, line2point1) &&
                   !equalPoints(line1point2, line2point2));  
   }
   
   return(result);  
}

int PAisectSegments(tom_pointArray *anArray, int indexl1p1, 
                    int indexl1p2, int indexl2p1, int indexl2p2)
{
   int result;  
   int minL1, maxL1, minL2, maxL2;  
   tom_point l1p1, l1p2, l2p1, l2p2;  
   
   /* map the indices in a way that l1p1 <= l1p2 and l2p1 <= l2p2 */
   minL1 = min(indexl1p1, indexl1p2);  
   maxL1 = max(indexl1p1, indexl1p2);  
   minL2 = min(indexl2p1, indexl2p2);  
   maxL2 = max(indexl2p1, indexl2p2);  

   //printf("PAisectSegments():\n");
   //printf("(%d-->%d) vs (%d-->%d)\n", minL1, maxL1, minL2, maxL2);

   // min1 < max1
   // min2 < max2
   // max1 > min2
   // max2 > min1
   if (maxL1 <= minL2) return FALSE;   //点的index按照x轴进行排序的？
   if (maxL2 <= minL1) return FALSE;
   
   l1p1 = PAgetPoint(anArray, minL1);  
   l1p2 = PAgetPoint(anArray, maxL1);  
   l2p1 = PAgetPoint(anArray, minL2);  
   l2p2 = PAgetPoint(anArray, maxL2);  
   
   if ((minL1 < minL2) || ((minL1 == minL2)  && (maxL1 < maxL2)))
      result = isectOrderedSegments(l1p1, l1p2, l2p1, l2p2);  
   else
      result = isectOrderedSegments(l2p1, l2p2, l1p1, l1p2);  
   return(result);  
}







