@echo off
chcp 65001 1>nul 2>nul

pushd "%~sdp0"

::timeout is used to avoid file-system dual-files bug.

if exist "peerblock.conf.backup3" ( 
  del /f /q "peerblock.conf.backup3"                        1>nul 2>nul
  call "timeout.exe" /T 1 /NOBREAK                          1>nul 2>nul
) 

if exist "peerblock.conf.backup2" ( 
  ren "peerblock.conf.backup2" "peerblock.conf.backup3"     1>nul 2>nul
  call "timeout.exe" /T 1 /NOBREAK                          1>nul 2>nul
) 

if exist "peerblock.conf.backup" ( 
  ren "peerblock.conf.backup" "peerblock.conf.backup2"      1>nul 2>nul
  call "timeout.exe" /T 1 /NOBREAK                          1>nul 2>nul
) 

copy /b /v /y "peerblock.conf" "peerblock.conf.backup"    1>nul 2>nul

popd
exit /b %EXIT_CODE%