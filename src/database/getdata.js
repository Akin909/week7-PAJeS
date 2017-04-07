const db_connection = require('../../database/db_connection.js');

const dataFromDatabase = {};

dataFromDatabase.getBlogPosts = (cb) => {
  db_connection.query('SELECT title, body, users.username FROM blogPosts INNER JOIN users ON users.id=blogPosts.username', (err, res) => {
    if (err) cb(err);
    cb(null, res.rows);
  });
};

dataFromDatabase.getUsers = (inputUsername, inputPassword, cb) => {
  const unacceptableInput = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (unacceptableInput.test(inputUsername)
    || unacceptableInput.test(inputPassword)){
      cb(Error('Introduzca un nombre de usuario y una contraseña válidos'));
    }
    db_connection.query(`SELECT * FROM users WHERE username = '${inputUsername}' AND password = '${inputPassword}'`, (err, res) => {
      if (err){
        cb(err);
      } else if (res.rows.length === 0) {
        cb(Error('Ese nombre de usuario y contraseña no existen'));
      }
      cb(null, res.rows);
    });
};

dataFromDatabase.registerUser = (request, callback) => {
  const { username, password } = request.payload;
  console.log('username', username);
  db_connection.query(`INSERT INTO users (username, password)
                      VALUES('${username}','${password}')
                      RETURNING ID;`, (dbErr,dbResponse) => {
                        if (dbErr) {
                          callback(dbErr);
                        }
                        callback(null, dbResponse);
                      });
}
module.exports = dataFromDatabase;
