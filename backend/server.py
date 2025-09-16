from flask import Flask, request, jsonify
import sqlite3 
import logging
from telegram import Bot
from telegram.error import BadRequest, NetworkError
import requests
app = Flask(__name__)
from datetime import datetime
from config import *


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def send_broadcast(message_text):
    try:
        success_count = 0
        for user_id in user_ids:
            try:
                url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
                payload = {
                    'chat_id': user_id,
                    'text': message_text,
                    'parse_mode': 'HTML'
                }
                
                response = requests.post(url, data=payload)
                response_data = response.json()
                
                if response_data.get('ok'):
                    success_count += 1
                    logger.info(f"Сообщение отправлено пользователю {user_id}")
                else:
                    logger.error(f"Ошибка Telegram API для пользователя {user_id}: {response_data}")
                    
            except Exception as e:
                logger.error(f"Ошибка при отправке пользователю {user_id}: {e}")

        logger.info(f"Сообщение отправлено {success_count}/{len(user_ids)} пользователям")
        return success_count
        
    except Exception as e:
        logger.error(f"Критическая ошибка при отправке сообщений: {e}")
        return 0

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        if not data or 'name' not in data or 'contact' not in data or 'idea' not in data:
            return jsonify({
                'error': 'Missing required fields (name, contact, idea)',
            }), 400
        
        if len(str(data['name'])) < 2 or len(str(data['idea'])) < 10:
            return jsonify({
                'error': 'Name must be at least 2 characters and idea at least 10 characters',
            }), 400

        text = f"""Новое обращение:
Имя: {data['name']}
Email: {data['contact']}
Сообщение: {data['idea']}"""
        
        logger.info(f"Получено новое обращение: {data['name']}")
        
        send_broadcast(text)
       
        db = sqlite3.connect('backend/database/db.db')
        sql = db.cursor()
        sql.execute(
            """INSERT INTO back_requests (timestamp, user_name, user_contact, idea) 
            VALUES (?,?,?,?)""", 
            (datetime.now(), data['name'], data['contact'], data['idea'])
        )
        db.commit()
        db.close()

        return jsonify({
            'status': 'success',
            'message': 'Обращение успешно отправлено'
        }), 201
        
    except Exception as e:
        logger.error(f"Ошибка при обработке обращения: {e}")
        return jsonify({
            'error': 'Internal server error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)