import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import QuizBuilder from './components/Builder/QuizBuilder';
import LeadsView from './components/Leads/LeadsView';

export default function App() {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <nav className="sidebar">
        <h2>Marquiz Clone</h2>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Дашборд</Link>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quiz/:id/builder" element={<QuizBuilder />} />
          <Route path="/quiz/:id/leads" element={<LeadsView />} />
        </Routes>
      </main>
    </div>
  );
}