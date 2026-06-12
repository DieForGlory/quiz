// Относительный путь — запросы идут через тот же nginx-шлюз, что и сама админка.
// Для локальной разработки можно переопределить: VITE_API_URL=http://localhost:8000/api/v1/admin
const API_URL = import.meta.env.VITE_API_URL || '/quiz/api/v1/admin';

export const api = {
  getQuizzes: () => fetch(`${API_URL}/quizzes/`).then(res => res.json()),
  getQuiz: (id) => fetch(`${API_URL}/quizzes/${id}`).then(res => res.json()),
  getLeads: (id) => fetch(`${API_URL}/quizzes/${id}/leads`).then(res => res.json()),
  createQuiz: (data) => fetch(`${API_URL}/quizzes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateQuiz: (id, data) => fetch(`${API_URL}/quizzes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  setQuizActive: (id, isActive) => fetch(`${API_URL}/quizzes/${id}/active`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active: isActive })
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }),
};