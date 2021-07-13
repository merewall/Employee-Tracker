// Required dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: '',
    database: 'companyDB',
  });

const allEmp = () => {
    connection.query('SELECT * FROM employee', (err,employees) => {
        if (err) throw err;
        console.log("All company employees are as follows:");
        console.table(employees);
        init();
    });
}

const empByDept = () => {
    connection.query('SELECT name AS name, id AS value FROM departments', (err, choices) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which department?",
                choices,
                name: "chosen-dept"
            },
        ]).then((answer) => {
            console.log(answer)
            // connection.query('SELECT * FROM employee WHERE ?', answer, (err,res) => {
            //     if (err) throw err;
            //     console.log(`${answer.title} successfully added as a role!`);
            //     init();
            // })
        });
    });  
    // connection.query('SELECT * FROM employee WHERE ?', data, (err,employees) => {
    //     if (err) throw err;
    //     console.log(`All company employees in ${data} are as follows:`);
    //     console.table(employees);
    //     init();
    // });
}

const empByMgr = () => {
    
}

const addEmp = () => {
    connection.query('SELECT title AS name, id AS value FROM role', (err, choices) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "first_name"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "last_name"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                choices,
                name: "role_id"
            }
        ]).then((answer) => {
            console.log(answer);
            // FIGURE OUT HOW TO GET TO A LIST OF MANAGER'S
            // connection.query('SELECT title AS name, id AS value FROM role WHERE role_id = ', answer, (err,departments) => {
            //     if (err) throw err;
            //     console.log(`${answer.name} successfully added to departments!`);
            //     console.log(departments);
            //     init();
            // })
    });      
}

const remEmp = () => {
    connection.query('SELECT first_name AS name, id AS value FROM employee', (err, choices) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee would you like to remove?",
                choices,
                name: "id"
            },
        ]).then((answer) => {
            console.log(answer);
            connection.query('DELETE FROM employee WHERE ?', answer, (err,res) => {
                if (err) throw err;
                console.log(`Successfully removed as an employee!`);
                init();
            })
        });
    }); 
    
}

const updateRole = () => {
    
}

const updateMgr = () => {
    
}

const allRoles = () => {
    connection.query('SELECT title FROM role', (err,roles) => {
        if (err) throw err;
        console.log("All of the company roles are as follows:");
        console.table(roles);
        init();
    });
}

const allDept = () => {
    connection.query('SELECT name FROM departments', (err,departments) => {
        if (err) throw err;
        console.log("All of the company departments are as follows:");
        console.table(departments);
        init();
    });
}

const addDept = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department you want to add?",
            name: "name"
        }
    ]).then((answer) => {
        console.log(answer);
        connection.query('INSERT INTO departments SET ?', answer, (err,departments) => {
            if (err) throw err;
            console.log(`${answer.name} successfully added to departments!`);
            console.log(departments);
            init();
        })
    });
};

const addRole = () => {
    connection.query('SELECT name AS name, id AS value FROM departments', (err, choices) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the role you want to add?",
                name: "title"
            },
            {
                type: "number",
                message: "What is the salary of the role?",
                name: "salary",
                validate: (value) => {
                    if (!value) {
                        console.log("\x1b[31m","\nYou must provide a salary!");
                        return false;
                    } else if (typeof value !== 'number') {
                        console.log("\x1b[31m",'\nThe salary must be a number (no commas)!');
                        return false;
                    } else {
                        return true;
                    }
                },
                filter: (value) => {
                    if (isNaN(value)) {
                    return '' 
                    } else {
                        return value
                    }
                },
            },
            {
                type: "list",
                message: "Which department is the role in?",
                choices,
                name: "department_id"
            },
        ]).then((answer) => {
            console.log(answer);
            connection.query('INSERT INTO role SET ?', answer, (err,res) => {
                if (err) throw err;
                console.log(`${answer.title} successfully added as a role!`);
                init();
            })
        });
    });  
};

const remDept = () => {
    connection.query('SELECT name AS name, id AS value FROM departments', (err, choices) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which department would you like to remove?",
                choices,
                name: "id"
            },
        ]).then((answer) => {
            console.log(answer);
            connection.query('DELETE FROM departments WHERE ?', answer, (err,res) => {
                if (err) throw err;
                console.log(`Successfully removed as a department!`);
                init();
            })
        });
    });  
}

const remRole = () => {
    connection.query('SELECT title AS name, id AS value FROM role', (err, choices) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which role would you like to remove?",
                choices,
                name: "id"
            },
        ]).then((answer) => {
            console.log(answer);
            connection.query('DELETE FROM role WHERE ?', answer, (err,res) => {
                if (err) throw err;
                console.log(`Successfully removed as a role!`);
                init();
            })
        });
    });  
}

const deptBudget = () => {

}

//   Initialization function
const init = () => {
    inquirer.prompt([
      {
        type: "list",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "View All Departments",
          "Add Department",
          "Add Role",
          "Remove Department",
          "Remove Role",
          "View Total Utilized Budget By Department",
          "Exit"
        ],
        message: "What would you like to do?",
        name: "start"
      }
    ]).then((answer) => {
      
        // switch cases for each user answer
        switch(answer.start) {
            case "View All Employees": {
            return allEmp();
            }
            case "View All Employees By Department": {
            return empByDept();
            }
            case "View All Employees By Manager": {
            return empByMgr();
            }
            case "Add Employee": {
            return addEmp();
            }
            case "Remove Employee": {
            return remEmp();
            }
            case "Update Employee Role": {
            return updateRole();
            }
            case "Update Employee Manager": {
            return updateMgr();
            }
            case "View All Roles": {
            return allRoles();
            }
            case "View All Departments": {
            return allDept();
            }
            case "Add Department": {
            return addDept();
            }
            case "Add Role": {
            return addRole();
            }
            case "Remove Department": {
            return remDept();
            }
            case "Remove Role": {
            return remRole();
            }
            case "View Total Utilized Budget By Department": {
            return deptBudget();
            }
            default: {
            return process.exit();
            }
            }
        });
  }

//   Connect
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    init();
    });