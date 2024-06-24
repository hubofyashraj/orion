#!/bin/bash

echo "Waiting for MongoDB to start on all nodes..."

# Function to check if MongoDB is ready
wait_for_mongodb() {
    echo "Waiting for MongoDB on $1 to start..."
    sleep 30  # Initial delay to allow MongoDB containers to start up
    until mongosh --host $1:27017 --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' ; do
        echo "Attempting to connect to MongoDB on $1:27017..."
        sleep 5
    done
    echo "MongoDB on $1 is ready."
}

# Wait for each MongoDB node
wait_for_mongodb mongo1
wait_for_mongodb mongo2
wait_for_mongodb mongo3

echo "All MongoDB nodes are ready. Initializing replica set..."

# Initialize the replica set
mongosh --host mongo2:27017 <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
EOF

echo "Replica set initialized."
