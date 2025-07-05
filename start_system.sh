#!/bin/bash
# Script to start MongoDB and the application

echo "Starting MongoDB..."
mkdir -p mongodb_data
mongod --dbpath=./mongodb_data &
MONGO_PID=$!

echo "Waiting for MongoDB to start..."
sleep 5

echo "Running data migration script..."
python migrate_data.py

echo "Starting backend server..."
cd server
npm start &
SERVER_PID=$!
cd ..

echo "Waiting for backend server to start..."
sleep 5

echo "Starting frontend application..."
cd client
npm start &
FRONTEND_PID=$!
cd ..

echo "Smart Traffic Management System started!"
echo "MongoDB, Backend, and Frontend are all running."
echo "Press Ctrl+C to stop all services."

# Handle cleanup on exit
trap "kill $MONGO_PID $SERVER_PID $FRONTEND_PID; exit" INT TERM EXIT

# Wait for user to press Ctrl+C
wait
