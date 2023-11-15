const sql = require('mssql')

const sqlConfig = {
  user: 'angel28',
  password: 'Full2023Stack',
  database: 'fullstacksql',
  server: 'SATANAS',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

// Middleware para manejar la conexión a la base de datos
module.exports = async function(req, res, next) {
  try {
    await sql.connect(sqlConfig);
    next();
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).send('Error de servidor');
  }
};