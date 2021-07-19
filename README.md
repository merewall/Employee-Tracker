# Employee-Tracker
A command-line application for managing a company's employees using node, inquirer, and MySQL.

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
## DESCRIPTION

This project is a command-line application that allows the user to View, Add, Update, or Remove employees, roles, and/or departments in a company database.

The application uses the node inquirer package for prompting questions in command-line and MySQL for the database.

## TABLE OF CONTENTS

- [DESCRIPTION](#description)
- [DEVELOPMENT CRITERIA](#development-criteria)
- [INSTALLATION](#installation)
- [USAGE](#usage)
- [LICENSE](#license)
- [CONTRIBUTING](#contributing)
- [TESTS](#tests)
- [TECHNOLOGIES USED](#technologies-used)
- [LINKS](#links)
- [QUESTIONS](#questions)

## DEVELOPMENT CRITERIA

The following acceptance criteria was used to guide the development of this project:
 
- [x] GIVEN a command-line application that accepts user input
- [x] WHEN a user is prompted  at application initiation
- [x] THEN the user is given options to add departments, add roles, add employees, view departments, view roles, view employees, and update employee roles

As a bonus:
- [x] WHEN a user is prompted at application initiation
- [x] THEN the user is given options to update employee managers, view employees by manager, delete departments, delete roles, delete employees, and view the total utilized budget of a department

## INSTALLATION

1. Fork the [repository](https://github.com/merewall/Team-Profile-Generator) from [GitHub](https://github.com/) to your profile.
2. Clone the repository down to your local machine in command-line using: `git clone`.
3. Node.js is required to run this application. Click [here](#installing-nodejs) for instructions on installing Node.js.
4. Install the required dependices to your cloned directory in command-line using: `npm install`
    * Or install the packages individually...
        * Install the [inquirer package](https://www.npmjs.com/package/inquirer) to your cloned directory in command-line using: `npm install inquirer`.
        * Install the [mysql](https://www.npmjs.com/package/mysql) to your cloned directory in command-line using: `npm install mysql`
5. Update the connection password in index.js with your mysql password.
    
    ###### Installing Nodejs

    1. Check if you already have Node.js in command-line by typing `node`.
    2. If you have Node.js on  your machine, a message similar to `Welcome to Node.js` will appear.
    3. If you do not have Node.js, an error message will appear and you need to download it.
    4. To download Node.js, click [here](https://nodejs.org/en/download/).
    5. After download and installation is complete, restart your command-line terminal and redo step 1 to confirm a successful installation.
    6. After Node.js is on your local machine, return to the [installation](#installation) instructions for this project's application above.

## USAGE

1. Open command-line terminal on your local machine.
2. Navigate to the cloned directory of the application on your local machine using `cd`, if not already there.
3. If you haven't already, be sure you followed all [installation](#installation) instructions to install inquirer, node, and mysql dependencies.
4. Create your database by running the schema.sql file.
5. Seed your database by running the companySeeds.sql file.
6. Initialize the application in command-line using: `npm start`.
7. When prompted in the command line, choose what you wish to do with the company database.
8. Answer each question when prompted, and hit the RETURN key.
9. Upon completion, select "Exit".

_Examples of initializing the application in command-line and a prompted question:_
![Initializing the application](https://github.com/merewall/Employee-Tracker/blob/main/assets/app-initiation.PNG)
![Welcome message after app initiation](https://github.com/merewall/Employee-Tracker/blob/main/assets/welcome-message.PNG)

_Example of all the view options for the database._
![View options for viewing info in database](https://github.com/merewall/Employee-Tracker/blob/main/assets/view-options.PNG)

_Example of all add options for the database._

![Add options for adding info in database](https://github.com/merewall/Employee-Tracker/blob/main/assets/add-options.PNG)

_Example of all update options for the database._  
![Update options for updating info in database](https://github.com/merewall/Employee-Tracker/blob/main/assets/update-options.PNG)

_Example of all remove options for the database._  
![Remove options for removing info in database](https://github.com/merewall/Employee-Tracker/blob/main/assets/remove-options.PNG)

_View of all employees in the database._  
![Table of all employees in databate](https://github.com/merewall/Employee-Tracker/blob/main/assets/view-all.PNG)

_View of success message after adding employee._  
![Added employee success message](https://github.com/merewall/Employee-Tracker/blob/main/assets/add-emp-success.PNG)
![Added employee in table](https://github.com/merewall/Employee-Tracker/blob/main/assets/added-emp.PNG)

_View of success message after updating employee role._  
![Updated employee role success message](https://github.com/merewall/Employee-Tracker/blob/main/assets/update-emp-success.PNG)
![Updated employee role in table](https://github.com/merewall/Employee-Tracker/blob/main/assets/updatd-emp.PNG)

_View of success message after removing employee._
![Removed employee success message](https://github.com/merewall/Employee-Tracker/blob/main/assets/rem-emp-success.PNG)
![Table of employees no longer showing removed employee](https://github.com/merewall/Employee-Tracker/blob/main/assets/removed-emp.PNG)

_Gif of Employee Tracker application in use._  
![Employee Tracker demo gif](https://github.com/merewall/Employee-Tracker/blob/main/assets/employee-tracker-demo.gif)

## LICENSE

This application is licensed under the [MIT License](https://opensource.org/licenses/MIT).
## CONTRIBUTING

If you'd like to contribute to the project, please create a pull request on a new branch of the [repository](https://github.com/merewall/Employee-Tracker) for review.

## TESTS

No current tests for this application.
## TECHNOLOGIES USED

- [X] JavaScript
- [X] [Node.js](https://nodejs.org/en/)
- [X] [mysql](https://www.npmjs.com/package/mysql)
- [X] [Inquirer](https://www.npmjs.com/package/inquirer)
- [X] [console.table](https://www.npmjs.com/package/console.table)

## LINKS

* The [repository](https://github.com/merewall/Employee-Tracker) for this application.
* A [demo video](https://drive.google.com/file/d/1eX9-H3P0L2LQ3OutOLXCkH1uZTL5tang/view) on how to use the application.

## QUESTIONS

For any questions, please check out my GitHub profile or send me an email:
* GitHub: [merewall](https://github.com/merewall)
* Email: mlwall@alumni.princeton.edu
