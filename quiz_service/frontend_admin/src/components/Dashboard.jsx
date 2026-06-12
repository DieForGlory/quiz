import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
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
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Link to={`/quiz/${quiz.id}/builder`} className="btn">Редактор</Link>
              <Link to={`/quiz/${quiz.id}/leads`} className="btn" style={{ background: '#50cd89' }}>Заявки</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}