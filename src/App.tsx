import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ParticipantList from './components/ParticipantList';
import ParticipantForm from './components/ParticipantForm';
import ParticipantDetail from './components/ParticipantDetail';
import DisciplineList from './components/DisciplineList';
import DisciplineForm from './components/DisciplineForm';
import ResultList from './components/ResultList';
import ResultForm from './components/ResultForm';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/">Participants</Link>
                    <Link to="/disciplines">Disciplines</Link>
                    <Link to="/results">Results</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<ParticipantList />} />
                    <Route path="/participants/new" element={<ParticipantForm />} />
                    <Route path="/participants/edit/:id" element={<ParticipantForm />} />
                    <Route path="/participants/:id" element={<ParticipantDetail />} />
                    <Route path="/disciplines" element={<DisciplineList />} />
                    <Route path="/disciplines/new" element={<DisciplineForm />} />
                    <Route path="/disciplines/edit/:id" element={<DisciplineForm />} />
                    <Route path="/results" element={<ResultList />} />
                    <Route path="/results/new" element={<ResultForm />} />
                    <Route path="/results/edit/:id" element={<ResultForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
