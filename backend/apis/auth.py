import json
from flask import request
from flask_restx import Resource

from tool import *
from models.request_model import *
from flask_app import api

# define namespace
auth = api.namespace('auth', description='Authentication Service')


# route function
# individual user's sign up
@auth.route('/signup/user', doc={"description": "new individual user registration"})
class IndividualRegister(Resource):
    @auth.expect(individual_model)
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
            org_sql = f"SELECT * FROM Organization WHERE Email='{email}';"
            if sql_command(sql):
                output = {
                    "message": "email already used as individual"
                }
                return output, 403
            elif sql_command(org_sql):
                output = {
                    "message": "email already used as organization"
                }
                return output, 403
            else:
                userid = 0
                sql = "INSERT INTO User VALUES ({},'{}', '{}', '{}', NULL);".format(userid, nickname, email, password)
                sql_command(sql)
                select_sql = f"SELECT UserId FROM User WHERE Email='{email}';"
                id = sql_command(select_sql)[0][0]
                token = encode_token(email, "individual")
                output = {
                    "message": "Success register",
                    "nickname": nickname,
                    "userid": id,
                    "token": token
                }
                return output, 200


# organization user's sign up
@auth.route('/signup/organization', doc={"description": "new organization user registration"})
class OrganizationRegister(Resource):
    @auth.expect(organization_model)
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
            user_sql = f"SELECT * FROM User WHERE Email='{email}';"
            if sql_command(sql):
                output = {
                    "message": "email already used as organization"
                }
                return output, 403
            elif sql_command(user_sql):
                output = {
                    "message": "email already used as individual"
                }
                return output, 403
            else:
                organization_id = 0
                sql = "INSERT INTO Organization VALUES ({},'{}', '{}', '{}', '{}',NULL,'{}','{}',NULL,NULL,NULL,NULL);". \
                    format(organization_id, email, password, organization_name, organization_type, contact,
                           introduction)
                sql_command(sql)
                select_sql = f"SELECT OrganizationId FROM Organization WHERE Email='{email}';"
                id = sql_command(select_sql)[0][0]
                token = encode_token(email, "organization")
                output = {
                    "message": "Success register",
                    "email": email,
                    "organizationid": id,
                    "token": token
                }
                return output, 200


@auth.route('/login')
class Login(Resource):
    @auth.response(200, 'OK')
    @auth.response(400, 'Bad Request')
    @auth.response(404, 'Not Found')
    @auth.response(201, 'Created')
    @auth.expect(login_model)
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']
        if email == "" or password == "":
            output = {
                "message": "Missing email or password"
            }
            return output, 400
        else:
            user_sql = f"SELECT Password,NickName,UserId FROM User WHERE Email='{email}';"
            org_sql = f"SELECT Password,OrganizationName,OrganizationId FROM Organization WHERE Email='{email}';"
            result_from_user = sql_command(user_sql)
            result_from_org = sql_command(org_sql)
            if result_from_user:
                type_flag = 'individual'
            elif result_from_org:
                type_flag = 'organization'
            else:
                output = {
                    "message": "email not signup as individual / organization"
                }
                return output, 403
            # check the identification of current user
            if type_flag == 'individual':
                if password == result_from_user[0][0]:
                    token = encode_token(email, type_flag)
                    output = {
                        "message": "success",
                        "token": token,
                        "usergroup": 'individual',
                        "name": result_from_user[0][1],
                        "id": result_from_user[0][2]
                    }
                    return output, 200
                else:
                    output = {
                        "message": "Wrong password"
                    }
                    return output, 403
            else:
                if password == result_from_org[0][0]:
                    token = encode_token(email, type_flag)
                    output = {
                        "message": "success",
                        "token": token,
                        "usergroup": type_flag,
                        "name": result_from_org[0][1],
                        "id": result_from_org[0][2]
                    }
                    return output, 200
                else:
                    output = {
                        "message": "Wrong password"
                    }
                    return output, 403
