@echo off

echo Checking OS.
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto 64BIT
    echo 32-bit OS
    echo Downloading Node.js (32-Bit). Please wait.
    powershell -Command "(New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v0.12.7/node.exe', 'bin\node.exe')"
    goto END
:64BIT
    echo 64-bit OS
    echo Downloading Node.js (64-Bit). Please wait.
    powershell -Command "(New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v0.12.7/x64/node.exe', 'bin\node.exe')"
:END

pause
