import math
import numpy as np
import matplotlib.pyplot as plt

def polarToRadius(polar, offset, k):
    return offset + polar/(k*math.pi)

'''
@description: 螺线曲线生成和绘制
@param {*} k 螺旋曲线参数1/(k*math.pi)
@param {*} offset 转换成直角坐标后的x轴偏移
@param {*} circles 控制生成的螺旋线圈数
@param {*} pointsPerCircle 控制生成的螺旋线每圈的点数
@return {*}
'''
def spiral(k, offset,circles, pointsPerCircle):
    x = []
    y = []
    polar = []
    r = []
    for p in np.linspace(0,2*math.pi*circles,pointsPerCircle):
        polar.append(p)
        nowr = polarToRadius(p, 0, k)
        r.append(nowr)
        x.append(nowr*math.cos(p) + offset)
        y.append(nowr*math.sin(p))
    return x,y

def writeToFile(x,y,x1,y1,lens,lens1):
    with open("spiral.txt","w") as outf:
        for i in range(lens):
            outf.write(str(x[i]*100)+" "+str(y[i]*100)+"\n")
        for i in range(lens1-1, 0, -1):    #起点不要了，到0而不是-1
             outf.write(str(x1[i]*100)+" "+str(y1[i]*100)+"\n")

if __name__ == "__main__":
    # 该脚本拟合极坐标r = kθ 螺旋线【生成不一样的螺旋线，需要动态调整参数】
    x1, y1=spiral(2,0,7.0,50000)
    plt.plot(x1, y1)
    x2, y2=spiral(2.2,-0.02,7.0,50000)
    plt.plot(x2, y2)
    plt.show()
    writeToFile(x1,y1,x2,y2,len(x1),len(x2))