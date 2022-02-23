@echo off
chcp 65001 1>nul 2>nul

pushd "%~sdp0"

del /f /q "..\..\cache.p2b" 1>nul 2>nul

set "BAK_NODE_PATH="
set  BAK_NODE_PATH=%NODE_PATH%
set "NODE_PATH=./xml-js/node_modules"

call "node.exe" "%~sdp0generate_anonymized_conf.js" %*
set "EXIT_CODE=%ErrorLevel%"

::pause

set  NODE_PATH=%BAK_NODE_PATH%
set  "BAK_NODE_PATH="
popd
exit /b %EXIT_CODE%