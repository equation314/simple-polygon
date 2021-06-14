#ifndef BASIC_TEST_H
#define BASIC_TEST
#include"2-Opt-Move.hpp"

int PAisectSegments(tom_pointArray *anArray, int indexl1p1, 
                    int indexl1p2, int indexl2p1, int indexl2p2);

int isOnLine(tom_point linePoint1, tom_point linePoint2, 
             tom_point aPoint);
#endif 