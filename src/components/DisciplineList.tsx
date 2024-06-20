import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDisciplines, deleteDiscipline } from '../services/DisciplineService';
import '../styling/DisciplineList.css';

const DisciplineList: React.FC = () => {
    const [disciplines, setDisciplines] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllDisciplines();
            setDisciplines(result);
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteDiscipline(id);
        setDisciplines(disciplines.filter(discipline => discipline.id !== id));
    };

    return (
        <div className="discipline-list">
            <h2>Disciplines</h2>
            <Link to="/disciplines/new" className="button">Add Discipline</Link>
            <ul>
                {disciplines.map(discipline => (
                    <li key={discipline.id}>
                        <span>{discipline.name}</span>
                        <div>
                            <Link to={`/disciplines/edit/${discipline.id}`} className="button edit-button">Edit</Link>
                            <button onClick={() => handleDelete(discipline.id)} className="button delete-button">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DisciplineList;
