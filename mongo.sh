#!/bin/bash
sudo systemctl stop mongod

running=0
while [ "$running" = 0 ]
do
  running=`ps -ef | grep mongod | grep -v grep`
	sleep 5
done

sudo systemctl start mongod
