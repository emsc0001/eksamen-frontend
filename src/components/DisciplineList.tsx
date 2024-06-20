import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDisciplines } from '../services/DisciplineService';

const DisciplineList: React.FC = () => {
    const [disciplines, setDisciplines] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllDisciplines();
                setDisciplines(result);
            } catch (error) {
                console.error('Error fetching disciplines:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Disciplines</h2>
            <Link to="/disciplines/new" className="button">Create New Discipline</Link>
            <ul>
                {disciplines.map(discipline => (
                    <li key={discipline.id}>
                        {discipline.name} ({discipline.resultType})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DisciplineList;
