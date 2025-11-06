@echo off
echo Starting Angular Frontend Locally...
cd /d "c:\Personal\projects\SmartOptions\angular-frontend"
npm install --force
ng serve --host 0.0.0.0 --port 4200