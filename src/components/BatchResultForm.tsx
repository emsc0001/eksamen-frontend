import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createResults } from '../services/ResultService';
import { getAllDisciplines } from '../services/DisciplineService';
import { getAllParticipants } from '../services/ParticipantService';
import '../styling/BatchResultForm.css';

const BatchResultForm: React.FC = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([{ date: '', resultValue: '', disciplineId: '', participantId: '', resultType: '' }]);
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const disciplinesData = await getAllDisciplines();
            setDisciplines(disciplinesData);
            const participantsData = await getAllParticipants();
            setParticipants(participantsData);
        };
        fetchData();
    }, []);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedResults = results.map((result, i) =>
            i === index ? { ...result, [name]: value } : result
        );
        setResults(updatedResults);
    };

    const addResult = () => {
        setResults([...results, { date: '', resultValue: '', disciplineId: '', participantId: '', resultType: '' }]);
    };

    const formatResultValue = (resultType: string, value: string) => {
        switch (resultType) {
            case 'time':
                const [hours, minutes, seconds] = value.split(':');
                return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
            case 'distance':
                const [meters, centimeters] = value.split('.');
                return `${meters}m ${centimeters}cm`;
            case 'points':
            default:
                return value;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedResults = results.map(result => ({
            ...result,
            resultValue: formatResultValue(result.resultType, result.resultValue),
            discipline: { id: result.disciplineId },
            participant: { id: result.participantId }
        }));
        await createResults(formattedResults);
        navigate('/results');
    };

    return (
        <div className="batch-result-form">
            <h2>Batch Create Results</h2>
            <form onSubmit={handleSubmit}>
                {results.map((result, index) => (
                    <div key={index} className="result-entry">
                        <div>
                            <label>Date:</label>
                            <input type="date" name="date" value={result.date} onChange={(e) => handleChange(index, e)} required />
                        </div>
                        <div>
                            <label>Result Value:</label>
                            <input type="text" name="resultValue" value={result.resultValue} onChange={(e) => handleChange(index, e)} required />
                        </div>
                        <div>
                            <label>Discipline:</label>
                            <select name="disciplineId" value={result.disciplineId} onChange={(e) => handleChange(index, e)} required>
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
                            <select name="participantId" value={result.participantId} onChange={(e) => handleChange(index, e)} required>
                                <option value="">Select Participant</option>
                                {participants.map(participant => (
                                    <option key={participant.id} value={participant.id}>{participant.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addResult}>Add Another Result</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default BatchResultForm;
