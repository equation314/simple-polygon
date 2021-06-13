#!/usr/bin/env python3
import matplotlib.pyplot as plt
points = []
px = []
py = []
plt.figure('Poly Out')
with open("../in.txt") as inf:
    line = inf.readline()
    while line:
        x, y = line.strip().split(' ')
        points.append([int(x),int(y)])
        px.append(int(x))
        py.append(int(y))
        line = inf.readline()
    # print(points)
    plt.plot(px,py,'ro')

sz = len(points)
numOfPoly = 10
with open("../ans.txt") as ansf:
    for num in range(numOfPoly):
        line = ansf.readline()
        idx = -1
        idx0 = -1
        nowx = []
        nowy = []
        for i in range(sz-1):
            if idx == -1:
                idx = int(ansf.readline())
                idx0 = idx
            else:
                idx = idx2
            idx2 = int(ansf.readline())
            nowx = [points[idx][0], points[idx2][0]]
            nowy = [points[idx][1], points[idx2][1]]
            # print("i is ",i, " and coo are:",nowx,nowy)
            plt.plot(nowx, nowy, label='sin')
        nowx = [points[idx0][0], points[idx2][0]]
        nowy = [points[idx0][1], points[idx2][1]]
        plt.plot(nowx, nowy, label='sin')
        plt.show()




        
