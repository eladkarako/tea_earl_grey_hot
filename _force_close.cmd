@echo off
chcp 65001 1>nul 2>nul
pushd "%~sdp0"

::make-sure peerblock is closed (0-closed. 128-process wasn't running).
call "%windir%\System32\taskkill.exe" /T /F /IM "peerblock.exe"  1>nul 2>nul
set "EXIT_CODE=%ErrorLevel%"


if ["%EXIT_CODE%"] EQU ["0"] ( 
  echo [INFO] peerblock.exe process closed.               1>&2
) 

if ["%EXIT_CODE%"] EQU ["128"] ( 
  echo [INFO] peerblock.exe process wasn't running.       1>&2
) 

if ["%EXIT_CODE%"] NEQ ["0"] ( 
  if ["%EXIT_CODE%"] NEQ ["128"] ( 
    echo [ERROR] peerblock.exe is still running.          1>&2
  ) 
) 

pause