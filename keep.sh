#!/bin/bash
apps='apps.txt'

while read line
do
  if [[ ! $line =~ ^\# ]]
  then
    port=`echo $line | cut -d, -f1`
    dir=`echo $line | cut -d, -f2`
    app=`echo $line | cut -d, -f3`
    logFile="/usr/apps/logs/$dir.log"

    running=`ps -ef | grep node | grep "$app" | grep -v grep`
    if [ $? -ne 0 ]
    then
      echo "CRASHED! Re-starting \"$app\" server at `date`"
      node /usr/apps/$dir/src/server.js $port $app $logFile &
      ps -ef | grep node  | sort -k10
    fi
  fi
done < $apps

mongo=`ps -ef | grep mongod | grep -v grep`
if [ $? -ne 0 ]
then
  echo "MONGO CRASHED! Re-starting at `date`"
  /usr/bin/mongod --config /etc/mongod.conf &
fi
