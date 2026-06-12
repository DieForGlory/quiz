import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import LandingBuilder from './LandingBuilder';

export default function QuizBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('landing'); // landing, questions, integrations

  useEffect(() => {
    api.getQuiz(id).then(data => {
      // Инициализация объекта настроек, если он пуст
      if (!data.settings) {
        data.settings = {};
      }
      setQuiz(data);
    });
  }, [id]);

  const saveConfig = async () => {
    try {
      await api.updateQuiz(id, quiz);
      alert('Успешно сохранено');
    } catch (e) {
      alert('Ошибка при сохранении');
    }
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { type: 'single', title: 'Новый вопрос', order_index: quiz.questions.length + 1, is_required: true, options: [] }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.push({ text: 'Вариант ответа', next_question_id: null });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex][field] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  if (!quiz) return <div>Загрузка...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Редактор: {quiz.name}</h2>
        <div>
          <button className="btn" onClick={saveConfig} style={{ background: '#50cd89', marginRight: '10px' }}>Сохранить</button>
          <button className="btn" onClick={() => navigate('/')} style={{ background: '#f1416c' }}>Выйти</button>
        </div>
      </div>

      <div style={{ margin: '20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <button
          className="btn"
          style={{ background: activeTab === 'landing' ? '#009ef7' : '#ccc', marginRight: '10px' }}
          onClick={() => setActiveTab('landing')}
        >
          Конструктор лендинга
        </button>
        <button
          className="btn"
          style={{ background: activeTab === 'questions' ? '#009ef7' : '#ccc', marginRight: '10px' }}
          onClick={() => setActiveTab('questions')}
        >
          Дерево вопросов
        </button>
        <button
          className="btn"
          style={{ background: activeTab === 'integrations' ? '#009ef7' : '#ccc' }}
          onClick={() => setActiveTab('integrations')}
        >
          Интеграции
        </button>
      </div>

      {activeTab === 'landing' && (
        <LandingBuilder quiz={quiz} setQuiz={setQuiz} />
      )}

      {activeTab === 'questions' && (
        <div>
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input
                  type="text"
                  value={q.title}
                  onChange={(e) => updateQuestion(qIndex, 'title', e.target.value)}
                  style={{ fontSize: '16px', fontWeight: 'bold', width: '70%', padding: '5px' }}
                />
                <button onClick={() => removeQuestion(qIndex)} style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer' }}>Удалить вопрос</button>
              </div>

              <div style={{ marginTop: '15px', paddingLeft: '20px' }}>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                      style={{ padding: '5px', flex: 1 }}
                    />
                    <select
                      value={opt.next_question_id || ''}
                      onChange={(e) => updateOption(qIndex, oIndex, 'next_question_id', e.target.value === '' ? null : parseInt(e.target.value))}
                      style={{ padding: '5px' }}
                    >
                      <option value="">Линейный переход (следующий)</option>
                      {quiz.questions.map(tq => (
                        <option key={tq.id || Math.random()} value={tq.id || ''}>
                          Переход к: {tq.title}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => removeOption(qIndex, oIndex)} style={{ cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button onClick={() => addOption(qIndex)} className="btn" style={{ padding: '4px 8px', fontSize: '12px' }}>+ Добавить вариант</button>
              </div>
            </div>
          ))}
          <button className="btn" onClick={addQuestion} style={{ width: '100%', background: '#f4f6f8', color: '#333', border: '1px dashed #ccc' }}>+ Добавить вопрос</button>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div style={{ maxWidth: '600px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0 }}>Настройка Webhook</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
            Укажите URL обработчика (например, вебхук Bitrix24, amoCRM или Zapier/Make). Данные будут отправляться методом POST в формате JSON сразу после прохождения квиза пользователем.
          </p>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>URL Webhook'а</label>
            <input
              type="url"
              placeholder="https://example.com/webhook"
              value={quiz.settings.crm_webhook || ''}
              onChange={e => setQuiz({
                ...quiz,
                settings: { ...quiz.settings, crm_webhook: e.target.value }
              })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}