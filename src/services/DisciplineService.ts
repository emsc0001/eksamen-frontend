import axios from 'axios';

const API_URL = 'http://localhost:8080/api/disciplines';

export const getAllDisciplines = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createDiscipline = async (discipline: any) => {
    const response = await axios.post(API_URL, discipline);
    return response.data;
};

export const getDisciplineById = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const updateDiscipline = async (id: number, discipline: any) => {
    const response = await axios.put(`${API_URL}/${id}`, discipline);
    return response.data;
};

export const deleteDiscipline = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
};
