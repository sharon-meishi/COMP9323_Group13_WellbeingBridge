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
  `Email` varchar(256) NOT NULL,
  `Password` varchar(256) NOT NULL,
  `OrganizationName` varchar(256) NOT NULL,
  `OrganizationType` varchar(256) NOT NULL,
  `Logo` TEXT DEFAULT NULL,
  `Contact` varchar(256) NOT NULL,
  `Introduction` TEXT DEFAULT NULL,
  `Details` TEXT DEFAULT NULL,
  `VideoUrl` varchar(256) DEFAULT NULL,
  `ServiceList` TEXT DEFAULT NULL,
  `WebsiteLink` TEXT DEFAULT NULL,
  `otherEvents` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`OrganizationId`));'''

    insert_organization='''INSERT INTO Organization (OrganizationId,Email,Password,OrganizationName,OrganizationType,
    Logo,Contact,Introduction,Details,VideoUrl,ServiceList,WebsiteLink,otherEvents) 
    VALUES (0, "wellbeing@org.com", 
    "abcd", "HeadSpace", "Youth","https://sydneynorthhealthnetwork.org.au/wp-content/uploads/2016/04/Headspace-logo
    .png","headspace@newhorizons.net.au","The Centre is open to assist young people with health advice and support 
    and information, around a range of matters including: caring for others, stress, relationships, employment and 
    depression","Headspace is the National Youth Mental Health Foundation providing early intervention mental health 
    services to 12-25 year olds, along with assistance in promoting young peoples’ wellbeing.",
    "https://youtu.be/DxIDKZHW3-E",'"mental health counselling","education support","employment support","alcohol and 
    other drug services"', "https://headspace.org.au","1,2,3"), 
    (1, 'test@org.com', 'abcd', "My Aged Care", "Seniors", 
    "https://www.myagedcare.gov.au/themes/custom/myagedcare/logo.png", "1800-200-422", "My Aged Care is the 
    Australian Government's starting point on your aged care journey. Find and access the government-funded services 
    you need.", "My Aged Care will offer: prompt, reliable and confidential services; polite, helpful and 
    knowledgeable staff; clear information, available in other languages if you speak another language; support to 
    access information if you have hearing difficulties or a vision impairment; help to find government funded aged 
    care services; prompt resolution of any complaint or concern you have with My Aged Care.", 
    "https://youtu.be/QkWMK7gDVkw", '"Information on the different types of aged care services available", 
    "An assessment of needs to identify eligibility and the right type of care", "Referrals and support to find 
    service providers that can meet your needs", "Information on what you might need to pay towards the cost of your 
    care."', "https://www.myagedcare.gov.au", '1,2,3'), 
    (2, '9323@org.com', 'abcd', "House to Grow", "Education", 
    "https://brizy.b-cdn.net/media/iW=70&iH=80&oX=0&oY=0&cW=70&cH=80/d1073b4eea3ad956e7750133d6091c22.png", 
    "info@housetogrow.org", "Empowering communities through education for life, holistic health and wellbeing ", 
    "House to Grow is a not-for-profit organisation that empowers vulnerable children in unhealthy environments and 
    women affected by domestic violence through personal development, education for life and holistic health. We try 
    not to limit who can come to us, we encourage and support any individual that seeks personal development, 
    education for life and holistic health. We also deliver educational programs to organisations, community groups 
    and people in need. ", "video link", '"Colouring Dreams - Creating an environment for children to dream", 
    "Growing Healthy International Students - More Self improvement for better societies", "The Flight of the 
    Butterflies - Empowering women", "Building Emotionally Intelligent Communities - Get your volunteers ready for 
    tomorrow’s job"', "https://www.housetogrow.org", '1,2,3'); '''
    event_table = '''
    CREATE TABLE IF NOT EXISTS `Event` (
  `EventId` int NOT NULL AUTO_INCREMENT,
  `EventName` varchar(255) NOT NULL,
  `OrganizationId` int NOT NULL,
  `OrganizationName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Thumbnail` varchar(255) NOT NULL,
  `Format` varchar(255) NOT NULL,
  `Postcode` varchar(255) NOT NULL,
  `Suburb` varchar(255) NOT NULL,
  `Street` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `Date` varchar(255) NOT NULL,
  `Time` varchar(255) NOT NULL,
  `Introduction` TEXT DEFAULT NULL,
  `Details` TEXT DEFAULT NULL,
  `Recommendation` TEXT DEFAULT NULL,
  `BookedUser` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`EventId`))
    '''

    insert_event = '''
    INSERT INTO Event
  (EventId,EventName,OrganizationId,OrganizationName,Thumbnail,Format,Postcode,Suburb,Street,
  venue,Date,Time,Introduction,Details,Recommendation,BookedUser)
VALUES(0,"Kids Yoga Class",2,"Innerwest Council" ,
"https://www.indianyoga.school/public/uploads/gallery/kids-yoga-ttc.jpg","Class",
2131,"Ashfield NSW","Parramatta Road and Orpington Street","Ashfield Park",
"14-07-2021",
"11:00 AM to 12:00 PM",
 "Aimed at kids between 5 to 12, the classes will be gentle exercise focus, incorporating the local landscape and body weight exercises during the 60 minute session. ",
 "Kids must attend with parents. All you need is your yoga mat, a workout towel, a water bottle and a sense of fun!",
'1,2,3','1,2,3'),

(1,"Tai Chi for seniors",2,"My Aged Care" ,
"https://www.greatseniorliving.com/assets/img/tai-chi-for-seniors-pin-@1X.jpg","Class",
2039,"Rozelle NSW","608 Darling Street","Hannaford Community Centre",
"20-07-2021","10:00 AM to 11:00 AM",
 "Traditional Yang Style Tai Chi for seniors with particular focus on the 85 forms.",
 "Health benefits are derived from the Tai Chi's slow, gentle and tranquil movements which enable harmony in mind and body, improved mobility, suppleness and mental alertness. Bookings essential. ",
'1,2,3','1,2,3'),

(2,"Youth - #TrueDreamersTour2021",3,"House to Grow" ,
"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F137085143%2F307439946789%2F1%2Foriginal.20210531-025831?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=1%2C78%2C1250%2C625&s=3d6e67be19885a5a9411e28685a3bf0a",
"Class",
2204,"Marrickville NSW","142 Addison Road","142 Addison Rd","01-08-2021","11:00 AM to 3:00 PM",
 "A half day of activity that challenges young people to engage with wellbeing and make new connections in a friendly and fun environment.",
 "# TrueDreamersTour2021 event promises a half day of activity that challenges young people to engage with health and make new connections in a friendly and fun environment. including
              Inspirational stories from internaitonal students; Documentary internaional students in Australia; Round table with experts in health and education; Yoga and meditation activity; Live Music; Gift vouchers",
'1,2,3','1,2,3');
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
    c.execute(insert_organization)
    db.commit()
    c.execute(insert_event)
    db.commit()
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


location_model = api.model("location", {
    "postcode": fields.String,
    "suburb": fields.String,
    "street": fields.String,
    "venue": fields.String
})
event_model = api.model("event", {
    "eventName": fields.String,
    "thumbnail": fields.String,
    "format": fields.String,
    "location": fields.Nested(location_model),
    "date": fields.String,
    "time": fields.String,
    "introduction": fields.String,
    "details": fields.String
})

token_parser = api.parser()
token_parser.add_argument('token', type=str)


@api.route("/event", doc={"description": "publish details of an event"})
@api.doc(parser=token_parser)
class PublishEvent(Resource):
    @api.expect(event_model)
    def post(self):
        print("ok")
        data = json.loads(request.get_data())
        print(data)
        token = token_parser.parse_args()['token']
        if token is None:
            output = {
                "message": "Invalid input"
            }
            return output, 400
        user_info = decode_token(token)
        user_type = user_info['type']
        print(user_type)
        if user_type != 'organization':
            output = {
                "message": "Cannot access.Wrong token!"
            }
            return output, 403
        else:
            org_email = user_info['email']
            org_sql = f"SELECT OrganizationId,OrganizationName FROM Organization WHERE Email = '{org_email}';"
            org_result = sql_command(org_sql)[0]
            sql = "INSERT INTO Event VALUES (0,'{}', {}, '{}', '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}'," \
                  "NULL,NULL);". \
                format(data['eventName'], org_result[0], org_result[1], data['thumbnail'], data['format'],
                       data['location']['postcode'], data['location']['suburb'],
                       data['location']['street'], data['location']['venue'], data['date'], data['time'],
                       data['introduction'], data['details'])
            print(sql)
            sql_command(sql)
            output = {
                "message": "success"
            }
        return output, 200


@api.route("/event/{eventid}", doc={"description": "get details of an event"})
@api.doc(parser=parser)
class GetEventbyId(Resource):
    def get(self):
        token = parser.parse_args()['token']
        eventid = parser.parse_args()['eventid']
        event_sql = f"SELECT * FROM Event WHERE EventId={eventid};"
        event_info = sql_command(event_sql)[0]
        if token is None:
            booked = False
            favourite = False
        else:
            email = decode_token(token)['email']
            user_sql = f"SELECT Userid FROM User WHERE Email='{email}';"
            userid = sql_command(user_sql)[0][0]
            if str(userid) in event_info[15].split(","):
                booked = True
            else:
                booked = False
            user_sql = f"SELECT FavouriteId FROM User WHERE Email='{email}';"
            if_favourite = sql_command(user_sql)
            favouriteid = list(if_favourite[0])[0]
            if str(eventid) in favouriteid.split(","):
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
            # comment_temp = json.dumps(comment_temp)
            comments.append(comment_temp)
        output = {
            "eventId": eventid,
            "eventName": event_info[1],
            "OrganizationId": event_info[2],
            "OrganizationName": event_info[3],
            "thumbnail": event_info[4],
            "format": event_info[5],
            "location": {
                "postcode": event_info[6],
                "suburb": event_info[7],
                "street": event_info[8],
                "venue": event_info[9],
            },
            "date": event_info[10],
            "time": event_info[11],
            "introduction": event_info[12],
            "details": event_info[13],
            "comments": comments,
            "recommendation": list(map(int, event_info[14].split(","))),
            "bookedUser": list(map(int, event_info[15].split(","))),
            "booked": booked,
            "favourite": favourite
        }
        return output

    @api.expect(event_model)
    def put(self):
        data = api.payload
        token = parser.parse_args()['token']
        eventid = parser.parse_args()['eventid']
        if token is None:
            output = {
                "message": "bad request!"
            }
            return output, 405
        else:
            user_type = decode_token(token)['type']
            if user_type != 'organization':
                output = {
                    "message": "wrong token!"
                }
                return output, 403
            update_sql = f"UPDATE Event SET EventName='{data['eventName']}', Thumbnail='{data['thumbnail']}',Format='{data['format']}',Postcode='{data['location']['postcode']}',Suburb='{data['location']['suburb']}',Street='{data['location']['street']}',venue='{data['location']['venue']}',Date='{data['date']}',Time='{data['time']}',Introduction='{data['introduction']}',Details='{data['details']}' WHERE Eventid={eventid};"
            sql_command(update_sql)
            output = {
                "message": "Success"
            }
        return output, 200


if __name__ == "__main__":
    create_database()
    app.run(host='127.0.0.1', port=8000, debug=True)
