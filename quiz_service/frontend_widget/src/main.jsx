import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { QuizWidget } from './components/QuizWidget'
import './index.css'

const App = ({ quizId }) => {
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/public/quiz/${quizId}/structure`)
      .then(res => {
        if (!res.ok) throw new Error('Quiz not found');
        return res.json();
      })
      .then(data => setQuizData(data))
      .catch(err => setError(err.message));
  }, [quizId]);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!quizData) return <div>Загрузка...</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
      <QuizWidget quizData={quizData} quizId={quizId} />
    </div>
  )
}

const rootElement = document.getElementById('quiz-widget-container');
if (rootElement) {
  const quizId = rootElement.getAttribute('data-quiz-id') || '1';
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App quizId={quizId} />
    </React.StrictMode>
  );
}