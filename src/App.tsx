import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './contexts/PrivateRoute';
import AdminRoute from './contexts/AdminRoute';
import ParticipantList from './components/ParticipantList';
import ParticipantForm from './components/ParticipantForm';
import ParticipantDetail from './components/ParticipantDetail';
import DisciplineList from './components/DisciplineList';
import DisciplineForm from './components/DisciplineForm';
import ResultList from './components/ResultList';
import ResultForm from './components/ResultForm';
import ResultsByDiscipline from './components/ResultsByDiscipline';
import Login from './contexts/Login';
import './index.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="container">
                    <header>
                        <h1>Athletic Event Management</h1>
                        <nav>
                            <ul>
                                <li><Link to="/">Participants</Link></li>
                                <li><Link to="/disciplines">Disciplines</Link></li>
                                <li><Link to="/results">Results</Link></li>
                                <li><Link to="/results/new">Create Result</Link></li>
                            </ul>
                        </nav>
                    </header>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<ParticipantList />} />
                        <Route path="/disciplines" element={<DisciplineList />} />
                        <Route path="/results" element={<ResultList />} />
                        <Route path="/results/discipline/:disciplineId" element={<ResultsByDiscipline />} />
                        <Route path="/participants/new" element={<AdminRoute element={<ParticipantForm />} />} />
                        <Route path="/participants/edit/:id" element={<AdminRoute element={<ParticipantForm />} />} />
                        <Route path="/participants/:id" element={<AdminRoute element={<ParticipantDetail />} />} />
                        <Route path="/disciplines/new" element={<AdminRoute element={<DisciplineForm />} />} />
                        <Route path="/disciplines/edit/:id" element={<AdminRoute element={<DisciplineForm />} />} />
                        <Route path="/results/new" element={<AdminRoute element={<ResultForm />} />} />
                        <Route path="/results/edit/:id" element={<AdminRoute element={<ResultForm />} />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
