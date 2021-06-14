
# RPG_2OptMoves Algorithm
Generate random simple polygons based on 2-OptMoves Algorithm.

```
#    _______                ________                 _____ ______      
#   /  ___  \              |\   __  \               |\   _ \  _   \    
#  /__/|_/  /| ____________\ \  \|\  \  ____________\ \  \\\__\ \  \   
#  |__|//  / /|\____________\ \  \\\  \|\____________\ \  \\|__| \  \  
#      /  /_/_\|____________|\ \  \\\  \|____________|\ \  \    \ \  \ 
#     |\________\             \ \_______\              \ \__\    \ \__\
#      \|_______|              \|_______|               \|__|     \|__|
#                                                                      
#                                                                      
#                                                                      
```

## Usage

Using 2-OptMoves Algorithm to generate random simple polygons with **random input data**:
`./test_data.sh <anythings>`

Using 2-OptMoves Algorithm to generate random simple polygons again with **old data**:
`./test_data.sh`

## Configure the value of random data：


```python
# in ./test_cases/random_data.py
# you need to modify the following lines:
maxnode = <the number of nodes you want>
maxval = <the range of the coordinates >
maxPoly = <the number of polygons you want to generate>

```
