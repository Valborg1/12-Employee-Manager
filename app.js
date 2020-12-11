var figlet = require('figlet');
const cTable = require('console.table');
const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1234",
  database: "employeeManager_db"
});

// Run connection to workbench
setTimeout(function(){
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
   menu();
  });
}, 1000);

  
// Function to Make Large Font Title in CMD Line  
figlet('~ Employee Manager 5000 ~', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

figlet();

function menu() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "Add a department, role, or employee",
          "View departments, roles, or employees",
          "Update an employee's role",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View all employees":
          allEmployees();
          break;
  
        case "Add a department, role, or employee":
          addDRE();
          break;
  
        case "View departments, roles, or employees":
          viewDRE();
          break;
  
        case "Update an employee's role":
          updateRole();
          break;
  
        case "Exit":
          connection.end();
          break;
        }
      });
  }

//   Function to View All Employees
function allEmployees() {
    var query =   `SELECT e.*, r.*, d.*, IFNULL(CONCAT(m.first_name,' ', m.last_name), 'No Manager') AS manager_name
                    FROM employee AS e
                    LEFT JOIN employee AS m ON e.manager_id = m.employee_id
                    LEFT JOIN role AS r ON e.role_id = r.id 
                    LEFT JOIN department AS d ON r.department_id = d.id`
                
    var array = []
    connection.query(query, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var x = [res[i].employee_id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].name, res[i].manager_name]
            array.push(x)
            // console.log(res)
        }
        console.table(["ID", "First Name", "Last Name", "Title", "Salary", "Department", "Reports To"], array);
        menu();
    })
    
}

// Function Ask about adding a Department, Role, or Employee
function addDRE() {
  inquirer
    .prompt({
      name: "dreMenu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a new department",
        "Add a new role",
        "Add a new employee",
        "Back"
      ]
    })
    .then(function(answer) {
      switch (answer.dreMenu) {
      case "Add a new department":
        addDepartment();
        break;

      case "Add a new role":
        addRole();
        break;

      case "Add a new employee":
        addEmployee();
        break;

      case "Back":
        menu();
        break;
      }
    });
}

// Make the first letter of each word capitalized
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


// Function to add a Department
function addDepartment() {
  inquirer
  .prompt({
    name: "dName",
    type: "input",
    message: "What is the name of the new department?",
    
  }).then(function(answer) {
    var query = `INSERT INTO department (name)
                 VALUES ("${answer.dName}");`

    connection.query(query, function(err, res) {
        if (err) throw err;
    })
    console.log(`${answer.dName} has been added as a department.`);
    menu();
  })
  
}

// Function to add a Role
function addRole() {

    var query = `SELECT * FROM department`
    var array = []

    connection.query(query, function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
          var x = {value: res[i].id, name: res[i].name}
          array.push(x)  
      }
    })

  inquirer
  .prompt([
    {
      name: "rName",
      type: "input",
      message: "What is the name of the new role?",
    },
    {
      name: "rSalary",
      type: "input",
      message: "What is the associated salary?",
    },
    {
      name: "rDept",
      type: "list",
      message: "Which department does this role being to?",
      choices: array
    }
  ]).then(function(answer) {
    var query = `INSERT INTO role (title, salary, department_id)
                 VALUES ("${answer.rName}","${answer.rSalary}","${answer.rDept}")`

    connection.query(query, function(err, res) {
        if (err) throw err;
    })
    console.log(`${answer.rName} has been added as a role.`);
    menu();
  })
}

  
// Function to add a Employee
function addEmployee() {

  var query = `SELECT * FROM role`
  var roles = []

  connection.query(query, function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
        var x = {value: res[i].id, name: res[i].title}
        roles.push(x)  
    }
  })

  var query = `SELECT * FROM employee WHERE manager_id = 0`
  var managers = []

  connection.query(query, function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      var x = {value: res[i].id, firstName: res[i].first_name, lastName: res[i].last_name}
      managers.push(x)
    }
  })

inquirer
.prompt([
  {
    name: "eFirstName",
    type: "input",
    message: "What is the employee's first name?",
  },
  {
    name: "eLastName",
    type: "input",
    message: "What is the employees' last name?",
  },
  {
    name: "eRole",
    type: "list",
    message: "What is the employee's job title?",
    choices: roles
  },
  {
    name: "eManager",
    type: "list",
    message: "Who is the employee's manager?",
    choices: managers
  }
]).then(function(answer) {
  var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
               VALUES ("${answer.eFirstName}","${answer.eLastName}","${answer.eRole}","${answer.eManager}")`

  connection.query(query, function(err, res) {
      if (err) throw err;
  })
  console.log(`${answer.eFirstName} ${answer.eLastName} has been added as an employee.`);
  menu();
})
}
