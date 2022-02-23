@echo off
chcp 65001 1>nul 2>nul

pushd "%~sdp0"

pushd "resources\xml_mods"

call "generate_anonymized_conf.cmd"
set "EXIT_CODE=%ErrorLevel%"

::pause

popd
popd
exit /b %EXIT_CODE%