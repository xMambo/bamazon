//Required Variables
var Table = require('cli-table2');
var mysql = require('mysql');
var inquirer = require('inquirer');

//Connect to SQL database

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "123456789",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

function startPrompt() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
            colWidths: [],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }


        console.log(table.toString());

        inquirer.prompt([{
                    type: "number",
                    message: "Please enter the Product ID of the item that you would like to buy?",
                    name: "id"
                },
                {
                    type: "number",
                    message: "How many would you like to buy?",
                    name: "quantity"
                },
            ])

            .then(function (cart) {
                var quantity = cart.quantity;
                var itemID = cart.id;

                connection.query('SELECT * FROM products WHERE id=' + itemID, function (err, selectedItem) {
                    if (err) throw err;

                    //Varify item quantity desired is in inventory
                    if (selectedItem[0].stock_quantity - quantity >= 0) {
                        console.log("Quantity in Stock: " + selectedItem[0].stock_quantity + " Order Quantity: " + quantity);
                        console.log("Congratulations! Bamazon has suffiecient inventory of " + selectedItem[0].product_name + " to fill your order!");
                        console.log("Thank you for your purchase");



                        connection.query('UPDATE products SET stock_quantity=? WHERE id=?', [selectedItem[0].stock_quantity - quantity, itemID],

                            function (err, inventory) {
                                if (err) throw err;

                                //startPrompt();
                            });

                    } else {
                        console.log("INSUFFICIENT INVENTORY");

                        //startPrompt();
                    }



                    inquirer.prompt([{

                        type: "confirm",
                        name: "continue",
                        message: "Would you like to purchase an item?",
                        default: true

                    }]).then(function (user) {
                        if (user.continue === true) {
                            startPrompt();
                        } else {
                            console.log("Thank you, come again!");
                            return process.exit();
                        }
                    });

                });

            });
    });
}