# -*- coding: utf-8 -*-

###
### DO NOT CHANGE THIS FILE
### 
### The code is auto generated, your change will be overwritten by 
### code generating.
###
from __future__ import absolute_import

from .api.signup_user import SignupUser
from .api.signup_organization import SignupOrganization
from .api.login import Login
from .api.logout import Logout
from .api.event import Event
from .api.event_eventid_summary import EventEventidSummary
from .api.event_eventid import EventEventid
from .api.event_eventid_like import EventEventidLike
from .api.event_eventid_unlike import EventEventidUnlike
from .api.event_eventid_book import EventEventidBook
from .api.event_eventid_unbook import EventEventidUnbook
from .api.organization_userId_summary import OrganizationUseridSummary
from .api.organization_userId import OrganizationUserid
from .api.organization_profile_userId import OrganizationProfileUserid
from .api.user_profile_userId import UserProfileUserid
from .api.popular_organizations import PopularOrganizations
from .api.popular_events import PopularEvents
from .api.search_organization import SearchOrganization
from .api.search_event import SearchEvent


routes = [
    dict(resource=SignupUser, urls=['/signup/user'], endpoint='signup_user'),
    dict(resource=SignupOrganization, urls=['/signup/organization'], endpoint='signup_organization'),
    dict(resource=Login, urls=['/login'], endpoint='login'),
    dict(resource=Logout, urls=['/logout'], endpoint='logout'),
    dict(resource=Event, urls=['/event'], endpoint='event'),
    dict(resource=EventEventidSummary, urls=['/event/<int:eventid>/summary'], endpoint='event_eventid_summary'),
    dict(resource=EventEventid, urls=['/event/<int:eventid>'], endpoint='event_eventid'),
    dict(resource=EventEventidLike, urls=['/event/<int:eventid>/like'], endpoint='event_eventid_like'),
    dict(resource=EventEventidUnlike, urls=['/event/<int:eventid>/unlike'], endpoint='event_eventid_unlike'),
    dict(resource=EventEventidBook, urls=['/event/<int:eventid>/book'], endpoint='event_eventid_book'),
    dict(resource=EventEventidUnbook, urls=['/event/<int:eventid>/unbook'], endpoint='event_eventid_unbook'),
    dict(resource=OrganizationUseridSummary, urls=['/organization/<int:userId>/summary'], endpoint='organization_userId_summary'),
    dict(resource=OrganizationUserid, urls=['/organization/<int:userId>'], endpoint='organization_userId'),
    dict(resource=OrganizationProfileUserid, urls=['/organization/profile/<int:userId>'], endpoint='organization_profile_userId'),
    dict(resource=UserProfileUserid, urls=['/user/profile/<int:userId>'], endpoint='user_profile_userId'),
    dict(resource=PopularOrganizations, urls=['/popular/organizations'], endpoint='popular_organizations'),
    dict(resource=PopularEvents, urls=['/popular/events'], endpoint='popular_events'),
    dict(resource=SearchOrganization, urls=['/search/organization'], endpoint='search_organization'),
    dict(resource=SearchEvent, urls=['/search/event'], endpoint='search_event'),
]