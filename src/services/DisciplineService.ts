import axios from 'axios';

const API_URL = 'http://localhost:8080/api/disciplines';

export const getAllDisciplines = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createDiscipline = async (discipline: any) => {
    return axios.post(API_URL, discipline);
};

export const updateDiscipline = async (id: string, discipline: any) => {
    return axios.put(`${API_URL}/${id}`, discipline);
};

export const getDisciplineById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const deleteDiscipline = async (id: string) => {
    return axios.delete(`${API_URL}/${id}`);
};