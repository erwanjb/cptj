const mysql = require('mysql');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : process.env.USER_DB,
	password : process.env.PASSWORD_DB,
	database : 'cptj',
  	port     : 3306
});
connection.connect();

module.exports = connection