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
  connection.end();
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