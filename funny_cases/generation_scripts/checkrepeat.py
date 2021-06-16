# 该脚本用于检测生成的点集文件是否包含有重复的点【包含重复点的输入不认为是simple ploygon】
points = []
filename = input("Input file path:")
with open(filename,"r") as inf:
    lines = inf.readlines()
    for line in lines:
        x, y = line.split(' ')
        points.append([float(x),float(y)])

sz = len(points)
for i in range(sz):
    if points.count(points[i]) > 1 :
        print("repeat:")
        print(points[i])