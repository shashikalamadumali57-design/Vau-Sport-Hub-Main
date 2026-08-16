import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

// Built-in demo users that work without the backend
const DEMO_USERS = [
  { username: "admin",   password: "admin123",   email: "admin@vav.com",   roles: ["ROLE_ADMIN"],   token: "demo-admin-token"   },
  { username: "coach",   password: "coach123",   email: "coach@vav.com",   roles: ["ROLE_COACH"],   token: "demo-coach-token"   },
  { username: "student", password: "student123", email: "student@vav.com", roles: ["ROLE_STUDENT"], token: "demo-student-token" },
  { username: "captain", password: "captain123", email: "captain@vav.com", roles: ["ROLE_CAPTAIN"], token: "demo-captain-token" },
];

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("localUsers") || "[]");
  } catch {
    return [];
  }
};

const saveLocalUser = (user) => {
  const existing = getLocalUsers();
  localStorage.setItem("localUsers", JSON.stringify([...existing, user]));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    // 1. Try the real backend first
    try {
      const data = await authService.login(username, password);
      const userObj = {
        ...data,
        token: data.accessToken,
        role: data.roles[0].replace("ROLE_", "").toLowerCase(),
      };
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
      return true;
    } catch (backendError) {
      // Backend is offline — fall back to local auth
      console.warn("Backend offline, using local auth.");
    }

    // 2. Check built-in demo users
    const allUsers = [...DEMO_USERS, ...getLocalUsers()];
    const found = allUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (found) {
      const userObj = {
        username: found.username,
        email: found.email,
        roles: found.roles,
        token: found.token || "local-token-" + Date.now(),
        role: found.roles[0].replace("ROLE_", "").toLowerCase(),
        accessToken: found.token || "local-token-" + Date.now(),
      };
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
      return true;
    }

    throw new Error("Invalid username or password");
  };

  const register = async (username, email, password, role = "ROLE_STUDENT") => {
    // 1. Try the real backend first
    try {
      await authService.register(username, email, password, role);
      return true;
    } catch (backendError) {
      // Backend is offline — save locally
      console.warn("Backend offline, registering user locally.");
    }

    // 2. Check for duplicate username locally
    const allUsers = [...DEMO_USERS, ...getLocalUsers()];
    if (allUsers.find((u) => u.username === username)) {
      throw new Error("Username already taken. Please choose another.");
    }

    // 3. Save to localStorage
    saveLocalUser({
      username,
      email,
      password,
      roles: [role],
      token: "local-token-" + Date.now(),
    });

    return true;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
