@echo off
title HP OMEN Command Center Ultra-Premium App
echo Starting OMEN Command Center Hardware Engine & Dashboard...

rem Start Python local web server on port 8090
start "" /b python -m http.server 8090 --directory "E:\Emo Games\OmenCommandCenter" > nul 2>&1

rem Start OmenMon hardware bridge on port 8091
start "" /b python "E:\Emo Games\OmenCommandCenter\omenmon_bridge.py" > nul 2>&1

timeout /t 1 /nobreak > nul

rem Launch Microsoft Edge or Chrome in 100% Frameless Standalone App Window Mode
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="http://localhost:8090/index.html" --window-size=1600,950
) else if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="http://localhost:8090/index.html" --window-size=1600,950
) else (
    start http://localhost:8090/index.html
)

exit
