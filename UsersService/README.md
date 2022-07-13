# User Service APIs

```
http://localhost:7000/user
```

## _Endpoints_

| Description       | API           | Authorization  |
| ------------- |:-------------:| -----:|
| Register User      | `/register` |  |
| Login User     | `/login`      |    |
| Delete restaurant admin | `/:id`      |  SUPER ADMIN   |
| Switch Role(customer/admin) | `/role/:id`      |  SUPER ADMIN   |
| Rate Delivery person | `/delivery/:delvId`      |  CUSTOMER   |
| Get all users/ admins | `/`      |  SUPER ADMIN   |
