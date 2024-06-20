import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDiscipline, getDisciplineById, updateDiscipline } from '../services/DisciplineService';
import '../styling/DisciplineForm.css'

const DisciplineForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);
    const [name, setName] = useState('');
    const [resultType, setResultType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditing) {
            const fetchData = async () => {
                const result = await getDisciplineById(Number(id));
                setName(result.name);
                setResultType(result.resultType);
            };
            fetchData();
        }
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const discipline = { name, resultType };
        if (isEditing) {
            await updateDiscipline(Number(id), discipline);
        } else {
            await createDiscipline(discipline);
        }
        navigate('/disciplines');
    };

    return (
        <div>
            <h2>{isEditing ? 'Edit Discipline' : 'Create Discipline'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Result Type</label>
                    <input type="text" value={resultType} onChange={(e) => setResultType(e.target.value)} />
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default DisciplineForm;
