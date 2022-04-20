#!/bin/bash
apps='/usr/keep/apps.txt'
customerApps='/usr/keep/customerApps.txt'
logOut='keep.log'

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
      echo "Re-starting \"$app\" server at `date`" >> $logOut
      appServer=/usr/apps/$dir/src/server.js
      if [ -f $appServer ]; then
        echo "node /usr/apps/$dir/src/server.js $port \"$app\" $logFile &" >> $logOut
        node /usr/apps/$dir/src/server.js $port "$app" $logFile &
      else
        echo "No such file \"$app\"" >> $logOut
      fi
    fi
  fi
done < $apps

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
      echo "Re-starting \"$app\" server for \"$server\" at `date`" >> $logOut
      appServer=/usr/apps/$dir/src/server.js
      if [ -f $appServer ]; then
        echo "node /usr/apps/$dir/src/server.js $port \"$app\" $logFile &" >> $logOut
        node /usr/apps/$dir/src/server.js $port "$app" $logFile &
      else
        echo "No such file \"$app\"" >> $logOut
      fi    fi
  fi
done < $customerApps

mongo=`ps -ef | grep mongod | grep -v grep`
if [ $? -ne 0 ]
then
  echo "MONGO CRASHED! Re-starting at `date`"
  /usr/bin/mongod --config /etc/mongod.conf &
fi
