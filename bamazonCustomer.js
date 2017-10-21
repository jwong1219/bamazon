var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");

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
    console.log("Sorry, you can't connect to Bamazon right now");
  }
  showMarketPlace();
});

function showMarketPlace() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) {
      throw err;
      console.log("Sorry, you can't acces the marketplace right now. Please try again.");
    }
    else {
      // console.log(res);
      makeTable(res);
      buy(5, 6);
    }
  })
}

function makeTable(tableData) {
  
  let data, output;

  data = [
    ["Item ID", "Product", "Price",]
  ];
  for (index in tableData) {
    var tableRow = [];
    for (key in tableData[index]) {
      var string = "";
      if (key !== "department_name" && key !== "stock_quantity"){
        if (key === "price") {
          string += "$";
          string += tableData[index][key].toFixed(2);
        }
        else {
          string += (tableData[index][key]);
        }
      }
      if(string) {tableRow.push(string);}
    }
    data.push(tableRow);
  }
  output = table(data);
  console.log(output);
}

function buy(id, quantity) {
  //get data from DB on item with id
  connection.query("SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?", [id], function(err, res) {
    if (err) {
      throw err;
      console.log("We had some trouble accessing that item for you. Please check to make sure you had a valid Item ID and try again.");
    }
    else{
      //check to see if the buy quantity is less than the in stock quantity
      if (res[0].stock_quantity === 0) {
        let message = res[0].product_name + " is not in stock. Please check back again soon.";
        console.log(message);
      }
      else if (res[0].stock_quantity < quantity) {
        let message = "Your order of " + quantity + " ea. of " + res[0].product_name + " could not be filled because of insufficient stock. We only have " + res[0].stock_quantity + " in stock.";
        console.log(message);
      }
      else {
        inStock = parseInt(res[0].stock_quantity);
        //update quantity for item in DB;
        var args = [{stock_quantity: inStock - parseInt(quantity)}, {item_id: id}];
        connection.query("UPDATE products SET ? WHERE ?", args, function (err, upRes) {
          if (err) {
            throw err;
            console.log("Could not place your order, please try again.");
          }
          else {
            let successMessage = "Your order of " + quantity + " ea. of " + res[0].product_name + " was placed! Your total is $" + ((quantity * res[0].price).toFixed(2)) + ".";
            console.log(successMessage);
          };
        });
      }
    }
  });
}