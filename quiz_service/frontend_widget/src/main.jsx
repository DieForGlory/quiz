import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { QuizWidget } from './components/QuizWidget'
import './index.css'

const App = ({ quizId, apiBase }) => {
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiBase}/public/quiz/${quizId}/structure`)
      .then(res => {
        if (!res.ok) throw new Error('Quiz not found');
        return res.json();
      })
      .then(data => setQuizData(data))
      .catch(err => setError(err.message));
  }, [quizId, apiBase]);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!quizData) return <div>Загрузка...</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
      <QuizWidget quizData={quizData} quizId={quizId} apiBase={apiBase} />
    </div>
  )
}

const rootElement = document.getElementById('quiz-widget-container');
if (rootElement) {
  // Приоритет: data-quiz-id из тега → последний сегмент URL (/quiz/widget/<id>)
  // → ?id=<id> → '1' по умолчанию.
  const idFromAttr = rootElement.getAttribute('data-quiz-id');
  const pathMatch = window.location.pathname.match(/\/quiz\/widget\/(\d+)(?:\/)?$/);
  const idFromPath = pathMatch ? pathMatch[1] : null;
  const idFromQuery = new URLSearchParams(window.location.search).get('id');
  const quizId = idFromAttr || idFromPath || idFromQuery || '1';

  // API base: можно переопределить через data-api-base, по умолчанию — прод-шлюз
  const apiBase = rootElement.getAttribute('data-api-base') || 'https://analytics.gh.uz/quiz/api/v1';
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App quizId={quizId} apiBase={apiBase} />
    </React.StrictMode>
  );
}