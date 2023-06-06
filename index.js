const inquirer = require('inquirer');
const db = require('./db/connection');

//start server 
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    employee_tracker();
});

var employee_tracker = function() {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }]).then((answers) => {
        if (answers.prompt === 'View all departments') {
            db.query(`SELECT * FROM department`, (err, results) => {
                if (err) throw err; 
                console.log("Viewing all departments: ");
                console.table(results);
                employee_tracker(); 
    });
} else if (answers.prompt === 'View all roles') {
    db.query(`SELECT * FROM role`, (err, results) => { 
        if (err) throw err;
        console.log("Viewing all roles: ");
        console.table(results);
        employee_tracker();
    });
} else if (answers.prompt === 'View all employees') {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) throw err;
        console.log("Viewing all employees: ");
        console.table(results);
        employee_tracker();
    });
} else if (answers.prompt === 'Add a department') {
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What is the name of the department you would like to add?',
        validate: departmentInput => {
            if (departmentInput) {
                return true;
            } else {
                console.log('Please enter a department name!');
                return false;
            }
        }
    }]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, results) => {
            if (err) throw err;
            console.log(`Added ${answers.department} to the database.`)
            employee_tracker();
    });
})
} else if (answers.prompt === 'Add a role') {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role you would like to add?',
                validate: roleInput => {
                    if (roleInput) {
                        return true;
                    } else {
                        console.log('Please enter a role name!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please enter a salary!');
                        return false;
                    }
                }
            },
            {
                //department
                type: 'list',
                name: 'department',
                message: 'Which department does this role belong to?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].name);
                    }
                    return array;
                }
            }
        ]).then((answers) => {
            for (var i = 0; i < results.length; i++) {
                if (results[i].name === answers.department) {
                    var department = results[i];
                }
            }

            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, results) => {
                if (err) throw err;
                console.log(`Added ${answers.role} to the database.`);
                employee_tracker();
            });
        })
    });
} else if (answers.prompt === 'Add an employee') {
    db.query(`SELECT * FROM employee, role`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the employee?',
                validate: firstNameInput => {
                    if (firstNameInput) {
                        return true;
                    } else {
                        console.log('Please enter a first name!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the employee?',
                validate: lastNameInput => {
                    if (lastNameInput) {
                        return true;
                    } else {
                        console.log('Please enter a last name!');
                        return false;
                    }
                }
            },
            { 
                type: 'list',
                name: 'role',
                message: 'What is the role of the employee?',
                choices: () => {
                    var array = []; 
                    for (var i = 0 ; i < results.length; i++) {
                        array.push(results[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                }
            },
            {
                type: 'input',
                name: 'manager',
                message: 'Who is the manager of the employee?',
                validate: managerInput => {
                    if (managerInput) {
                        return true;
                    } else {
                        console.log('Please enter a manager!');
                        return false;
                    }
                }
            }
        ]).then((answers) => {
            for (var i = 0; i < results.length; i++) {
                if (results[i].title === answers.role) {
                    var role = results[i];
                }
            }

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, results) => {
                if (err) throw err;
                console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                employee_tracker();
            });
        })
    });
} else if (answers.prompt === 'Update an employee role') {
    db.query (`SELECT * FROM employee, role`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].last_name);
                    }
                    var employeeArray = [...new Set(array)];
                    return employeeArray;
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the new role of the employee?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < results.length; i++) {
                        array.push(results[i].title);
                    }
                    var newArray = [...new Set(array)];
                    return newArray;
                }
            }
        ]).then((answers) => {
            for (var i = 0; i < results.length; i++) {
                if (results[i].last_name === answers.employee) {
                    var name = results[i];
                }
            }

            for (var i = 0; i < results.length; i++) {
                if (results[i].title === answers.role) {
                    var role = results[i];
                }
            }

            db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, results) => {
                if (err) throw err;
                console.log(`Updated ${answers.employee} to ${answers.role}.`);
                employee_tracker();
            });
        })
    });
} else if (answers.prompt === 'Exit') {
    db.end();
    console.log('Goodbye!');
}
})
};