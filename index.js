// Required dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
  
    // Port number
    port: 3306,
  
    // Your username
    user: 'root',
  
    // database and password credentials
    password: '',
    database: 'companyDB',
});

// Function to view all employees
const allEmp = () => {

    connection.query(
        // Selecting and alias-ing the columns to display from a joined table
        // the joined table does a self-join to add a column for the manager name, matched to the manager_id
        // and left joins to add columns for title, salary, and department
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
        // Display all employees as table in console
        console.log("\nAll company employees are as follows:\n");
        console.table(employees);
        init();
    });
};

// Function to view employees by department
const empByDept = () => {

    // Selecting all departments to give the user departments to choose from
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        // Prompt the user to select a department
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
                // Selecting and alias-ing columns to display from a joined table
                // the joined table does a self-join to add a column for the manager name, matched to the manager_id
                // and left joins to add columns for title, salary, and department
                // and returns all employees where their department is the user's selected department
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
            // Display all employees in the department as table in console
            console.log(`\nEmployees in the ${answer.chosenDept} department are as follows:\n`);
            console.table(res);
            init();
            });
        });
    });  
};

// Function to display employees by manager
const empByMgr = () => {

    // Select all employees to give the user a list from which to choose a manager 
    connection.query(
        `SELECT *
        FROM employee`,
        (err, results) => {
        if (err) throw err;

        // Prompt the user to choose a manager
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
                // Selecting and alias-ing columns to display from a joined table
                // the joined table does a self-join to add a column for the manager name, matched to the manager_id
                // and left joins to add columns for title, salary, and department
                // and returns all employees where their manager is the user's selected manager
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
                // Display all employees under that manager as table in console
                console.log(`\nEmployees managed by ${answer.chosenMgr} are as follows:\n`);
                console.table(res);
                init();
                }
            );
        });
    });  
};

// Function to add an employee to the company database
const addEmp = () => {
    
    // Select all roles to give the user a list to choose a role from for the added employee 
    connection.query(
        `SELECT
            title AS name,
            id AS value
        FROM role`,
        (err, choices) => {
        if (err) throw err;
        
        // Prompt the user to provide a first name, last name, and role for the new employee
        // will generate an object with first_name, last_name, and role_id fields to match employee table columns
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
            
            // Select all employees to give the user a list to choose a manager for the added employee 
            connection.query('SELECT * FROM employee', (err, results) => {
                if (err) throw err;
                
                // Prompt user to select a manager for new employee
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

                    // Find an employee that matches the user's selected manager and create a variable for the chosenManager that's equal to the corresponding employee's field values
                    let chosenManager;
                    results.forEach((employee) => {
                        if(`${employee.first_name} ${employee.last_name}` === answer2.manager) {
                            chosenManager = employee;
                        }
                    });

                    // Adds a manager_id field with the value of the chosenManager id to the employee object that was generated by the first prompts
                    answer.manager_id = chosenManager.id;

                    // Insert a new employee with field values specified in the answer object
                    connection.query(
                        `INSERT INTO employee
                        SET ?`,
                        answer,
                        (err, results) => {
                        if(err) throw err;
                        // Display message in console of added employee
                        console.log(`\nYou added ${answer.first_name} ${answer.last_name} as an employee!\n`);
                        init();
                    });
                });
            });
        });      
    });
};

// Function to remove an employee
const remEmp = () => {

    // Select all employees to give the user a list to choose an employee to remove
    connection.query(
        `SELECT * 
        FROM employee`,
        (err, results) => {
        if (err) throw err;

        // Prompt the user to choose an employee to remove
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
            
            // Find an employee that matches the user's selected employee and create a variable for the chosenEmployee that's equal to the corresponding employee's field values
            let chosenEmployee;
            results.forEach((employee) => {
                if(answer.removedEmp === `${employee.first_name} ${employee.last_name}`) {
                    chosenEmployee = employee
                };
            });
            
            // Delete an employee that matches the chosen employee ID#
            connection.query(
                `DELETE FROM employee 
                WHERE ?`,
                {id: chosenEmployee.id},
                (err,res) => {
                if (err) throw err;
                // Display message in console of removed employee
                console.log(`\nSuccessfully removed ${answer.removedEmp} as an employee!\n`);
                init();
            });
        });
    });
};

// Function to update an employee's role
const updateRole = () => {

    // Select all employees to give the user a list to choose an employee for updating their role
    connection.query(
        `SELECT *
        FROM employee`,
        (err, results) => {
        if (err) throw err;
        
        // Prompt the user to choose an employee to update
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
            
            // Find an employee that matches the user's selected employee and create a variable for the chosenEmployee that's equal to the corresponding employee's field values
            let chosenEmployee;
            results.forEach((employee) => {
                if(answer.empToUpdate === `${employee.first_name} ${employee.last_name}`) {
                    chosenEmployee = employee
                };
            });
            
            // Select titles and role id's to give the user a list to choose a role to update the employee's role
            connection.query(
                `SELECT 
                    title AS name,
                    id AS value
                FROM role`,
                (err, choices) => {
                if (err) throw err;
                
                // Prompt the user to choose a new role for the employee
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What is their updated role?",
                        choices,
                        name: "updatedRole"
                    }
                ]).then((answer) => {
                    
                    // Update the employee table, changing the role_id affiliated with the user's selected role for the chosen employee
                    connection.query(
                        `UPDATE employee
                        SET role_id = ${answer.updatedRole}
                        WHERE ?`,
                        {id: chosenEmployee.id}, 
                        (err,res) => {
                        if (err) throw err;
                        // Display message in console of updated employee's role
                        console.log(`\n${chosenEmployee.first_name} ${chosenEmployee.last_name}'s role successfully updated!\n`);
                        init();
                    });
                });
            });  
        });
    }); 
};

// Function to update an employee's manager
const updateMgr = () => {

    // Select all employees to give the user a list to choose an employee for updating their manager
    connection.query(
        `SELECT *
        FROM employee`,
        (err, results) => {
        if (err) throw err;
        
        // Prompt the user to choose an employee to update and their new manager
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
            
            // Find an employee that matches the user's selected employee and create a variable for the chosenEmployee that's equal to the corresponding employee's field values
            let chosenEmployee;
            results.forEach((employee) => {
                if(answer.empToUpdate === `${employee.first_name} ${employee.last_name}`) {
                    chosenEmployee = employee
                };
            });

            // Find an employee that matches the user's selected manager and create a variable for the chosenManager that's equal to the corresponding employee's field values
            let chosenManager;
            results.forEach((employee) => {
                if(answer.updatedManager === `${employee.first_name} ${employee.last_name}`) {
                    chosenManager = employee
                };
            });
            
            // Update the employee table, changing the manager_id to the id of the chosenManager for the chosenEmployee
            connection.query(
                `UPDATE employee
                SET manager_id = ${chosenManager.id}
                WHERE ?`,
                {id: chosenEmployee.id}, 
                (err,res) => {
                if (err) throw err;
                // Display console message of updated employee's manager
                console.log(`\n${chosenEmployee.first_name} ${chosenEmployee.last_name}'s manager successfully updated to ${chosenManager.first_name} ${chosenManager.last_name}!\n`);
                init();
            });
        });
    }); 
};

// Function to view all roles in the company
const allRoles = () => {

    // Select all roles from the role table
    connection.query(
        `SELECT title AS Roles
        FROM role`,
        (err,roles) => {
        if (err) throw err;
        // Display all roles as table in console
        console.log("\nAll of the company roles are as follows:\n");
        console.table(roles);
        init();
    });
};

// Function to view all departments in the company
const allDept = () => {

    // Select all departments from the departments table
    connection.query(
        `SELECT name AS Departments
        FROM departments`,
        (err,departments) => {
        if (err) throw err;
        // Display all departments as table in console
        console.log("\nAll of the company departments are as follows:\n");
        console.table(departments);
        init();
    });
};

// Function to add a department for the company
const addDept = () => {

    // Prompt the user to input the department they wish to add
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department you want to add?",
            name: "name"
        }
    ]).then((answer) => {

        // Insert a new department into the departments table with the name input by the user
        connection.query(
            `INSERT INTO departments 
            SET ?`,
            answer,
            (err,departments) => {
            if (err) throw err;
            // Display console message of added department
            console.log(`\n${answer.name} successfully added to departments!\n`);
            init();
        });
    });
};

// Function to add a role to the company
const addRole = () => {

    // Select department names and ids to create a list of options for the user to choose a department to add the new role to
    connection.query(
        `SELECT
            name AS name,
            id AS value
        FROM departments`,
        (err, choices) => {
        if (err) throw err;

        // Prompt the user to input the new role, it's salary and the role's department
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
                // ensure the salary is a number and not empty string
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
                // override default NaN value when user inputs empty string to allow user to change input
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

            // Insert a new role into the role table with the user's input field values
            connection.query(
                `INSERT INTO role 
                SET ?`,
                answer,
                (err,res) => {
                if (err) throw err;
                // Display console message of added role
                console.log(`\n${answer.title} successfully added as a role!\n`);
                init();
            });
        });
    });  
};

// Function to remove a department from the company
const remDept = () => {

    // Select all departments to give the user a list of departments to choose to remove
    connection.query(
        `SELECT *
        FROM departments`,
        (err, results) => {
        if (err) throw err;

        // Prompt the user to select a department to remove
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
            
            // Find a department that matches the user's selected department and create a variable for the chosenDepartment that's equal to the corresponding department's field values
            let chosenDepartment;
            results.forEach((department) => {
                if(department.name === answer.deptToRemove) {
                    chosenDepartment = department
                };
            });
            
            // Delete the department from the departments table
            connection.query(
                `DELETE FROM departments 
                WHERE ?`, 
                {id: chosenDepartment.id},
                (err,res) => {
                if (err) throw err;
                // Display console message of removed department
                console.log(`\nSuccessfully removed ${chosenDepartment.name} as a department!\n`);
                init();
            });
        });
    });  
};

// Function to remove a role from the company
const remRole = () => {
    
    // Select all roles from the role table to give the user a list of roles to choose to remove
    connection.query(
        `SELECT *
        FROM role`,
        (err, results) => {
        if (err) throw err;

        // Prompt user to select a role to remove
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
            
            // Find a role that matches the user's selected role and create a variable for the chosenRole that's equal to the corresponding role's field values
            let chosenRole;
            results.forEach((role) => {
                if(role.title === answer.roleToRemove) {
                    chosenRole = role
                };
            });

            // Delete the chosen role from the role table
            connection.query(
                `DELETE FROM role 
                WHERE ?`,
                {id: chosenRole.id},
                (err,res) => {
                if (err) throw err;
                // Display console message of removed role
                console.log(`\nSuccessfully removed ${chosenRole.title} as a role!\n`);
                init();
            });
        });
    });  
};

// Function to show the total utilized budget by department
const deptBudget = () => {

    // Select all departments from the departments table to give user a list to choose a department for which to display their used budget
    connection.query(
        `SELECT * 
        FROM departments`,
        (err, results) => {
        if (err) throw err;

        // Prompt user to choose a department
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
                name: "deptToSeeBudget"
            }
        ]).then((answer) => {
            
            // Find a department that matches the user's selected department and create a variable for the chosenDept that's equal to the corresponding department's field values
            let chosenDept;
            results.forEach((department) => {
                if(department.name === answer.deptToSeeBudget) {
                    chosenDept = department
                };
            });
            
            //  Join a column for the department name to the role table by department_id
            // then sum all salaries for roles whose department matches the user's selected department
            connection.query(
                `SELECT 
                    SUM(roleDepts.salary) AS Total_Utilized_Budget
                FROM 
                    (SELECT 
                        role.department_id, 
                        departments.name, 
                        role.salary
                    FROM role
                    LEFT JOIN departments ON role.department_id = departments.id)
                AS roleDepts
                WHERE ?`, 
                {department_id: chosenDept.id}, 
                (err,res) => {
                if (err) throw err;
                // Display department utilized budget as table in console
                console.log(`\nThe utilized budget in the ${chosenDept.name} department is as follows:\n`);
                console.table(res);
                init();
            });
        });
    });
};

//   Initialization function that runs after npm start
const init = () => {

    // Prompt user to either VIEW, ADD, UPDATE, or REMOVE information
    inquirer.prompt([
        {
          type: "list",
          choices: [
            "VIEW",
            "ADD", 
            "UPDATE",
            "REMOVE",
            "Exit"
          ],
          message: "What would you like to do in the company database?",
          name: "start"
        }
    ]).then((answer) => {
    
        // switch cases for each user answer
        switch(answer.start) {
            case "VIEW": {
            return viewOptions();
            }
            case "ADD": {
            return addOptions();
            }
            case "UPDATE": {
            return updateOptions();
            }
            case "REMOVE": {
            return removeOptions();
            }
            default: {
            return process.exit();
            }
        };
    });
};

// Function to give user options for viewing info in company database
const viewOptions = () => {

    // Prompt user to choose what to view
    inquirer.prompt([
        {
          type: "list",
          choices: [
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Manager",
            "View All Roles",
            "View All Departments",
            "View Total Utilized Budget By Department",
            "Return to start"
          ],
          message: "What would you like to do?",
          name: "view"
        }
    ]).then((answer) => {
    
        // switch cases for each user answer
        switch(answer.view) {
            case "View All Employees": {
            return allEmp();
            }
            case "View All Employees By Department": {
            return empByDept();
            }
            case "View All Employees By Manager": {
            return empByMgr();
            }
            case "View All Roles": {
            return allRoles();
            }
            case "View All Departments": {
            return allDept();
            }
            case "View Total Utilized Budget By Department": {
            return deptBudget();
            }
            case "Return to start": {
            return init();
            }
            default: {
            return process.exit();
            }
        };
    });
};

// Function to give user options for adding info to company database
const addOptions = () => {

    // Prompt user to choose what to add
    inquirer.prompt([
        {
          type: "list",
          choices: [
            "Add Employee",
            "Add Department",
            "Add Role",
            "Return to start"
          ],
          message: "What would you like to do?",
          name: "add"
        }
    ]).then((answer) => {
    
        // switch cases for each user answer
        switch(answer.add) {
            case "Add Employee": {
            return addEmp();
            }
            case "Add Department": {
            return addDept();
            }
            case "Add Role": {
            return addRole();
            }
            case "Return to start": {
            return init();
            }
            default: {
            return process.exit();
            }
        };
    }); 
};

// Function to give user options for updating info in company database
const updateOptions = () => {

    // Prompt user to choose what to update
    inquirer.prompt([
        {
          type: "list",
          choices: [
            "Update Employee Role",
            "Update Employee Manager",
            "Return to start"
          ],
          message: "What would you like to do?",
          name: "update"
        }
    ]).then((answer) => {
    
        // switch cases for each user answer
        switch(answer.update) {
            
            case "Update Employee Role": {
            return updateRole();
            }
            case "Update Employee Manager": {
            return updateMgr();
            }
            case "Return to start": {
            return init();
            }
            default: {
            return process.exit();
            }
        };
    });  
};

// Function to give user options for removing info from company database
const removeOptions = () => {

    // Prompt user to choose what to remove
    inquirer.prompt([
        {
          type: "list",
          choices: [
            "Remove Employee",
            "Remove Department",
            "Remove Role",
            "Return to start"
          ],
          message: "What would you like to do?",
          name: "remove"
        }
    ]).then((answer) => {
    
        // switch cases for each user answer
        switch(answer.remove) {
            case "Remove Employee": {
            return remEmp();
            }
            case "Remove Department": {
            return remDept();
            }
            case "Remove Role": {
            return remRole();
            }
            case "Return to start": {
            return init();
            }
            default: {
            return process.exit();
            }
        };
    });
};

//   Connect
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    init();
});