import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParticipantById, deleteParticipant } from '../services/ParticipantService';

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
        await deleteParticipant(Number(id));
        navigate('/');
    };

    if (!participant) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Participant Detail</h2>
            <p>Name: {participant.name}</p>
            <p>Gender: {participant.gender}</p>
            <p>Age: {participant.age}</p>
            <p>Club: {participant.club}</p>
            <button onClick={() => navigate(`/participants/edit/${id}`)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default ParticipantDetail;
