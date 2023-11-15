const sql = require('mssql');


const router = app => {
    //Mostrar mensaje de bienvenida en root
    app.get('/', (request, response) => {
        response.send({
            message: 'Bienvenido a Node.js Express REST API con MSSQL'
        });
    });

    //Mostrar todos los usuarios
    app.get('/users', async (request, response) => {
        try {
            const pool = await sql.connect('./data/config'); // Asegúrate de tener sqlConfig definido
            const result = await pool.request().query('SELECT * FROM users');
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    // Mostrar un solo usuario por ID
    app.get('/users/:id', async (request, response) => {
        const id = request.params.id;

        try {
            const pool = await sql.connect('./data/config'); // Asegúrate de tener sqlConfig definido
            const result = await pool
                .request()
                .input('id', sql.Int, id) // Declarar el parámetro @id
                .query('SELECT * FROM users WHERE idusers = @id');
            
            response.send(result.recordset);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });

    //Agregar un nuevo usuario
    app.post('/users', async (request, response) => {
        const newUser = request.body;

        try {
            const pool = await sql.connect('./data/config');

            const request = pool.request();
            
            // Asignar parámetros individualmente
            request.input('userNombre', sql.VarChar(45), newUser.userNombre);
            request.input('userEdad', sql.Int, newUser.userEdad);
            request.input('userEmail', sql.VarChar(320), newUser.userEmail);
            request.input('userPass', sql.VarChar(128), newUser.userPass);

            const result = await request.query('INSERT INTO users (userNombre, userEdad, userEmail, userPass) OUTPUT INSERTED.idusers VALUES (@userNombre, @userEdad, @userEmail, @userPass)');

            const insertId = result.recordset[0].idusers;

            response.status(201).send(`User added with ID: ${insertId}`);
        } catch (error) {
            console.error(error);
            response.status(500).send('Error de servidor');
        }
    });
    
}

//Exportar el router
module.exports = router;