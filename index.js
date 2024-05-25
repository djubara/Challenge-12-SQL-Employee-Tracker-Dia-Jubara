const Inquirer = require("inquirer");
const connections = require("./lib/connections");

// Welcome Banner
console.log("");
console.log(" =============================================");
console.log("║ Welcome to the Employee Management System!  ║");
console.log(" ============================================");
console.log("");

function manageEmployees() {

    Inquirer.prompt([
        {
            type: "list",
            loop: false,
            message: "What would you like to do?",
            name: "option",
            choices: ["View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"]
        }
    ])
        .then((res) => {
            if (res.option === "View All Employees") {

                viewAllEmployees();
            }

            else if (res.option === "Add Employee") {
                addEmployee();
            }
            else if (res.option === "Update Employee Role") {
                updateEmployeeRole();
            }
            else if (res.option === "View All Roles") {
                console.log("View All Roles");
                viewAllRoles();
            }
            else if (res.option === "Add Role") {
                console.log("Add Role");
                // addRole();
            }
            else if (res.option === "View All Departments") {
                console.log("View All Departments");
                // viewAllDepartments();
            }
            else if (res.option === "Add Department") {
                console.log("Add Department");
                // addDepartment();
            }
            else if (res.option === "Quit") {
                process.exit();
                // console.log("Goodbye!");
                // quit();
            }

        })
        .catch((err) => {
            console.log(err);
        });
}
manageEmployees();

let response;
viewAllEmployees = async () => {
    console.log("");
    try {
        console.log("Viewing all Employees...");
        client = await connections;
        response = await client.query(`SELECT e.id as employee_id, 
        e.first_name || ' ' || e.last_name AS employee,
        m.first_name || ' ' || m.last_name AS manager, 
        role.title AS job_title, 
        department.department_name as Department, 
        role.salary  from EMPLOYEE e
        JOIN role ON e.role_id = role.id
        JOIN department ON role.department_id = department.id
        inner JOIN employee m on m.id = e.manager_id
        ORDER BY department_id ASC`)
        console.log("");
        console.table(response.rows);
    }
    catch (err) {
        console.log(err)

    }
    manageEmployees();
}

addEmployee = async () => {
    try {
        console.log("");
        console.log("Adding an employee...");
        console.log("");

        // Establish connection to database
        let client = await connections

        // Query the database for employees and roles
        const roles = await client.query("SELECT * FROM role")

        const managers = await client.query(`SELECT e.first_name || ' ' || e.last_name as Employee_name, 
        role.title,
        e.id as manager_id
        FROM EMPLOYEE e
        JOIN role ON e.role_id = role.id
        WHERE role.title LIKE '%anager%' or role.title LIKE '%ead%'`)

        // console.log("Managers", managers.rows);

        const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }))

        const managerChoice = managers.rows.map(manager => ({ name: (manager.employee_name + " --- " + manager.title), value: manager.manager_id }))

        // Prompt user for the information of the employee to be added
        const answers = await Inquirer.prompt([
            {
                type: "input",
                message: "Enter the employee's first name: ",
                name: "first_name"
            },
            {
                type: "input",
                message: "Enter the employee's last name: ",
                name: "last_name"
            },
            {
                type: "list",
                loop: false,
                message: "Enter the employee's role: ",
                name: "role_id",
                choices: roleChoices
            },
            {
                type: "list",
                loop: false,
                message: "Select the employee's manager: ",
                name: "manager_id",
                choices: managerChoice
            }
        ]);

        console.log(answers);

        // Insert the employee into the database
        response = await client.query(
            "insert into employee (first_name, last_name, role_id, manager_id) values ($1, $2, $3, $4)",
            [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
        );
        console.log("");
        console.table(response.rows);
        console.log("");
        response = await client.query("SELECT * FROM employee")
        console.table(response.rows);
    }
    catch (err) {
        console.log(err);

    }
    manageEmployees();
}
updateEmployeeRole = async () => {
    try {
        console.log("Updating an employee role...");
        console.log("");

        // Establish connection to database
        let client = await connections

        // Query the database for employees and roles

        const employees = await client.query("SELECT * FROM employee")

        const roles = await client.query("SELECT * FROM role")

        const roleChoices = roles.rows.map(role => ({ name: "Role title: " + role.title + " --- " + "Role Id: " + role.id, value: role.id }));
        const employeesChoices = employees.rows.map(employee => ({ name: employee.first_name + " " + employee.last_name + " --- " + "Current Role: " + employee.role_id, value: employee.id }))

        console.log("role choices", roleChoices);
        console.log("employees choices", employeesChoices);


        // Prompt user for the information of the employee whose role is to be updated
        const answers = await Inquirer.prompt([
            {
                type: "list",
                loop: false,
                message: "Select the employee whose role you would like to update: ",
                name: "employee.id",
                choices: employeesChoices
            },
            {
                type: "list",
                loop: false,
                message: "Select the employee's new role: ",
                name: "role.id",
                choices: roleChoices
            },
        ]);

        // Update the employee's role in the database

        response = await client.query(
            "Update employee set role_id = $2 where id = $1",
            [answers.employee.id, answers.role.id]
        );
        console.log("");
        console.table(response.rows);
        console.log("");
        response = await client.query("SELECT * FROM employee")
        console.table(response.rows);
    }
    catch (err) {
        console.log(err);

    }
    manageEmployees();
}
viewAllRoles = async () => {
    try {
        console.log("Viewing all roles...");
        client = await connections;
        response = await client.query("SELECT * FROM role")
        console.log("");
        console.table(response.rows);
    }
    catch (err) {
        console.log(err);

    }
    manageEmployees();
}
addRole = async () => {
    try {
        console.log("Adding a role...");
        console.log("");
        consol.log("Here are the current roles in the database")
        console.log("");

        // Establish connection to database
        let client = await connections
        response = await client.query("SELECT * FROM role")
        console.log("");
        console.table(response.rows);
        console.log("");

        // Query the database for roles
        const newRole = roles.rows.map(role => ({ name: role.title, value: role.id, name: role.salary, value: role.department_id }))

        const managerChoice = managers.rows.map(employee => ({ name: (employee.first_name + " " + employee.last_name), value: employee.id }))

        console.log("role choices", roleChoices);

        // Prompt user for the information of the employee to be added
        const answers = await Inquirer.prompt([
            {
                type: "input",
                message: "Enter a title for the role: ",
                name: "first_name"
            },
            {
                type: "input",
                message: "Enter a salary for the role: ",
                name: "last_name"
            },
            {
                type: "list",
                loop: false,
                message: "Enter the name of the department: ",
                name: "role_id",
                choices: roleChoices
            },
            {
                type: "list",
                loop: false,
                message: "Select the employee's manager:",
                name: "manager_id",
                choices: managerChoice
            }
        ]);

        console.log(answers);

        // Insert the employee into the database
        response = await client.query(
            "insert into employee (first_name, last_name, role_id, manager_id) values ($1, $2, $3, $4)",
            [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
        );
        console.log("");
        console.table(response.rows);
        console.log("");
        response = await client.query("SELECT * FROM employee")
        console.table(response.rows);
    }
    catch (err) {
        console.log(err);

    }
    manageEmployees();
}
viewAllDepartments = () => {
    console.log("View All Departments");
    manageEmployees();
}
addDepartment = () => {
    console.log("Add Department");
    manageEmployees();
}
quit = () => {
    console.log("Goodbye!");
    process.exit();
}