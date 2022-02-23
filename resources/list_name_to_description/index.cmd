@echo off
chcp 65001 1>nul 2>nul

call "node.exe" "%~sdp0index.js" %*
set "EXIT_CODE=%ErrorLevel%"

pause
exit /b %EXIT_CODE%