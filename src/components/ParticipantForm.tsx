import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createParticipant, getParticipantById, updateParticipant } from '../services/ParticipantService';
import '../styling/ParticipantForm.css';

const ParticipantForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState<number | undefined>();
    const [club, setClub] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditing) {
            const fetchData = async () => {
                const result = await getParticipantById(Number(id));
                setName(result.name);
                setGender(result.gender);
                setAge(result.age);
                setClub(result.club);
            };
            fetchData();
        }
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const participant = { name, gender, age, club };
        if (isEditing) {
            await updateParticipant(Number(id), participant);
        } else {
            await createParticipant(participant);
        }
        navigate('/');
    };

    return (
        <div className="participant-form">
            <h2>{isEditing ? 'Edit Participant' : 'Create Participant'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Gender</label>
                    <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
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
