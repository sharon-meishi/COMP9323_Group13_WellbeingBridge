# User guide for COMP9323 Group13 Project WellbeingBridge

## Enviroment requirement
* Python 3.6+
* Npm
* Network connection (For third-party service purpose)


# Database Server

This project is using local MySQL database, therefore you need to have your MySQL server running on your computer before running the project.

## Installation
### Download MySQL Community Server.
For Windows users, follow steps in https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/windows-installation.html


For Mac users, follow steps in https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/macos-installation-pkg.html


## Running
### Start MySQL server
For Windows users, follow steps in https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/windows-start-service.html


For Mac users, follow steps in https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/macos-installation-launchd.html


# Backend (Inside backend folder)

## Installation

Before

1. Create virtual env (First time)

```shell
python3 -m venv env
```

2. Active env (Every time)

For Mac users:
```shell
source env/bin/activate
```

For Windows users:
```shell
cd env
cd Scripts
activate
```

3. Install requirement library(First time)
```shell
pip3 install -r requirements.txt
```

## Configuration specification (For database connection)
### Backend
Go to the configuration of system in *./backend/config.py* and change following value as you need.
* DB_ACCOUNT: The username of database
* DB_PASSWORD: The password for database user
* DB_NAME: The database name on the database server
* DB_URL: The host name of database
* DB_PORT: The running port of database
### Frontend
Go to the configuration file in *./frontend/src/configData.json* and change following values as you need.
* Google Cloud Platform API key

 

## Database initialization(First time only)
Before you run, please make sure you already update config.py
```shell
python3 initialize_database.py
```

## Running
```shell
python3 app.py
```

## Notes
* Server running on 127.0.0.1/8000
* To specify running port, change port number in file **app.py** last line: `app.run(debug=True, port=XXXX)`, where `XXXX` is your prefer
port number
* open **127.0.0.1/8000** in the browser to check swagger document

# Frontend (Inside frontend folder)

1. 
```
yarn install
```

2.
```
yarn start
```

## Notes
* Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

