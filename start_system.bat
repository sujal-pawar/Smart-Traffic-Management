@echo off
REM Script to start MongoDB and the application

echo Starting MongoDB...
start "MongoDB" /MIN "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="%~dp0mongodb_data"

echo Waiting for MongoDB to start...
timeout /t 5 /nobreak

echo Running data migration script...
python "%~dp0migrate_data.py"

echo Starting backend server...
start "Backend Server" /MIN cmd /c "cd /d %~dp0server && npm start"

echo Waiting for backend server to start...
timeout /t 5 /nobreak

echo Starting frontend application...
start "Frontend" /MIN cmd /c "cd /d %~dp0client && npm start"

echo Smart Traffic Management System started!
echo MongoDB, Backend, and Frontend are all running.
echo Press Ctrl+C to stop all services.
pause
