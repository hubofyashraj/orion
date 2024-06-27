#!/bin/sh

connectionTry() {
    CONN=2
    until [ "$CONN" =  "1" ]
    do
        CONN=$(mongosh --host=mongo$1 --eval "db.runCommand({ping:1}).ok" 2>/dev/null)
        if [ "$CONN" = "1" ]; then
            echo "mongo$1 connected"
            break
        else
            echo "not connected"
            sleep 1
        fi
    done
}

connectionTry 1
connectionTry 2
connectionTry 3



STATUS=$(mongosh  --eval 'rs.status().set' 2>/dev/null)
if [ "$STATUS" ]; then 
echo 'replicaset already setup: '"$STATUS"
exit
else
echo 'setting up replicaset'
fi


RESULT=2
until [ "$RESULT" = "MongoServerError: already initialized" ]
do
    RESULT=$(mongosh --eval "rs.initiate({
    _id: 'rs0',
    members: [
        { _id: 0, host: 'mongo1:27017' },
        { _id: 1, host: 'mongo2:27017' },
        { _id: 2, host: 'mongo3:27017' }
    ]
    }).ok" 2>/dev/null)
    if [ "$RESULT" =  "1" ]; then
        echo successfully setup replicaset 
        break
    fi
done
