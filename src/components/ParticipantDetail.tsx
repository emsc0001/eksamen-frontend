import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParticipantById, deleteParticipant } from '../services/ParticipantService';
import '../styling/ParticipantDetail.css';

const ParticipantDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [participant, setParticipant] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const result = await getParticipantById(Number(id));
            setParticipant(result);
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this participant?')) {
            await deleteParticipant(Number(id));
            navigate('/');
        }
    };

    if (!participant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="participant-detail">
            <h2>Participant Detail</h2>
            <p><strong>Name:</strong> {participant.name}</p>
            <p><strong>Gender:</strong> {participant.gender}</p>
            <p><strong>Age:</strong> {participant.age}</p>
            <p><strong>Club:</strong> {participant.club}</p>
            <h3>Disciplines</h3>
            <ul>
                {participant.disciplines.map((discipline: any) => (
                    <li key={discipline.id}>{discipline.name} ({discipline.resultType})</li>
                ))}
            </ul>
            <button onClick={() => navigate(`/participants/edit/${id}`)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default ParticipantDetail;
