const bodyParser = require("body-parser");
const express = require("express");
const app = express();
var mysql = require('mysql');


var pool = mysql.createPool({
    connectionLimit : 100, //focus it
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'ramya_node'
    
    
});



app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});


//insert data 
app.post('/', function(req,res){
    
   pool.getConnection(function(error,conn){

   	email = req.body.email;  
   	pwd = req.body.pwd;  
    name = req.body.name;
       
       var queryString = "insert into register(name,email,password) values('"+name+"','"+email+"','"+pwd+"')";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                 //res.send('Inserted Successfully!')
                 conn.query("SELECT * FROM register", function (err, result, fields) 
                  {
				    if (err) throw err;
				    console.log(result);
                    res.send(result)
				  });

               }
           
       });
       conn.release();
   });
    
    
});



app.post('/', (req, res) => {

  email = req.body.email;
  pwd = req.body.pwd;  
  name = req.body.name;

    
    res.end("<p>Email: "+email+"</p><p>Name:"+name+"</p>");

    console.log(req.body);
  
});


 
app.listen(3500, () => {
  console.log("Started on http://localhost:3500");
});