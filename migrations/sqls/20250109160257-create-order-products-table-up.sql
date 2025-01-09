CREATE TABLE "Order_products" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INTEGER, 
  product_id INTEGER, 
  quantity INTEGER,
  CONSTRAINT fk_order
    FOREIGN KEY(order_id) 
    REFERENCES "Order"(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_product
    FOREIGN KEY(product_id) 
    REFERENCES "Product"(id)
    ON DELETE CASCADE
);
