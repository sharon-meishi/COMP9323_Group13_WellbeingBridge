# COMP9323_Group13_WellbeingBridge
Group project of COMP9323

# Backend 

## Installation

Before

1. Create virtual env (First time)

```shell
python3 -m venv env
```

2. Active env (Every time)

```shell
source env/bin/activate
```
3. Install requirement library(First time)
```shell
pip3 install -r requirements.txt
```

After that you are good to go

## Running
```shell
python3 app.py
```

## Notes
* Server running on 127.0.0.0/8000
* To specify running port, in file **app.py** replace `app.run(debug=True)` by `app.run(debug=True, port=XXXX)` where `XXXX` is your prefer
port number
