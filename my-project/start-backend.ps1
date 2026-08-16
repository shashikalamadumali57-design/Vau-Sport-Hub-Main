# Start Backend with Reduced Memory Settings
# This script starts the Spring Boot backend with lower memory requirements

Write-Host "=== Starting SportsHub Backend Server ===" -ForegroundColor Cyan
Write-Host ""

# Set Maven options to use less memory
$env:MAVEN_OPTS="-Xmx512m -Xms256m"

# Navigate to backend directory
Set-Location -Path "$PSScriptRoot\backend"

Write-Host "Using Maven with reduced memory settings..." -ForegroundColor Yellow
Write-Host "MAVEN_OPTS: $env:MAVEN_OPTS" -ForegroundColor Gray
Write-Host ""

# Use the Maven wrapper we found
$mavenPath = "C:\Users\HP\.m2\wrapper\dists\apache-maven-3.9.11-bin\6mqf5t809d9geo83kj4ttckcbc\apache-maven-3.9.11\bin\mvn.cmd"

if (Test-Path $mavenPath) {
    Write-Host "Starting backend server..." -ForegroundColor Green
    Write-Host "This may take a minute..." -ForegroundColor Gray
    Write-Host ""
    
    & $mavenPath spring-boot:run
} else {
    Write-Host "ERROR: Maven not found at expected location" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the backend from your IDE instead:" -ForegroundColor Yellow
    Write-Host "1. Open SportsHubApplication.java" -ForegroundColor White
    Write-Host "2. Right-click -> Run 'SportsHubApplication'" -ForegroundColor White
    Write-Host ""
    pause
}
