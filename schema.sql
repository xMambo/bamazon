CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);

Select * from products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mountainsmith Mountain Tipi Tent: 2-person 3-Season", "Hike & Camp", 249.49, 20),
("Stanley Cool Grip Percolator - 6 Cup", "Camp Kitchen", 39.99, 40),
("Prana M-65 Jacket - Men's", "Men's Clothing", 168.95, 30),
("Kelty Cosmic 40 Sleeping Bag: 40 Degree Down", "Sleeping Bags", 129.95, 50),
("Adidas Ultraboost 18 Running Shoes", "Men's Shoes", 116.97, 20),
("Garmin Fenix 5 GPS Watch", "Men's Watches", 674.99, 10),
("GoPro Hero 7", "Electronics", 359.99, 25),
("Patagonia Dirt Roamer Bike Shorts", "Men's Clothing", 99.00, 20),
("Lezyne RAP-15 CO2 Multi Tool", "Bike Maintenance", 29.99, 30),
("Adidas Outdoor Pullover", "Men's Clothing", 59.95, 40);
