import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllResults, deleteResult } from '../services/ResultService';
import '../styling/ResultList.css';

const ResultList: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;
    const [sortField, setSortField] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [genderFilter, setGenderFilter] = useState<string>('');
    const [ageGroupFilter, setAgeGroupFilter] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllResults();
            setResults(result);
            setFilteredResults(result);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let sortedResults = [...filteredResults];
        sortedResults.sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredResults(sortedResults);
    }, [sortField, sortOrder, filteredResults]);

    const getAgeGroup = (age: number) => {
        if (age >= 6 && age <= 9) return 'Children';
        if (age >= 10 && age <= 13) return 'Youth';
        if (age >= 14 && age <= 22) return 'Junior';
        if (age >= 23 && age <= 40) return 'Adult';
        if (age >= 41) return 'Senior';
        return 'Unknown';
    };

    useEffect(() => {
        let filtered = results;
        if (genderFilter) {
            filtered = filtered.filter(result => result.participant.gender === genderFilter);
        }
        if (ageGroupFilter) {
            filtered = filtered.filter(result => getAgeGroup(result.participant.age) === ageGroupFilter);
        }
        setFilteredResults(filtered);
    }, [genderFilter, ageGroupFilter, results]);

    const handleDelete = async (id: string) => {
        await deleteResult(id);
        setResults(results.filter(result => result.id !== id));
    };

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
            <div>
                <label>Filter by Gender:</label>
                <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <label>Filter by Age Group:</label>
                <select value={ageGroupFilter} onChange={(e) => setAgeGroupFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Children">Children (6-9)</option>
                    <option value="Youth">Youth (10-13)</option>
                    <option value="Junior">Junior (14-22)</option>
                    <option value="Adult">Adult (23-40)</option>
                    <option value="Senior">Senior (41+)</option>
                </select>
            </div>
            <ul>
                {currentResults.map(result => (
                    <li key={result.id}>
                        {result.date} - {result.resultValue} - {result.participant.name}
                        <button onClick={() => handleDelete(result.id)}>Delete</button>
                        <Link to={`/results/edit/${result.id}`}>Edit</Link>
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
