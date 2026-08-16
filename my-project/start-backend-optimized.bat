@echo off
echo Starting VavSport Hub Backend (Optimized for Low Memory)...
echo Using limited memory (300MB) to prevent system freezing.

java -Xms128m -Xmx300m -jar backend/target/sportshub-0.0.1-SNAPSHOT.jar

pause
