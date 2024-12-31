CREATE TABLE "Order" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INT NOT NULL,
  customer_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL,
  datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discount NUMERIC(5, 2) DEFAULT 0,
  remark TEXT,
  CONSTRAINT fk_product
    FOREIGN KEY(product_id) 
    REFERENCES "Product"(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_customer
    FOREIGN KEY(customer_id) 
    REFERENCES "Customer"(id)
    ON DELETE CASCADE
);
