import pymysql
import jwt
from datetime import datetime, timedelta
import smtplib
from email.header import Header
from email.mime.text import MIMEText
from email.utils import formataddr

from config import *

def sql_command(command):
    db = pymysql.connect(
        host=DB_URL,
        port=3306,
        user=DB_ACCOUNT,
        password=DB_PASSWORD,
        database=DB_NAME,
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


def send_email(message, link, receiver, receiver_address):
    # define the format of mail message
    template = '''
    <html>
      <body>
        <p>Hi, %s<br><br>
           %s<br><br>
           <a href="%s">Click to view</a><br><br>
           Warmly,<br>
           WellbeingBridge<br>
        </p>
      </body>
    </html>
    ''' % (receiver, message, link)

    # init message format
    message = MIMEText(template, 'html', 'utf-8')
    message['From'] = formataddr(['WellbeingBridge', EMAIL_ADDRESS])
    message['To'] = formataddr([receiver, receiver_address])
    message['Subject'] = Header('New message from WellbeingBridge', 'utf-8')

    # send mail to given receiver mail
    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, receiver_address, message.as_string())

    except Exception as e:
        print(e)
        return False

    return True
