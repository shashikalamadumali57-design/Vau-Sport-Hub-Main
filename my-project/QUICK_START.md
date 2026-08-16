# Quick Start Guide - SportsHub Backend

## The Problem
The backend won't start because your system is low on memory. The H2 database is embedded in the backend, so it can't work until the backend starts successfully.

## Solution: Start Backend from Your IDE (EASIEST METHOD)

### Step 1: Open the Main Application File
1. In your IDE, navigate to: `backend/src/main/java/com/vav/sportshub/SportsHubApplication.java`
2. You should already have this file open

### Step 2: Configure Memory Settings (Important!)
Before running, set the JVM memory options in your IDE:

**For IntelliJ IDEA:**
1. Right-click on `SportsHubApplication.java`
2. Select "Modify Run Configuration..." or "Edit Configurations..."
3. In the "VM options" field, add: `-Xmx512m -Xms256m`
4. Click "Apply" and "OK"

**For Eclipse:**
1. Right-click on `SportsHubApplication.java`
2. Select "Run As" → "Run Configurations..."
3. Go to the "Arguments" tab
4. In "VM arguments", add: `-Xmx512m -Xms256m`
5. Click "Apply" and "Run"

**For VS Code:**
1. Open `.vscode/launch.json` (create if it doesn't exist)
2. Add this configuration:
```json
{
    "type": "java",
    "name": "SportsHubApplication",
    "request": "launch",
    "mainClass": "com.vav.sportshub.SportsHubApplication",
    "projectName": "sportshub",
    "vmArgs": "-Xmx512m -Xms256m"
}
```

### Step 3: Run the Application
1. Right-click on `SportsHubApplication.java`
2. Select "Run 'SportsHubApplication'" or "Run As → Java Application"
3. Wait for the console to show: **"Started SportsHubApplication in X.XXX seconds"**
4. You should also see: **"Tomcat started on port(s): 8080 (http)"**

### Step 4: Verify Database Initialization
Look for these messages in the console:
```
User registered successfully: admin with role: ROLE_ADMIN
User registered successfully: coach with role: ROLE_COACH
User registered successfully: student with role: ROLE_STUDENT
```

This confirms the database has been initialized with demo users.

## What Happens When Backend Starts

1. **H2 Database** creates an in-memory database
2. **Tables** are automatically created based on your entities
3. **Demo Data** is seeded (users, sports, teams, matches, announcements)
4. **API Endpoints** become available at http://localhost:8080/api

## Testing the System

Once the backend is running:

1. **Open your browser** to http://localhost:5173 (frontend is already running)
2. **Try to register** as a Vice Captain:
   - Username: `vicecaptain1`
   - Email: `vc1@test.com`
   - Password: `password123`
   - Role: `Vice Captain`
3. **Should succeed!** You'll see "User registered successfully!"
4. **Login** with your new credentials
5. **Access the dashboard** and all features

## Troubleshooting

### If backend still won't start:
1. **Close other programs** to free up memory
2. **Restart your computer**
3. Try running with even less memory: `-Xmx384m -Xms128m`

### If you see "Port 8080 already in use":
1. Another process is using port 8080
2. Stop that process or change the port in `application.properties`

### To access H2 Console (optional):
1. Go to: http://localhost:8080/h2-console
2. JDBC URL: `jdbc:h2:mem:sportshubdb`
3. Username: `sa`
4. Password: `password`

## Summary

✅ **Database Configuration**: Correct (H2 in-memory)  
✅ **Frontend**: Running on port 5173  
❌ **Backend**: Needs to be started with reduced memory settings  
❌ **Database**: Will work once backend starts

**Next Step**: Run the backend from your IDE with the memory settings above!
