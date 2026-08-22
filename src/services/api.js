import axios from "axios";
import getBaseUrl from '../utils/GetUrl';

const API_URL = `${getBaseUrl()}/api/`;

export const addUser = async (user) => {
    return axios.post(`${API_URL}/addUser`, user);
};

export const getUsers = async () => {
    return axios.get(`${API_URL}/users`);
};

// ✅ New function to add a profile
export const addProfile = async (profile) => {
    
    return axios.post(`${API_URL}/addProfile`, profile) 
    .then(response => {
        
        return response.data;
    })
    .catch(error => {
        console.error("Error while adding profile:", error.response?.data || error.message);
        throw error;
    });
};
