import axios from "axios";

const API_URL = "http://localhost:8080/api/join-requests";

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        return {
            Authorization: `Bearer ${user.token}`,
            "X-User-Email": user.email,
            "X-User-Role": user.role
        };
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
