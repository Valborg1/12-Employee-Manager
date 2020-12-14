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
INSERT INTO employee (first_name, last_name, role_id)
VALUES 
    ("Rick", "Bremer", 1),
    ("Mark", "Wegman", 5),
    ("Kelly", "Allen", 9),
    ("Haywood", "Muller", 13),
    ("Larisa", "Galdamez", 17);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    -- Marketing
    ("Joseph", "Marquez", 2, 1),
    ("Michael", "Torres", 3, 1),
    ("Karl", "Dash", 4, 1),
    ("Laura", "Stewart", 4, 1),

    -- Sales
    ("Sheldon", "Casey", 6, 2),
    ("Larry", "Barber", 6, 2),
    ("Kevin", "Price", 7, 2),
    ("Maria", "White", 7, 2),
    ("Richard", "Briscoe", 7, 2),
    ("Robert", "Dibble", 8, 2),

    -- Operations
    ("Seth", "Jackson", 10, 3),
    ("Annie", "England", 11, 3),
    ("Chastity", "Lyon", 12, 3),

    -- Engineering
    ("Elanor", "Davis", 14, 4),
    ("Essie", "Heath", 14, 4),
    ("Richard", "Brito", 15, 4),
    ("Dorthy", "Wingert", 15, 4),
    ("Daniel", "Fisher", 16, 4),

    -- Finance
    ("Alexander", "Green", 18, 5),
    ("Erica", "Christensen", 19, 5),
    ("Paul", "McKinney", 20, 5);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;
