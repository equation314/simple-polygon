import matplotlib.pyplot as plt
def _moore(direction, rotation, order):
    if order == 0:
        return
    direction -= rotation
    _hilbert(direction, rotation, order - 1)
    step2(direction)
    _hilbert(direction, rotation, order - 1)

    direction -= rotation
    step2(direction)
    direction -= rotation
    _hilbert(direction, rotation, order - 1)
    step2(direction)
    _hilbert(direction, rotation, order - 1)
    
def step2(direction):
    next = {0: (1, 0), 1: (0, 1), 2: (-1, 0), 3: (0, -1)}[direction & 0x3]#取后两位？
    
    global x, y
    x.append(x[-1] + next[0])
    y.append(y[-1] + next[1])

def moore(order):
    global x, y
    x = [2**(order-1)-1,]
    y = [0,]
    _moore(2, 1, order)
    return (x, y)
def _hilbert(direction, rotation, order):
    if order == 0:
        return

    direction += rotation
    _hilbert(direction, -rotation, order - 1)
    step1(direction)

    direction -= rotation
    _hilbert(direction, rotation, order - 1)
    step1(direction)
    _hilbert(direction, rotation, order - 1)

    direction -= rotation
    step1(direction)
    _hilbert(direction, -rotation, order - 1)

def step1(direction):
    next = {0: (1, 0), 1: (0, 1), 2: (-1, 0), 3: (0, -1)}[direction & 0x3]#取后两位？

    global x, y
    x.append(x[-1] + next[0])
    y.append(y[-1] + next[1])

def hilbert(order):
    global x, y
    x = [0,]
    y = [0,]
    _hilbert(0, 1, order)
    return (x, y)

def main(sz):
    x, y = moore(sz)
    plt.plot(x, y)
    plt.show()
    
def writeToFile(x,y,lens):
    with open("hilbert.txt","w") as outf:
        for i in range(lens):
            outf.write(str(x[i])+" "+str(y[i])+"\n")

if __name__=='__main__':
    dataSize = 4    #可以修改生成的数据量【目前4层的hilbert可以生成256个点】
    main(dataSize)
    # print(x)
    # print(y)
    sz = len(x)
    print(sz)
    if sz != len(y):
        print("error len")
    writeToFile(x,y,sz)