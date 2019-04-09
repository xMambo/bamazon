//Required Variables
var Table = require('cli-table');
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
            colWidths: [10, 30, 30, 30]
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }

        
        console.log(table);

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
                });

            });
    });
}




/*
//Inquirer introduction
function startPrompt() {
    
    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Would you like to view our inventory?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log("Thank you!");
        }
    });
}


//Inventory

function inventory() {
    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30]
    });

    function listInventory() {

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

                    table.push(
                        [itemId, productName, departmentName, price, stockQuantity]
                    );
            }
            console.log("");
            console.log("------------------------");
            console.log("");
            console.log(table.toString());
            console.log("");
            consolePrompt();
        });
    }
}

//Inquirer user purchase

function contunuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?",
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log("Thank you!");
        }
    });
}


//Item selection and quantity desired

function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many units of this item would you like to purchase?",

        }
    ]).then(function(userPurchase) {

        //connect to databse to find stock_quantity in database. 
        //If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                    console.log("-------------------");
                    console.log("Not enough in stock");
                    console.log("-------------------");
                    startPrompt();

                } else {
                    //list item information for user for confirm prompt
                    console.log("===================================");
                    console.log("You've selected:");
                    console.log("----------------");
                    console.log("Item: " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("----------------");
                    console.log("Total: " + res[i].price * userPurchase.inputNumber);
                    console.log("===================================");

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    //console.log(newStock);
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });

//Confirm Purchase

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Confirm purchase",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("----------------");
            console.log("Transaction complete. Thank You.");
            console.log("----------------");
            startPrompt();
        } else {
            console.log("----------------");
            console.log("Transaction incomplete.");
            console.log("----------------");
            startPrompt();
        }
    });
}
}
*/