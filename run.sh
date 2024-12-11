#/bin/bash

if [ -z "$1" ]
  then
    echo "\033[1;31m"
    echo "No argument supplied"
    echo "\033[0m"
    echo "Usage:\n./run.sh <number>"
    echo ""
    echo "Example:\n./run.sh 1\n\n"
    exit 1
fi

bun run src/$1/index.civet