import React, { useEffect, useState } from 'react';
import { getAllResults, deleteResult } from '../services/ResultService';
import '../styling/ResultList.css';

const ResultList: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;
    const [sortField, setSortField] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<string>('asc');

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllResults();
            setResults(result);
            setFilteredResults(result);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let sortedResults = [...results];
        sortedResults.sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredResults(sortedResults);
    }, [results, sortField, sortOrder]);

    const handleDelete = async (id: string) => {
        try {
            await deleteResult(id);
            setResults(results.filter(result => result.id !== id));
        } catch (error) {
            console.error('Error deleting result:', error);
        }
    };

    const formatResultDisplay = (resultType: string, value: string) => {
        switch (resultType) {
            case 'time':
                const [hours, minutes, seconds, hundredths] = value.split(/[:.]/);
                return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}.${hundredths.padStart(2, '0')}`;
            case 'distance':
                const [meters, centimeters] = value.split('.');
                return `${meters}m ${centimeters}cm`;
            default:
                return value;
        }
    };

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="result-list">
            <h2>Results</h2>
            <div className="filters">
                <div>
                    <label>Sort by:</label>
                    <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                        <option value="date">Date</option>
                        <option value="resultValue">Result Value</option>
                    </select>
                </div>
                <div>
                    <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </button>
                </div>
            </div>
            <div className="header">
                <div className="participant">Participant</div>
                <div>Value</div>
                <div>Discipline</div>
                <div>Date</div>
                <div>Actions</div>
            </div>
            <ul>
                {currentResults.map(result => (
                    <li key={result.id} className="result-item">
                        <div className="result-info">
                            <div className="participant">{result.participant.name}</div>
                            <div>{formatResultDisplay(result.resultType, result.resultValue)}</div>
                            <div>{result.discipline.name}</div>
                            <div>{result.date}</div>
                            <div>
                                <button onClick={() => handleDelete(result.id)}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {[...Array(Math.ceil(filteredResults.length / resultsPerPage)).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ResultList;
