import axios from "axios";

const API_URL = "http://localhost:8080/api/matches";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  }
  return {};
};

const getAllMatches = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createMatch = async (match) => {
  return axios.post(API_URL, match, { headers: getAuthHeader() });
};

const updateMatch = async (id, match) => {
  return axios.put(`${API_URL}/${id}`, match, { headers: getAuthHeader() });
};

const deleteMatch = async (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const matchService = {
  getAllMatches,
  createMatch,
  updateMatch,
  deleteMatch,
};

export default matchService;
