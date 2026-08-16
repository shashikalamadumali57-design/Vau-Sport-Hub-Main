@echo off
echo Starting SportsHub Backend Server...
echo.

REM Check if Java is installed
java -version 2>&1 | findstr /i "version" >nul
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

echo Java found!
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

echo Checking for Maven...
where mvn >nul 2>&1
if errorlevel 1 (
    echo Maven not found in PATH
    echo Trying to use Maven wrapper...
    
    REM Try to find Maven in temp_maven or .m2
    if exist "temp_maven" (
        echo Found temp_maven directory
        cd temp_maven
        for /d %%i in ("%USERPROFILE%\.m2\wrapper\dists\apache-maven-*") do (
            if exist "%%i\apache-maven-*\bin\mvn.cmd" (
                echo Using Maven from: %%i
                "%%i\apache-maven-*\bin\mvn.cmd" -f ..\pom.xml spring-boot:run
                goto :end
            )
        )
        cd ..
    )
    
    echo ERROR: Maven not found
    echo.
    echo Please install Maven or use your IDE to run SportsHubApplication.java
    echo.
    pause
    exit /b 1
) else (
    echo Maven found! Starting application...
    echo.
    mvn spring-boot:run
)

:end
pause
