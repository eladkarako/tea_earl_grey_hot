@echo off
chcp 65001 1>nul 2>nul

set "HOME=%~dp0"
pushd "%HOME%"

set "FILE_LIST=https://github.com/eladkarako/tea_earl_grey_hot/raw/store/resources/update/file_list.txt"
::set "FILE_LIST=https://raw.githubusercontent.com/eladkarako/tea_earl_grey_hot/store/resources/update/file_list.txt"
set  ARIA2C="%HOME%\aria2c.exe" --no-conf "--check-certificate=false" "--realtime-chunk-checksum=false" "--user-agent=Mozilla/5.0 Windows NT 6.1" "--referer=*" "--continue=true" "--allow-overwrite=true" "--auto-file-renaming=false" "--remote-time=true" "--conditional-get=true" "--disable-ipv6=true" "--human-readable=true" "--file-allocation=falloc" "--no-file-allocation-limit=1M" "--min-split-size=1M" "--min-tls-version=TLSv1.2" "--content-disposition-default-utf8=true" "--console-log-level=info" "--summary-interval=5" "--max-concurrent-downloads=14" "--max-connection-per-server=14" "--retry-wait=2"

call %ARIA2C% "--dir=." %FILE_LIST%
call %ARIA2C% "--input-file=file_list.txt"
popd

pushd "%HOME%..\..\lists_1_country"
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" *.txt
popd

pushd "%HOME%..\..\lists_2_iblocklists"
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" *.txt
popd

pushd "%HOME%..\..\lists_3_ipfilter_dat"
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" *.txt
popd

pushd "%HOME%..\..\lists_4_custom"
call "%HOME%\unix2dos.exe" "--remove-bom" "-1252" "--oldfile" *.txt
popd

del /f /q "%HOME%..\..\cache.p2b" 1>nul 2>nul

pause
exit /b %EXIT_CODE%