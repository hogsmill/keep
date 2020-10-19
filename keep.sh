#!/bin/bash
apps='apps.txt'

while true
do
  while read line
  do
    if [[ ! $line =~ ^\# ]]
    then
      port=`echo $line | cut -d, -f1`
      dir=`echo $line | cut -d, -f2`
      app=`echo $line | cut -d, -f3`

      running=`ps -ef | grep node | grep "$app"`
      if [ $? -ne 0 ]
      then
        echo "CRASHED! Re-starting \"$app\" server at `date`"
        node /usr/apps/$dir/src/server.js $port $app &
        ps -ef | grep node  | sort -k10
      fi
    fi
  done < $apps
  sleep 10
done
