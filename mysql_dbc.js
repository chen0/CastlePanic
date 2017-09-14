var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '10.10.4.15',
  user: 'app',
  password: 'apppassword'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('You are now coonected to MySQL')
})

connection.end()