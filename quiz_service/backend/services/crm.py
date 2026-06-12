import httpx
import logging
import asyncio

logger = logging.getLogger(__name__)


async def async_send_to_macrocrm(webhook_url: str, payload: dict):
    # Преобразование массива ответов в читаемый комментарий
    answers_log = payload.get("answers_log", [])
    comments = "\\n".join([f"Вопрос ID {a.get('question_id')}: Ответ ID {a.get('option_id')}" for a in answers_log])

    contact_data = payload.get("contact_data", {})

    # Структура данных MacroCRM (адаптировать ключи под требования конкретного эндпоинта)
    macrocrm_payload = {
        "name": contact_data.get("name", "Лид из Квиза"),
        "phone": contact_data.get("phone", ""),
        "tags": [payload.get("quiz_name", "Квиз")],
        "message": comments
    }

    async with httpx.AsyncClient() as client:
        try:
            # Если MacroCRM требует авторизации по токену, добавить параметр headers={"Authorization": f"Bearer ТВОЙ_ТОКЕН"}
            response = await client.post(webhook_url, json=macrocrm_payload, timeout=10.0)
            response.raise_for_status()
            logger.info("Заявка успешно передана в MacroCRM")
        except Exception as e:
            logger.error(f"Ошибка передачи в MacroCRM: {e}")


def send_lead_webhook(webhook_url: str, payload: dict):
    if not webhook_url:
        return
    asyncio.run(async_send_to_macrocrm(webhook_url, payload))