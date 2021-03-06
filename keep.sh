#!/bin/bash
apps='/usr/keep/apps.txt'

while read line
do
  if [[ ! $line =~ ^\# ]]
  then
    server=`echo $line | cut -d, -f1`
    port=`echo $line | cut -d, -f2`
    dir=`echo $line | cut -d, -f3`
    app=`echo $line | cut -d, -f4`
    logFile="/usr/apps/logs/$dir.log"

    running=`ps -ef | grep node | grep "$port $app" | grep -v grep`
    if [ $? -ne 0 ]
    then
      echo "Re-started \"$app\" server at `date`"
      node /usr/apps/$dir/src/server.js $port "$app" $logFile &
    fi
  fi
done < $apps

mongo=`ps -ef | grep mongod | grep -v grep`
if [ $? -ne 0 ]
then
  echo "MONGO CRASHED! Re-starting at `date`"
  /usr/bin/mongod --config /etc/mongod.conf &
fi
