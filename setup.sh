#!/bin/sh

WORKDIR=$(pwd)

cd $WORKDIR

cd z/nats

helm install nats nats/nats --set=config.jetstream.enabled=true

cd $WORKDIR

cd z/secrets
sh ./secrets.sh

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