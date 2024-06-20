import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBatchResults } from '../services/ResultService';
import { getAllDisciplines } from '../services/DisciplineService';
import { getAllParticipants } from '../services/ParticipantService';
import '../index.css'; // Ensure the new CSS file is imported

const BatchResultForm: React.FC = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([{ participantId: '', resultValue: '', resultType: '' }]);
    const [disciplines, setDisciplines] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [disciplineId, setDisciplineId] = useState('');

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
        setResults([...results, { participantId: '', resultValue: '', resultType: '' }]);
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
        try {
            await createBatchResults(resultData);
            navigate('/results');
        } catch (error) {
            console.error('Error creating batch results:', error);
        }
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
                        <div>
                            <label>Result Type:</label>
                            <select
                                name="resultType"
                                value={result.resultType}
                                onChange={(e) => handleChange(index, e)}
                                required
                            >
                                <option value="">Select Result Type</option>
                                <option value="TIME">Time</option>
                                <option value="DISTANCE">Distance</option>
                                <option value="POINTS">Points</option>
                            </select>
                        </div>
                        <button type="button" className="remove-button" onClick={() => handleRemoveResult(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" className="add-button" onClick={handleAddResult}>
                    Add Another Result
                </button>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default BatchResultForm;
