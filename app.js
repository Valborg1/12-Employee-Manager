var figlet = require('figlet');
const cTable = require('console.table');
const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

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
          "View all employee data",
          "Add a department, role, or employee",
          "View departments, roles, or employees",
          "Update an employee's role",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View all employee data":
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
          figlet('~ Have A Great Day ~', function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data)
        });
          connection.end();
          break;
        }
      });
  }

//   Function to View All Employees
function allEmployees() {
    var query =   `SELECT r.*, d.*, e.*, IFNULL(CONCAT(m.first_name,' ', m.last_name), 'No Manager') AS manager_name
                    FROM employee AS e
                    LEFT JOIN employee AS m ON e.manager_id = m.id
                    LEFT JOIN role AS r ON e.role_id = r.id 
                    LEFT JOIN department AS d ON r.department_id = d.id`
                
    var array = []
    connection.query(query, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var x = [res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].name, res[i].manager_name]
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
        // Inquirer takes VALUE as the identifier (and value attached to the choice), and NAME as the value to display as a choice
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
async function addEmployee() {

  var query = `SELECT * FROM role`
  var roles = []

  var execute = util.promisify(connection.query).bind(connection);

  await execute(query).then(res => {
    for (var i = 0; i < res.length; i++) {
      var x = {value: res[i].id, name: res[i].title}
      roles.push(x)  
  }
  })

  var query = `SELECT * FROM employee WHERE manager_id = 0`
  var managers = []
 
  await execute(query).then(res => {
    managers = res.map(manager => {
      return ({value: manager.id, name: `${manager.first_name} ${manager.last_name}`});
    })
    // console.log("res", res)
    // console.log("managers", managers)
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
  // var query = `SELECT employee_id FROM employee WHERE manager `
  var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
               VALUES ("${answer.eFirstName}","${answer.eLastName}","${answer.eRole}","${answer.eManager}")`
 
  connection.query(query, function(err, res) {
      if (err) throw err;
  })
  console.log(`${answer.eFirstName} ${answer.eLastName} has been added as an employee.`);
  menu();
})
}


// Function Ask about adding a Department, Role, or Employee
function viewDRE() {
  inquirer
    .prompt({
      name: "viewDREMenu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "See all departments",
        "See all roles",
        "See all employees",
        "Back"
      ]
    })
    .then(function(answer) {
      switch (answer.viewDREMenu) {
      case "See all departments":
        viewDepartment();
        break;

      case "See all roles":
        viewRole();
        break;

      case "See all employees":
        viewEmployee();
        break;

      case "Back":
        menu();
        break;
      }
    });
}


function viewDepartment() {
  var query =   `SELECT * FROM department`
  var departments = []

  connection.query(query, function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
          var x = [res[i].id, res[i].name]
          departments.push(x)
      }
      console.table(["Department ID", "Department Name"], departments);
      menu();
  })
  
}

function viewRole() {
  var query =   `SELECT * FROM role`
  var roles = []

  connection.query(query, function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
          var x = [res[i].id, res[i].title, res[i].salary]
          roles.push(x)
      }
      console.table(["Role ID", "Title", "Salary"], roles);
      menu();
  })
  
}

function viewEmployee() {
  var query =   `SELECT * FROM employee`
  var employees = []

  connection.query(query, function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
          var x = [res[i].id, res[i].first_name, res[i].last_name]
          employees.push(x)
      }
      console.table(["Employee ID", "First Name", "Last Name"], employees);
      menu();
  })
  
}



// Function to Change and Employee Role
async function updateRole() {

  var query = `SELECT * FROM role`
  var roles = []

  var execute = util.promisify(connection.query).bind(connection);

  await execute(query).then(res => {
    for (var i = 0; i < res.length; i++) {
      var x = {value: res[i].id, name: res[i].title}
      roles.push(x)  
  }
  })

  var query = `SELECT * FROM employee`
  var employees = []
 
  await execute(query).then(res => {
    employees = res.map(ee => {
      return ({value: ee.id, name: `${ee.first_name} ${ee.last_name}`});
    })
    // console.log("res", res)
    // console.log("managers", managers)
  })
inquirer
.prompt([
  {
    name: "chooseEE",
    type: "list",
    message: "Select the employee who needs their role updated.",
    choices: employees
  },
  {
    name: "newRole",
    type: "list",
    message: "What should their new role be?",
    choices: roles
  },
]).then(function(answer) {
  var query = `UPDATE employee SET role_id = ${answer.newRole} WHERE id = ${answer.chooseEE}`
 
  connection.query(query, function(err, res) {
      if (err) throw err;
  })
  console.log(`The role has been updated.`);
  menu();
})
}