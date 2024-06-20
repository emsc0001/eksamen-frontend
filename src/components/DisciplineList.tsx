import React, { useEffect, useState } from 'react';
import { getAllDisciplines } from '../services/DisciplineService';
import { Link } from 'react-router-dom';
import '../styling/DisciplineList.css';

const DisciplineList: React.FC = () => {
    const [disciplines, setDisciplines] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllDisciplines();
            setDisciplines(result);
        };
        fetchData();
    }, []);

    return (
        <div className="discipline-list">
            <h2>Disciplines</h2>
            <Link to="/disciplines/new">Create New Discipline</Link>
            <ul>
                {disciplines.map(discipline => (
                    <li key={discipline.id}>
                        {discipline.name} - {discipline.resultType} - <Link to={`/disciplines/edit/${discipline.id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DisciplineList;