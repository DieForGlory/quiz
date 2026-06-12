import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [togglingId, setTogglingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getQuizzes().then(setQuizzes);
  }, []);

  const handleCreate = async () => {
    const name = prompt('Введите название нового квиза:');
    if (!name) return;

    const payload = {
      name: name,
      is_active: false,
      settings: {},
      questions: []
    };

    try {
      const newQuiz = await api.createQuiz(payload);
      navigate(`/quiz/${newQuiz.id}/builder`);
    } catch (error) {
      console.error("Ошибка создания:", error);
      alert("Ошибка при создании квиза");
    }
  };

  const handleToggleActive = async (quiz) => {
    setTogglingId(quiz.id);
    try {
      const updated = await api.setQuizActive(quiz.id, !quiz.is_active);
      setQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, is_active: updated.is_active } : q));
    } catch (error) {
      console.error("Ошибка переключения статуса:", error);
      alert("Не удалось изменить статус квиза");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Мои Квизы</h1>
        <button className="btn" onClick={handleCreate}>+ Создать квиз</button>
      </div>

      <div className="grid">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="card">
            <h3>{quiz.name}</h3>
            <p>Статус: {quiz.is_active ? 'Активен' : 'Отключен'}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
              <Link to={`/quiz/${quiz.id}/builder`} className="btn">Редактор</Link>
              <Link to={`/quiz/${quiz.id}/leads`} className="btn" style={{ background: '#50cd89' }}>Заявки</Link>
              <button
                className="btn"
                onClick={() => handleToggleActive(quiz)}
                disabled={togglingId === quiz.id}
                style={{ background: quiz.is_active ? '#f1416c' : '#50cd89' }}
              >
                {togglingId === quiz.id
                  ? '...'
                  : quiz.is_active ? 'Отключить' : 'Включить'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}