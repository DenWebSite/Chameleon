from flask import Flask, request, jsonify
import sqlite3 
app = Flask(__name__)
from datetime import datetime
from config import *


@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    if not data or 'name' not in data or 'contact' not in data or 'idea' not in data or len(str(data['name'])) < 2 or len(str(data['idea'])) < 10:
        return jsonify({
            'error': 'Missing required fields (name, contact, idea)',
        }), 400
    
    print(f"Новое обращение:\n"
          f"Имя: {data['name']}\n"
          f"Email: {data['contact']}\n"
          f"Сообщение: {data['idea']}\n")
    
    db = sqlite3.connect('backend/database/db.db')
    sql = db.cursor()
    sql.execute("""INSERT INTO back_requests (timestamp, user_name, user_contact, idea) VALUES (?,?,?,?)""", (datetime.now(), data['name'], data['contact'], data['idea']))
    db.commit()
    db.close()

    return jsonify({
        'status': 'success',
        'message': 'Обращение успешно отправлено'
    }), 201

if __name__ == '__main__':
    app.run(debug=True)
