#include<iostream>
#include<stdio.h>
#include<stdlib.h>
#include<vector>
#include "2-Opt-Move.hpp"
using namespace std;

void readPointsFromFile(FILE* readf, vector<pair<double, double> > &pointsValue){
    double x,y;
    while(fscanf(readf,"%lf %lf",&x,&y) == 2){
        pointsValue.push_back(make_pair(x,y));
    }
}

int main(){
    FILE* inf = fopen("in.txt","r");
    FILE* outf = fopen("ans.txt","w");
    int needNumOfPoly = 10;
    //init poly
    tom_polygon poly = tom_initPoly();
    tom_points points;
    vector<pair<double, double> > pointsValue;
    readPointsFromFile(inf,pointsValue);
    if(outf != NULL){
        points = tom_initPoint(pointsValue);
        tom_polyToFile(&poly, &points, needNumOfPoly, outf);
    }   

    fclose(outf);
    fclose(inf);
    return 0;
}