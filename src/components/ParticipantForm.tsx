import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getParticipantById, createParticipant, updateParticipant } from '../services/ParticipantService';
import { getAllDisciplines } from '../services/DisciplineService';

const ParticipantForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [participant, setParticipant] = useState({
        name: '',
        gender: '',
        age: '',
        club: '',
        disciplines: []
    });
    const [disciplines, setDisciplines] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const disciplinesData = await getAllDisciplines();
            setDisciplines(disciplinesData);
            if (id) {
                const participantData = await getParticipantById(Number(id));
                setParticipant({
                    ...participantData,
                    disciplines: participantData.disciplines.map((d: any) => d.id)
                });
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParticipant({ ...participant, [name]: value });
    };

    const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDisciplines = Array.from(e.target.selectedOptions, option => option.value);
        setParticipant({ ...participant, disciplines: selectedDisciplines });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedParticipant = {
            ...participant,
            disciplines: participant.disciplines.map(id => ({ id }))
        };
        if (id) {
            await updateParticipant(Number(id), formattedParticipant);
        } else {
            await createParticipant(formattedParticipant);
        }
        navigate('/'); // Redirect to the homepage after creation or update
    };

    return (
        <div>
            <h2>{id ? 'Edit Participant' : 'Create Participant'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={participant.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Gender:</label>
                    <select name="gender" value={participant.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" name="age" value={participant.age} onChange={handleChange} required />
                </div>
                <div>
                    <label>Club:</label>
                    <input type="text" name="club" value={participant.club} onChange={handleChange} required />
                </div>
                <div>
                    <label>Disciplines:</label>
                    <select multiple value={participant.disciplines} onChange={handleDisciplineChange}>
                        {disciplines.map(discipline => (
                            <option key={discipline.id} value={discipline.id}>{discipline.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ParticipantForm;