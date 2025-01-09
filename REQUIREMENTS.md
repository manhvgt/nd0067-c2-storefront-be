# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints
All routes below are append from server root url, by default `http://localhost:3000`.\
They are complied with RESTful regulation.

#### Products
`/products`

- `/products/ [GET]` Index: To get all products 
- `/products/:id [GET]` Show: To get product details by ID
- `/products/ [POST]` Create [token required]: To create new product
- `/products/:id [PUT]` Update [token required]: To update product by ID
- `/products/:id [DELETE]` Remove [token required]: To delete product by ID

#### Users
`/users`

- `/users/ [GET]` Index [token required]: To get all users 
- `/users/:id [GET]` Show [token required]: To get user details by ID
- `/users/ [POST]` Create: To create new user and return its token
- `/users/:id [PUT]` Update [token required]: To update user by ID
- `/users/:id [DELETE]` Remove [token required]: To delete user by ID

#### Orders
`/orders`

- `/orders/ [GET]` Index [token required]: To get all orders, which belongs to authenticated user (from token) 
- `/orders/:id [GET]` Show [token required]: To get order details by ID
- `/orders/ [POST]` Create [token required]: To create new order
- `/orders/:id [PUT]` Update [token required]: To update order by ID
- `/orders/:id [DELETE]` Remove [token required]: To delete order by ID

#### Bills
`/bills`

- `/bills/ [GET]` Index [token required]: To get all bills, which belongs to authenticated user (from token) 
- `/bills/:id [GET]` Show [token required]: To get bill details by ID
- `/bills/ [POST]` Create [token required]: To create new bill
- `/bills/:id [PUT]` Update [token required]: To update bill by ID
- `/bills/:id [DELETE]` Remove [token required]: To delete bill by ID


## Data Shapes
There are 4 tables below.
- Product
- User
- Order
- Bill
Relationship between tables
- 1 User has many Bill (User do shopping many times, each time is 1 Bill)
- 1 Bill has many Order 
- 1 Order is with a quantity of 1 Product (To suppose that a split part of an order in real life) 

#### Product
This Table is to store products and their information.

<pre>
CREATE TABLE "Product" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL,
  remark TEXT
);
</pre>


#### User
This Table is to store users and their information.

<pre>
CREATE TABLE "User" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile VARCHAR(15) NOT NULL UNIQUE,
  gender VARCHAR(10) NOT NULL,
  role VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);
</pre>

#### Order
This Table is to store orders and their information. The order is for 01 products and belongs to 01 user.

<pre>
CREATE TABLE "Order" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL,
  datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discount NUMERIC(5, 2) DEFAULT 0,
  remark TEXT,
  CONSTRAINT fk_product
    FOREIGN KEY(product_id) 
    REFERENCES "Product"(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES "User"(id)
    ON DELETE CASCADE
);
</pre>

#### Bill
This Table is to store bills and their information. The bill belonga to 01 user and contain 1 or many orders for product.

<pre>
CREATE TABLE "Bill" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  order_ids INT[] NOT NULL, /* This array contains all order_id in the bill (1 bill to many order relationship ) */
  datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount_original NUMERIC(10, 2) NOT NULL,
  amount_payable NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES "User"(id)
    ON DELETE CASCADE
);
</pre>
