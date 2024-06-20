import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createResult, getResultById, updateResult } from '../services/ResultService';
import { getAllParticipants } from '../services/ParticipantService';
import { getAllDisciplines } from '../services/DisciplineService';

const ResultForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);
    const [participantId, setParticipantId] = useState<number | undefined>();
    const [disciplineId, setDisciplineId] = useState<number | undefined>();
    const [resultValue, setResultValue] = useState('');
    const [date, setDate] = useState('');
    const [participants, setParticipants] = useState<any[]>([]);
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParticipantsAndDisciplines = async () => {
            const participantsResult = await getAllParticipants();
            setParticipants(participantsResult);
            const disciplinesResult = await getAllDisciplines();
            setDisciplines(disciplinesResult);
        };

        fetchParticipantsAndDisciplines();

        if (isEditing) {
            const fetchData = async () => {
                const result = await getResultById(Number(id));
                setParticipantId(result.participant.id);
                setDisciplineId(result.discipline.id);
                setResultValue(result.resultValue);
                setDate(result.date);
            };
            fetchData();
        }
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = { participantId, disciplineId, resultValue, date };
        if (isEditing) {
            await updateResult(Number(id), result);
        } else {
            await createResult(result);
        }
        navigate('/results');
    };

    return (
        <div>
            <h2>{isEditing ? 'Edit Result' : 'Create Result'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Participant</label>
                    <select value={participantId} onChange={(e) => setParticipantId(Number(e.target.value))}>
                        <option value="">Select Participant</option>
                        {participants.map(participant => (
                            <option key={participant.id} value={participant.id}>
                                {participant.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Discipline</label>
                    <select value={disciplineId} onChange={(e) => setDisciplineId(Number(e.target.value))}>
                        <option value="">Select Discipline</option>
                        {disciplines.map(discipline => (
                            <option key={discipline.id} value={discipline.id}>
                                {discipline.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Result Value</label>
                    <input type="text" value={resultValue} onChange={(e) => setResultValue(e.target.value)} />
                </div>
                <div>
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default ResultForm;
