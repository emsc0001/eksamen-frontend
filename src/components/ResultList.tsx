import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllResults } from '../services/ResultService';

const ResultList: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllResults();
            setResults(result);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Results</h2>
            <Link to="/results/new">Create New Result</Link>
            <ul>
                {results.map(result => (
                    <li key={result.id}>
                        {result.participant.name} - {result.discipline.name} - {result.resultValue} - {result.date}
                        <Link to={`/results/edit/${result.id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResultList;
