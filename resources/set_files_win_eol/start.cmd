@echo off
chcp 65001 1>nul 2>nul

set "HOME=%~dp0"

pushd "%HOME%\..\..\" 

call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" "example.peerblock.conf"
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" "peerblock.conf"
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" "peerblock.conf.bak"
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" "peerblock.exe.manifest"

::do not wrap *.cmd with "" since unix2dos will recive the * and think it is a pattern.
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" *.cmd


pause
popd
exit /b %EXIT_CODE%