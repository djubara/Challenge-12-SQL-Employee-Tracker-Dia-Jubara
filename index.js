const Inquirer = require("inquirer");
const connections = require("./lib/connections");

function main() {
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
                // updateEmployeeRole();
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
main();

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

    main();
}

addEmployee = async () => {
    try {
        let client = await connections
        const roles = await client.query("SELECT * FROM role")
        console.log(roles);
        const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }))
        console.log(roleChoices);
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
            // {
            //     type: "input",
            //     message: "Enter the employee's manager ID",
            //     name: "manager_id"
            // }
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
    main();
}
updateEmployeeRole = () => {
    console.log("Update Employee Role");
    main();
}
viewAllRoles = () => {
    console.log("View All Roles");
    main();
}
addRole = () => {
    console.log("Add Role");
    main();
}
viewAllDepartments = () => {
    console.log("View All Departments");
    main();
}
addDepartment = () => {
    console.log("Add Department");
    main();
}
quit = () => {
    console.log("Goodbye!");
    // process.exit();
}