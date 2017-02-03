@echo off
cls

:: Get script directory
set SCRIPT_DIR=%~dp0
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%
set MODULES=%SCRIPT_DIR%\node_modules

if not exist "%MODULES%" (
	echo Required dependencies not installed.
	echo Please run 'install_deps' first, then run 'make' again.
	goto :DONE
)

cd "%SCRIPT_DIR%"
call npm run build

:DONE
pause