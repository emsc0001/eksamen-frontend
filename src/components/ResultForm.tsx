import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createResult, getResultById, updateResult } from '../services/ResultService';
import { getAllDisciplines } from '../services/DisciplineService';
import { getAllParticipants } from '../services/ParticipantService';
import '../styling/ResultForm.css';

const ResultForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [result, setResult] = useState({ date: '', resultValue: '', disciplineId: '', participantId: '', resultType: '' });
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const disciplinesData = await getAllDisciplines();
            setDisciplines(disciplinesData);
            const participantsData = await getAllParticipants();
            setParticipants(participantsData);

            if (id) {
                const resultData = await getResultById(id);
                setResult({
                    ...resultData,
                    disciplineId: resultData.discipline.id,
                    participantId: resultData.participant.id
                });
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setResult(prevResult => ({ ...prevResult, [name]: value }));
    };

    const formatResultValue = (resultType: string, value: string) => {
        switch (resultType) {
            case 'time':
                const [hours, minutes, seconds, hundredths] = value.split(':');
                return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}.${hundredths.padStart(2, '0')}`;
            case 'distance':
                const [meters, centimeters] = value.split('.');
                return `${meters}m ${centimeters}cm`;
            default:
                return value;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedValue = formatResultValue(result.resultType, result.resultValue);
        const resultData = {
            ...result,
            resultValue: formattedValue,
            discipline: { id: result.disciplineId },
            participant: { id: result.participantId }
        };
        if (id) {
            await updateResult(id, resultData);
        } else {
            await createResult(resultData);
        }
        navigate('/results');
    };

    return (
        <div className="form-container">
            <h2>{id ? 'Edit Result' : 'Create Result'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={result.date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Result Value:</label>
                    <input type="text" name="resultValue" value={result.resultValue} onChange={handleChange} required placeholder={result.resultType === 'time' ? 'HH:MM:SS.SS' : 'Meters.Centimeters'} />
                </div>
                <div>
                    <label>Discipline:</label>
                    <select name="disciplineId" value={result.disciplineId} onChange={handleChange} required>
                        <option value="">Select Discipline</option>
                        {disciplines.map(discipline => (
                            <option key={discipline.id} value={discipline.id}>
                                {discipline.name} ({discipline.resultType})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Participant:</label>
                    <select name="participantId" value={result.participantId} onChange={handleChange} required>
                        <option value="">Select Participant</option>
                        {participants.map(participant => (
                            <option key={participant.id} value={participant.id}>{participant.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default ResultForm;
