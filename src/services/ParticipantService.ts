import axios from 'axios';

const API_URL = 'http://localhost:8080/api/participants';

export const getAllParticipants = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getParticipantById = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createParticipant = async (participant: any) => {
    const response = await axios.post(API_URL, participant);
    return response.data;
};

export const updateParticipant = async (id: number, participant: any) => {
    const response = await axios.put(`${API_URL}/${id}`, participant);
    return response.data;
};

export const deleteParticipant = async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const searchParticipants = async (query: string) => {
    const response = await axios.get(`${API_URL}/search?query=${query}`);
    return response.data;
};
