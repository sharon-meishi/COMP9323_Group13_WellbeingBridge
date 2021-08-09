import jwt
from datetime import datetime, timedelta

# get token by encrypting email and user type
def encode_token(email,type):
    payload = {
        'exp': datetime.now() + timedelta(minutes=10000),
        'email': email,
        'type':type
    }

    key = 'SECRET_KEY'

    encoded_jwt = jwt.encode(payload, key, algorithm='HS256')
    return encoded_jwt

# decode token
def decode_token(code):
    decoded_jwt = jwt.decode(code, 'SECRET_KEY', algorithms=['HS256'])
    return decoded_jwt
