from jwt_token import encode_token, decode_token
from flask import Flask, request, jsonify
from flask_restx import Resource, Api, fields
import pymysql
import json
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
api = Api(app, title='COMP9323', description='hello')
CORS(app)


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
    c = db.cursor()
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
    organization_table = '''CREATE TABLE IF NOT EXISTS `Organization` (
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
    event_table = '''
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
    booking_table = '''
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
    c.execute(booking_table)
    c.close()

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


user_model = api.model("user", {
    "nickname": fields.String,
    "email": fields.String,
    "password": fields.String
})


# individual user's sign up
@api.route('/signup/user', doc={"description": "new individual user registration"})
class IndividualRegister(Resource):
    @api.expect(user_model)
    def post(self):
        data = json.loads(request.get_data())
        nickname = data['nickname']
        email = data['email']
        password = data['password']
        if nickname == "" or email == "" or password == "":
            output = {
                "message": "Missing nickname or email or password"
            }
            return output, 400
        else:
            sql = f"SELECT * FROM User WHERE Email='{email}';"
            if sql_command(sql):
                output = {
                    "message": "email already used as individual"
                }
                return output, 403
            else:
                userid = 0
                sql = "INSERT INTO User VALUES ({},'{}', '{}', '{}', NULL);".format(userid, nickname, email, password)
                sql_command(sql)
                output = {
                    "message": "Success register",
                    "nickname": nickname
                }
                return output, 200


organization_model = api.model("organization", {
    "organizationName": fields.String,
    "email": fields.String,
    "password": fields.String,
    "organizationType": fields.String,
    "contact": fields.String,
    "introduction": fields.String
})


# organization user's sign up
@api.route('/signup/organization', doc={"description": "new organization user registration"})
class OrganizationRegister(Resource):
    @api.expect(organization_model)
    def post(self):
        data = json.loads(request.get_data())
        organization_name = data['organizationName']
        email = data['email']
        password = data['password']
        organization_type = data['organizationType']
        introduction = data['introduction']
        contact = data['contact']
        if email == "" or password == "" or organization_name == "" or organization_type == "" or contact == "":
            output = {
                "message": "Missing information"
            }
            return output, 400
        else:
            sql = f"SELECT * FROM Organization WHERE Email='{email}';"
            if sql_command(sql):
                output = {
                    "message": "email already used as organization"
                }
                return output, 403
            else:
                organization_id = 0
                sql = "INSERT INTO Organization VALUES ({},'{}', '{}', '{}', '{}','{}','{}',NULL,NULL,NULL,NULL);". \
                    format(organization_id, email, password, organization_name, organization_type, contact,
                           introduction)
                sql_command(sql)
                output = {
                    "message": "Success register"
                }
                return output, 200


login_model = api.model("login", {
    "email": fields.String,
    "password": fields.String
})


@api.route('/login')
class Login(Resource):
    @api.response(200, 'OK')
    @api.response(400, 'Bad Request')
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.expect(login_model)
    def post(self):
        data = json.loads(request.get_data())
        email = data['email']
        password = data['password']
        if email == "" or password == "":
            output = {
                "message": "Missing email or password"
            }
            return output, 400
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
        output = {
            "userId": group_id,
            "usergroup": tag,
            "token": token
        }
        return output, 200
    else:
        output = {
            "message": "Wrong email or password"
        }
        return output, 400


@api.route('/popular/events')
class GetPopularEvent(Resource):
    def get(self):
        querry_string = '''SELECT EventId FROM Booking GROUP BY EventId ORDER BY COUNT(BookingId) DESC LIMIT 9'''
        return sql_command(querry_string), 200


parser = api.parser()
parser.add_argument('token', type=str)
parser.add_argument('eventid', type=str, required=True)


@api.route("/event/{eventid}/summary", doc={"description": "get the summary of event"})
@api.doc(parser=parser)
class event(Resource):
    def get(self):
        eventid = parser.parse_args()['eventid']
        event_sql = f"SELECT EventId,Thumbnail,EventName,Date,Postcode,Suburb, Introduction FROM Event WHERE EventId='{eventid}';"
        result = sql_command(event_sql)

        token = parser.parse_args()['token']
        if token is None:
            favourite = False
        else:
            email = decode_token(token)['email']
            user_sql = f"SELECT FavouriteId FROM User WHERE Email='{email}';"
            if_favourite = sql_command(user_sql)
            favouriteid = list(if_favourite[0])[0]
            if str(eventid) in favouriteid.split(","):
                favourite = True
            else:
                favourite = False
        if result:
            # location = {"postcode": result[0][4], "suburb": result[0][5]}
            result_output = {"eventId": result[0][0],
                                 "thumbnail": result[0][1],
                                 "name": result[0][2],
                                 "date": result[0][3],
                                 "location": {
                                     "postcode": result[0][4],
                                     "suburb": result[0][5]
                                 },
                                 "introduction": result[0][6],
                                 "favourite": favourite}
            return result_output, 200
        else:
            output = {
                    "message": "Not Found"
                }
            return output, 404


if __name__ == "__main__":
    create_database()
    app.run(host='127.0.0.1', port=8000, debug=True)
