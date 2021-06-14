import random
maxnode = 100
maxval = 100
maxPoly = 3

def randNode():
    line = str(random.uniform(-maxval,maxval))+" "+str(random.uniform(-maxval,maxval))+"\n"
    return line

with open("../in.txt","w+") as f:
    n = maxnode
    f.write(str(maxPoly)+"\n")
    for i in range(n):
        f.write(randNode())
