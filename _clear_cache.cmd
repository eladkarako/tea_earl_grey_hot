@echo off
chcp 65001 1>nul 2>nul

pushd "%~sdp0"

del /f /q "cache.p2b"
set "EXIT_CODE=%ErrorLevel%"

popd
exit /b %EXIT_CODE%