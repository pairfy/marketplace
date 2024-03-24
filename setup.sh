#!/bin/sh

WORKDIR=$(pwd)

sh z/kafka/kafka.sh

cd plugin-debezium

sh ./setup.sh

cd $WORKDIR

sh z/ingress/setup.sh

# Prompt for input
read response

# Check the response
if [[ $response == "yes" || $response == "Yes" || $response == "YES" ]]; then
    echo "You chose to continue."
elif [[ $response == "no" || $response == "No" || $response == "NO" ]]; then
    echo "You chose to cancel."
else
    echo "Invalid input. Please enter 'yes' or 'no'."
fi