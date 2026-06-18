@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
set "NODE_OPTIONS=--use-system-ca"
call "C:\Program Files\nodejs\npm.cmd" run start -- --port 3100
