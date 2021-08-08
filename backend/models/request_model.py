from flask_restx import fields
from flask_app import api


# predefine model
individual_model = api.model("individual", {
    "nickname": fields.String,
    "email": fields.String,
    "password": fields.String
})

organization_model = api.model("organization", {
    "organizationName": fields.String,
    "email": fields.String,
    "password": fields.String,
    "organizationType": fields.String,
    "contact": fields.String,
    "introduction": fields.String
})

login_model = api.model("login", {
    "email": fields.String,
    "password": fields.String
})

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

user_update_model = api.model("user", {
    "Nickname": fields.String,
    "Password": fields.String,
})

org_profile_model = api.model("profile", {
    "organizationName": fields.String,
    "password": fields.String
})

comment_model = api.model("comment", {
    "comment": fields.String
})

reply_model = api.model("reply", {
    "answer": fields.String
})

review_model = api.model("review", {
    "review": fields.String,
    "rating": fields.Integer
})
