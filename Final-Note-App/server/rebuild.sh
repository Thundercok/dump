#!/bin/bash

cd ..
docker-compose down
docker volume rm noteapp-root_mysql-data || true
docker-compose build --no-cache
docker-compose up 


cd ..
docker-compose down
docker volume rm noteapp-root_mysql-data || true
docker-compose build --no-cache
docker-compose up 

 