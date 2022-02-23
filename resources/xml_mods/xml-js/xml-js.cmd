@echo off
chcp 65001 1>nul 2>nul

call "%~sdp0/node_modules/.bin/xml-js.cmd" %*

exit /b %ErrorLevel%
