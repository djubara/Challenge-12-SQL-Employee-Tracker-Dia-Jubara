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
                console.log("Add Employee");
                addEmployee();
            }
            else if (res.option === "Update Employee Role") {
                console.log("Update Employee Role");
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
        let client = await connections
        const roles = await client.query("SELECT * FROM role")

        const managers = await client.query("SELECT * FROM employee")

        const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }))

        const managerChoice = managers.rows.map(employee => ({ name: (employee.first_name + " " + employee.last_name), value: employee.id }))
        console.log("manger choices", managerChoice);
        console.log("role choices", roleChoices);

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
    console.log("Add Employee");
    manageEmployees();
}
updateEmployeeRole = () => {
    console.log("Update Employee Role");
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