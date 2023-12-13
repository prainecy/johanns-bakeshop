johanns-bakeshop
├─ config
│  ├─ app.js
│  └─ db.js
├─ models
│  ├─ message.js
│  ├─ product.js
│  └─ users.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ assets
│  │  └─ images
│  │     └─ [several image files]
│  ├─ Content
│  │  └─ app.css
│  └─ Scripts
│     └─ app.js
├─ routes
│  └─ index.js
├─ server.js
└─ views
   ├─ [several .ejs files]
   └─ partials
      ├─ footer.ejs
      └─ header.ejs


   +-----------------+       +-----------------+
|     Product     |       |      User       |
|-----------------| 1   N |-----------------|
| _id: ObjectId   |<------| username: String|
| Name: String    |       | password: String|
| Type: String    |       | email: String   |
| Cost: Number    |       | cart: CartItem[]|
| Relevance: Number|      | orders: Order[] |
+-----------------+       +-----------------+
                                 | 1
                                 |
                                 | N
                          +-----------------+
                          |    CartItem     |
                          |-----------------|
                          | product: ObjectId|
                          | quantity: Number |
                          | createdAt: Timestamp|
                          | updatedAt: Timestamp|
                          +-----------------+
                                 | 1
                                 |
                                 | N
                          +-----------------+
                          |      Order      |
                          |-----------------|
                          | products: CartItem[]|
                          | subtotal: Number  |
                          | tax: Number      |
                          | total: Number    |
                          | date: Date       |
                          +-----------------+

+-----------------+
|     Message     |
|-----------------|
| _id: ObjectId   |
| firstName: String|
| lastName: String|
| contactNumber: String|
| emailAddress: String|
| message: String |
| createdAt: Timestamp|
| updatedAt: Timestamp|
+-----------------+



Products Collection
-------------------
Product
  _id: ObjectId
  Name: String
  Type: String
  Cost: Number
  Relevance: Number

Users Collection
----------------
User
  _id: ObjectId
  username: String (unique)
  password: String
  email: String
  cart: Array of CartItem
  orders: Array of Order

CartItem (Embedded in User)
---------------------------
CartItem
  product: ObjectId (References Product)
  quantity: Number
  createdAt: Timestamp
  updatedAt: Timestamp

Order (Embedded in User)
------------------------
Order
  products: Array of CartItem (Embedded)
  subtotal: Number
  tax: Number
  total: Number
  date: Date

Messages Collection
-------------------
Message
  _id: ObjectId
  firstName: String
  lastName: String
  contactNumber: String
  emailAddress: String
  message: String
  createdAt: Timestamp
  updatedAt: Timestamp

Relationships
-------------
- User to CartItem: One-to-Many (Each user can have multiple cart items)
- User to Order: One-to-Many (Each user can have multiple orders)
- CartItem to Product: Many-to-One (Each cart item references one product)
- Order contains CartItem: One-to-Many (Each order contains multiple cart items)
- Message: Standalone collection (No direct relationship with other collections but stores customer messages)
