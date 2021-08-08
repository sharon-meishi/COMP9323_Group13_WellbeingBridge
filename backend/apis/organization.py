from flask import request
from flask_restx import Resource
import json
from pymysql.converters import escape_string

from models.request_model import *
from flask_app import api
from tool import *

api_org = api.namespace('organization', description='Operations about organization information', ordered=True)

# pre-define for parser
token_parser = api.parser()
token_parser.add_argument('Authorization', type=str, location='headers')


@api_org.route("/<int:oid>/summary", doc={"description": "get the summary of an organization"})
@api_org.doc(parser=token_parser)
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
            "rating": rating
        }
        return output, 200


@api_org.route("/<int:orgid>", doc={"description": "get details of an organization"})
@api_org.doc(parser=token_parser)
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
            # if len(popular_list_top3) >= 3:
            #     break
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
        reviews.reverse()
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

    @api_org.expect(org_model)
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
            Introduction='{escape_string(data['introduction'])}',\
            Details='{escape_string(data['details'])}',\
            VideoUrl='{data['video']}',\
            ServiceList='{escape_string(data['serviceList'])}',\
            WebsiteLink='{data['websiteLink']}' WHERE OrganizationId={orgid};"
        sql_command(update_sql)
        output = {
            "message": "Success"
        }
        return output, 200


@api_org.route("/profile/<int:oid>", doc={"description": "get the profile information of an organization user"})
@api_org.doc(parser=token_parser)
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

    @api_org.expect(org_profile_model)
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


@api_org.route("/<int:oid>/review", doc={"description": "give a review to an orgnization"})
@api_org.doc(parser=token_parser)
class review(Resource):
    @api_org.expect(review_model)
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


@api_org.route("/<int:oid>/review/<int:reviewid>", doc={"description": "review function"})
@api_org.doc(parser=token_parser)
class review_function(Resource):
    @api_org.expect(review_model)
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