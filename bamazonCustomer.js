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

function showMarketPlace() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) {
      throw err;
      console.log("Sorry, you can't acces the marketplace right now. Please try again.".red);
    }
    else {
      // console.log(res);
      makeTable(res);
      promptBuy();
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
      console.log("\nWe had some trouble accessing that item for you. Please check to make sure you had a valid Item ID and try again.\n".red);
      showMarketPlace();
    }
    else{
      //check to see if the buy quantity is less than the in stock quantity
      if (res[0].stock_quantity === 0) {
        let message = "\n" + res[0].product_name + " is not in stock. Please check back again soon.\n".red;
        console.log(message);
      }
      else if (res[0].stock_quantity < quantity) {
        let message = "\nYour order of " + quantity + " ea. of " + res[0].product_name + " could not be filled because of insufficient stock. We only have " + res[0].stock_quantity + " in stock.\n".red;
        console.log(message);
      }
      else {
        inStock = parseInt(res[0].stock_quantity);
        //update quantity for item in DB;
        var args = [{stock_quantity: inStock - parseInt(quantity)}, {item_id: id}];
        connection.query("UPDATE products SET ? WHERE ?", args, function (err, upRes) {
          if (err) {
            throw err;
            console.log("\nCould not place your order, please try again.\n".red);
          }
          else {
            let successMessage = "\nYour order of " + quantity + " ea. of " + res[0].product_name + " was placed! Your total is $" + ((quantity * res[0].price).toFixed(2)).magenta + ".\n";
            console.log(successMessage);
          };
        });
      }
      showMarketPlace();
    }
  });
}

function promptBuy() {
  inquirer.prompt([
    {
      message: 'Enter the ID of the item you would like to order. (Type "exit" to exit)',
      name: "chosen",
      validate: function validateChosen(name) {
        // console.log(parseInt(name));
        if(name.toLowerCase() === "exit") {
          connection.end();
          process.exit();
        }
        return (parseInt(name).toString() === name);
      }
    },{
      message: "How many would you like to order?",
      name: "qty",
      validate: function validateChosen(name) {
        // console.log(parseInt(name));
        return (parseInt(name).toString() === name);
      }
    }
  ]).then(function(answer) {
    buy(answer.chosen, answer.qty);
  })
}
