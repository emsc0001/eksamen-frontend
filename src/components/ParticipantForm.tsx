import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getParticipantById, createParticipant, updateParticipant } from '../services/ParticipantService';
import '../styling/ParticipantForm.css';

const ParticipantForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState<number | undefined>();
    const [club, setClub] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing) {
            const fetchData = async () => {
                const participant = await getParticipantById(Number(id));
                setName(participant.name);
                setGender(participant.gender);
                setAge(participant.age);
                setClub(participant.club);
            };
            fetchData();
        }
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !gender || age === undefined || !club) {
            setError('All fields are required');
            return;
        }
        const participant = { name, gender, age, club };
        try {
            if (isEditing) {
                await updateParticipant(Number(id), participant);
            } else {
                await createParticipant(participant);
            }
            navigate('/');
        } catch (error) {
            setError('An error occurred while saving the participant');
        }
    };

    return (
        <div className="participant-form">
            <h2>{isEditing ? 'Edit Participant' : 'Create Participant'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                </div>
                <div>
                    <label>Club</label>
                    <input type="text" value={club} onChange={(e) => setClub(e.target.value)} />
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default ParticipantForm;
