from flask import request
from flask_restx import Resource
from geopy import distance

from flask_app import api
from tool import sql_command

api_search = api.namespace('search', description='Search function')


@api_search.route("/organization", doc={"description": "get details of an organization"})
@api_search.doc(params={'name': 'orgname', 'type': 'orgtype'})
class search_org(Resource):
    def get(self):
        name = request.args.get('name')
        orgtype = request.args.get('type')

        sql_orgsearch = "select OrganizationId from Organization"
        conds = []
        if name is not None:
            ns = name.split(",")
            conds.append("( " + " OR ".join(["LOWER(OrganizationName) LIKE '%{}%'".format(n.lower()) for n in ns]) + " )")
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
        

@api_search.route("/event", doc={"description": "search event based on criterions."})
@api_search.doc(params={"keyword": "search keywords", "format": "event format", "category": "event category",
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
                evt_coords = (float(e_lat), float(e_lng))
                if distance.geodesic(orig_coords, evt_coords).km <= range:
                    found_events.append(event_id)
        else:
            found_events = [output[0] for output in output_search]

        return found_events, 200