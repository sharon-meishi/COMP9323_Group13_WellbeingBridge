from jwt_token import encode_token, decode_token
from flask import Flask, request, jsonify
from flask_restx import Resource, Api, fields
import pymysql
import json

app = Flask(__name__)
api = Api(app, title='COMP9323', description='hello')


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
individual_parser = api.parser()
individual_parser.add_argument('nickname', type=str, required=True)
individual_parser.add_argument('email', type=str, required=True)
individual_parser.add_argument('password', type=str, required=True)


@api.route('/signup/user', doc={"description": "new individual user registration"})
@api.doc(parser=individual_parser)
@api.response(200, 'OK')
@api.response(400, 'Bad Request')
@api.response(404, 'Not Found')
class IndividualRegister(Resource):
    def post(self):
        nickname = individual_parser.parse_args()['nickname']
        email = individual_parser.parse_args()['email']
        password = individual_parser.parse_args()['password']
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
organization_parser = api.parser()
organization_parser.add_argument('email', type=str, required=True)
organization_parser.add_argument('password', type=str, required=True)
organization_parser.add_argument('organizationName', type=str, required=True)
organization_parser.add_argument('organizationType', type=str, required=True)
organization_parser.add_argument('introduction', type=str)
organization_parser.add_argument('contact', type=str, required=True)
organization_parser.add_argument('logo', type=str)
organization_parser.add_argument('videoUrl', type=str)
organization_parser.add_argument('ServiceList', type=str)
organization_parser.add_argument('WebsiteLink', type=str)


@api.route('/signup/organization', doc={"description": "new organization user registration"})
@api.doc(parser=organization_parser)
@api.response(200, 'OK')
@api.response(400, 'Bad Request')
@api.response(404, 'Not Found')
class OrganizationRegister(Resource):
    def post(self):
        organization_name = organization_parser.parse_args()['organizationName']
        email = organization_parser.parse_args()['email']
        password = organization_parser.parse_args()['password']
        organization_type = organization_parser.parse_args()['organizationType']
        introduction = organization_parser.parse_args()['introduction']
        contact = organization_parser.parse_args()['contact']
        logo = organization_parser.parse_args()['logo']
        video_url = organization_parser.parse_args()['videoUrl']
        service_list = organization_parser.parse_args()['ServiceList']
        website_Link = organization_parser.parse_args()['WebsiteLink']
        if email == "" or password == "" or organization_name == "" or organization_type == "" or contact == "":
            return jsonify({'code': 400, 'message': "Missing information"})
        else:
            sql = f"SELECT * FROM Organization WHERE Email='{email}';"
            if sql_command(sql):
                return jsonify({'code': 403, 'message': "email already used as organization"})
            else:
                organization_id = 0
                sql = "INSERT INTO Organization VALUES ({},'{}', '{}', '{}', '{}','{}','{}','{}','{}','{}','{}');". \
                    format(organization_id, email, password, organization_name, organization_type, contact,
                           introduction, logo, video_url, service_list, website_Link)
                sql_command(sql)
                return jsonify({'code': 200, 'message': "Success register"})


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
            code = login(username, password)
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
    app.run(host='127.0.0.1', port=8000, debug=True)
