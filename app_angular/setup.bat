@echo off
REM Setup script for CodeMaster Angular version (Windows)
REM This script copies necessary files from parent directories

echo Setting up CodeMaster Angular application...
echo.

REM Create directories if they don't exist
if not exist "public\assets\images" mkdir public\assets\images
if not exist "public\data" mkdir public\data

REM Copy data files
echo Copying data files...
if exist "..\data\content.json" (
    copy ..\data\content.json public\data\
) else (
    echo Note: content.json not found in parent data directory
)

REM Copy images
echo Copying image assets...
if exist "..\images" (
    xcopy ..\images public\assets\images\ /E /I /Y
) else (
    echo Note: images not found in parent images directory
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Run 'npm install' to install dependencies
echo 2. Run 'npm start' to start the development server
echo 3. Open http://localhost:4200 in your browser
pause
