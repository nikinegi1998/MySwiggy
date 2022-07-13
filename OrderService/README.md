# Order Service APIs

```
http://localhost:9000/order
```

## _Endpoints_

| Description       | API           | Authorization  |
| ------------- |:-------------:| -----:|
| Place/create order      | `/create` | CUSTOMER |
| Fetch order status     | `/:orderId`      |  CUSTOMER  |
| Update delivery status | `/deliverystatus/:orderId`      |  DELIVERY   |
| Update order status | `/orderstatus/:orderId`      |  ADMIN   |
| Cancel order | `/:orderId`      |  CUSTOMER   |
