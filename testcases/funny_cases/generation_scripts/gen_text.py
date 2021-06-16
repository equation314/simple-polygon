from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties

fp = FontProperties(fname="行楷-简 细体.ttf")
size = 1000

text = "计算几何 2021"
path1 = TextPath((size, size), text, size, prop=fp)

text = "Computational Geometry"
path2 = TextPath((0, 0), text, size, prop=fp)

points = set()
with open("text/poly_all.pts", "w") as f1:
    n = 0
    for path in [path1, path2]:
        print(len(path.to_polygons()))
        for poly in path.to_polygons():
            with open("text/poly%d.pts" % n, "w") as f2:
                for p in poly:
                    p = (p[0], p[1])
                    if not p in points:
                        points.add(p)
                        f1.write("%f %f\n" % (p[0], p[1]))
                        f2.write("%f %f\n" % (p[0], p[1]))
            f1.write("\n")
            n += 1
