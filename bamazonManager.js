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
  addItem("Dog Treats", "Food and Drink", "5.99", "100");
});

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
  })
}

function makeTable(tableData) {
  
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
        else {
          string += (tableData[index][key]);
        }
      if(string) {tableRow.push(string);}
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
      makeTable(res);
    }
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
    }
  );
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

