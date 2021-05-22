#!/bin/bash

echo What should the version be?
read VERSION

docker build -t ahmedmohamedhue/api:$VERSION .
docker push ahmedmohamedhue/api:$VERSION
ssh root@172.104.241.130 "docker pull ahmedmohamedhue/api:$VERSION && docker tag ahmedmohamedhue/api:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
