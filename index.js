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
                // console.log("View All Employees");
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
                // viewAllRoles();
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
    try {
        console.log("Viewing all Employees...");
        client = await connections;
        response = await client.query("SELECT * FROM employee")
        console.log("");
        console.table(response.rows);
    }
    catch (err) {
        console.log(err);

    }
    manageEmployees();
}

addEmployee = async () => {
    try {
        console.log("Adding an Employee...");
        console.log("");

        // Establish connection to database
        let client = await connections

        // Query the database for employees and roles
        const roles = await client.query("SELECT * FROM role")

        const managers = await client.query("SELECT * FROM employee")

        const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }))

        const managerChoice = managers.rows.map(employee => ({ name: (employee.first_name + " " + employee.last_name), value: employee.id }))

        console.log("manger choices", managerChoice);
        console.log("role choices", roleChoices);

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
updateEmployeeRole = async () => {
    try {
        console.log("Updating an Employee Role...");
        console.log("");

        // Establish connection to database
        let client = await connections

        // Query the database for employees and roles

        const employees = await client.query("SELECT * FROM employee")

        const roles = await client.query("SELECT * FROM role")

        const roleChoices = roles.rows.map(role => ({ name: "Role title: " + role.title + "---" + "Role Id: " + role.id, value: role.id }));
        const employeesChoices = employees.rows.map(employee => ({ name: employee.first_name + " " + employee.last_name + "---" + "Current Role: " + employee.role_id, value: employee.id }))

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
            // {
            //     type: "list",
            //     loop: false,
            //     message: "Select the new role: ",
            //     name: "OldRole_id",
            // },
            {
                type: "list",
                loop: false,
                message: "Select the employee's new role: ",
                name: "role.id",
                choices: roleChoices
            },
            // {
            //     type: "list",
            //     loop: false,
            //     message: "Will this employee have a new manager:",
            //     name: "manager_id",
            //     choices: managerChoice
            // }
        ]);

        console.log("After line 204", answers);

        // Update the employee's role in the database
        // console.log("answers.employee.id", employee.id + "---" + "answers.role_id", role_id);
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
viewAllRoles = () => {
    console.log("View All Roles");
    manageEmployees();
}
addRole = () => {
    console.log("Add Role");
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
    // process.exit();
}