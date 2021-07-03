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
import pymysql

app = Flask(__name__)
api = Api(app, title='comme on', description='hello')


#构造密匙

token_secret='goodgoodstudy,daydayup'
time_max=60
refresh_time=120

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
            if username == "" or password == "":
                return jsonify({'code': 400, 'message': "Missing email or password"})
            code=login(username,password)
            return code

def login(username,password):
    sql_login_u= f"SELECT UserId, Password FROM User WHERE Email = '{username}';"
    sql_login_o= f"SELECT OrganizationId, Password FROM Organization WHERE Email = '{username}';"
    result_u=use_db(sql_login_u)
    result_o=use_db(sql_login_o)
    tag='string'
    password_final=0
    if len(result_u)>0:
        group_id=result_u[0][0]
        password_final=result_u[0][1]
        tag='individual'
    elif len(result_o)>0:
        group_id=result_o[0][0]
        password_final=result_o[0][1]
        tag='organization'
    
    if password == password_final:
        token=createtoken(username)
        return jsonify({'code': 200, "userId": group_id,"usergroup":tag,'token':token})
    else:
        return jsonify({'code': 400, 'message': "Wrong email or password"})

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

def use_db(string):
    con = pymysql.connect(host='localhost',
                            port=3306,
                            user='root',
                            password='abcd',
                            db='wellbeing',
                            charset='utf8')
    cur = con.cursor()
    cur.execute(string)
    result = cur.fetchall()
    con.commit()  # Perform previous database operations
    con.close()  # Remember to turn it off after running
    return result
    #fake data
    #INSERT INTO User (UserId,NickName,Email,Password,FavouriteId) VALUES (1,'root','wyw@123.com','a123','2');
    
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
