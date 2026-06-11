import { useState, useMemo } from 'react';

export function useQuizEngine(quizData) {
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const sortedQuestions = useMemo(() => {
    return [...quizData.questions].sort((a, b) => a.order_index - b.order_index);
  }, [quizData]);

  const [currentQuestionId, setCurrentQuestionId] = useState(() => sortedQuestions[0]?.id);

  const currentQuestion = useMemo(() =>
    sortedQuestions.find(q => q.id === currentQuestionId),
  [sortedQuestions, currentQuestionId]);

  const handleAnswer = (option) => {
    setAnswers(prev => ({ ...prev, [currentQuestionId]: option.id }));
    setHistory(prev => [...prev, currentQuestionId]);

    if (option.next_question_id) {
       setCurrentQuestionId(option.next_question_id);
    } else {
       const currentIndex = sortedQuestions.findIndex(q => q.id === currentQuestionId);
       const nextQ = sortedQuestions[currentIndex + 1];
       if (nextQ) {
         setCurrentQuestionId(nextQ.id);
       } else {
         setIsFinished(true);
       }
    }
  };

  const stepBack = () => {
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    setCurrentQuestionId(prevId);
    setHistory(prev => prev.slice(0, -1));
    setIsFinished(false);
  };

  return { currentQuestion, answers, handleAnswer, stepBack, isFinished, history, total: sortedQuestions.length };
}