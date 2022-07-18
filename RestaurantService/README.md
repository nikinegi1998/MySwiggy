# Restaurant and Menu Service APIs

Run the following command and test the APIs
```
npm start
```

## _Endpoints_

```
http://localhost:8000/restaurant
```

| Description       | API         | Request Type  | Authorization  |
| ------------- |:-------------:|:-------------:| -----:|
| Create/ Add new restaurant      | `/create` | _POST_| SUPER ADMIN |
| Add new admin to restaurant     | `/create/:rId/:adminId`  | _PATCH_ |  SUPER ADMIN  |
| Delete Restaurant | `/:rId`      | _DELETE_ |  SUPER ADMIN   |
| Give ratings to restaurant | `/rate/:rId`     | _PATCH_ |  CUSTOMER   |
| Search restaurant | `/search/?filter=location&value=roh`    |  _GET_ |     |
| Get all restaurants | `/`     | _GET_ |     |



## _Endpoints_

```
http://localhost:8000/menu
```

| Description       | API           | Request Type| Authorization  |
| ------------- |:-------------:|:-------------:| -----:|
| Get all cuisines from database      | `/cuisine`| _GET_ |  |
| Create new cuisine     | `/create/:rid/menu`     | _POST_ |  ADMIN  |
| Delete cuisine | `/delete/:rid/:menuId`      | _DELETE_ |  ADMIN   |
| Get all cuisines of a restaurant | `/:rid`      | _GET_ |     |
| Create a dish in a cuisine | `/create/:rid/:menuId`     | _POST_ |  ADMIN   |
| Update dish in a cuisine | `/:menuId/:dishId`      | _POST_ |  ADMIN   |
| Delete dish in a cuisine | `/:menuId/dish/:dId`    | _DELETE_  |  ADMIN   |
| Get all dish in a cuisine | `/create/:rid/:menuId`     | _GET_ |     |
