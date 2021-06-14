#!/bin/sh
if [ $# -eq 1 ]; then
    echo "rerandom input data"
    cd test_cases
    python3 random_data.py
    cd ..
fi
g++ -g -fsanitize=address test_main.cpp 2-Opt-Move.cpp basicOperation.cpp -o a.out
./a.out
cd test_cases
python3 plot_output.py
cd ..

