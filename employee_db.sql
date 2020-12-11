DROP DATABASE IF EXISTS employeeManager_db;
CREATE database employeeManager_db;

USE employeeManager_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL DEFAULT "0"
);


INSERT INTO department (name)
VALUES 
    ("Marketing"),
    ("Sales"),
    ("Operations"),
    ("Engineering"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Marketing Manager", 80000, 1),
    ("Marketing and Promotions", 50000, 1),
    ("Marketing Analyst", 55000, 1),
    ("Marketing Consultant", 55750, 1),

    ("Sales Manager", 78000, 2),
    ("Lead Generation", 45000, 2),
    ("Account Manager", 55000, 2),
    ("Sales Support", 30000, 2),

    ("Operations Manager", 90000, 3),
    ("Operations Coordinator", 60000, 3),
    ("Logistician", 57000, 3),
    ("Project Manager", 72000, 3),

    ("Engineering Manager", 90000, 4),
    ("Front End Developer", 75000, 4),
    ("Back End Developer", 74000, 4),
    ("UX/UI Designer", 73000, 4),

    ("Finance Manager", 88000, 5),
    ("Financial Analyst", 58000, 5),
    ("Budget Analyst", 54000, 5),
    ("Accountant", 61000, 5);

-- Managers
INSERT INTO employee (employee_id, first_name, last_name, role_id)
VALUES 
    (100, "Rick", "Bremer", 1),
    (101, "Mark", "Wegman", 5),
    (102, "Kelly", "Allen", 9),
    (103, "Haywood", "Muller", 13),
    (104, "Larisa", "Galdamez", 17);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES
    -- Marketing
    (105, "Joseph", "Marquez", 2, 100),
    (106, "Michael", "Torres", 3, 100),
    (107, "Karl", "Dash", 4, 100),
    (108, "Laura", "Stewart", 4, 100),

    -- Sales
    (109, "Sheldon", "Casey", 6, 101),
    (110, "Larry", "Barber", 6, 101),
    (111, "Kevin", "Price", 7, 101),
    (112, "Maria", "White", 7, 101),
    (113, "Richard", "Briscoe", 7, 101),
    (114, "Robert", "Dibble", 8, 101),

    -- Operations
    (115, "Seth", "Jackson", 10, 102),
    (116, "Annie", "England", 11, 102),
    (117, "Chastity", "Lyon", 12, 102),

    -- Engineering
    (118, "Elanor", "Davis", 14, 103),
    (119, "Essie", "Heath", 14, 103),
    (120, "Richard", "Brito", 15, 103),
    (121, "Dorthy", "Wingert", 15, 103),
    (122, "Daniel", "Fisher", 16, 103),

    -- Finance
    (123, "Alexander", "Green", 18, 104),
    (124, "Erica", "Christensen", 19, 104),
    (125, "Paul", "McKinney", 20, 104);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;
