#include<iostream>
#include<string.h>
#include<vector>
#include<stdlib.h>
#include<stdio.h>
using namespace std;
bool **maze;
int maxX,maxY;
vector<pair<int,int> > leftvec;
vector<pair<int,int> > rightvec;
void nextDirect(int *step){
    if(step[0] == 0 && step[1] == -1){
        step[0] = 1; step[1] = 0; return;
    }else if(step[0] == 1 && step[1] == 0){
        step[0] = 0; step[1] = 1; return;
    }else if(step[0] == 0 && step[1] == 1){
        step[0] = -1; step[1] = 0; return;
    }else if(step[0] == -1 && step[1] == 0){
        step[0] = 0; step[1] = -1; return;
    }
    fprintf(stderr, "step error\n");
}
void toleft(int step[2], int *left){
    if(step[0] == 0 && step[1] == -1){
        left[0] = -1; left[1] = 0; return;
    }else if(step[0] == 1 && step[1] == 0){
        left[0] = 0; left[1] = -1; return;
    }else if(step[0] == 0 && step[1] == 1){
        left[0] = 1; left[1] = 0; return;
    }else if(step[0] == -1 && step[1] == 0){
        left[0] = 0; left[1] = 1; return;
    }
    fprintf(stderr, "left error\n");
}
void toright(int step[2], int *right){
    if(step[0] == 0 && step[1] == -1){
        right[0] = 1; right[1] = 0; return;
    }else if(step[0] == 1 && step[1] == 0){
        right[0] = 0; right[1] = 1; return;
    }else if(step[0] == 0 && step[1] == 1){
        right[0] = -1; right[1] = 0; return;
    }else if(step[0] == -1 && step[1] == 0){
        right[0] = 0; right[1] = -1; return;
    }
    fprintf(stderr, "right error\n");
}
bool check(int x, int y, int steps[2]){
    int nextx = x+ steps[0], nexty = y +steps[1];
    if(nextx >= maxX-1 || nexty >= maxY - 1)
        return true;
    if(nextx <= 0 || nexty <= 0)
        return true;
    if(maze[nextx+steps[0]][nexty+steps[1]])
        return true;
    return false;
}
void rotateMaze(int step[2], int nowx, int nowy, int flag){
    if(nowx >= maxX || nowy >= maxY){
        fprintf(stderr, "out of space\n");
        exit(1);
    }
    if(maze[nowx][nowy]){
        return;
    }
    int rightpos[2],leftpos[2];
    toright(step, rightpos);
    toleft(step, leftpos);

    if(check(nowx,nowy,step)){
        leftvec.push_back(make_pair(nowx+leftpos[0],nowy+leftpos[1]));
        maze[nowx+leftpos[0]][nowy+leftpos[1]] = true;
        leftvec.push_back(make_pair(nowx+step[0]+leftpos[0],nowy+step[1]+leftpos[1]));
        maze[nowx+step[0]+leftpos[0]][nowy+step[1]+leftpos[1]] = true;
        leftvec.push_back(make_pair(nowx+step[0],nowy+step[1]));
        maze[nowx+step[0]][nowy+step[1]] = true;
        nextDirect(step);
        rotateMaze(step,nowx+step[0],nowy+step[1],true);
    }else{
        leftvec.push_back(make_pair(nowx+leftpos[0],nowy+leftpos[1]));
        maze[nowx+leftpos[0]][nowy+leftpos[1]] = true;
        if(!flag)
            rightvec.push_back(make_pair(nowx+ rightpos[0], nowy+rightpos[1]));
        maze[nowx+ rightpos[0]][nowy+rightpos[1]] =true;
        rotateMaze(step,nowx+step[0],nowy+step[1],false);
    }
}

int main(){
    FILE* fd = fopen("out.txt","w");
    maxX = 120;
    maxY = 200;
    maze = (bool**)malloc(sizeof(bool*)*maxX);
    for(int i=0; i < maxX; i++){
        maze[i] = (bool*)malloc(sizeof(bool)*maxY);
        memset(maze[i],0,sizeof(maze[i]));
    }
    int firststep[2] = {1,0};
    rotateMaze(firststep,0,1,false);
    for(int i = 0; i < maxX; i++){
        for(int j = 0; j < maxY; j++){
            cout<<maze[i][j]<<" ";
        }
        cout<<endl;
    }
    //write out
    for (int i = 0; i < leftvec.size(); i++)
    {
        fprintf(fd,"%d %d\n", leftvec[i].first, leftvec[i].second);
    }
    for (int i = (rightvec.size() - 1); i >= 0; i--)
    {
        fprintf(fd,"%d %d\n", rightvec[i].first, rightvec[i].second);
    }
    fflush(fd);
    fclose(fd);



    return 0;
}