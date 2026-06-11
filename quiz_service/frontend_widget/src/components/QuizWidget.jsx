import React, { useState } from 'react';
import { useQuizEngine } from '../hooks/useQuizEngine';
import '../index.css';

export function QuizWidget({ quizData, quizId }) {
  const { currentQuestion, answers, handleAnswer, stepBack, isFinished, history, total } = useQuizEngine(quizData);
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitLead = async () => {
    const payload = {
      contact_data: { phone },
      answers_log: Object.entries(answers).map(([qId, oId]) => ({ question_id: parseInt(qId), option_id: oId }))
    };

    const res = await fetch(`http://localhost:8000/api/v1/public/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="quiz-container">
        <div className="quiz-title">Заявка отправлена</div>
        <p style={{color: '#666'}}>Менеджер свяжется с вами в ближайшее время.</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <button className="quiz-nav-btn" onClick={stepBack}>Назад</button>
          <span>Финал</span>
        </div>
        <div className="quiz-title">Оставьте контакт для получения результатов</div>
        <input
          className="quiz-input"
          type="tel"
          placeholder="+998 90 000 00 00"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="quiz-submit-btn" onClick={submitLead} disabled={!phone}>
          Получить результат
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="quiz-nav-btn" onClick={stepBack} disabled={history.length === 0}>Назад</button>
        <span>Шаг {history.length + 1} из {total}</span>
      </div>

      <div className="quiz-title">{currentQuestion.title}</div>

      <div className="quiz-options">
        {currentQuestion.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option)}
            className="quiz-btn"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}