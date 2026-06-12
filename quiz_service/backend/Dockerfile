FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Непривилегированный пользователь (порт 8000 не требует root)
RUN useradd --create-home --uid 10001 quiz && chown -R quiz:quiz /app
USER quiz

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]