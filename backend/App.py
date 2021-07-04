import os

from jwt_token import encode_token, decode_token
from flask import Flask, request, jsonify
from flask_restx import Resource, Api, fields
import pymysql
import json
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
api = Api(app, title='COMP9323', description='hello')


# create tables in database
def create_database():
    conn = pymysql.connect(host='localhost',
                           user='root',
                           password='unsw1234')
    conn.cursor().execute('''create database if not exists wellbeing''')
    conn.close()
    db = pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='unsw1234',
        database='wellbeing',
        charset='utf8'
    )
    c=db.cursor()
    user_table = '''
    CREATE TABLE IF NOT EXISTS `User` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `NickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FavouriteId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UserId`)
)
    '''
    organization_table='''CREATE TABLE IF NOT EXISTS `Organization` (
  `OrganizationId` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `OrganizationName` varchar(255) NOT NULL,
  `OrganizationType` varchar(255) NOT NULL,
  `Contact` varchar(255) NOT NULL,
  `Introduction` varchar(255) DEFAULT NULL,
  `Logo` varchar(255) DEFAULT NULL,
  `VideoUrl` varchar(255) DEFAULT NULL,
  `ServiceList` varchar(255) DEFAULT NULL,
  `WebsiteLink` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`OrganizationId`))
    '''
    event_table='''
    CREATE TABLE IF NOT EXISTS `Event` (
  `EventId` int NOT NULL,
  `OrganizationId` int NOT NULL,
  `OrganizationName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EventName` varchar(255) NOT NULL,
  `Thumbnail` varchar(255) NOT NULL,
  `Postcode` varchar(255) NOT NULL,
  `Suburb` varchar(255) NOT NULL,
  `Street` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `Date` date NOT NULL,
  `Time` datetime NOT NULL,
  `Details` varchar(1000) NOT NULL,
  `Recommendation` varchar(1000) DEFAULT NULL,
  `Favourites` int DEFAULT NULL,
  `Introduction` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`EventId`)
)
    '''
    booking_table='''
    CREATE TABLE IF NOT EXISTS `Booking` (
  `BookingId` int NOT NULL AUTO_INCREMENT,
  `EventId` int NOT NULL,
  `UserId` int NOT NULL,
  PRIMARY KEY (`BookingId`)
)
    '''
    c.execute(user_table)
    c.execute(organization_table)
    c.execute(event_table)

    return True


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


# individual user's sign up
@api.route('/signup/user', doc={"description": "new individual user registration"})
class IndividualRegister(Resource):
    def post(self):
        data = json.loads(request.get_data())
        nickname = data['nickname']
        email = data['email']
        password = data['password']
        if nickname == "" or email == "" or password == "":
            return jsonify({'code': 400, 'message': "Missing nickname or email or password"})
        else:
            sql = f"SELECT * FROM User WHERE Email='{email}';"
            if sql_command(sql):
                return jsonify({'code': 403, 'message': "email already used as individual"})
            else:
                userid = 0
                sql = "INSERT INTO User VALUES ({},'{}', '{}', '{}', NULL);".format(userid, nickname, email, password)
                sql_command(sql)
                return jsonify({'code': 200, 'message': "Success register", 'nickname': nickname})


# organization user's sign up
@api.route('/signup/organization', doc={"description": "new organization user registration"})
class OrganizationRegister(Resource):
    def post(self):
        data = json.loads(request.get_data())
        organization_name = data['organizationName']
        email = data['email']
        password = data['password']
        organization_type = data['organizationType']
        introduction = data['introduction']
        contact = data['contact']
        if email == "" or password == "" or organization_name == "" or organization_type == "" or contact == "":
            return jsonify({'code': 400, 'message': "Missing information"})
        else:
            sql = f"SELECT * FROM Organization WHERE Email='{email}';"
            if sql_command(sql):
                return jsonify({'code': 403, 'message': "email already used as organization"})
            else:
                organization_id = 0
                sql = "INSERT INTO Organization VALUES ({},'{}', '{}', '{}', '{}','{}','{}',NULL,NULL,NULL,NULL);". \
                    format(organization_id, email, password, organization_name, organization_type, contact,
                           introduction)
                sql_command(sql)
                return jsonify({'code': 200, 'message': "Success register"})


@api.route('/login')
@api.doc(params={'username': 'your name', 'password': 'an number'})
class Login(Resource):
    @api.response(200, 'OK')
    @api.response(400, 'Bad Request')
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    def post(self):
        data = json.loads(request.get_data())
        email = data['email']
        password = data['password']
        if email == "" or password == "":
            return jsonify({'code': 400, 'message': "Missing email or password"})
        code = login(email, password)
        return code


def login(username, password):
    sql_login_u = f"SELECT UserId, Password FROM User WHERE Email = '{username}';"
    sql_login_o = f"SELECT OrganizationId, Password FROM Organization WHERE Email = '{username}';"
    result_u = sql_command(sql_login_u)
    result_o = sql_command(sql_login_o)
    tag = 'string'
    password_final = 0
    if len(result_u) > 0:
        group_id = result_u[0][0]
        password_final = result_u[0][1]
        tag = 'individual'
    elif len(result_o) > 0:
        group_id = result_o[0][0]
        password_final = result_o[0][1]
        tag = 'organization'

    if password == password_final:
        token = encode_token(username, tag)
        return jsonify({'code': 200, "userId": group_id, "usergroup": tag, 'token': token})
    else:
        return jsonify({'code': 400, 'message': "Wrong email or password"})


@api.route('/popular/events')
class GetPopularEvent(Resource):
    def get(self):
        querry_string = '''SELECT EventId FROM Booking GROUP BY EventId ORDER BY COUNT(BookingId) DESC LIMIT 9'''
        return sql_command(querry_string), 200


if __name__ == "__main__":
    create_database()
    app.run(host='127.0.0.1', port=8000, debug=True)
