# User guide for COMP9323 Group13 Project WellbeingBridge 


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

## Database initialization(First time and everytime you want to reset database)
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

