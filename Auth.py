from jwt_token import encode_token, decode_token
from flask import Flask, request, jsonify
import pymysql
import json

app = Flask(__name__)


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


@app.route('/user/register', methods=['POST'])
def user_register():
    data = request.data
    data = json.loads(data)
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
            sql = "INSERT INTO User VALUES ({},'{}', '{}', '{}', NULL,NULL);".format(userid, nickname, email, password)
            sql_command(sql)
            return jsonify({'code': 200, 'message': "Success register", 'nickname': nickname})


@app.route('/login', methods=['POST'])
def login():
    data = request.data
    data = json.loads(data)
    email = data['email']
    password = data['password']
    if email == "" or password == "":
        return jsonify({'code': 400, 'message': "Missing email or password"})
    else:
        user_sql = f"SELECT Password FROM User WHERE Email='{email}';"
        org_sql = f"SELECT Password FROM Organization WHERE Email='{email}';"
        result_from_user = sql_command(user_sql)
        result_from_org = sql_command(org_sql)
        if result_from_user:
            type_flag = 'user'
        elif result_from_org:
            type_flag = 'orgnization'
        else:
            return jsonify({'code': 403, 'message': "email not signup as individual / organization"})
        # check the identification of current user
        if type_flag == 'user':
            if password == result_from_user:
                token=encode_token(email,type_flag)
                return jsonify({'code': 200, 'message': "success", 'token':token})
            else:
                return jsonify({'code': 403, 'message': "invalid password"})
        else:
            if password == result_from_org:
                token = encode_token(email, type_flag)
                return jsonify({'code': 200, 'message': "success",'token':token})
            else:
                return jsonify({'code': 403, 'message': "invalid password"})


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
