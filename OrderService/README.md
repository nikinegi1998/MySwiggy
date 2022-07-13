# Order Service APIs

Run the following command and test the APIs
```
npm start
```

## _Endpoints_

```
http://localhost:9000/order
```

| Description       | API           | Authorization  |
| ------------- |:-------------:| -----:|
| Place/create order      | `/create` | CUSTOMER |
| Fetch order status     | `/:orderId`      |  CUSTOMER  |
| Update delivery status | `/deliverystatus/:orderId`      |  DELIVERY   |
| Update order status | `/orderstatus/:orderId`      |  ADMIN   |
| Cancel order | `/:orderId`      |  CUSTOMER   |
