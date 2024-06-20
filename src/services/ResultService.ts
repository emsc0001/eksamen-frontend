import axios from 'axios';

const API_URL = 'http://localhost:8080/api/results';

export const getAllResults = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getResultById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createResult = async (result: any) => {
    const response = await axios.post(API_URL, result);
    return response.data;
};

export const createResults = async (results: any[]) => {
    const response = await axios.post(`${API_URL}/batch`, results);
    return response.data;
};

export const updateResult = async (id: string, result: any) => {
    const response = await axios.put(`${API_URL}/${id}`, result);
    return response.data;
};

export const deleteResult = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const getResultsByDiscipline = async (disciplineId: string) => {
    const response = await axios.get(`${API_URL}/discipline/${disciplineId}`);
    return response.data;
};
