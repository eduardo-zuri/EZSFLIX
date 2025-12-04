const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log('Configurações do banco:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ezsfinder',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message);
    console.error('Código do erro:', err.code);
  } else {
    console.log('Conectado ao banco MySQL!');
    connection.release();
  }
});

module.exports = promisePool;