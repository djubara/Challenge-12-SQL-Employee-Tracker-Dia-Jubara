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
                addRole();
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

        const managerChoices = managers.rows.map(manager => ({ name: (manager.employee_name + " --- " + manager.title), value: manager.manager_id }))

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
                choices: managerChoices
            }
        ]);

        console.log(answers);

        // Insert the employee into the database
        client = await connections;
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

        // testing role choices
        // console.log("role choices", roleChoices);

        // testing employee choices
        // console.log("employees choices", employeesChoices);


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

        // Establish connection to database
        let client = await connections

        console.log("");
        console.log("Adding a new role to an existing department...");
        console.log("");
        console.info("M E S S A G E: To add a new role, you must first select a department to add the role to.")
        console.log("If the department you want to add the role to does not exist,");
        console.log("you must first add the department to the department table.");
        console.log("");
        console.log("Here are the current roles in the database: ");
        console.log("");

        // Query the database for roles to display existing roles
        const roles = await client.query("SELECT * FROM role")
        // const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }))
        // print the roles to the console
        console.log("");
        console.table(roles.rows);
        console.log("");

        //Query the database for departments to choose from
        const departments = await client.query("SELECT * FROM department")
        const departmentChoices = departments.rows.map(department => ({ name: department.department_name, value: department.id }))
        console.log("Here are the current departments in the department table: ")
        console.log("");
        console.table(departments.rows);
        console.log("");

        // testing department choices
        // console.log("department choices", departmentChoices);


        // testing roles choices
        // console.log("roles choices", roleChoices);

        // map the roles to a new array to be used in the inquirer prompt

        // Prompt user for the information of the role to be added
        const answers = await Inquirer.prompt([
            {
                type: "list",
                loop: false,
                message: "Enter the name of the department for this role: ",
                name: "department_name",
                choices: departmentChoices
            },
            {
                type: "input",
                message: "Enter a title for the new role: ",
                name: "title",
                validate: function (title) {
                    // validate the title input
                    const valid = /^[a-zA-Z]+$/;
                    // return valid || "Please enter a valid title for the new role:";
                    if (!title.match(valid)) {
                        console.log("\n Please enter a valid title for the new role:");
                        return false;
                    }
                    else {
                        return true;
                    }
                },
            },
            {
                type: "input",
                message: "Enter the annual salary for the new role: ",
                name: "salary",
                validate: function (salary) {

                    // const valid = /^[0-9]+$/; // regex for up to 6 digits and 2 decimal places;

                    // validate the salary input
                    let pay = parseFloat(salary);
                    const notValid = isNaN(pay);
                    // const notValid = isNaN(parseFloat(salary));
                    // return valid || "Please enter a number:";

                    const validUpperLimit = 1000000.00;
                    const validLowerLimit = 10000.00;
                    // regex for 4 numbers to the left of the decimal and 2 numbers to the right of the decimal 
                    // const valid = /^\d{4}(\.\d{2})?$/;
                    // regex for number with 2 decimal places: /^\d{7}(\.\d{2})?$/
                    if (Salary = notValid || salary < validLowerLimit || salary > validUpperLimit) {
                        console.log("\n Please enter a valid salary amount up to 6 digits and 2 decimal places: (i.e $123456.89)");
                        return false;
                    }
                    else {
                        console.log("Salary: ", salary);
                        return true;
                    }
                }
            },
        ]);
        title = answers.title.toLowerCase();
        const firstLetter = title.charAt(0)
        const firstLetterCap = firstLetter.toUpperCase()
        const remainingLetters = title.slice(1)
        const capitalizedWord = firstLetterCap + remainingLetters
        console.log("\n Title: ", capitalizedWord);
        answers.title = capitalizedWord;
        console.log(answers);
    }
    catch (err) {
        console.log(err);
    }
    // Insert role into the database
    let client = await connections

    // response = await client.query(
    //     "insert into role (department_id, title, salary) values ($1, $2, $3)",
    //     [answers.department_id, answers.title, answers.salary]
    // );

    // validation
    // Color validation function for hexadecimal input block
    // function validateColorHex(answer) {
    //     const hexColor = /^#[0-9A-Fa-f]{6}$/i;   Letters only: /^[a-zA-Z]+$/ numbers only: /^[0-9]+$/   regex for up to 7 digits and 2 decimal places: /^\d{7}(\.\d{2})?$/   
    //     if (!answer.match(hexColor)) {
    //         console.log("\n Please enter a valid hexadecimal number");
    //         return false;
    // regex for up to 7 digits and 2 decimal places: /^\d{7}(\.\d{2})?$/
    //     }
    //     else {
    //         return true;
    // regex for up to 7 digits and 2 decimal places: /^\d{7}(\.\d{2})?$/
    // regex for no less than 2 digits and no more than 7 digits and 2 decimal places: /^\d{2,7}(\.\d{2})?$/


    // console.log("Salary: ", answers.salary);
    manageEmployees();
};

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