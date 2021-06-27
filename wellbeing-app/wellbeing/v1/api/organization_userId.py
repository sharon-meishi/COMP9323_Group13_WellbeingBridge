# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class OrganizationUserid(Resource):

    def get(self, userId):
        print(g.headers)

        return {}, 200, None

    def put(self, userId):
        print(g.json)
        print(g.headers)

        return None, 200, None