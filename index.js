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

// WORKS! 
const allEmp = () => {
    connection.query(
        `SELECT 
            allEmployees.id AS ID,
            allEmployees.first_name AS First_Name,
            allEmployees.last_name AS Last_Name,
            allEmployees.title AS Title,
            allEmployees.name AS Department,
            allEmployees.salary AS Salary,
            allEmployees.manager AS Manager
        FROM 
            (SELECT 
                employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                role.department_id, 
                departments.name, 
                role.salary, 
                employee.manager_id,
                concat(m.first_name," ", m.last_name) manager
            FROM employee
            LEFT JOIN employee m ON m.id = employee.manager_id
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN departments ON role.department_id = departments.id)
        AS allEmployees`,
        (err,employees) => {
        if (err) throw err;
        console.log("\nAll company employees are as follows:");
        console.table(employees);
        init();
    });
}

// WORKS!
const empByDept = () => {
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which department?",
                choices() {
                    const choiceArray = [];
                    results.forEach((department) => {
                      choiceArray.push(`${department.name}`);
                    });
                    return choiceArray;
                  },
                name: "chosenDept"
            },
        ]).then((answer) => {
                        
            connection.query(
                `SELECT 
                    allEmployees.id AS ID,
                    allEmployees.first_name AS First_Name,
                    allEmployees.last_name AS Last_Name,
                    allEmployees.title AS Title,
                    allEmployees.salary AS Salary,
                    allEmployees.manager AS Manager
                FROM 
                    (SELECT 
                        employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        role.department_id, 
                        departments.name, 
                        role.salary, 
                        employee.manager_id,
                        concat(m.first_name," ", m.last_name) manager
                    FROM employee
                    LEFT JOIN employee m ON m.id = employee.manager_id
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN departments ON role.department_id = departments.id)
                AS allEmployees
                WHERE ?`, 
            {name: answer.chosenDept}, 
            (err,res) => {

            if (err) throw err;
            console.log(`\nEmployees in the ${answer.chosenDept} department are as follows:\n`);
            console.table(res);
            init();

            });
        });
    });  
}

// works!
const empByMgr = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which manager?",
                choices() {
                    const choiceArray = [];
                    results.forEach((employee) => {
                      choiceArray.push(`${employee.first_name} ${employee.last_name}`);
                    });
                    return choiceArray;
                  },
                name: "chosenMgr"
            },
        ]).then((answer) => {
                        
            connection.query(
                `SELECT 
                    allEmployees.id AS ID,
                    allEmployees.first_name AS First_Name,
                    allEmployees.last_name AS Last_Name,
                    allEmployees.title AS Title,
                    allEmployees.name AS Department,
                    allEmployees.salary AS Salary
                    
                FROM 
                    (SELECT 
                        employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        role.department_id, 
                        departments.name, 
                        role.salary, 
                        employee.manager_id,
                        concat(m.first_name," ", m.last_name) manager
                    FROM employee
                    LEFT JOIN employee m ON m.id = employee.manager_id
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN departments ON role.department_id = departments.id)
                AS allEmployees
                WHERE ?`, 
                {Manager: answer.chosenMgr},
                (err,res) => {
                if (err) throw err;
                console.log(`\nEmployees managed by ${answer.chosenMgr} are as follows:\n`);
                console.table(res);
                init();
                }
            );
        });
    });  
    
}

// WORKS!
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
            connection.query('SELECT * FROM employee', (err, results) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices() {
                            const choiceArray = [];
                            results.forEach(({first_name, last_name }) => {
                              choiceArray.push(`${first_name} ${last_name}`);
                            });
                            return choiceArray;
                          },
                        name: "manager"
                    }
                ]).then((answer2) => {
                    let chosenManager;
                    results.forEach((employee) => {
                        if(`${employee.first_name} ${employee.last_name}` === answer2.manager) {
                            chosenManager = employee;
                        }
                    });
                    answer.manager_id = chosenManager.id;
                    connection.query('INSERT INTO employee SET ?', answer, (err, results) => {
                        if(err) throw err;
                        console.log(`\nYou added ${answer.first_name} ${answer.last_name} as an employee!\n`);
                        init();
                    });
                    
                });
            });
        });      
    })
};

// WORKS!
const remEmp = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee would you like to remove?",
                choices() {
                    const choiceArray = [];
                    results.forEach(({first_name, last_name }) => {
                      choiceArray.push(`${first_name} ${last_name}`);
                    });
                    return choiceArray;
                  },
                name: "removedEmp"
            },
        ]).then((answer) => {
            console.log(answer);
            let chosenEmployee;
            results.forEach((employee) => {
                if(answer.removedEmp === `${employee.first_name} ${employee.last_name}`) {
                    chosenEmployee = employee
                };
            });
            console.log(chosenEmployee);
            connection.query('DELETE FROM employee WHERE ?', {id: chosenEmployee.id}, (err,res) => {
                if (err) throw err;
        
                console.log(`\nSuccessfully removed ${answer.removedEmp} as an employee!\n`);
                init();
            });
        });
    }); 
    
}

// WORKS!
const updateRole = () => {

    connection.query(
        `SELECT *
        FROM employee`,
        (err, results) => {
        if (err) throw err;
        
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee would you like to update?",
                choices() {
                    const choiceArray = [];
                    results.forEach(({first_name, last_name }) => {
                      choiceArray.push(`${first_name} ${last_name}`);
                    });
                    return choiceArray;
                  },
                name: "empToUpdate"
            }
        ]).then((answer) => {
            
            let chosenEmployee;
            results.forEach((employee) => {
                if(answer.empToUpdate === `${employee.first_name} ${employee.last_name}`) {
                    chosenEmployee = employee
                };
            });
            
            connection.query('SELECT title AS name, id AS value FROM role', (err, choices) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What is their updated role?",
                        choices,
                        name: "updatedRole"
                    }
                ]).then((answer) => {
                    console.log(answer);
                    connection.query(
                        `UPDATE employee
                        SET role_id = ${answer.updatedRole}
                        WHERE ?`,
                        {id: chosenEmployee.id}, 
                        (err,res) => {
                        if (err) throw err;
                        console.log(`\n${chosenEmployee.first_name} ${chosenEmployee.last_name}'s role successfully updated!\n`);
                        init();
                    })
                });
            });  
        });
    }); 
}

// WORKS!
const updateMgr = () => {
    connection.query(
        `SELECT *
        FROM employee`,
        (err, results) => {
        if (err) throw err;
        
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee would you like to update?",
                choices() {
                    const choiceArray = [];
                    results.forEach(({first_name, last_name }) => {
                      choiceArray.push(`${first_name} ${last_name}`);
                    });
                    return choiceArray;
                },
                name: "empToUpdate"
            },
            {
                type: "list",
                message: "Who is their new manager?",
                choices() {
                    const choiceArray = [];
                    results.forEach(({first_name, last_name }) => {
                      choiceArray.push(`${first_name} ${last_name}`);
                    });
                    return choiceArray;
                  },
                name: "updatedManager"
            }
        ]).then((answer) => {
            console.log(answer);
            let chosenEmployee;
            let chosenManager;
            results.forEach((employee) => {
                if(answer.empToUpdate === `${employee.first_name} ${employee.last_name}`) {
                    chosenEmployee = employee
                };
            });
            results.forEach((employee) => {
                if(answer.updatedManager === `${employee.first_name} ${employee.last_name}`) {
                    chosenManager = employee
                }
            })
            
            connection.query(
                `UPDATE employee
                SET manager_id = ${chosenManager.id}
                WHERE ?`,
                {id: chosenEmployee.id}, 
                (err,res) => {
                if (err) throw err;
                console.log(`\n${chosenEmployee.first_name} ${chosenEmployee.last_name}'s manager successfully updated to ${chosenManager.first_name} ${chosenManager.last_name}!\n`);
                init();
            });
        });
    }); 
}

// WORKS!
const allRoles = () => {
    connection.query('SELECT title AS Roles FROM role', (err,roles) => {
        if (err) throw err;
        console.log("\nAll of the company roles are as follows:\n");
        console.table(roles);
        init();
    });
}

// WORKS!
const allDept = () => {
    connection.query('SELECT name AS Departments FROM departments', (err,departments) => {
        if (err) throw err;
        console.log("\nAll of the company departments are as follows:\n");
        console.table(departments);
        init();
    });
}

// Works!
const addDept = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department you want to add?",
            name: "name"
        }
    ]).then((answer) => {
        connection.query('INSERT INTO departments SET ?', answer, (err,departments) => {
            if (err) throw err;
            console.log(`\n${answer.name} successfully added to departments!\n`);
            init();
        })
    });
};

// works!
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
                console.log(`\n${answer.title} successfully added as a role!\n`);
                init();
            })
        });
    });  
};

// WORKS!
const remDept = () => {
    connection.query(
        `SELECT *
        FROM departments`,
        (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which department would you like to remove?",
                choices() {
                    const choiceArray = [];
                    results.forEach((department) => {
                      choiceArray.push(department.name);
                    });
                    return choiceArray;
                },
                name: "deptToRemove"
            },
        ]).then((answer) => {
            
            let chosenDepartment;
            results.forEach((department) => {
                if(department.name === answer.deptToRemove) {
                    chosenDepartment = department
                }
            });
            
            connection.query(
                `DELETE FROM departments 
                WHERE ?`, 
                {id: chosenDepartment.id},
                (err,res) => {
                if (err) throw err;
                console.log(`\nSuccessfully removed ${chosenDepartment.name} as a department!\n`);
                init();
            });
        });
    });  
}

// wORKS!
const remRole = () => {
    connection.query(
        `SELECT *
        FROM role`,
        (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which role would you like to remove?",
                choices() {
                    const choiceArray = [];
                    results.forEach((role) => {
                      choiceArray.push(role.title);
                    });
                    return choiceArray;
                },
                name: "roleToRemove"
            },
        ]).then((answer) => {
            
            let chosenRole;
            results.forEach((role) => {
                if(role.title === answer.roleToRemove) {
                    chosenRole = role
                }
            });

            connection.query(
                `DELETE FROM role 
                WHERE ?`,
                {id: chosenRole.id},
                (err,res) => {
                if (err) throw err;
                console.log(`\nSuccessfully removed ${chosenRole.title} as a role!\n`);
                init();
            })
        });
    });  
}

// need to create
const deptBudget = () => {

}

//   Initialization function - works!
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