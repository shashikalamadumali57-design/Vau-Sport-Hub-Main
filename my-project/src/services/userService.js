import axios from "axios";

const API_URL = "http://localhost:8080/api/players/";

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const getMyProfile = async () => {
    try {
        const response = await axios.get(API_URL + "me", { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching profile", error);
        throw error;
    }
};

const userService = {
    getMyProfile,
};

export default userService;
