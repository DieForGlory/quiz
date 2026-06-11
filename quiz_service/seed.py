import requests

url = "http://localhost:8000/api/v1/admin/quizzes/"
payload = {
  "name": "Расчет стоимости интеграции",
  "is_active": True,
  "settings": {"theme": "light"},
  "questions": [
    {
      "type": "single",
      "title": "Укажите тип вашего проекта",
      "order_index": 1,
      "is_required": True,
      "options": [
        {"text": "Корпоративный сайт", "next_question_id": None},
        {"text": "Интернет-магазин", "next_question_id": None}
      ]
    },
    {
      "type": "single",
      "title": "Требуется ли интеграция с CRM?",
      "order_index": 2,
      "is_required": True,
      "options": [
        {"text": "Да", "next_question_id": None},
        {"text": "Нет", "next_question_id": None}
      ]
    }
  ]
}

response = requests.post(url, json=payload)
print(response.status_code)
print(response.json())