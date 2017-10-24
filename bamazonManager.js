var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");
var colors = require("colors");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) {
    throw err;
    console.log("Sorry, you can't connect to Bamazon right now".red);
  }
  showMarketPlace();
});

function managerPrompt() {
  inquirer.prompt([
    {
      message: "What would you like to?",
      name: "command",
      type: "list",
      choices: ["Show All Inventory", "Show Low Inventory", "Add Inventory", "Add A New Item", "Exit"]
    }
  ]).then(function(answer) {
    switch (answer.command) {
      case "Show All Inventory":
        showMarketPlace();
        break;
      case "Show Low Inventory":
        showLowStock();
        break;
      case "Add Inventory":
        promptAddStock();
        break;
      case "Add A New Item":
        promptAddItem();
        break;
      case "Exit":
        connection.end();
        break;
    }
  })
}

function showMarketPlace() {
  connection.query("SELECT * FROM products ORDER BY department_name ASC", function(err, res) {
    if (err) {
      throw err;
      console.log("Sorry, you can't acces the marketplace right now. Please try again.".red);
    }
    else {
      // console.log(res);
      makeTable(res);
    }
    managerPrompt();
  })
}

function makeTable(tableData, status) {
  
  let data, output;

  data = [
    ["Item ID", "Product", "Category", "Price", "In Stock"]
  ];
  for (index in tableData) {
    var tableRow = [];
    for (key in tableData[index]) {
      var string = "";
        if (key === "price") {
          string += "$";
          string += tableData[index][key].toFixed(2);
        }
        else if(key === "stock_quantity" && tableData[index][key] < 5) {
          let redString = (tableData[index][key]).toString().red;
          string += redString; 
        }
        else {
          string += (tableData[index][key]);
        }
      if(string) {
        tableRow.push(string);
      }
    }
    data.push(tableRow);
  }
  output = table(data);
  console.log(output);
}

function showLowStock() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY department_name ASC", function(err, res) {
    if (err) {
      throw err;
      console.log("Sorry, you can't acces the marketplace right now. Please try again.".red);
    }
    else {
      // console.log(res);
      makeTable(res, "low");
    }
    managerPrompt();
  })
}

function promptAddStock() {
  inquirer.prompt([
    {
      name: "chosen",
      message: "Enter the ID of the item to increase stock: ",
      validate: function validateChosen(name) {
        // console.log(parseInt(name));
        return (parseInt(name).toString() === name);
      }
    },{
      name: "quantity",
      message: "How many of these should be added to Inventory?",
      validate: function validateChosen(name) {
        // console.log(parseInt(name));
        return (parseInt(name).toString() === name);
      }
    }
  ]).then(function(answer) {
    addInventory(answer.chosen, answer.quantity);
  })
}

function addInventory(id, addStock) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
    [addStock, id],
    function(err, res) {
      if (err) {
        throw err;
        console.log("Could not add stock to that item.");
      }
      showMarketPlace();
    }
  );
}

function promptAddItem() {
  inquirer.prompt([
    {
      name: "item_name",
      message: "Enter the name of the item to add: ",
    },{
      name: "department_name",
      message: "What department will this item be in: ",
    },{
      name: "price",
      message: "What is the price of this item: ",
    },{
      name: "stock",
      message: "How many of this item should be added to inventory: ",
      validate: function validateStock(name) {
        // console.log(parseInt(name));
        return (parseInt(name).toString() === name);
      }
    }
  ]).then(function(answer) {
    addItem(answer.item_name, answer.department_name, answer.price, answer.stock);
  })
}

function addItem(name, department, price, stock) {
  connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) Values (?, ?, ?, ?)",
    [name, department, price, stock], function(err, res) {
      if (err) {
        throw err;
        console.log("Could not add that item to inventory.");
      }
      showMarketPlace();
    })
}

