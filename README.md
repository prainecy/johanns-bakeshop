
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
│  │     ├─ .gitkeep
│  │     ├─ aboutus.jpg
│  │     ├─ bg-black.jpg
│  │     ├─ brownies1.jpg
│  │     ├─ brownies2.jpg
│  │     ├─ brownies3.jpg
│  │     ├─ cake1.jpg
│  │     ├─ cake10.jpg
│  │     ├─ cake11.jpg
│  │     ├─ cake12.jpg
│  │     ├─ cake2.jpg
│  │     ├─ cake3.jpg
│  │     ├─ cake4.jpg
│  │     ├─ cake5.jpg
│  │     ├─ cake6.jpg
│  │     ├─ cake7.jpg
│  │     ├─ cake8.jpg
│  │     ├─ cake9.jpg
│  │     ├─ cakebg.png
│  │     ├─ connective.png
│  │     ├─ cookie1.jpg
│  │     ├─ cookie2.jpg
│  │     ├─ Crowned_Legacy_Logo.png
│  │     ├─ cupcake1.jpg
│  │     ├─ cupcake2.jpg
│  │     ├─ emptycart.png
│  │     ├─ favicon.png
│  │     ├─ logo.jpg
│  │     ├─ logo.png
│  │     ├─ maintenance.png
│  │     ├─ maintenance2.png
│  │     ├─ product1.jpg
│  │     ├─ product1.png
│  │     ├─ product2.jpg
│  │     ├─ product2.png
│  │     ├─ product3.jpeg
│  │     ├─ product3.png
│  │     ├─ product4.jpg
│  │     ├─ product4.png
│  │     ├─ testimonial1.jpeg
│  │     ├─ testimonial2.jpg
│  │     ├─ testimonial3.jpeg
│  │     ├─ testimonial4.jpg
│  │     ├─ testimonial5.jpg
│  │     └─ testimonial6.jpg
│  ├─ Content
│  │  └─ app.css
│  └─ Scripts
│     └─ app.js
├─ routes
│  └─ index.js
├─ server.js
└─ views
   ├─ about.ejs
   ├─ cart.ejs
   ├─ contact.ejs
   ├─ error.ejs
   ├─ home.ejs
   ├─ login.ejs
   ├─ maintenance.ejs
   ├─ menu.ejs
   ├─ partials
   │  ├─ footer.ejs
   │  └─ header.ejs
   └─ shop.ejs



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
