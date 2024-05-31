#!/bin/bash


if [ $# -eq 0 ]; then
    echo "no command"
    exit 1
fi

WORKDIR=$(pwd)

if [  "$1" = "-f"  ]; then
    echo "FRONTEND"
    cd frontend-seller && npm run buildx
fi   

cd $WORKDIR

skaffold run
