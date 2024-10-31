const mysql = require('mysql');
const express = require('express');
var app = express();

app.use(
    express.urlencoded({
        extended:true
    })
);

app.use(express.json());

app.get('/', (req,res) => res.send('up and running...'));


const connection = mysql.createConnection({
  //  socketPath: "/Application/MAMP/tmp/mysql/mysql.sock",

  user: "feb22nd",
  password: "feb22nd",
  host: "127.0.0.1",
  database: "feb22nd",
});

connection.connect((err) => {
    if (err) console.log(err);
    else console.log('connected to Mysql');
});

app.get("/create-table", (req, res) => {
    let name = `CREATE TABLE if not exists customers(
        customer_id int auto_increment,
        name VARCHAR(255) not null,
            PRIMARY KEY (customer_id)
        )`;

        let address = `CREATE TABLE if not exists address(
        address_id int auto_increment,
        customer_id int(11) not null,
        address VARCHAR(255) not null,
        PRIMARY KEY (address_id),
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        )`;

        let company = `CREATE TABLE if not exists company(
        company_id int auto_increment,
        customer_id int(11) not null,
        company VARCHAR(255) not null,
        PRIMARY KEY (company_id),
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        )`;
    
        connection.query (name, (err, result, fields) => {
            if (err) console.log("Error Found: ${err}");
        });

              connection.query (address, (err, result, fields) => {
            if (err) console.log("Error Found: ${err}");
        });

              connection.query (company, (err, result, fields) => {
            if (err) console.log("Error Found: ${err}");
        });

        res.end("Table Created");
        console.log("Table Created");
    
});

app.post("/insert-customers-info", (req, res) => {
    console.table(req.body);

    const { name , address, company} = req.body;

    let insertName = "INSERT INTO customers (name) VALUE (?)";// ? is buhalla setkalew

    let insertAddress = "INSERT INTO address (customer_id, address) VALUE (?,?)";

    let insertCompany = "INSERT INTO company (customer_id, company) VALUE (?, ?)";


    connection.query(insertName,[name], (err, results, fields) => {
        if (err) console.log("Error Found: ${error}");
        console.table(results);

        const id = results.insertId;
      console.log(
        "id from customers table to be used as a foreign key on the other table >>>",id
      );

      connection.query(insertAddress, [id, address], (err, results, fields) => {
        if (err) console.log ("Error Found: ${err}");
      });

     // let insertCompany : String
      connection.query(insertCompany, [id, company], (err, results, fields) => {
        if(err) console.log("Error Found: ${err}");
      });
    })
    res.end("Data inserted successfully!");
    console.log("Data inserted successfuly!");
});

// app.get("/customers-detail-info", (req, res) =>{
//     connection.query(
//         "SELECT * FROM customers JOIN address JOIN company ON customers.customer_id = address.customer_id AND customers.customer_id = company.customer_id",
//         (err, results, fields) => {
//             console.table(fields);

//             if(err) console.log("Error During Selection", err);
//             res.send(results);
//         }
//     );
// });

app.get("/customers", (req, res) => {
  connection.query(
    "SELECT customers.customer_id AS id, customers.name, address.address, company.company FROM customers JOIN address JOIN company ON customers.customer_id = address.customer_id AND customers.customer_id = company.customer_id",
    (err, results, fields) => {
      console.table(fields);

      if (err) console.log("Error During Selection", err);
      res.send(results);
    }
  );
});

app.put("/update", (req, res) => {
    const {newName, id} = req.body;

    let updateName = `UPDATE customers SET name = '${newName}' WHERE customer_id = '${id}'`;

    connection.query(updateName, (err, result) => {
        if (err) throw err; 
    console.log(result.affectedRows + "record(S) updated");
      res.send(result);
    });
});

app.delete("/remove-user", (req, res) => {

    const {id} =req.body;
    let removeName = `DELETE FROM customers WHERE customer_id = '${id}`;
    let removeAddress = `DELETE FROM address customer_id = '${id}'`;
    let removeCompany = `DELETE FROM company WHERE customer_id = '${id}'`

    connection.query(removeAddress, (err, result) => {
        if(err) throw err;
        console.log(result.affectedRows + "record(s) Deleted");
    });

     connection.query(removeCompany, (err, result) => {
       if (err) throw err;
       console.log(result.affectedRows + "record(s) Deleted");
     });

      connection.query(removeName, (err, result) => {
        if (err) throw err;
        console.log(result.affectedRows + "record(s) Deleted");
      });
      res.end("Deleted");
});

app.listen(2024, () => console.log("Listening to : 2024"));
