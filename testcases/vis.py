import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon

OUTPUT_DIR = 'thumbnail/'


def read_points(fname):
    points = []
    with open(fname, 'r') as f:
        for line in f.readlines():
            points.append(tuple(map(float, line.split())))
    return points


def draw(points, start, end, path, output_file):
    points = np.array(points)
    fig, ax = plt.subplots()

    poly = Polygon(points, ec='k', color='#ddd', joinstyle='round')
    ax.add_patch(poly)

    path_points = [start] + [points[i] for i in path] + [end]
    for i in range(len(path_points) - 1):
        u = path_points[i]
        v = path_points[i + 1]
        ax.plot([u[0], v[0]], [u[1], v[1]], '-', color='y', lw=1, alpha=0.75)
    for i, p in enumerate(points):
        plt.annotate('%d' % i, xy=p, xytext=[2,2], textcoords='offset points')

    ax.plot(points[:, 0], points[:, 1], '.', color='k')
    ax.plot(start[0], start[1], '.', color='r', ms=10)
    ax.plot(end[0], end[1], '.', color='g', ms=10)

    ax.autoscale_view()
    plt.savefig(output_file)
    # plt.show()


if __name__ == '__main__':
    if len(sys.argv) > 1:
        id_list = [int(sys.argv[1])]
    else:
        num = len(os.listdir('polygon'))
        id_list = range(num)

    if not os.path.exists(OUTPUT_DIR):
        os.mkdir(OUTPUT_DIR)

    for id in id_list:
        print(id)
        points = read_points('polygon/%02d.pts' % id)
        (start, end) = read_points('start_end/%02d.pts' % id)
        with open('shortest/%02d.res' % id, 'r') as f:
            path = f.readlines()

        assert(path[0] == 's\n' and path[-1] == 'e\n')
        path = list(map(lambda s: int(s.strip()), path[1:-1]))
        draw(points, start, end, path, '%s/%02d.svg' % (OUTPUT_DIR, id))
