# Restaurant and Menu Service APIs

```
http://localhost:8000/restaurant
```

## _Endpoints_

| Description       | API           | Authorization  |
| ------------- |:-------------:| -----:|
| Create/ Add new restaurant      | `/create` | SUPER ADMIN |
| Add new admin to restaurant     | `/create/:rId/:adminId`      |  SUPER ADMIN  |
| Delete Restaurant | `/:rId`      |  SUPER ADMIN   |
| Give ratings to restaurant | `/rate/:rId`      |  CUSTOMER   |
| Search restaurant | `/search/?filter=location&value=roh`      |     |
| Get all restaurants | `/`      |     |


```
http://localhost:8000/menu
```

## _Endpoints_

| Description       | API           | Authorization  |
| ------------- |:-------------:| -----:|
| Get all cuisines from database      | `/cuisine` |  |
| Create new cuisine     | `/create/:rid/menu`      |  ADMIN  |
| Delete cuisine | `/delete/:rid/:menuId`      |  ADMIN   |
| Get all cuisines of a restaurant | `/:rid`      |     |

| Create a dish in a cuisine | `/create/:rid/:menuId`      |  ADMIN   |
| Update dish in a cuisine | `/:menuId/:dishId`      |  ADMIN   |
| Delete dish in a cuisine | `/:menuId/dish/:dId`      |  ADMIN   |
| Get all dish in a cuisine | `/create/:rid/:menuId`      |     |
