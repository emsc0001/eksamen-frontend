import React, { useEffect, useState } from 'react';
import { getAllResults } from '../services/ResultService';
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

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="result-list">
            <h2>Results</h2>
            <div>
                <label>Sort by:</label>
                <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="date">Date</option>
                    <option value="resultValue">Result Value</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </button>
            </div>
            <ul>
                {currentResults.map(result => (
                    <li key={result.id}>
                        {result.date} - {result.resultValue}
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
