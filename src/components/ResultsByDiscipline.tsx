import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResultsByDiscipline } from '../services/ResultService';
import '../styling/ResultsByDiscipline.css';

const ResultsByDiscipline: React.FC = () => {
    const { disciplineId } = useParams<{ disciplineId: string }>();
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (disciplineId) {
                const data = await getResultsByDiscipline(disciplineId);
                setResults(data);
            }
        };
        fetchData();
    }, [disciplineId]);

    return (
        <div className="results-by-discipline">
            <h2>Results for Discipline {disciplineId}</h2>
            <ul>
                {results.map(result => (
                    <li key={result.id}>
                        {result.participant.name}: {result.resultValue} ({result.date})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResultsByDiscipline;
