DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(40) NOT NULL,
  department_name VARCHAR(20) NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Star Wars shirt", "Clothing", 16.99, 40),
("Basketball", "Sports", 36.36, 100),
("Carhartt Jacket", "Clothing", 119.99, 50),
("Settlers of Catan", "Board Games", 39.88, 35),
("Small World", "Board Games", 36.93, 50),
("Exploding Kittens NSFW", "Card Games", 19.99, 60),
("Joking Hazard", "Card Games", 25.00, 50),
("Ticket to Ride", "Board Games", 29.99, 40),
("Gatorade 6ct 12oz", "Food and Drink", 3.99, 120),
("Bundaberg Ginger Beer 12ct 375ml", "Food and Drink", 28.00, 60),
("Peppered Salmon Jerky 6pk", "Food and Drink", 24.94, 70),
("Archery Target 22in", "Sports", 67.81, 55);

SELECT * FROM products;