# VavSport Hub Project

This project contains a Spring Boot backend and a React/Vite frontend.

## How to Run in VS Code

You need **two** terminal instances running simultaneously.

### 1. Start the Backend

Open a terminal in VS Code (`Ctrl + ~`) and run:

```powershell
# If using PowerShell/Command Prompt
java -jar backend/target/sportshub-0.0.1-SNAPSHOT.jar
```

Ensure you have Java installed.

### 2. Start the Frontend

Open a **new** terminal (click the `+` icon or split the terminal) and run:

```powershell
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

---
## Project Structure
- `backend/`: Java Spring Boot application
- `src/`: React Frontend application
