import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllParticipants } from '../services/ParticipantService';
import '../styling/ParticipantList.css';

const ParticipantList: React.FC = () => {
    const [participants, setParticipants] = useState<any[]>([]);
    const [filteredParticipants, setFilteredParticipants] = useState<any[]>([]);
    const [genderFilter, setGenderFilter] = useState<string>('');
    const [ageGroupFilter, setAgeGroupFilter] = useState<string>('');
    const [clubFilter, setClubFilter] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllParticipants();
            setParticipants(result);
            setFilteredParticipants(result);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = participants;
        if (genderFilter) {
            filtered = filtered.filter(participant => participant.gender === genderFilter);
        }
        if (ageGroupFilter) {
            filtered = filtered.filter(participant => getAgeGroup(participant.age) === ageGroupFilter);
        }
        if (clubFilter) {
            filtered = filtered.filter(participant => participant.club === clubFilter);
        }
        setFilteredParticipants(filtered);
    }, [genderFilter, ageGroupFilter, clubFilter, participants]);

    const getAgeGroup = (age: number) => {
        if (age >= 6 && age <= 9) return 'Children';
        if (age >= 10 && age <= 13) return 'Youth';
        if (age >= 14 && age <= 22) return 'Junior';
        if (age >= 23 && age <= 40) return 'Adult';
        if (age >= 41) return 'Senior';
        return '';
    };

    return (
        <div className="participant-list">
            <h2>Participants</h2>
            <Link to="/participants/new">Create New Participant</Link>
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
                <label>Filter by Club:</label>
                <input type="text" value={clubFilter} onChange={(e) => setClubFilter(e.target.value)} />
            </div>
            <ul>
                {filteredParticipants.map(participant => (
                    <li key={participant.id}>
                        {participant.name} - {participant.gender} - {participant.age} - {participant.club} - 
                        <Link to={`/participants/edit/${participant.id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParticipantList;
