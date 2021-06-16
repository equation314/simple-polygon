# The output polygon may still have intersecting edges, we need to use 2-opt moves to remove them.

import os
import numpy as np

BASE_DIR = 'text'


def read_points(fname):
    points = []
    with open(fname, 'r') as f:
        for line in f.readlines():
            if line.strip() == "":
                break
            p = list(map(float, line.strip().split()))
            points.append([p[0], p[1]])
    return points


def poly_dist(pa, pb):
    min_dist = 1e99
    ii = jj = 0
    for i, a in enumerate(pa):
        for j, b in enumerate(pb):
            d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
            if d < min_dist:
                min_dist = d
                ii = i
                jj = j
    return min_dist, ii, jj


if __name__ == '__main__':
    n = len(os.listdir(BASE_DIR)) - 1
    # n = 10
    print(n)

    polys = []
    for i in range(n):
        fname = BASE_DIR + "/poly%d.pts" % i
        polys.append(read_points(fname))

    d = [[0 for i in range(n)] for j in range(n)]
    connect_pos = [[(0, 0) for i in range(n)] for j in range(n)]
    all_edges = []
    for i in range(n):
        print(i)
        for j in range(i + 1, n):
            dist, i1, i2 = poly_dist(polys[i], polys[j])
            d[i][j] = d[j][i] = dist
            connect_pos[i][j] = (i1, i2)
            connect_pos[j][i] = (i2, i1)
            all_edges.append((d[i][j], i, j))

    all_edges = sorted(all_edges)
    f = [i for i in range(n)]

    def find(x):
        if x != f[x]:
            f[x] = find(f[x])
        return f[x]

    edges = []
    for d, u, v in all_edges:
        p = find(u)
        q = find(v)
        if p != q:
            print(u, v, connect_pos[u][v])
            edges.append((u, v, connect_pos[u][v]))
            f[p] = q
            if len(edges) == n - 1:
                break

    points = []
    next = []
    prev = []
    first_id = []
    for i, poly in enumerate(polys):
        first = len(points)
        last = first + len(poly) - 1
        first_id.append(first)
        print(first, last, len(poly))
        for p in poly:
            points.append(np.array(p))
            next.append(len(points))
            prev.append(len(points) - 2)
        next[last] = first
        prev[first] = last

    def point_between(a, b):
        dir = points[b] - points[a]
        new_point = points[a] + dir * (1 / np.sqrt(dir.dot(dir)))
        return new_point

    def connect(a, b):
        new_a = len(points)
        new_b = len(points) + 1
        next.extend([-1, -1])
        prev.extend([-1, -1])

        new_a_next = point_between(a, next[a])
        new_a_prev = point_between(a, prev[a])
        new_b_next = point_between(b, next[b])
        new_b_prev = point_between(b, prev[b])
        if np.linalg.norm(new_a_next - new_b_prev) < np.linalg.norm(new_a_prev - new_b_next):
            points.extend([new_a_next, new_b_prev])
            next[prev[b]] = new_b
            next[new_b] = new_a
            next[new_a] = next[a]
            next[a] = b
        else:
            points.extend([new_a_prev, new_b_next])
            next[prev[a]] = new_a
            next[new_a] = new_b
            next[new_b] = next[b]
            next[b] = a

    for u, v, (i, j) in edges:
        print(u, v, (i, j))
        connect(first_id[u] + i, first_id[v] + j)

    with open('output.pts', "w") as f:
        i = 0
        while True:
            i = next[i]
            f.write("%f %f\n" % (points[i][0], points[i][1]))
            if i == 0:
                break
