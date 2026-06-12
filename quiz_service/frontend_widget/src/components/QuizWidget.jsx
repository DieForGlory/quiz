import React, { useState, useEffect, useRef } from 'react';
import { useQuizEngine } from '../hooks/useQuizEngine';
import '../index.css';

export function QuizWidget({ quizData, quizId, apiBase }) {
  const { currentQuestion, answers, handleAnswer, stepBack, isFinished, history, total } = useQuizEngine(quizData);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const landingRef = useRef(null);

  useEffect(() => {
    if (!isStarted && landingRef.current) {
      const startBtn = landingRef.current.querySelector('#start-quiz-btn');
      if (startBtn) {
        const handleStart = () => setIsStarted(true);
        startBtn.addEventListener('click', handleStart);
        return () => startBtn.removeEventListener('click', handleStart);
      }
    }
  }, [isStarted, quizData]);

  const submitLead = async () => {
    const payload = {
      contact_data: { name, phone },
      answers_log: Object.entries(answers).map(([qId, oId]) => ({ question_id: parseInt(qId), option_id: oId }))
    };

    const res = await fetch(`${apiBase}/public/quiz/${quizId}/submit`, {
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

  if (!isStarted && quizData.settings?.landingData?.html) {
    return (
      <div className="quiz-landing-wrapper" ref={landingRef}>
        <style>{quizData.settings.landingData.css}</style>
        <div dangerouslySetInnerHTML={{ __html: quizData.settings.landingData.html }} />
      </div>
    );
  }

  if (!isStarted && !quizData.settings?.landingData?.html) {
     setIsStarted(true);
     return null;
  }

  if (isFinished) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <button className="quiz-nav-btn" onClick={stepBack}>Назад</button>
          <span>Финал</span>
        </div>
        <div className="quiz-title">Оставьте контакты для получения результатов</div>
        <input
          className="quiz-input"
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="quiz-input"
          type="tel"
          placeholder="+998 90 000 00 00"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="quiz-submit-btn" onClick={submitLead} disabled={!phone || !name}>
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