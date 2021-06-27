# -*- coding: utf-8 -*-

import six
from jsonschema import RefResolver
# TODO: datetime support

class RefNode(object):

    def __init__(self, data, ref):
        self.ref = ref
        self._data = data

    def __getitem__(self, key):
        return self._data.__getitem__(key)

    def __setitem__(self, key, value):
        return self._data.__setitem__(key, value)

    def __getattr__(self, key):
        return self._data.__getattribute__(key)

    def __iter__(self):
        return self._data.__iter__()

    def __repr__(self):
        return repr({'$ref': self.ref})

    def __eq__(self, other):
        if isinstance(other, RefNode):
            return self._data == other._data and self.ref == other.ref
        elif six.PY2:
            return object.__eq__(other)
        elif six.PY3:
            return object.__eq__(self, other)
        else:
            return False

    def __deepcopy__(self, memo):
        return RefNode(copy.deepcopy(self._data), self.ref)

    def copy(self):
        return RefNode(self._data, self.ref)

###
### DO NOT CHANGE THIS FILE
### 
### The code is auto generated, your change will be overwritten by 
### code generating.
###

base_path = '/v1'

definitions = {'definitions': {'ArrayOfInt': {'type': 'array', 'items': {'type': 'integer'}, 'example': [1, 2, 3]}, 'eventFormat': {'type': 'string', 'enum': ['Class', 'Conference', 'Festival', 'Party', 'Convention', 'Expo', 'Gala', 'Game', 'Networking', 'Performance', 'Race', 'Seminar', 'Tournament', 'Tour']}, 'organizationType': {'type': 'string', 'enum': ['Youth', 'Disability and carers', 'Serniors', 'Family and domestic violence', 'Education', 'Employment', 'Body health', 'Mental health', 'Money', 'Legal services']}, 'userRegister': {'type': 'object', 'properties': {'username': {'type': 'string', 'example': 'Sharon/HeadSpace'}, 'email': {'type': 'string', 'example': 'meishichen1106@gmail.com'}, 'password': {'type': 'string', 'example': '123456'}, 'usergroup': {'type': 'string', 'example': 'individual'}}}, 'userProfile': {'type': 'object', 'properties': {'userId': {'type': 'integer', 'example': 1}, 'username': {'type': 'string', 'example': 'Sharon'}, 'email': {'type': 'string'}, 'likedEvent': {'$ref': '#/definitions/ArrayOfInt'}, 'bookedEvent': {'$ref': '#/definitions/ArrayOfInt'}}}, 'organizationRegister': {'type': 'object', 'properties': {'username': {'type': 'string', 'example': 'headspace'}, 'email': {'type': 'string', 'example': 'headspaceashfield@newhorizons.net.au'}, 'password': {'type': 'string', 'example': '123456'}, 'usergroup': {'type': 'string', 'example': 'organization'}, 'organizationName': {'type': 'string', 'example': 'HeadSpace'}, 'organizationType': {'$ref': '#/definitions/organizationType'}, 'contact': {'type': 'string', 'example': 'headspaceashfield@newhorizons.net.au'}, 'introduction': {'type': 'string', 'example': 'The Centre is open to assist young people with health advice and support and information, around a range of matters including: caring for others, stress, relationships, employment and depression'}}}, 'organizationProfile': {'type': 'object', 'properties': {'userId': {'type': 'integer', 'example': 2}, 'username': {'type': 'string', 'example': 'HeadSpace'}, 'email': {'type': 'string', 'example': 'headspaceashfield@newhorizons.net.au'}, 'publishedEvent': {'$ref': '#/definitions/ArrayOfInt'}}}, 'eventSummary': {'type': 'object', 'properties': {'eventId': {'type': 'integer', 'example': 1}, 'thumbnail': {'type': 'string', 'example': 'image link'}, 'name': {'type': 'string', 'description': 'The name of event', 'example': 'Community Yoga Class'}, 'date': {'type': 'string', 'format': 'date-time', 'example': ''}, 'location': {'type': 'object', 'properties': {'postcode': {'type': 'string', 'example': '2131'}, 'suburb': {'type': 'string', 'example': 'Ashfield NSW'}}}}}, 'eventDetails': {'type': 'object', 'properties': {'eventId': {'type': 'integer', 'example': 1}, 'eventName': {'type': 'string', 'description': 'The name of event', 'example': 'Community Yoga Class'}, 'thumbnail': {'type': 'string', 'description': 'image link', 'example': 'image link'}, 'format': {'$ref': '#/definitions/eventFormat'}, 'location': {'type': 'object', 'properties': {'postcode': {'type': 'integer', 'example': '2131'}, 'suburb': {'type': 'string', 'example': 'Ashfield NSW'}, 'street': {'type': 'string', 'example': 'Parramatta Road and Orpington Street'}, 'venue': {'type': 'string', 'example': 'Ashfield Park'}}}, 'date': {'type': 'string', 'format': 'date-time', 'example': ''}, 'details': {'type': 'string', 'example': 'Aimed at all levels of fitness and age groups, the classes will be gentle exercise focus, incorporating the local landscape and body weight exercises during the 60 minute session.  All you need is your yoga mat, a workout towel, a water bottle and a sense of fun!'}, 'recommendation': {'$ref': '#/definitions/ArrayOfInt'}}}, 'organizationSummary': {'type': 'object', 'properties': {'userId': {'type': 'integer', 'example': 2}, 'organizationType': {'type': 'string', 'example': 'Youth'}, 'organizationName': {'type': 'string', 'example': 'HeadSpace'}, 'logo': {'type': 'string', 'description': 'logo of the organization', 'example': 'image link'}, 'introduction': {'type': 'string', 'example': 'The Centre is open to assist young people with health advice and support and information, around a range of matters including: caring for others, stress, relationships, employment and depression'}}}, 'organizationDetails': {'type': 'object', 'properties': {'userId': {'type': 'integer', 'example': 2}, 'organizationName': {'type': 'string', 'example': 'HeadSpace'}, 'organizationType': {'$ref': '#/definitions/organizationType'}, 'logo': {'type': 'string', 'description': 'logo of the organization', 'example': 'image link'}, 'contact': {'type': 'string', 'example': 'headspace@newhorizons.net.au'}, 'introduction': {'type': 'string', 'example': 'The Centre is open to assist young people with health advice and support and information, around a range of matters including: caring for others, stress, relationships, employment and depression'}, 'video': {'type': 'string', 'example': 'video link'}, 'serviceList': {'type': 'array', 'items': {'type': 'string'}, 'example': ['mental health counselling', 'education support', 'employment support', 'alcohol and other drug services']}, 'websiteLink': {'type': 'string', 'example': 'https://headspace.org.au/headspace-centres/ashfield/'}, 'otherEvents': {'$ref': '#/definitions/ArrayOfInt'}}}}, 'parameters': {}}

validators = {
    ('signup_user', 'POST'): {'json': {'$ref': '#/definitions/userRegister'}},
    ('signup_organization', 'POST'): {'json': {'$ref': '#/definitions/organizationRegister'}},
    ('login', 'POST'): {'json': {'type': 'object', 'properties': {'email': {'type': 'string', 'example': 'meishichen1106@gmail.com'}, 'password': {'type': 'string', 'example': '123456'}}}},
    ('event', 'POST'): {'json': {'$ref': '#/definitions/eventDetails'}, 'headers': {'required': ['Authority'], 'properties': {'Authority': {'description': 'The token', 'type': 'string'}}}},
    ('event_eventid_summary', 'GET'): {'headers': {'required': [], 'properties': {'Authorization': {'type': 'string'}}}},
    ('event_eventid', 'GET'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('event_eventid', 'PUT'): {'json': {'$ref': '#/definitions/eventDetails'}, 'headers': {'required': [], 'properties': {'Authorization': {'type': 'string'}}}},
    ('event_eventid', 'DELETE'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('event_eventid_like', 'PUT'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('event_eventid_unlike', 'PUT'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('event_eventid_book', 'PUT'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('event_eventid_unbook', 'PUT'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('organization_userId_summary', 'GET'): {'headers': {'required': [], 'properties': {'Authority': {'description': 'The token', 'type': 'string'}}}},
    ('organization_userId', 'GET'): {'headers': {'required': [], 'properties': {'Authority': {'description': 'The token', 'type': 'string'}}}},
    ('organization_userId', 'PUT'): {'json': {'$ref': '#/definitions/organizationDetails'}, 'headers': {'required': [], 'properties': {'Authority': {'description': 'The token', 'type': 'string'}}}},
    ('organization_profile_userId', 'GET'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('organization_profile_userId', 'PUT'): {'json': {'type': 'object', 'properties': {'username': {'type': 'string', 'example': 'HeadSpace'}, 'password': {'type': 'string', 'example': '123456'}}}, 'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('user_profile_userId', 'GET'): {'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('user_profile_userId', 'PUT'): {'json': {'type': 'object', 'properties': {'username': {'type': 'string', 'example': 'Sharon'}, 'password': {'type': 'string', 'example': '123456'}}}, 'headers': {'required': ['Authorization'], 'properties': {'Authorization': {'type': 'string'}}}},
    ('search_organization', 'GET'): {'args': {'required': [], 'properties': {'name': {'type': 'string', 'description': 'Name of organization'}, 'type': {'type': 'string', 'description': 'type of organization'}}}},
    ('search_event', 'GET'): {'args': {'required': [], 'properties': {'eventname': {'type': 'string', 'description': 'Name of event'}, 'category': {'type': 'string', 'description': 'category of event'}, 'location': {'type': 'string', 'description': 'preferred location'}, 'date': {'type': 'string', 'description': 'preferred date of event'}, 'sort': {'type': 'string', 'description': 'preferred order of event'}}}},
}

filters = {
    ('signup_user', 'POST'): {200: {'headers': None, 'schema': {'type': 'object', 'properties': {'userId': {'type': 'integer', 'example': 1}, 'token': {'type': 'string', 'example': 'token'}}}}, 400: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': {'type': 'object', 'properties': {'message': {'type': 'string', 'example': 'email already used as individual'}}}}},
    ('signup_organization', 'POST'): {200: {'headers': None, 'schema': {'type': 'object', 'properties': {'userId': {'type': 'integer', 'example': 1}, 'token': {'type': 'string', 'example': 'string'}}}}, 400: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': {'type': 'object', 'properties': {'message': {'type': 'string', 'example': 'email already used as organization'}}}}},
    ('login', 'POST'): {200: {'headers': None, 'schema': {'type': 'object', 'properties': {'userId': {'type': 'integer', 'example': 1}, 'usergroup': {'type': 'string', 'example': 'individual/organization'}, 'token': {'type': 'string', 'example': 'string'}}}}, 400: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': {'type': 'object', 'properties': {'message': {'type': 'string', 'example': 'email not signup as individual/organization'}}}}},
    ('logout', 'GET'): {},
    ('event', 'POST'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}},
    ('event_eventid_summary', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/eventSummary'}}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('event_eventid', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/eventDetails'}}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('event_eventid', 'PUT'): {200: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}, 405: {'headers': None, 'schema': None}},
    ('event_eventid', 'DELETE'): {200: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('event_eventid_like', 'PUT'): {200: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('event_eventid_unlike', 'PUT'): {200: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('event_eventid_book', 'PUT'): {200: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('event_eventid_unbook', 'PUT'): {200: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('organization_userId_summary', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/organizationSummary'}}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('organization_userId', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/organizationDetails'}}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('organization_userId', 'PUT'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}},
    ('organization_profile_userId', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/organizationProfile'}}, 404: {'headers': None, 'schema': None}},
    ('organization_profile_userId', 'PUT'): {200: {'headers': None, 'schema': None}, 400: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}},
    ('user_profile_userId', 'GET'): {200: {'headers': None, 'schema': {'$ref': '#/definitions/userProfile'}}, 404: {'headers': None, 'schema': None}},
    ('user_profile_userId', 'PUT'): {200: {'headers': None, 'schema': None}, 403: {'headers': None, 'schema': None}, 404: {'headers': None, 'schema': None}},
    ('popular_organizations', 'GET'): {200: {'headers': None, 'schema': {'type': 'object', 'properties': {'organizationId': {'$ref': '#/definitions/ArrayOfInt'}}}}, 404: {'headers': None, 'schema': None}},
    ('popular_events', 'GET'): {200: {'headers': None, 'schema': {'type': 'object', 'properties': {'eventId': {'$ref': '#/definitions/ArrayOfInt'}}}}, 404: {'headers': None, 'schema': None}},
    ('search_organization', 'GET'): {200: {'headers': None, 'schema': {'type': 'object', 'properties': {'organizationId': {'$ref': '#/definitions/ArrayOfInt'}}}}, 404: {'headers': None, 'schema': None}},
    ('search_event', 'GET'): {200: {'headers': None, 'schema': {'type': 'object', 'properties': {'eventId': {'$ref': '#/definitions/ArrayOfInt'}}}}, 404: {'headers': None, 'schema': None}},
}

scopes = {
}

resolver = RefResolver.from_schema(definitions)

class Security(object):

    def __init__(self):
        super(Security, self).__init__()
        self._loader = lambda: []

    @property
    def scopes(self):
        return self._loader()

    def scopes_loader(self, func):
        self._loader = func
        return func

security = Security()


def merge_default(schema, value, get_first=True, resolver=None):
    # TODO: more types support
    type_defaults = {
        'integer': 9573,
        'string': 'something',
        'object': {},
        'array': [],
        'boolean': False
    }

    results = normalize(schema, value, type_defaults, resolver=resolver)
    if get_first:
        return results[0]
    return results


def normalize(schema, data, required_defaults=None, resolver=None):
    if required_defaults is None:
        required_defaults = {}
    errors = []

    class DataWrapper(object):

        def __init__(self, data):
            super(DataWrapper, self).__init__()
            self.data = data

        def get(self, key, default=None):
            if isinstance(self.data, dict):
                return self.data.get(key, default)
            return getattr(self.data, key, default)

        def has(self, key):
            if isinstance(self.data, dict):
                return key in self.data
            return hasattr(self.data, key)

        def keys(self):
            if isinstance(self.data, dict):
                return list(self.data.keys())
            return list(getattr(self.data, '__dict__', {}).keys())

        def get_check(self, key, default=None):
            if isinstance(self.data, dict):
                value = self.data.get(key, default)
                has_key = key in self.data
            else:
                try:
                    value = getattr(self.data, key)
                except AttributeError:
                    value = default
                    has_key = False
                else:
                    has_key = True
            return value, has_key

    def _merge_dict(src, dst):
        for k, v in six.iteritems(dst):
            if isinstance(src, dict):
                if isinstance(v, dict):
                    r = _merge_dict(src.get(k, {}), v)
                    src[k] = r
                else:
                    src[k] = v
            else:
                src = {k: v}
        return src

    def _normalize_dict(schema, data):
        result = {}
        if not isinstance(data, DataWrapper):
            data = DataWrapper(data)

        for _schema in schema.get('allOf', []):
            rs_component = _normalize(_schema, data)
            _merge_dict(result, rs_component)

        for key, _schema in six.iteritems(schema.get('properties', {})):
            # set default
            type_ = _schema.get('type', 'object')

            # get value
            value, has_key = data.get_check(key)
            if has_key or '$ref' in _schema:
                result[key] = _normalize(_schema, value)
            elif 'default' in _schema:
                result[key] = _schema['default']
            elif key in schema.get('required', []):
                if type_ in required_defaults:
                    result[key] = required_defaults[type_]
                else:
                    errors.append(dict(name='property_missing',
                                       message='`%s` is required' % key))

        additional_properties_schema = schema.get('additionalProperties', False)
        if additional_properties_schema is not False:
            aproperties_set = set(data.keys()) - set(result.keys())
            for pro in aproperties_set:
                result[pro] = _normalize(additional_properties_schema, data.get(pro))

        return result

    def _normalize_list(schema, data):
        result = []
        if hasattr(data, '__iter__') and not isinstance(data, (dict, RefNode)):
            for item in data:
                result.append(_normalize(schema.get('items'), item))
        elif 'default' in schema:
            result = schema['default']
        return result

    def _normalize_default(schema, data):
        if data is None:
            return schema.get('default')
        else:
            return data

    def _normalize_ref(schema, data):
        if resolver == None:
            raise TypeError("resolver must be provided")
        ref = schema.get(u"$ref")
        scope, resolved = resolver.resolve(ref)
        if resolved.get('nullable', False) and not data:
            return {}
        return _normalize(resolved, data)

    def _normalize(schema, data):
        if schema is True or schema == {}:
            return data
        if not schema:
            return None
        funcs = {
            'object': _normalize_dict,
            'array': _normalize_list,
            'default': _normalize_default,
            'ref': _normalize_ref
        }
        type_ = schema.get('type', 'object')
        if type_ not in funcs:
            type_ = 'default'
        if schema.get(u'$ref', None):
            type_ = 'ref'

        return funcs[type_](schema, data)

    return _normalize(schema, data), errors
