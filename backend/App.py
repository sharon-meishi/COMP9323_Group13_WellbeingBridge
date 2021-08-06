from jwt_token import encode_token, decode_token
from flask import Flask, request, jsonify
from flask_restx import Resource, Api, fields
import pymysql
import json
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
from geopy import distance

app = Flask(__name__)
api = Api(app, title='COMP9323', description='hello')
CORS(app)


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


individual_model = api.model("individual", {
    "nickname": fields.String,
    "email": fields.String,
    "password": fields.String
})


# individual user's sign up
@api.route('/signup/user', doc={"description": "new individual user registration"})
class IndividualRegister(Resource):
    @api.expect(individual_model)
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


@api.route('/popular/events')
class GetPopularEvent(Resource):
    def get(self):
        query_string = '''SELECT EventId FROM Booking GROUP BY EventId ORDER BY COUNT(BookingId) DESC LIMIT 9'''
        if sql_command(query_string):
            event_id = [1, 2, 3]
            # event_id = sql_command(query_string)[0]
            # print(sql_command(query_string))
        else:
            event_id = [1, 2, 3]
        output = {"event_id": event_id}
        return output, 200


parser = api.parser()
parser.add_argument('token', type=str)
parser.add_argument('eventid', type=str, required=True)

token_parser = api.parser()
token_parser.add_argument('Authorization', type=str, location='headers')


@api.route("/event/<int:eventid>/summary", doc={"description": "get the summary of event"})
@api.doc(parser=token_parser)
class event(Resource):
    def get(self, eventid):
        token = token_parser.parse_args()['Authorization']
        event_sql = f"SELECT EventId,Thumbnail,EventName,StartDate,Postcode,Address,Lat,Lng, Introduction,Time,Category,OrganizationId,EndDate,Format FROM Event WHERE EventId='{eventid}';"
        result = sql_command(event_sql)

        if token is None:
            favourite = False
        else:
            email = decode_token(token)['email']
            type = decode_token(token)['type']
            if type == 'organization':
                favourite = False
            else:
                user_sql = f"SELECT FavouriteId FROM User WHERE Email='{email}';"
                if_favourite = sql_command(user_sql)[0][0]
                if if_favourite is None:
                    favourite = False
                else:
                    # favouriteid = list(if_favourite[0])[0]
                    if str(eventid) in if_favourite.split(","):
                        favourite = True
                    else:
                        favourite = False
        if result:
            book_sql = f"SELECT UserId FROM Booking WHERE EventId={eventid};"
            booked_userid = sql_command(book_sql)
            booked_event_user = []
            for i in booked_userid:
                booked_temp = {}
                id = i[0]
                sql = f"SELECT NickName,Email FROM User WHERE UserId={id};"
                x = sql_command(sql)[0]
                booked_temp['username'] = x[0]
                booked_temp['email'] = x[1]
                booked_event_user.append(booked_temp)
            # location = {"postcode": result[0][4], "suburb": result[0][5]}
            result_output = {"eventId": result[0][0],
                             "thumbnail": result[0][1],
                             "format":result[0][13],
                             "category": result[0][10],
                             "name": result[0][2],
                             "orgid": result[0][11],
                             "startdate": result[0][3],
                             "enddate": result[0][12],
                             "time": result[0][9],
                             "location": {
                                 "postcode": result[0][4],
                                 "Address": result[0][5],
                                 "Lat": result[0][6],
                                 "Lng": result[0][7]
                             },
                             "introduction": result[0][8],
                             "favourite": favourite,
                             "bookedUser": booked_event_user}
            return result_output, 200
        else:
            output = {
                "message": "Not Found"
            }
            return output, 404

    def delete(self, eventid):
        try:
            delete_sql = f'delete from Event where EventId={eventid};'
            sql_command(delete_sql)
            return {"message": 'Success!'}, 200
        except:
            return {"message": 'Wrong ID. Please try again.'}, 400


def get_user_id_by_token(token):
    user_email = decode_token(token)['email']
    sql_user_id = f"SELECT UserId FROM User WHERE Email = '{user_email}';"
    user_id_result = sql_command(sql_user_id)
    if user_id_result:
        return user_id_result[0][0]
    else:
        return None


@api.route("/event/<int:eventid>/favourite", doc={"description": "like an event"})
@api.doc(parser=token_parser)
class favourite(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_favourite_id = f"SELECT FavouriteId FROM User WHERE UserId='{user_id}';"
        favourite_id_result = sql_command(sql_favourite_id)
        curr_favourite_id = favourite_id_result[0][0]

        if curr_favourite_id:
            ids = curr_favourite_id.split(',')
            if any([id_ == eventid for id_ in ids]):
                output = {
                    "message": "Internal Error: event is already favourited."
                }
                return output, 200
            favourite_id = curr_favourite_id + ',' + str(eventid)
        else:
            favourite_id = str(eventid)

        sql_update_favourite = f"Update User SET FavouriteId='{favourite_id}' WHERE UserId='{user_id}';"
        sql_command(sql_update_favourite)

        favourite_id = [int(fid) for fid in favourite_id.split(',')]

        return {'favourite_id': favourite_id}, 200


@api.route("/event/<int:eventid>/unfavourite", doc={"description": "unlike an event"})
@api.doc(parser=token_parser)
class unfavourite(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_favourite_id = f"SELECT FavouriteId FROM User WHERE UserId='{user_id}';"
        favourite_id_result = sql_command(sql_favourite_id)
        curr_favourite_id = favourite_id_result[0][0]

        if not curr_favourite_id:
            output = {
                "message": "Internal Error: user never liked any event."
            }
            return output, 500

        new_favorate_id = []
        event_id_str = str(eventid)
        if curr_favourite_id:
            ids = curr_favourite_id.split(',')
            for i, id_ in enumerate(ids):
                if id_ == event_id_str:
                    new_favorate_id = ids[:i] + ids[i + 1:]
                    break
            if new_favorate_id or (not new_favorate_id and len(ids) == 1):
                new_favorate_id_str = ','.join(new_favorate_id)
                sql_update_favourite = f"Update User SET FavouriteId='{new_favorate_id_str}' WHERE UserId='{user_id}';"
                sql_command(sql_update_favourite)
                new_favorate_id = [int(id_) for id_ in new_favorate_id]

                return {'favourite_id': new_favorate_id}, 200
            else:
                output = {
                    "message": "Internal Error: user never liked this event with id: " + event_id_str
                }
                return output, 500


@api.route("/event/<int:eventid>/book", doc={"description": "Book an event"})
@api.doc(parser=token_parser)
class book(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_booking = f"SELECT BookingId FROM Booking WHERE UserId = '{user_id}' AND EventId = '{eventid}';"
        booking_result = sql_command(sql_booking)
        if booking_result:
            output = {
                "message": "Booking is already being made."
            }
        else:
            sql = "INSERT INTO Booking VALUES (NULL, '{}', '{}');".format(eventid, user_id)
            sql_command(sql)
            output = {"message": "new event is booked."}
        return output, 200


@api.route("/event/<int:eventid>/unbook", doc={"description": "Unook an event"})
@api.doc(parser=token_parser)
class unbook(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_booking = f"SELECT BookingId FROM Booking WHERE UserId = '{user_id}' AND EventId = '{eventid}';"
        booking_result = sql_command(sql_booking)
        if not booking_result:
            output = {
                "message": "No booking for this event."
            }
            return output, 404
        else:
            sql = f"DELETE FROM Booking WHERE UserId = '{user_id}' AND EventId = '{eventid}';"
            sql_command(sql)
            output = {"message": "event is unbooked."}
        return output, 200


user_model = api.model("user", {
    "UserId": fields.Integer,
    "Nickname": fields.String,
    "Email": fields.String,
    "Password": fields.String,
    "FavouriteId": fields.String
})

location_model = api.model("location", {
    "postcode": fields.String,
    "address": fields.String,
    "lat": fields.String,
    "lng": fields.String
})
event_model = api.model("event", {
    "eventName": fields.String,
    "thumbnail": fields.String,
    "format": fields.String,
    "category": fields.String,
    "location": fields.Nested(location_model),
    "startdate": fields.String,
    "enddate": fields.String,
    "time": fields.String,
    "introduction": fields.String,
    "details": fields.String
})
org_model = api.model("org", {
    "organizationName": fields.String,
    "organizationType": fields.String,
    "logo": fields.String,
    "contact": fields.String,
    "introduction": fields.String,
    "details": fields.String,
    "video": fields.String,
    "serviceList": fields.String,
    "websiteLink": fields.String
})


@api.route("/event", doc={"description": "publish details of an event"})
@api.doc(parser=token_parser)
class PublishEvent(Resource):
    @api.expect(event_model)
    def post(self):
        data = json.loads(request.get_data())
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "Invalid input"
            }
            return output, 400
        user_info = decode_token(token)
        user_type = user_info['type']
        if user_type != 'organization':
            output = {
                "message": "Cannot access.Wrong token!"
            }
            return output, 403
        else:
            org_email = user_info['email']
            org_sql = f"SELECT OrganizationId,OrganizationName FROM Organization WHERE Email = '{org_email}';"
            org_result = sql_command(org_sql)[0]
            sql = "INSERT INTO Event VALUES (0,'{}', {}, '{}', '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}');". \
                format(data['eventName'], org_result[0], org_result[1], data['thumbnail'], data['format'],
                       data['category'],
                       data['location']['postcode'], data['location']['address'],
                       data['location']['lat'], data['location']['lng'], data['startdate'], data['enddate'],
                       data['time'],
                       data['introduction'], data['details'])
            sql_command(sql)
            event_sql = f"SELECT EventId FROM Event WHERE EventName='{data['eventName']}' and OrganizationId={org_result[0]};"
            eventid = sql_command(event_sql)[0][0]
            output = {
                "message": "success",
                "eventid": eventid
            }
        return output, 200


@api.route("/event/<int:eventid>", doc={"description": "get details of an event"})
@api.doc(parser=token_parser)
class GetEventbyId(Resource):
    def get(self, eventid):
        token = token_parser.parse_args()['Authorization']
        event_sql = f"SELECT * FROM Event WHERE EventId={eventid};"
        event_info = sql_command(event_sql)[0]
        if token is None:
            booked = False
            favourite = False
        else:
            email = decode_token(token)['email']
            type = decode_token(token)['type']
            if type == 'organization':
                booked = False
                favourite = False
            else:
                user_sql = f"SELECT Userid FROM User WHERE Email='{email}';"
                userid = sql_command(user_sql)[0][0]
                booking_sql = f"SELECT * FROM Booking WHERE UserId={userid} and EventId={eventid};"
                booking_result = sql_command(booking_sql)
                if len(booking_result) == 0:
                    booked = False
                else:
                    booked = True
                user_sql = f"SELECT FavouriteId FROM User WHERE Email='{email}';"
                if_favourite = sql_command(user_sql)[0][0]
                if if_favourite is None:
                    favourite = False
                else:
                    # favouriteid = list(if_favourite[0])[0]
                    if str(eventid) in if_favourite.split(","):
                        favourite = True
                    else:
                        favourite = False
        comment_sql = f"SELECT * FROM Comment WHERE eventid={eventid};"
        comments = []

        comments_result = sql_command(comment_sql)
        for data in comments_result:
            comment_temp = {}
            comment_temp['commentId'] = data[0]
            comment_temp['userId'] = data[1]
            comment_temp['username'] = data[2]
            comment_temp['published'] = str(data[5])
            comment_temp['comment'] = data[4]
            comment_temp['answer'] = data[6]
            comment_temp['replyid'] = data[7]
            # comment_temp = json.dumps(comment_temp)
            comments.append(comment_temp)
        comments.reverse()
        book_sql = f"SELECT UserId FROM Booking WHERE EventId={eventid};"
        booked_userid = sql_command(book_sql)
        booked_event_user = []
        for i in booked_userid:
            booked_temp = {}
            id = i[0]
            sql = f"SELECT NickName,Email FROM User WHERE UserId={id};"
            result = sql_command(sql)[0]
            booked_temp['username'] = result[0]
            booked_temp['email'] = result[1]
            booked_event_user.append(booked_temp)

        other_event_sql = f"SELECT * FROM Event WHERE Category='{event_info[6]}' and EventId!={eventid};"
        other_event = sql_command(other_event_sql)
        recommendation = []
        if len(other_event) != 0:
            for j in range(len(other_event)):
                recommendation.append(other_event[j][0])
        output = {
            "eventId": eventid,
            "eventName": event_info[1],
            "OrganizationId": event_info[2],
            "OrganizationName": event_info[3],
            "thumbnail": event_info[4],
            "format": event_info[5],
            "category": event_info[6],
            "location": {
                "postcode": event_info[7],
                "address": event_info[8],
                "lat": event_info[9],
                "lng": event_info[10],
            },
            "startdate": event_info[11],
            "enddate": event_info[12],
            "time": event_info[13],
            "introduction": event_info[14],
            "details": event_info[15],
            "comments": comments,
            "recommendation": recommendation,
            "bookedUser": booked_event_user,
            "booked": booked,
            "favourite": favourite
        }
        return output

    @api.expect(event_model)
    def put(self, eventid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']

        if token is None:
            output = {
                "message": "bad request!"
            }
            return output, 400
        else:
            user_type = decode_token(token)['type']
            if user_type != 'organization':
                output = {
                    "message": "wrong token!"
                }
                return output, 403
            update_sql = f"UPDATE Event SET EventName='{data['eventName']}', Thumbnail='{data['thumbnail']}',Format='{data['format']}',Category='{data['category']}',Postcode='{data['location']['postcode']}',Address='{data['location']['address']}',Lat='{data['location']['lat']}',lng='{data['location']['lng']}',StartDate='{data['startdate']}', EndDate='{data['enddate']}',Time='{data['time']}',Introduction='{data['introduction']}',Details='{data['details']}' WHERE Eventid={eventid};"
            sql_command(update_sql)
            output = {
                "message": "Success"
            }
        return output, 200


user_update_model = api.model("user", {
    "Nickname": fields.String,
    "Password": fields.String,
})


@api.route("/user/profile", doc={"description": "get current user profile"})
@api.doc(parser=token_parser)
class GetUserProfilebyId(Resource):
    def get(self):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        user_sql = f"SELECT * FROM User WHERE UserId={user_id};"
        book_sql = f"SELECT EventId FROM Booking WHERE UserId={user_id};"
        user_info = sql_command(user_sql)[0]
        bood_info = sql_command(book_sql)
        booking_lst = [info[0] for info in bood_info]
        if user_info[4]:
            favourite_id = [int(fid) for fid in user_info[4].split(',')]
        else:
            favourite_id = []
        favourite_id.reverse()
        booking_lst.reverse()
        output = {"UserId": user_id,
                  "Nickname": user_info[1],
                  "Email": user_info[2],
                  "Password": user_info[3],
                  "FavouriteId": favourite_id,
                  "BookingId": booking_lst
                  }

        return output, 200

    @api.expect(user_update_model)
    def put(self):
        data = json.loads(request.get_data())
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if token is None:
            output = {
                "message": "Invalid Input"
            }
            return output, 400
        if data['Password'] == '':
            sql = '''UPDATE User SET Nickname = '{}'
                    WHERE UserId = {}'''. \
                format(data['Nickname'],
                       user_id)
        else:
            sql = '''UPDATE User SET
                             Nickname = '{}', 
                             Password = '{}'
            WHERE UserId = {}'''. \
                format(data['Nickname'],
                       data['Password'],
                       user_id)
        sql_command(sql)

        output = {
            "message": "success"
        }

        return output, 200


@api.route("/organization/<int:oid>/summary",
           doc={"description": "get the summary of an organization"})
@api.doc(parser=token_parser)
class Organization_profile(Resource):
    def get(self, oid):
        sql = f"SELECT OrganizationName,OrganizationType,Logo,Introduction FROM Organization WHERE OrganizationId={oid};"
        result = sql_command(sql)
        rating_sql = f'select avg(rating) from Review where organizationid={oid};'
        rating_result = sql_command(rating_sql)[0]
        if rating_result[0] is None:
            rating=0
        else:
            rating=float(rating_result[0])
        output = {
            "oId": oid,
            "OrganizationName": result[0][0],
            "OrganizationType": result[0][1],
            "Logo": result[0][2],
            "Introduction": result[0][3],
            "rating":rating
        }
        return output, 200


org_profile_model = api.model("profile", {
    "organizationName": fields.String,
    "password": fields.String
})


@api.route("/organization/profile/<int:oid>",
           doc={"description": "get the profile information of an organization user"})
@api.doc(parser=token_parser)
class Organization_profile(Resource):
    def get(self, oid):
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "bad request!"
            }
            return output, 400
        else:
            user_type = decode_token(token)['type']
            if user_type != 'organization':
                output = {
                    "message": "wrong token!"
                }
                return output, 403
            org_sql = f"SELECT OrganizationName, Email FROM Organization WHERE OrganizationId={oid};"
            result = sql_command(org_sql)
            event_sql = f"SELECT EventId FROM Event WHERE OrganizationId={oid};"
            event_list = sql_command(event_sql)
            event_id = []
            if len(event_list):
                for i in event_list:
                    event_id.append(i[0])
            event_id.reverse()
            rating_sql = f'select avg(rating) from Review where organizationid={oid};'
            rating_result = sql_command(rating_sql)[0]
            if rating_result[0] is None:
                rating = 0
            else:
                rating = float(rating_result[0])
            if len(result):
                output = {
                    "oId": oid,
                    "organizationName": result[0][0],
                    "email": result[0][1],
                    "publishedEvent": event_id,
                    "rating":rating
                }
                return output, 200
            output = {
                "message": "NOT FOUND"
            }
            return output, 404

    @api.expect(org_profile_model)
    def put(self, oid):
        data = json.loads(request.get_data())
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "bad request!"
            }
            return output, 400
        else:
            user_type = decode_token(token)['type']
            if user_type != 'organization':
                output = {
                    "message": "wrong token!"
                }
                return output, 403
            # find_password=f"SELECT Password FROM Organization WHERE OrganizationId={oid};"
            if data['password'] == '':
                sql = f"UPDATE Organization SET OrganizationName='{data['organizationName']}' WHERE OrganizationId={oid};"
            else:
                sql = f"UPDATE Organization SET OrganizationName='{data['organizationName']}',Password='{data['password']}' WHERE OrganizationId={oid};"
            sql_command(sql)
            output = {
                "message": "Success"
            }
            return output, 200


comment_model = api.model("comment", {
    "comment": fields.String
})


@api.route("/event/<int:eventid>/comment", doc={"description": "make a comment on a specific event"})
@api.doc(parser=token_parser)
class Organization_profile(Resource):
    @api.expect(comment_model)
    def post(self, eventid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "You must login first!"
            }
            return output, 403
        email = decode_token(token)['email']
        type = decode_token(token)['type']
        if type == 'individual':
            sql = f"SELECT Userid,NickName FROM User WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]
            username = result[1]

        else:
            sql = f"SELECT OrganizationId,OrganizationName FROM Organization WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]
            username = result[1]
        find_event_sql = f"SELECT * FROM Event WHERE EventId={eventid};"
        event_result = sql_command(find_event_sql)
        if len(event_result):
            time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            sql = f"INSERT INTO Comment VALUES (0,{userid},'{username}',{eventid},'{data['comment']}','{time}',NULL,NULL);"
            sql_command(sql)
            output = {
                "message": "success"
            }
            return 200
        else:
            output = {
                "message": "Not found this event"
            }
            return output, 404


@api.route("/organization/<int:orgid>", doc={"description": "get details of an organization"})
@api.doc(parser=token_parser)
class org(Resource):
    def get(self, orgid):
        token = token_parser.parse_args()['Authorization']
        org_sql = f"SELECT * FROM Organization WHERE OrganizationId={orgid};"

        output_org = sql_command(org_sql)
        if len(output_org) == 0:
            return 404, 'Not Found'
        org_info = output_org[0]

        orgname = value_check(org_info, 3)
        orgtype = value_check(org_info, 4)
        logo = value_check(org_info, 5)
        contact = value_check(org_info, 6)
        orgintro = value_check(org_info, 7)
        detail = value_check(org_info, 8)
        video = value_check(org_info, 9)

        if org_info[10] != None:
            servicelist = org_info[10]
            servicelist = servicelist.replace("\n", '').split('@')
        else:
            servicelist = []
        website = value_check(org_info, 11)

        otherlist = []

        event_sql_list = f"select EventId from Event inner join Organization on (Event.OrganizationId=Organization.OrganizationId) where Organization.OrganizationId={orgid};"
        popular_list_top3 = []
        result_event = sql_command(event_sql_list)
        if len(result_event) > 0:
            for i in result_event:
                otherlist.append(i[0])
            # else:
            #     popular_list_top3=None

        event_popular = {}
        for i in otherlist:
            event_sql = f'select count(userId) from Booking inner join Event on (Booking.EventId=Event.EventId) where Event.Eventid ={i};'
            event_number = sql_command(event_sql)[0][0]
            number = int(event_number)
            event_popular[i] = number

        new_dic = zip(event_popular.keys(), event_popular.values())
        new_dic = sorted(new_dic)
        for i in new_dic:
            popular_list_top3.append(i[0])
            if len(popular_list_top3) >= 3:
                break
        rating_sql = f'select avg(rating) from Review where organizationid={orgid};'
        rating_result = sql_command(rating_sql)[0]
        if rating_result[0] is None:
            rating=0
        else:
            rating=float(rating_result[0])
        review_sql = f'select id,userid,username,rating,review,time from Review where organizationid={orgid};'
        reviews=[]
        review_result=sql_command(review_sql)
        for review in review_result:
            temp={}
            temp['reviewId']=review[0]
            temp['userId']=review[1]
            temp['username']=review[2]
            temp['rating']=review[3]
            temp['review']=review[4]
            temp['published']=str(review[5])
            reviews.append(temp)
        output = {
            'oId': orgid,
            'organizationName': orgname,
            'organizationType': orgtype,
            'logo': logo,
            'contact': contact,
            'introduction': orgintro,
            "details": detail,
            "video": video,
            "serviceList": servicelist,
            "websiteLink": website,
            "otherEvents": popular_list_top3,
            "rating": rating,
            "reviews":reviews
        }

        return output, 200

    @api.expect(org_model)
    def put(self, orgid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "bad request!"
            }
            return output, 400

        user_type = decode_token(token)['type']
        if user_type != 'organization':
            output = {
                "message": "wrong token!"
            }
            return output, 403

        update_sql = f"UPDATE Organization SET OrganizationName='{data['organizationName']}', \
            OrganizationType='{data['organizationType']}',Logo='{data['logo']}',\
            Contact='{data['contact']}',\
            Introduction='{data['introduction']}',\
            Details='{data['details']}',\
            VideoUrl='{data['video']}',\
            ServiceList='{data['serviceList']}',\
            WebsiteLink='{data['websiteLink']}' WHERE OrganizationId={orgid};"
        sql_command(update_sql)
        output = {
            "message": "Success"
        }
        return output, 200


@api.route("/search/organization", doc={"description": "get details of an organization"})
@api.doc(params={'name': 'orgname', 'type': 'orgtype'})
class search_org(Resource):
    def get(self):
        name = request.args.get('name')
        orgtype = request.args.get('type')

        sql_orgsearch = "select OrganizationId from Organization"
        conds = []
        if name is not None:
            ns = name.split(",")
            conds.append("( " + " OR ".join(["OrganizationName='{}'".format(n) for n in ns]) + " )")
        if orgtype is not None:
            ots = orgtype.split(",")
            conds.append("( " + " OR ".join(["OrganizationType='{}'".format(ot) for ot in ots]) + " )")

        if conds:
            sql_orgsearch += " WHERE " + " AND ".join(conds) + ";"
        else:
            sql_orgsearch += ";"
        output_search = sql_command(sql_orgsearch)
        org_info = output_search

        org_list = [oi[0] for oi in org_info]
        output = {"organizationId": org_list}

        return output, 200


@api.route("/search/event", doc={"description": "search event based on criterions."})
@api.doc(params={"keyword": "search keywords", "format": "event format", "category": "event category",
                 "startdate": "date of start", "enddate": "date of end", "lat": "latitude", "lng": "longitude",
                 "range": "default range = 5km"})
class search_event(Resource):
    def get(self):
        keyword = request.args.get('keyword')
        formats = request.args.get('format')
        category = request.args.get('category')
        startdate = request.args.get('startdate')
        enddate = request.args.get('enddate')
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        range = request.args.get('range')
        if range == "" or range is None:
            range = 5
        else:
            range = int(range)

        sql_eventsearch = "select EventId, Lat, Lng from Event"
        conds = []
        if keyword is not None:
            kws = keyword.split(",")
            conds.append("( " + " OR ".join(["EventName LIKE '%{}%'".format(kw) for kw in kws]) + " )")
        if formats is not None:
            fs = formats.split(",")
            conds.append("( " + " OR ".join(["FORMAT='{}'".format(f) for f in fs]) + " )")
        if category is not None:
            cts = category.split(",")
            conds.append("( " + " OR ".join(["Category='{}'".format(f) for f in cts]) + " )")

        if startdate is not None:
            slst = startdate.split("/")
            slst = list(reversed(slst))
            startdate = "-".join(slst)
        if enddate is not None:
            elst = enddate.split("/")
            elst = list(reversed(elst))
            enddate = "-".join(elst)

        if startdate is not None and enddate is not None:
            conds.append(
                "DATE_FORMAT(STR_TO_DATE(EndDate,'%d/%m/%Y') ,'%Y-%m-%d')>='{}' AND DATE_FORMAT(STR_TO_DATE(StartDate,'%d/%m/%Y'),'%Y-%m-%d')<='{}'".format(
                    startdate, enddate))
        elif startdate is not None and enddate is None:
            conds.append("DATE_FORMAT(STR_TO_DATE(EndDate,'%d/%m/%Y'),'%Y-%m-%d')>='{}'".format(startdate))
        elif startdate is None and enddate is not None:
            conds.append("DATE_FORMAT(STR_TO_DATE(StartDate,'%d/%m/%Y'),'%Y-%m-%d')<='{}'".format(enddate))

        if conds:
            sql_eventsearch += " WHERE " + " AND ".join(conds) + ";"
        else:
            sql_eventsearch += ";"

        print(sql_eventsearch)

        output_search = sql_command(sql_eventsearch)
        found_events = []
        if lat is not None and lng is not None:
            orig_coords = (float(lat), float(lng))
            for event_id, e_lat, e_lng in output_search:
                if(e_lat == "" and e_lng == ""):
                    found_events.append(event_id)
                else:
                    evt_coords = (float(e_lat), float(e_lng))
                    if distance.geodesic(orig_coords, evt_coords).km <= range:
                        found_events.append(event_id)
        else:
            found_events = [output[0] for output in output_search]
        
        found_events.reverse()

        return found_events, 200


@api.route("/event/<int:eventid>/comment/<int:commentid>", doc={"description": "edit comments under one event"})
@api.doc(parser=token_parser)
class comment(Resource):
    @api.expect(comment_model)
    def put(self, eventid, commentid):
        token = token_parser.parse_args()['Authorization']
        data = api.payload
        edit_comment_sql = f"UPDATE COMMENT SET comment='{data['comment']}' WHERE id={commentid}"
        sql_command(edit_comment_sql)
        output = {
            "message": "Success"
        }
        return output, 200

    def delete(self, eventid, commentid):
        try:
            token = token_parser.parse_args()['Authorization']
            delete_sql = f'DELETE FROM COMMENT where id={commentid};'
            sql_command(delete_sql)
            return {"message": 'Success!'}, 200
        except:
            return {"message": 'Wrong ID. Please try again.'}, 400


def value_check(org_info, i):
    result = None
    if org_info[i] != None:
        result = org_info[i].replace("\n", '')
    return result


reply_model = api.model("reply", {
    "answer": fields.String
})


@api.route("/event/<int:eventid>/comment/<int:commentid>/answer",
           doc={"description": "reply to a comment on a specific event"})
@api.doc(parser=token_parser)
class reply_comment(Resource):
    @api.expect(reply_model)
    def put(self, eventid, commentid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "You must login first!"
            }
            return output, 403
        email = decode_token(token)['email']
        type = decode_token(token)['type']
        if type == 'individual':
            sql = f"SELECT Userid,NickName FROM User WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]
        else:
            sql = f"SELECT OrganizationId,OrganizationName FROM Organization WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]

        sql = f"UPDATE COMMENT SET answer='{data['answer']}',replyid={userid} WHERE id={commentid};"
        sql_command(sql)
        output = {
            "message": "success"
        }
        return output, 200


review_model = api.model("review", {
    "review": fields.String,
    "rating": fields.Integer
})


@api.route("/organization/<int:oid>/review", doc={"description": "give a review to an orgnization"})
@api.doc(parser=token_parser)
class review(Resource):
    @api.expect(review_model)
    def post(self, oid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "You must login first!"
            }
            return output, 403
        email = decode_token(token)['email']
        sql = f"SELECT Userid,NickName FROM User WHERE Email='{email}';"
        result = sql_command(sql)[0]
        userid = result[0]
        username = result[1]
        time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        sql = f"INSERT INTO Review VALUES (0,{userid},'{username}',{data['rating']},{oid},'{data['review']}','{time}');"
        sql_command(sql)
        output = {
            "message": "success"
        }
        return output, 200


@api.route("/organization/<int:oid>/review/<int:reviewid>", doc={"description": "review function"})
@api.doc(parser=token_parser)
class review_function(Resource):
    @api.expect(review_model)
    def put(self, oid, reviewid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "You must login first!"
            }
            return output, 403
        email = decode_token(token)['email']
        sql = f"SELECT Userid,NickName FROM User WHERE Email='{email}';"
        result = sql_command(sql)[0]
        userid = result[0]
        time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        review_sql = f"SELECT Userid FROM Review WHERE id={reviewid};"
        review_result = sql_command(review_sql)[0]
        if userid!=review_result[0]:
            output={
                "message":"You cannot change others' reviews!"
            }
            return output,403
        change_sql=f"UPDATE REVIEW SET review='{data['review']}',rating={data['rating']},time='{time}' WHERE id={reviewid};"
        sql_command(change_sql)
        output={
            "message":"success"
        }
        return output,200
    def delete(self,oid,reviewid):
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "You must login first!"
            }
            return output, 403
        email = decode_token(token)['email']
        sql = f"SELECT Userid,NickName FROM User WHERE Email='{email}';"
        result = sql_command(sql)[0]
        userid = result[0]
        review_sql = f"SELECT Userid FROM Review WHERE id={reviewid};"
        review_result = sql_command(review_sql)[0]
        if userid!=review_result[0]:
            output={
                "message":"You cannot delete others's review!"
            }
            return output,403
        sql=f"DELETE FROM REVIEW WHERE id={reviewid};"
        sql_command(sql)
        output={
            "message":"success"
        }
        return output,200





if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
