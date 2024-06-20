import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBatchResults } from '../services/ResultService';
import { getAllDisciplines } from '../services/DisciplineService';
import { getAllParticipants } from '../services/ParticipantService';
import '../styling/ResultForm.css';

const BatchResultForm: React.FC = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([{ participantId: '', resultValue: '' }]);
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
    const [disciplineId, setDisciplineId] = useState<string>('');

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

    const handleAddResult = () => {
        setResults([...results, { participantId: '', resultValue: '' }]);
    };

    const handleRemoveResult = (index: number) => {
        setResults(results.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultData = results.map(result => ({
            ...result,
            discipline: { id: disciplineId },
        }));
        await createBatchResults(resultData);
        navigate('/results');
    };

    return (
        <div className="form-container">
            <h2>Create Batch Results</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Discipline:</label>
                    <select
                        name="disciplineId"
                        value={disciplineId}
                        onChange={(e) => setDisciplineId(e.target.value)}
                        required
                    >
                        <option value="">Select Discipline</option>
                        {disciplines.map(discipline => (
                            <option key={discipline.id} value={discipline.id}>
                                {discipline.name} ({discipline.resultType})
                            </option>
                        ))}
                    </select>
                </div>
                {results.map((result, index) => (
                    <div key={index} className="result-entry">
                        <div>
                            <label>Participant:</label>
                            <select
                                name="participantId"
                                value={result.participantId}
                                onChange={(e) => handleChange(index, e)}
                                required
                            >
                                <option value="">Select Participant</option>
                                {participants.map(participant => (
                                    <option key={participant.id} value={participant.id}>
                                        {participant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Result Value:</label>
                            <input
                                type="text"
                                name="resultValue"
                                value={result.resultValue}
                                onChange={(e) => handleChange(index, e)}
                                required
                            />
                        </div>
                        <button type="button" onClick={() => handleRemoveResult(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddResult}>
                    Add Another Result
                </button>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default BatchResultForm;
