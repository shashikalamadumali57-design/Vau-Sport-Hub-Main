import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/auth/`;

const login = async (username, password) => {
    const response = await axios.post(API_URL + "signin", {
        username,
        password,
    });
    if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify({
            ...response.data,
            token: response.data.accessToken,
            role: response.data.roles[0].replace("ROLE_", "").toLowerCase()
        }));
    }
    return response.data;
};

const register = async (username, email, password, role) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
        role,
    });
};

const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    login,
    register,
    logout,
};

export default authService;
