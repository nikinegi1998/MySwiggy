# User Service APIs

Run the following command and test the APIs
```
npm start
```

## _Endpoints_

```
http://localhost:7000/user
```

| Description       | API           | Request Type           | Authorization  |
| ------------- |:-------------:|:-------------:| -----:|
| Register User      | `/register` | _POST_ |  |
| Login User     | `/login`      |_POST_ |    |
| Delete restaurant admin | `/:id`      |_DELETE_ |  SUPER ADMIN   |
| Switch Role(customer/admin) | `/role/:id`      | _PATCH_ |  SUPER ADMIN   |
| Rate Delivery person | `/delivery/:delvId`      | _PATCH_ |  CUSTOMER   |
| Get all users/ admins | `/`      | _GET_ |  SUPER ADMIN   |
