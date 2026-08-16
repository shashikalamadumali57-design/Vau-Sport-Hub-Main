import axios from 'axios';

const API_URL = "http://localhost:8080/api/announcements";

const testFetch = async () => {
    try {
        console.log("Fetching from:", API_URL);
        const response = await axios.get(API_URL);
        console.log("Status:", response.status);
        console.log("Data:", response.data);
    } catch (error) {
        console.error("Error fetching:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
    }
};

testFetch();
