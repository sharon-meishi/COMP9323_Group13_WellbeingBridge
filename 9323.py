import jwt
import datetime
from jwt import exceptions
import sqlite3
from flask import *
from flask_restx import Resource, Api, fields
import urllib.request as req
import requests
import time
from pandas.io.json import json_normalize
import pandas as pd
from datetime import datetime
import os
import matplotlib.pyplot as plt
import time



app = Flask(__name__)
api = Api(app, title='comme on', description='hello')


#构造密匙

token_secret='goodgoodstudy,daydayup'
time_max=60
refresh_time=120


# SALT = 'iv%x6xo7l7_u9bf_u!9#g#m*)*=ej@bek5)(@u3kh*72+unjv='
# def create_token():
#     # 构造header
#     headers = {
#         'typ': 'jwt',
#         'alg': 'HS256'
#     }
#     # 构造payload
#     payload = {
#         'user_id': 1, # 自定义用户ID
#         'username': 'yhz', # 自定义用户名
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5) # 超时时间
#     }
#     result = jwt.encode(payload=payload, key=SALT, algorithm="HS256", headers=headers).decode('utf-8')
#     return result


get_user = api.parser()
get_user.add_argument('username', type=str, default='wyw@123.com', location="args")
get_user.add_argument('password', type=str, default='a123', location="args")

@api.route('/login')
@api.doc(params={'username': 'your name', 'password': 'an number'})
@api.expect(get_user, validate=True)
class get(Resource):
    @api.response(200, 'OK')
    @api.response(400, 'Bad Request')
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    def get(self):
        if request.method == 'GET':
            username = request.args.get('username')
            password = request.args.get('password')
            # token = request.headers["token"]
            # data = jwt.decode(token, token_secret, algorithms=['HS256'])
            code=login(username,password)
            return code




    
def login(username,password):
    
    sql_login= f"SELECT Password FROM User WHERE Email = '{username}';"
    createdb()
    con = sqlite3.connect('9323.db')
    cur = con.cursor()
    cur.execute(sql_login)
    password_s = cur.fetchall()
    password_final = password_s[0]
    if password == password_final:
        return 200

def verify_front():
    pass


def createtoken(Email):
    payload={
    'uid': Email,
    'iss':'comp9323',
    'exp':'something',
    'sub':'project'
    }
    token = jwt.encode(payload, token_secret, algorithm='HS256')
    return token




def createdb():
    con = sqlite3.connect('9323.db')
    cur = con.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS User (
                UserID INTEGER NOT NULL PRIMARY KEY , 
                NickName VARCHAR(255) NOT NULL,
                Email VARCHAR(255) NOT NULL,
                Password VARCHAR(255) NOT NULL,
                EventId VARCHAR(255) NULL,
                FavouriteId VARCHAR(255) NULL)''')  # There must be brackets inside
    
    intsert_data=(1,'root','wyw@123.com','a123','1','2')
    sql_string = 'INSERT OR REPLACE INTO User VALUES(?,?,?,?,?,?)'
    con.execute(sql_string, intsert_data)
    con.commit()  # Perform previous database operations
    con.close()  # Remember to turn it off after running


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)