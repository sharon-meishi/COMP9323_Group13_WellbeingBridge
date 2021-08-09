# reserve for db.init()


# start run the flask server
try:
    from flask_app import app
    import apis.auth
    import apis.event
    import apis.organization
    import apis.user
    import apis.popular
    import apis.search

    app.run(debug=True, port=8000)
except ImportError as e:
    print(e)