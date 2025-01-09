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
