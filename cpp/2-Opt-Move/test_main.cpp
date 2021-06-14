#include<iostream>
#include<stdio.h>
#include<stdlib.h>
#include<algorithm>
#include<vector>
#include "2-Opt-Move.hpp"
using namespace std;

void readPointsFromFile(FILE* readf, vector<pair<double, double> > &pointsValue){
    double x,y;
    while(fscanf(readf,"%lf %lf",&x,&y) == 2){
        pointsValue.push_back(make_pair(x,y));
    }
}
void writePointstoFile(FILE* insortf, vector<pair<double, double> > &pointsValue){
    int sz = pointsValue.size();
    for(int i = 0; i < sz; i++){
        //cout << pointsValue[i].first << pointsValue[i].second <<endl;
        fprintf(insortf,"%lf %lf\n",pointsValue[i].first, pointsValue[i].second);
    }
    fflush(insortf);
}
//this function returns -1 if a < b 
bool comparePoints(const pair<double, double> a, const pair<double, double> b){
    int res;  
    
    if((a.first == b.first) && (a.second == b.second))
        res = true;
    else if (( a.first < b.first) || ((a.first == b.first)&&(a.second < b.second)))
        res = false;  
    else
        res = true;
    
    return res;
}

int main(){
    FILE* inf = fopen("in.txt","r");
    FILE* insortf = fopen("in_sorted.txt","w");
    FILE* outf = fopen("ans.txt","w");
    int needNumOfPoly;
    fscanf(inf,"%d",&needNumOfPoly);
    //init poly
    tom_polygon poly = tom_initPoly();
    tom_points points;
    vector<pair<double, double> > pointsValue;
    readPointsFromFile(inf,pointsValue);
    //sort first
    sort(pointsValue.begin(), pointsValue.end(),comparePoints);
    writePointstoFile(insortf,pointsValue);
    if(outf != NULL){
        points = tom_initPoint(pointsValue);
        tom_polyToFile(&poly, &points, needNumOfPoly, outf);
    }   
    fclose(inf);
    fclose(outf);
    fclose(insortf);
    
    return 0;
}