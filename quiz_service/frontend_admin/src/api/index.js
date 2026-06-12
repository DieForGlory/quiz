const API_URL = 'http://localhost:8000/api/v1/admin';

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
};