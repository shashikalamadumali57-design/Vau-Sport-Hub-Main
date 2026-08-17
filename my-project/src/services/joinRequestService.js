import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/join-requests`;

const getAuthHeader = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token || user?.accessToken;
        if (token) {
            return {
                Authorization: `Bearer ${token}`,
                "X-User-Email": user.email || "",
                "X-User-Role": user.role || ""
            };
        }
    } catch (e) {
        console.error("Error reading auth token", e);
    }
    return {};
};

export const createJoinRequest = async (requestData) => {
    try {
        const response = await axios.post(API_URL, requestData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error creating join request:", error);
        throw error;
    }
};

export const getJoinRequests = async (sportName, teamCategory) => {
    try {
        const response = await axios.get(`${API_URL}/${sportName}/${teamCategory}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching join requests:", error);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const response = await axios.get(`${API_URL}/notifications`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

export const updateJoinRequestStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/status`, null, {
            params: { status },
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error updating join request status:", error);
        throw error;
    }
};
