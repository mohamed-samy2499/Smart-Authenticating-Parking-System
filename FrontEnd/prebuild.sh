#!/bin/bash

#####################
#										#
# HOW TO USE				#
#										#
# DON'T							#
#										#
#####################

# cp -r ./api-models ../api-models
cp ./config/$1/nginx.conf ./nginx.conf
cp ./config/$1/config.$1.ts ./src/config/config.ts