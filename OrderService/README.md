# Order Service APIs

Run the following command and test the APIs
```
npm start
```

## _Endpoints_

```
http://localhost:9000/order
```

| Description       | API           | Request Type| Authorization  |
| ------------- |:-------------:|:-------------:| -----:|
| Place/create order      | `/create` | _POST_| CUSTOMER |
| Fetch order status     | `/:orderId`      | _GET_|  CUSTOMER  |
| Update delivery status | `/deliverystatus/:orderId`     | _PATCH_ |  DELIVERY   |
| Update order status | `/orderstatus/:orderId`    | _PATCH_  |  ADMIN   |
| Cancel order | `/:orderId`      | _DELETE_ |  CUSTOMER   |
