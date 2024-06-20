import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createResult, createBatchResults } from '../services/ResultService';
import { getAllDisciplines } from '../services/DisciplineService';
import { getAllParticipants } from '../services/ParticipantService';
import '../styling/ResultForm.css';

const ResultForm: React.FC = () => {
    const [date, setDate] = useState('');
    const [resultValue, setResultValue] = useState('');
    const [disciplineId, setDisciplineId] = useState('');
    const [participantId, setParticipantId] = useState('');
    const [disciplines, setDisciplines] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [resultType, setResultType] = useState('');
    const [batchResults, setBatchResults] = useState([{ participantId: '', resultValue: '' }]);
    const [isBatch, setIsBatch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const disciplinesData = await getAllDisciplines();
            setDisciplines(disciplinesData);
            const participantsData = await getAllParticipants();
            setParticipants(participantsData);
        };
        fetchData();
    }, []);

    const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const disciplineId = e.target.value;
        setDisciplineId(disciplineId);
        const selectedDiscipline = disciplines.find(d => d.id.toString() === disciplineId);
        setResultType(selectedDiscipline.resultType);
    };

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = { date, resultValue, discipline: { id: disciplineId }, participant: { id: participantId }, resultType };
        try {
            await createResult(result);
            navigate('/results');
        } catch (error) {
            console.error('Error creating result:', error);
        }
    };

    const handleBatchChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedResults = batchResults.map((result, i) =>
            i === index ? { ...result, [name]: value } : result
        );
        setBatchResults(updatedResults);
    };

    const handleAddBatchResult = () => {
        setBatchResults([...batchResults, { participantId: '', resultValue: '' }]);
    };

    const handleRemoveBatchResult = (index: number) => {
        setBatchResults(batchResults.filter((_, i) => i !== index));
    };

    const handleBatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const results = batchResults.map(result => ({
            ...result,
            discipline: { id: disciplineId },
            resultType
        }));
        try {
            await createBatchResults(results);
            navigate('/results');
        } catch (error) {
            console.error('Error creating batch results:', error);
        }
    };

    return (
        <div className="result-form-container">
            <h2>{isBatch ? 'Create Batch Results' : 'Create Result'}</h2>
            <button onClick={() => setIsBatch(!isBatch)}>
                {isBatch ? 'Switch to Single Result' : 'Switch to Batch Results'}
            </button>
            {isBatch ? (
                <form onSubmit={handleBatchSubmit}>
                    <div>
                        <label>Discipline:</label>
                        <select value={disciplineId} onChange={handleDisciplineChange} required>
                            <option value="">Select Discipline</option>
                            {disciplines.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>
                                    {discipline.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {batchResults.map((result, index) => (
                        <div key={index} className="result-entry">
                            <div>
                                <label>Participant:</label>
                                <select
                                    name="participantId"
                                    value={result.participantId}
                                    onChange={(e) => handleBatchChange(index, e)}
                                    required
                                >
                                    <option value="">Select Participant</option>
                                    {participants.map((participant) => (
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
                                    placeholder={resultType === 'TIME' ? 'hh:mm:ss.ms' : resultType === 'DISTANCE' ? 'meters.centimeters' : 'points'}
                                    onChange={(e) => handleBatchChange(index, e)}
                                    required
                                />
                            </div>
                            <button type="button" onClick={() => handleRemoveBatchResult(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddBatchResult}>
                        Add Another Result
                    </button>
                    <button type="submit">Submit Batch</button>
                </form>
            ) : (
                <form onSubmit={handleSingleSubmit}>
                    <div>
                        <label>Date:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div>
                        <label>Result Value:</label>
                        <input
                            type="text"
                            value={resultValue}
                            placeholder={resultType === 'TIME' ? 'hh:mm:ss.ms' : resultType === 'DISTANCE' ? 'meters.centimeters' : 'points'}
                            onChange={(e) => setResultValue(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Discipline:</label>
                        <select value={disciplineId} onChange={handleDisciplineChange} required>
                            <option value="">Select Discipline</option>
                            {disciplines.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>
                                    {discipline.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Participant:</label>
                        <select value={participantId} onChange={(e) => setParticipantId(e.target.value)} required>
                            <option value="">Select Participant</option>
                            {participants.map((participant) => (
                                <option key={participant.id} value={participant.id}>
                                    {participant.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Create</button>
                </form>
            )}
        </div>
    );
};

export default ResultForm;
