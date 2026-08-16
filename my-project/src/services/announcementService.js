import axios from "axios";

const API_URL = "http://localhost:8080/api/announcements";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  }
  return {};
};

const getAllAnnouncements = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createAnnouncement = async (announcement) => {
  return axios.post(API_URL, announcement, { headers: getAuthHeader() });
};

const updateAnnouncement = async (id, announcement) => {
  return axios.put(`${API_URL}/${id}`, announcement, { headers: getAuthHeader() });
};

const deleteAnnouncement = async (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const announcementService = {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};

export default announcementService;
