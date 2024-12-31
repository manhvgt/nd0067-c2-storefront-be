CREATE TABLE "Bill" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  customer_id INT NOT NULL,
  order_ids INT[] NOT NULL,
  datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount_original NUMERIC(10, 2) NOT NULL,
  amount_payable NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES "User"(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_customer
    FOREIGN KEY(customer_id) 
    REFERENCES "Customer"(id)
    ON DELETE CASCADE
);
