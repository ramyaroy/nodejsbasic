const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const app = express();
const pool = mysql.createPool({
  connectionLimit: 100, //focus it
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ramya_node'
});
const port = process.env.PORT || 3000 ;
app.listen(port, () => console.log('listening on port ' + port));

 
const url = "http://localhost:"+port;
 

app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs.engine({ extname: '.handlebars', defaultLayout: "main" }));
app.set('view engine', 'handlebars');
app.set("views", "./views");


app.get('/add', function (req, res,) {
  res.render('add', {url:url})
});


app.post('/', (req, res) => {
  email = req.body.email;
  pwd = req.body.pwd;
  name = req.body.name;
  pool.getConnection(function (error, conn) {

    var queryString = "INSERT register SET name='" + req.body.name + "',email='" + req.body.email + "',password='" + req.body.password + "' ";
    conn.query(queryString, function (error, results) {
      if (error) {
        throw error;
      }
      else {
        res.redirect(url);
      }
    });
  });// end of delete
  
  
});


app.get('/', function (req, res) {
  //res.send('Inserted Successfully!')
  pool.getConnection(function (error, conn) {

    conn.query("SELECT * FROM register", function (err, result, fields) {
      if (err) throw err;
      var dt = "";
      if (result.length == 0) {
        dt = dt + `<tr><td colspan='3'>No records Found</td></tr>`;
      }
      else {
        for (var i = 0; i < result.length; i++) 
        {
          dt = dt +  `<tr>
            <td>`+result[i].name +`</td>
            <td>` + result[i].email + `</td>
            <td>
            <form action="`+url+`/edit" style='display: inline-block;float: left;padding-right: 2%;' method='post'>
              <input type='hidden' name='eid' value='`+ result[i].id +`'>
              <button type='submit' class='btn btn-sm btn-dark'>Edit</button>
            </form>
            <form action="`+url+`/delete" method='post'>
              <input type='hidden' name='did' value='`+ result[i].id + `'>
              <button type='submit' class='btn btn-sm btn-danger'>Delete</button>
            </form></td>
          </tr>`;
        }
      }

      res.render('index', { result: dt,url:url });
    });

    conn.release();
  });

});




app.post('/edit', function (req, res) {

  pool.getConnection(function (error, conn) {

    var queryString = "SELECT * FROM register WHERE `id` = '" + req.body.eid + "' ";

    conn.query(queryString, function (error, result) {
      if (error) {
        throw error;
      }
      else {
        for (var i = 0; i < result.length; i++) {
          res.render('edit', { name: result[i].name, email: result[i].email, password: result[i].password, id: result[i].id ,url:url});
        }
      }
    });

  });// end of delete

});

app.post('/update', function (req, res) {

  pool.getConnection(function (error, conn) {

    var queryString = "Update  register SET name='" + req.body.name + "',email='" + req.body.email + "',password='" + req.body.password + "' WHERE id = '" + req.body.register_id + "' ";
    conn.query(queryString, function (error, results) {
      if (error) {
        throw error;
      }
      else {
        res.redirect(url);
      }
    });

  });// end of delete

});


app.post('/delete', function (req, res) {

  pool.getConnection(function (error, conn) {


    var queryString = "Delete FROM register WHERE `id` = '" + req.body.did + "' ";
    conn.query(queryString, function (error, results) {
      if (error) {
        throw error;
      }
      else {
        res.redirect(url);
      }
    });
  });// end of delete
});

 
