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
      if [ $? -eq 0 ]
      then
        sleep 5
      else
        echo "CRASHED! Re-starting \"$app\" server at `date`"
        node /usr/apps/$dir/src/server.js $port \"$app\" &
      fi
    fi
  done < $apps
done
