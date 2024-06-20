import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllParticipants, searchParticipants, deleteParticipant, filterParticipants } from '../services/ParticipantService';
import { getAllDisciplines } from '../services/DisciplineService';
import '../styling/ParticipantList.css';

const ParticipantList: React.FC = () => {
    const [participants, setParticipants] = useState<any[]>([]);
    const [filteredParticipants, setFilteredParticipants] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const participantsPerPage = 10;
    const [genderFilter, setGenderFilter] = useState<string>('');
    const [ageGroupFilter, setAgeGroupFilter] = useState<string>('');
    const [clubFilter, setClubFilter] = useState<string>('');
    const [disciplineFilter, setDisciplineFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const participantsData = await getAllParticipants();
            setParticipants(participantsData);
            setFilteredParticipants(participantsData);
            const disciplinesData = await getAllDisciplines();
            setDisciplines(disciplinesData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [genderFilter, ageGroupFilter, clubFilter, disciplineFilter, searchTerm]);

    const applyFilters = async () => {
        let filtered = participants;

        if (genderFilter) {
            filtered = filtered.filter(participant => participant.gender === genderFilter);
        }

        if (ageGroupFilter) {
            filtered = filtered.filter(participant => getAgeGroup(participant.age) === ageGroupFilter);
        }

        if (clubFilter) {
            filtered = filtered.filter(participant => participant.club.toLowerCase().includes(clubFilter.toLowerCase()));
        }

        if (disciplineFilter) {
            const disciplineId = parseInt(disciplineFilter, 10);
            filtered = filtered.filter(participant => participant.disciplines.some(discipline => discipline.id === disciplineId));
        }

        if (searchTerm) {
            filtered = filtered.filter(participant => participant.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredParticipants(filtered);
    };

    const getAgeGroup = (age: number) => {
        if (age >= 6 && age <= 9) return 'Children';
        if (age >= 10 && age <= 13) return 'Youth';
        if (age >= 14 && age <= 22) return 'Junior';
        if (age >= 23 && age <= 40) return 'Adult';
        if (age >= 41) return 'Senior';
        return 'Unknown';
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this participant?')) {
            try {
                await deleteParticipant(id);
                setParticipants(participants.filter(participant => participant.id !== id));
                setFilteredParticipants(filteredParticipants.filter(participant => participant.id !== id));
            } catch (error) {
                console.error('Failed to delete participant', error);
            }
        }
    };

    const handleViewDetails = (id: number) => {
        navigate(`/participants/${id}`);
    };

    const indexOfLastParticipant = currentPage * participantsPerPage;
    const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
    const currentParticipants = filteredParticipants.slice(indexOfFirstParticipant, indexOfLastParticipant);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="participant-list">
            <h2>Participants</h2>
            <Link to="/participants/new" className="button">Create New Participant</Link>
            <div className="filters">
                <div>
                    <label>Filter by Gender:</label>
                    <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
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
                <div>
                    <label>Filter by Club:</label>
                    <input type="text" value={clubFilter} onChange={(e) => setClubFilter(e.target.value)} />
                </div>
                <div>
                    <label>Filter by Discipline:</label>
                    <select value={disciplineFilter} onChange={(e) => setDisciplineFilter(e.target.value)}>
                        <option value="">All</option>
                        {disciplines.map(discipline => (
                            <option key={discipline.id} value={discipline.id}>{discipline.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Search by Name:</label>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <ul>
                {currentParticipants.map(participant => (
                    <li key={participant.id} className="participant-item">
                        <div className="participant-info">
                            <strong>Name:</strong> <span>{participant.name}</span> <br />
                            <strong>Gender:</strong> <span>{participant.gender}</span> <br />
                            <strong>Age:</strong> <span>{participant.age}</span> <br />
                            <strong>Age Group:</strong> <span>{getAgeGroup(participant.age)}</span> <br />
                            <strong>Club:</strong> <span>{participant.club}</span>
                        </div>
                        <div className="participant-actions">
                            <button onClick={() => handleViewDetails(participant.id)} className="view-button">View</button>
                            <Link to={`/participants/edit/${participant.id}`} className="edit-button">Edit</Link>
                            <button onClick={() => handleDelete(participant.id)} className="delete-button">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {[...Array(Math.ceil(filteredParticipants.length / participantsPerPage)).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ParticipantList;
