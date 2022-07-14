#!/bin/bash

#####################
#										#
# HOW TO USE				#
#										#
# DON'T							#
#										#
#####################


ENV=${1}

echo "Deploying platform to $ENV."

sed -e "s/DEPLOY_TIMESTAMP/$(date)/g" config/$ENV/pod.yaml > platform_prepared.yaml

kubectl apply -f platform_prepared.yaml

rm platform_prepared.yaml
