#!/bin/bash
apps='apps.txt'

while read line
do
  if [ $line !~ ^\# ]
  then
    echo "$line"
  fi
done < $apps

exit 0



PORT=$1

while true
do
  running=`ps -ef | grep node | grep "No Estimates"`
  if [ $? -eq 0 ]
  then
    sleep 5
  else
    echo "CRASHED! Re-starting server at `date`"
    node src/server.js $PORT 'No Estimates' &
  fi
done
