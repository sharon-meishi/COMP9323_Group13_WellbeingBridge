import pymysql
import jwt
from datetime import datetime, timedelta

def sql_command(command):
    db = pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='unsw1234',
        database='wellbeing',
        charset='utf8'
    )
    c = db.cursor()
    c.execute(command)
    result = c.fetchall()
    db.commit()
    db.close()
    return result


def encode_token(email,type):
    payload = {
        'exp': datetime.now() + timedelta(minutes=10000),
        'email': email,
        'type':type
    }

    key = 'SECRET_KEY'

    encoded_jwt = jwt.encode(payload, key, algorithm='HS256')
    return encoded_jwt


def decode_token(code):
    decoded_jwt = jwt.decode(code, 'SECRET_KEY', algorithms=['HS256'])
    return decoded_jwt


def get_user_id_by_token(token):
    user_email = decode_token(token)['email']
    sql_user_id = f"SELECT UserId FROM User WHERE Email = '{user_email}';"
    user_id_result = sql_command(sql_user_id)
    if user_id_result:
        return user_id_result[0][0]
    else:
        return None

def value_check(org_info, i):
    result = None
    if org_info[i] != None:
        result = org_info[i].replace("\n", '')
    return result
