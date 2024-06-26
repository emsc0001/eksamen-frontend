import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResultsByDiscipline } from '../services/ResultService';
import '../styling/ResultsByDiscipline.css';

const ResultsByDiscipline: React.FC = () => {
    const { disciplineId } = useParams<{ disciplineId: string }>();
    const [results, setResults] = useState<any[]>([]);
    const [sortField, setSortField] = useState<string>('resultValue');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const [genderFilter, setGenderFilter] = useState<string>('');
    const [ageGroupFilter, setAgeGroupFilter] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            if (disciplineId) {
                const data = await getResultsByDiscipline(disciplineId);
                setResults(data);
            }
        };
        fetchData();
    }, [disciplineId]);

    const getAgeGroup = (age: number) => {
        if (age >= 6 && age <= 9) return 'Children';
        if (age >= 10 && age <= 13) return 'Youth';
        if (age >= 14 && age <= 22) return 'Junior';
        if (age >= 23 && age <= 40) return 'Adult';
        if (age >= 41) return 'Senior';
        return 'Unknown';
    };

    useEffect(() => {
        let filteredResults = results;
        if (genderFilter) {
            filteredResults = filteredResults.filter(result => result.participant.gender === genderFilter);
        }
        if (ageGroupFilter) {
            filteredResults = filteredResults.filter(result => getAgeGroup(result.participant.age) === ageGroupFilter);
        }
        let sortedResults = [...filteredResults];
        sortedResults.sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setResults(sortedResults);
    }, [genderFilter, ageGroupFilter, sortField, sortOrder, results]);

    return (
        <div className="results-by-discipline">
            <h2>Results for Discipline {disciplineId}</h2>
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
